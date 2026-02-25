import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

async function readJson(req: VercelRequest) {
  if (typeof req.body === 'object' && req.body) return req.body;
  const chunks: Buffer[] = [];
  for await (const ch of req) chunks.push(Buffer.from(ch));
  const raw = Buffer.concat(chunks as any).toString('utf8') || '{}';
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// ========================================
// PREÇOS DOS PLANOS EM CENTAVOS (BRL)
// ========================================
const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  basic: { monthly: 7900, yearly: 78700 },
  pro: { monthly: 24900, yearly: 248000 },
  provider: { monthly: 39900, yearly: 397400 },
  enterprise: { monthly: 59900, yearly: 596600 },
};

const PLAN_NAMES: Record<string, string> = {
  basic: 'Rumo Operacional - Básico',
  pro: 'Rumo Operacional - Pro',
  provider: 'Rumo Operacional - Prestador Pro',
  enterprise: 'Rumo Operacional - Enterprise',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST, OPTIONS').end('Method Not Allowed');
  }

  try {
    const body = await readJson(req);
    const { priceId, userId, planType, billingPeriod } = body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    if (!priceId && (!planType || !billingPeriod)) {
      return res
        .status(400)
        .json({ error: 'priceId ou (planType + billingPeriod) são obrigatórios' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-01-28.clover',
    });

    const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://operacional.agrorumo.com';

    // Buscar email do usuário no Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData?.user?.email) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const userEmail = userData.user.email;

    // Buscar ou criar customer no Stripe
    let customerId: string;
    const customersByUserId = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 1,
    });

    if (customersByUserId.data.length > 0) {
      customerId = customersByUserId.data[0].id;
      if (customersByUserId.data[0].email !== userEmail) {
        await stripe.customers.update(customerId, { email: userEmail });
      }
    } else {
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId, app: 'rumo-operacional' },
      });
      customerId = newCustomer.id;
    }

    // Construir line_items
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (priceId) {
      lineItems = [{ price: priceId, quantity: 1 }];
    } else {
      const prices = PLAN_PRICES[planType];
      if (!prices) {
        return res.status(400).json({ error: `Plano "${planType}" não encontrado` });
      }

      const unitAmount = billingPeriod === 'yearly' ? prices.yearly : prices.monthly;
      const interval = billingPeriod === 'yearly' ? 'year' : 'month';

      lineItems = [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: PLAN_NAMES[planType] || 'Rumo Operacional',
              description: `Acesso completo ao Rumo Operacional - Plano ${planType}`,
            },
            unit_amount: unitAmount,
            recurring: { interval: interval as 'month' | 'year' },
          },
          quantity: 1,
        },
      ];
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: lineItems,
      success_url: `${baseUrl}/subscription?success=true`,
      cancel_url: `${baseUrl}/subscription?canceled=true`,
      locale: 'pt-BR',
      metadata: {
        userId,
        planType: planType || 'unknown',
        billingPeriod: billingPeriod || 'unknown',
        app: 'rumo-operacional',
      },
      subscription_data: {
        metadata: {
          userId,
          planType: planType || 'unknown',
          billingPeriod: billingPeriod || 'unknown',
          app: 'rumo-operacional',
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error('[CHECKOUT] Erro:', e?.message);
    return res.status(500).json({ error: 'checkout_failed', details: e?.message });
  }
}
