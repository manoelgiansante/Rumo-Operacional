/**
 * IDs de Produtos para Pagamentos - Rumo Operacional
 *
 * Configure estes IDs após criar os produtos em cada plataforma:
 * - Stripe: https://dashboard.stripe.com/products
 * - App Store Connect: https://appstoreconnect.apple.com
 * - Google Play Console: https://play.google.com/console
 *
 * NOTA: O Rumo Operacional usa os MESMOS IDs de produto do ecossistema Rumo.
 * A assinatura Premium dá acesso a todos os apps (Operacional, Finance, Máquinas).
 */

// ========================================
// 🌐 STRIPE (Web e Webhooks)
// ========================================

export const STRIPE_PRICE_IDS = {
  // BÁSICO
  basic_monthly: 'price_1SXMbuEa6xGSraYx5Obo48a1', // R$ 79,00/mês
  basic_yearly: 'price_1SXMcpEa6xGSraYxancVFGQI', // R$ 787,00/ano

  // PRO (Mais Popular)
  pro_monthly: 'price_1SXMfYEa6xGSraYxrFkmQL1Z', // R$ 249,00/mês
  pro_yearly: 'price_1SXMgAEa6xGSraYxDjmTDYxN', // R$ 2.480,00/ano

  // ENTERPRISE
  enterprise_monthly: 'price_1SXMh7Ea6xGSraYx78UdwkF7', // R$ 599,00/mês
  enterprise_yearly: 'price_1SXMocEa6xGSraYxC2II2blE', // R$ 5.966,04/ano

  // PRESTADOR PRO
  provider_monthly: 'price_1SXMmhEa6xGSraYxBo7a0pEu', // R$ 399,00/mês
  provider_yearly: 'price_1SXMnKEa6xGSraYxcVEVfTxh', // R$ 3.974,04/ano
};

// Chave pública do Stripe (seguro usar no frontend)
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_xxxxx';

// ========================================
// 🔗 STRIPE PAYMENT LINKS (Web - Checkout direto)
// ========================================

export const STRIPE_PAYMENT_LINKS = {
  basic_monthly: 'https://buy.stripe.com/14AaEX3oVfOi7SYauO5Vu00',
  basic_yearly: 'https://buy.stripe.com/9B6bJ12kR8lQ3CIbyS5Vu01',
  pro_monthly: 'https://buy.stripe.com/9B6fZhf7DfOiehmauO5Vu02',
  pro_yearly: 'https://buy.stripe.com/fZu3cvgbHby28X27iC5Vu03',
  provider_monthly: 'https://buy.stripe.com/8x2eVdcZveKeflqeL45Vu04',
  provider_yearly: 'https://buy.stripe.com/4gM5kD0cJ6dI7SY5au5Vu05',
  enterprise_monthly: 'https://buy.stripe.com/aFabJ16B78lQ1uAdH05Vu06',
  enterprise_yearly: 'https://buy.stripe.com/7sYfZhgbH45A7SYcCW5Vu07',
};

// ========================================
// 🍎 APP STORE (iOS)
// ========================================
//
// 📌 ÚNICA FONTE DE VERDADE para Product IDs do App Store Connect
// Bundle ID: com.agrorumo.operacional
//
// NOTA PARA O DEV:
// Estes IDs precisam ser criados no App Store Connect.
// Use os mesmos preços do Rumo Máquinas.
// Subscription Group: criar novo para Rumo Operacional
//

export const APP_STORE_PRODUCT_IDS = {
  // BÁSICO - R$ 79,90/mês ou R$ 799/ano
  basic_monthly: 'ro.rumo.basico.mensal.v1',
  basic_yearly: 'ro.rumo.basico.anual.v1',

  // PRO (Mais Popular) - R$ 249/mês ou R$ 2.490/ano
  pro_monthly: 'ro.rumo.pro.mensal.v1',
  pro_yearly: 'ro.rumo.pro.anual.v1',

  // ENTERPRISE - R$ 599/mês ou R$ 5.990/ano
  enterprise_monthly: 'ro.rumo.enterprise.mensal.v1',
  enterprise_yearly: 'ro.rumo.enterprise.anual.v1',

  // PRESTADOR PRO - R$ 399/mês ou R$ 3.990/ano
  provider_monthly: 'ro.rumo.prestador.mensal.v1',
  provider_yearly: 'ro.rumo.prestador.anual.v1',
};

