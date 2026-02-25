import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').end('Method Not Allowed');
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-01-28.clover',
    });

    const supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Buscar email do user
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (!userData?.user?.email) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const email = userData.user.email;

    // Buscar subscription pelo email
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (!sub?.stripe_subscription_id) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Cancelar no Stripe (no final do período)
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Atualizar no Supabase
    await supabase
      .from('user_subscriptions')
      .update({ updated_at: new Date().toISOString() })
      .eq('email', email);

    return res.status(200).json({
      success: true,
      message: 'Assinatura será cancelada no final do período atual',
    });
  } catch (error: any) {
    console.error('[CANCEL-OP] Erro:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
