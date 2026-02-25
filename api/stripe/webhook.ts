import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

async function readRaw(req: VercelRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const ch of req) chunks.push(ch);
  return Buffer.concat(chunks).toString('utf8');
}

// Mapeamento de Price IDs para planos
const PRICE_TO_PLAN: Record<string, { planType: string; billingCycle: string }> = {
  price_1SXMbuEa6xGSraYx5Obo48a1: { planType: 'basic', billingCycle: 'monthly' },
  price_1SXMcpEa6xGSraYxancVFGQI: { planType: 'basic', billingCycle: 'annual' },
  price_1SXMfYEa6xGSraYxrFkmQL1Z: { planType: 'pro', billingCycle: 'monthly' },
  price_1SXMgAEa6xGSraYxDjmTDYxN: { planType: 'pro', billingCycle: 'annual' },
  price_1SXMmhEa6xGSraYxBo7a0pEu: { planType: 'provider', billingCycle: 'monthly' },
  price_1SXMnKEa6xGSraYxcVEVfTxh: { planType: 'provider', billingCycle: 'annual' },
  price_1SXMh7Ea6xGSraYx78UdwkF7: { planType: 'enterprise', billingCycle: 'monthly' },
  price_1SXMocEa6xGSraYxC2II2blE: { planType: 'enterprise', billingCycle: 'annual' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').end('Method Not Allowed');
  }

  try {
    const raw = await readRaw(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      return res.status(400).send('Webhook Error: Missing signature');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-01-28.clover',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).send('Webhook Error: Secret not configured');
    }

    const event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
    console.log('[WEBHOOK-OP] Evento:', event.type, '| ID:', event.id);

    const supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    async function findUserIdByEmail(email: string | null): Promise<string | null> {
      if (!email) return null;
      const {
        data: { users },
        error: authError,
      } = await supabase.auth.admin.listUsers();
      if (authError || !users) return null;
      const found = users.find((u) => u.email === email);
      return found?.id ?? null;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        let userId = session.metadata?.userId || session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_email || session.customer_details?.email;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        if (!userId && subscription.metadata?.userId) {
          userId = subscription.metadata.userId;
        }
        if (!userId && customerEmail) {
          userId = (await findUserIdByEmail(customerEmail)) ?? null;
        }
        if (!userId) {
          console.error('[WEBHOOK-OP] userId não encontrado');
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;
        let planConfig = PRICE_TO_PLAN[priceId || ''];

        if (!planConfig) {
          const metaPlanType = session.metadata?.planType || subscription.metadata?.planType;
          const metaBillingPeriod =
            session.metadata?.billingPeriod || subscription.metadata?.billingPeriod;
          planConfig = {
            planType: metaPlanType || 'basic',
            billingCycle: metaBillingPeriod === 'yearly' ? 'annual' : 'monthly',
          };
        }

        // Salvar no user_subscriptions (tabela compartilhada)
        const { error } = await supabase.from('user_subscriptions').upsert(
          {
            email: customerEmail,
            custo_operacional_plan: planConfig.planType,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscriptionId,
            expires_at: (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

        if (error) {
          console.error('[WEBHOOK-OP] Erro ao salvar subscription:', error);
        } else {
          console.log('[WEBHOOK-OP] Subscription salva para:', customerEmail);
        }
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerEmail = (invoice as any).customer_email;
          if (customerEmail) {
            await supabase
              .from('user_subscriptions')
              .update({
                expires_at: (subscription as any).current_period_end
                  ? new Date((subscription as any).current_period_end * 1000).toISOString()
                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('email', customerEmail);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubId = subscription.id;

        await supabase
          .from('user_subscriptions')
          .update({
            custo_operacional_plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubId);

        console.log('[WEBHOOK-OP] Subscription cancelada:', stripeSubId);
        break;
      }

      default:
        console.log('[WEBHOOK-OP] Evento não tratado:', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('[WEBHOOK-OP] Erro:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