// ========================================
// 🤖 GOOGLE PLAY (Android)
// ========================================

/**
 * ⚠️ NOTA IMPORTANTE:
 * O Google Play tem limite máximo de ~R$ 5.200/ano para assinaturas.
 * O plano Enterprise Anual (R$ 5.990) excede esse limite, então
 * NÃO ESTÁ DISPONÍVEL no Google Play.
 *
 * NOTA PARA O DEV:
 * Estes IDs precisam ser criados no Google Play Console.
 * Use o package: com.agrorumo.operacional
 */
export const GOOGLE_PLAY_PRODUCT_IDS = {
  // BÁSICO - R$ 79,90/mês ou R$ 799/ano
  basic_monthly: 'com.agrorumo.op.basic.month',
  basic_yearly: 'com.agrorumo.op.basic.year',

  // PRO (Mais Popular) - R$ 249/mês ou R$ 2.490/ano
  pro_monthly: 'com.agrorumo.op.pro.month',
  pro_yearly: 'com.agrorumo.op.pro.year',

  // ENTERPRISE - R$ 599/mês (anual não disponível - limite Google Play)
  enterprise_monthly: 'com.agrorumo.op.enterprise.month',
  // enterprise_yearly: NÃO DISPONÍVEL (limite do Google Play: R$ 5.200/ano)

  // PRESTADOR PRO - R$ 399/mês ou R$ 3.990/ano
  provider_monthly: 'com.agrorumo.op.provider.month',
  provider_yearly: 'com.agrorumo.op.provider.year',
};

// ========================================
// 📋 GUIA DE CONFIGURAÇÃO PARA O DEV
// ========================================

/*

🔧 PASSO A PASSO PARA CONFIGURAR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ STRIPE (Web) - ✅ JÁ CONFIGURADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Os produtos e Payment Links do Stripe já estão criados.
São os MESMOS do Rumo Máquinas (assinatura compartilhada).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣ APP STORE (iOS) - PRECISA CRIAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bundle ID: com.agrorumo.operacional

PRODUTOS A CRIAR NO APP STORE CONNECT:

   📱 BÁSICO MENSAL
   ├─ ID do Produto: ro.rumo.basico.mensal.v1
   ├─ Duração: 1 mês
   └─ Preço: R$ 79,90

   📱 PRO MENSAL
   ├─ ID do Produto: ro.rumo.pro.mensal.v1
   ├─ Duração: 1 mês
   └─ Preço: R$ 249,90

   📱 PRESTADOR MENSAL
   ├─ ID do Produto: ro.rumo.prestador.mensal.v1
   ├─ Duração: 1 mês
   └─ Preço: R$ 399,90

   📱 ENTERPRISE MENSAL
   ├─ ID do Produto: ro.rumo.enterprise.mensal.v1
   ├─ Duração: 1 mês
   └─ Preço: R$ 599,90

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣ GOOGLE PLAY (Android) - PRECISA CRIAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Package: com.agrorumo.operacional

Criar os mesmos planos com IDs com.agrorumo.op.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*/

// ========================================
// 🎯 HELPER FUNCTIONS
// ========================================

/**
 * Retorna o ID do produto correto baseado na plataforma
 */
export function getProductId(
  plan: string,
  period: 'monthly' | 'yearly',
  platform: 'web' | 'ios' | 'android'
): string {
  const key = `${plan}_${period}` as keyof typeof STRIPE_PRICE_IDS;

  switch (platform) {
    case 'web':
      return STRIPE_PRICE_IDS[key];
    case 'ios':
      return APP_STORE_PRODUCT_IDS[key as keyof typeof APP_STORE_PRODUCT_IDS];
    case 'android':
      return GOOGLE_PLAY_PRODUCT_IDS[key as keyof typeof GOOGLE_PLAY_PRODUCT_IDS];
    default:
      return STRIPE_PRICE_IDS[key];
  }
}

/**
 * Retorna o Payment Link do Stripe para checkout direto na web
 */
export function getStripePaymentLink(
  plan: string,
  period: 'monthly' | 'yearly'
): string | undefined {
  const key = `${plan}_${period}` as keyof typeof STRIPE_PAYMENT_LINKS;
  return STRIPE_PAYMENT_LINKS[key];
}

/**
 * Verifica se os IDs do Stripe estão configurados
 */
export function isStripeConfigured(): boolean {
  return !STRIPE_PUBLISHABLE_KEY.includes('xxxxx');
}
