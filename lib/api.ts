import { supabase } from './supabase';

// =====================================================
// API SERVICE - RUMO OPERACIONAL
// Funções padronizadas para comunicação com Supabase
// =====================================================

// ==================== SECTORS ====================
export const SectorsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('sectors').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async create(sector: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    farm_id?: string;
  }) {
    const { data, error } = await supabase.from('sectors').insert(sector).select().single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<{
      name: string;
      description: string;
      color: string;
      icon: string;
      is_active: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from('sectors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('sectors').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },
};

// ==================== OPERATIONS ====================
export const OperationsAPI = {
  async getAll(sectorId?: string) {
    let query = supabase
      .from('operations')
      .select('*, sectors(name, color)')
      .eq('is_active', true)
      .order('name');

    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('operations')
      .select('*, sectors(name, color)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(operation: {
    name: string;
    sector_id?: string;
    description?: string;
    color?: string;
    icon?: string;
    budget?: number;
    farm_id?: string;
  }) {
    const { data, error } = await supabase.from('operations').insert(operation).select().single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<{
      name: string;
      description: string;
      color: string;
      icon: string;
      budget: number;
      spent: number;
      is_active: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from('operations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('operations').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },

  async updateSpent(id: string, amount: number) {
    const { data, error } = await supabase.rpc('increment_operation_spent', {
      operation_id: id,
      amount,
    });
    if (error) throw error;
    return data;
  },
};

// ==================== EXPENSES ====================
export const ExpensesAPI = {
  async getAll(filters?: {
    operation_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    category?: string;
  }) {
    let query = supabase
      .from('expenses')
      .select('*, operations(name, color), suppliers(name)')
      .order('due_date', { ascending: false });

    if (filters?.operation_id) query = query.eq('operation_id', filters.operation_id);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.start_date) query = query.gte('due_date', filters.start_date);
    if (filters?.end_date) query = query.lte('due_date', filters.end_date);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, operations(name, color), suppliers(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(expense: {
    description: string;
    operation_id?: string;
    supplier_id?: string;
    supplier?: string;
    category?: string;
    subcategory?: string;
    agreed_value?: number;
    negotiated_value?: number;
    invoice_value?: number;
    actual_value?: number;
    due_date?: string;
    date?: string;
    payment_method?: string;
    status?: string;
    notes?: string;
    created_by?: string;
  }) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        status: expense.status || 'pending',
        created_by: expense.created_by || 'app',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<{
      description: string;
      category: string;
      agreed_value: number;
      invoice_value: number;
      actual_value: number;
      status: string;
      notes: string;
      payment_date: string;
      verified_by: string;
      verification_notes: string;
    }>
  ) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async verify(id: string, verifiedBy: string, notes?: string) {
    return this.update(id, {
      status: 'verified',
      verified_by: verifiedBy,
      verification_notes: notes,
    });
  },

  async pay(id: string, paidBy: string) {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        status: 'paid',
        paid_by: paidBy,
        paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== SUPPLIERS ====================
export const SuppliersAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('active', true)
      .order('name');
    if (error) throw error;
    return data;
  },

  async create(supplier: {
    name: string;
    cpf_cnpj?: string;
    category?: string;
    phone?: string;
    email?: string;
  }) {
    const { data, error } = await supabase.from('suppliers').insert(supplier).select().single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<{
      name: string;
      cpf_cnpj: string;
      category: string;
      phone: string;
      email: string;
      active: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ==================== SUBSCRIPTIONS ====================
export const SubscriptionsAPI = {
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async create(subscription: {
    email: string;
    gestao_rural_plan?: string;
    custo_operacional_plan?: string;
  }) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert(subscription)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    email: string,
    updates: Partial<{
      gestao_rural_plan: string;
      custo_operacional_plan: string;
      stripe_customer_id: string;
      stripe_subscription_id: string;
      expires_at: string;
    }>
  ) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updates)
      .eq('email', email)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Verifica se tem bônus do Rumo Finance para Rumo Operacional
  async checkCrossAppBonus(email: string): Promise<boolean> {
    const subscription = await this.getByEmail(email);
    return subscription?.custo_op_bonus === true;
  },
};

// ==================== REPORTS ====================
export const ReportsAPI = {
  async getExpensesSummary(filters?: {
    start_date?: string;
    end_date?: string;
    operation_id?: string;
  }) {
    let query = supabase
      .from('expenses')
      .select('category, status, agreed_value, invoice_value, actual_value');

    if (filters?.operation_id) query = query.eq('operation_id', filters.operation_id);
    if (filters?.start_date) query = query.gte('due_date', filters.start_date);
    if (filters?.end_date) query = query.lte('due_date', filters.end_date);

    const { data, error } = await query;
    if (error) throw error;

    // Calcular totais
    const summary = {
      total_agreed: 0,
      total_invoice: 0,
      total_actual: 0,
      by_category: {} as Record<string, number>,
      by_status: {} as Record<string, number>,
      count: data?.length || 0,
    };

    data?.forEach((expense) => {
      summary.total_agreed += expense.agreed_value || 0;
      summary.total_invoice += expense.invoice_value || 0;
      summary.total_actual += expense.actual_value || 0;

      if (expense.category) {
        summary.by_category[expense.category] =
          (summary.by_category[expense.category] || 0) +
          (expense.actual_value || expense.agreed_value || 0);
      }

      summary.by_status[expense.status] = (summary.by_status[expense.status] || 0) + 1;
    });

    return summary;
  },

  async getOperationsSummary() {
    const { data, error } = await supabase
      .from('operations')
      .select('id, name, budget, spent, color')
      .eq('is_active', true);
    if (error) throw error;

    return data?.map((op) => ({
      ...op,
      remaining: (op.budget || 0) - (op.spent || 0),
      percentage: op.budget ? ((op.spent || 0) / op.budget) * 100 : 0,
    }));
  },
};

export default {
  sectors: SectorsAPI,
  operations: OperationsAPI,
  expenses: ExpensesAPI,
  suppliers: SuppliersAPI,
  subscriptions: SubscriptionsAPI,
  reports: ReportsAPI,
};
