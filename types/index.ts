export interface Sector {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export type OperationType =
  | 'plantio'
  | 'colheita'
  | 'manejo'
  | 'preparo'
  | 'adubacao'
  | 'irrigacao'
  | 'transporte'
  | 'manutencao'
  | 'administrativo'
  | 'outro';

export interface Operation {
  id: string;
  sectorId: string;
  name: string;
  type: OperationType;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export interface ExpenseAllocation {
  operationId: string;
  percentage: number;
  value: number;
}

export type PaymentMethod =
  | 'boleto'
  | 'pix'
  | 'cartao'
  | 'transferencia'
  | 'cheque'
  | 'dinheiro'
  | 'outro';

export interface Expense {
  id: string;
  operationId: string;
  description: string;
  supplier: string;
  category: string;
  agreedValue: number;
  negotiatedValue: number;
  invoiceValue?: number;
  invoiceNumber?: string;
  date: string;
  dueDate: string;
  competence: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  createdBy: string;
  status: ExpenseStatus;
  notes?: string;
  paymentDate?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  isShared: boolean;
  allocations?: ExpenseAllocation[];
}

export type ExpenseStatus = 'pending' | 'verified' | 'discrepancy' | 'paid' | 'rejected';

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  operations: OperationReport[];
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
}

export interface OperationReport {
  operationId: string;
  operationName: string;
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  expenseCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  farmId: string;
}

export type UserRole = 'admin' | 'operator' | 'financial';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  operationsLimit: number;
  usersLimit: number;
  isPopular?: boolean;
}
