import { supabase } from './supabase';

// =====================================================
// CROSS-APP SERVICE
// Serviço para comunicação entre Rumo Finance e Rumo Operacional
// =====================================================

export interface CrossAppSubscription {
  email: string;
  rumoFinancePlan: 'free' | 'basic' | 'intermediate' | 'premium';
  rumoOperacionalPlan: 'free' | 'basic' | 'intermediate' | 'premium';
  hasBonus: boolean; // Se assinou Finance intermediário+, Operacional é grátis
  expiresAt?: string;
}

export const CrossAppService = {
  /**
   * Verifica status da assinatura unificada
   * Funciona para ambos os apps
   */
  async getSubscriptionStatus(email: string): Promise<CrossAppSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar assinatura:', error);
        return null;
      }

      if (!data) return null;

      return {
        email: data.email,
        rumoFinancePlan: data.gestao_rural_plan || 'free',
        rumoOperacionalPlan: data.custo_operacional_plan || 'free',
        hasBonus: data.custo_op_bonus || false,
        expiresAt: data.expires_at,
      };
    } catch (err) {
      console.error('Erro no CrossAppService:', err);
      return null;
    }
  },

  /**
   * Cria ou atualiza assinatura unificada
   */
  async upsertSubscription(
    subscription: Partial<CrossAppSubscription> & { email: string }
  ): Promise<CrossAppSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert(
          {
            email: subscription.email,
            gestao_rural_plan: subscription.rumoFinancePlan || 'free',
            custo_operacional_plan: subscription.rumoOperacionalPlan || 'free',
            expires_at: subscription.expiresAt,
          },
          {
            onConflict: 'email',
          }
        )
        .select()
        .single();

      if (error) throw error;

      return {
        email: data.email,
        rumoFinancePlan: data.gestao_rural_plan,
        rumoOperacionalPlan: data.custo_operacional_plan,
        hasBonus: data.custo_op_bonus,
        expiresAt: data.expires_at,
      };
    } catch (err) {
      console.error('Erro ao atualizar assinatura:', err);
      return null;
    }
  },

  /**
   * Verifica se usuário tem acesso premium no Rumo Operacional
   * (seja por assinatura direta ou bônus do Rumo Finance)
   */
  async hasOperacionalPremium(email: string): Promise<boolean> {
    const subscription = await this.getSubscriptionStatus(email);
    if (!subscription) return false;

    // Tem bônus do Finance ou assinatura direta
    return (
      subscription.hasBonus ||
      subscription.rumoOperacionalPlan === 'premium' ||
      subscription.rumoOperacionalPlan === 'intermediate'
    );
  },

  /**
   * Verifica se usuário tem acesso premium no Rumo Finance
   */
  async hasFinancePremium(email: string): Promise<boolean> {
    const subscription = await this.getSubscriptionStatus(email);
    if (!subscription) return false;

    return (
      subscription.rumoFinancePlan === 'premium' || subscription.rumoFinancePlan === 'intermediate'
    );
  },

  /**
   * Sincroniza dados entre os apps
   * Útil para compartilhar fazendas, fornecedores, etc.
   */
  async syncSharedData(email: string) {
    // Dados que são compartilhados entre os apps:
    // - Farms (Fazendas)
    // - Suppliers (Fornecedores)
    // - Clients (Clientes)
    // - Bank Accounts (Contas Bancárias)

    const [farms, suppliers, clients, bankAccounts] = await Promise.all([
      supabase.from('farms').select('*').eq('active', true),
      supabase.from('suppliers').select('*').eq('active', true),
      supabase.from('clients').select('*').eq('active', true),
      supabase.from('bank_accounts').select('*').eq('active', true),
    ]);

    return {
      farms: farms.data || [],
      suppliers: suppliers.data || [],
      clients: clients.data || [],
      bankAccounts: bankAccounts.data || [],
    };
  },

  /**
   * Obtém resumo financeiro consolidado de ambos os apps
   */
  async getConsolidatedSummary() {
    const [expenses, revenues] = await Promise.all([
      supabase
        .from('expenses')
        .select('actual_value, agreed_value, status')
        .in('status', ['pending', 'verified', 'paid']),
      supabase.from('revenues').select('value, status').in('status', ['pending', 'received']),
    ]);

    const totalExpenses = (expenses.data || []).reduce(
      (sum, e) => sum + (e.actual_value || e.agreed_value || 0),
      0
    );

    const totalRevenues = (revenues.data || []).reduce((sum, r) => sum + (r.value || 0), 0);

    return {
      totalExpenses,
      totalRevenues,
      balance: totalRevenues - totalExpenses,
      expensesCount: expenses.data?.length || 0,
      revenuesCount: revenues.data?.length || 0,
    };
  },

  /**
   * Deep link para abrir o outro app
   */
  getDeepLink(app: 'finance' | 'operacional', path?: string): string {
    const schemes = {
      finance: 'rumo-finance',
      operacional: 'rumo-operacional',
    };

    const base = `${schemes[app]}://`;
    return path ? `${base}${path}` : base;
  },
};

export default CrossAppService;
