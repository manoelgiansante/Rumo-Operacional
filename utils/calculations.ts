/**
 * Funções de cálculo e lógica de negócio
 */

import { Expense, Operation, Sector } from '@/types';

export interface OperationTotal {
  operationId: string;
  operationName: string;
  total: number;
  paid: number;
  pending: number;
  count: number;
}

export interface SectorTotal {
  sectorId: string;
  sectorName: string;
  total: number;
  paid: number;
  pending: number;
  count: number;
}

export interface MonthlyReport {
  operationTotals: OperationTotal[];
  sectorTotals: SectorTotal[];
  totalMonth: number;
  totalPaid: number;
  totalPending: number;
  expenseCount: number;
}

/**
 * Calcula o valor de uma despesa para uma operação específica
 * Considera se a despesa é rateada ou não
 * @param expense - A despesa
 * @param operationId - ID da operação
 * @returns Valor atribuído à operação
 */
export const getExpenseValueForOperation = (expense: Expense, operationId: string): number => {
  if (expense.isShared && expense.allocations) {
    const allocation = expense.allocations.find((a) => a.operationId === operationId);
    return allocation?.value || 0;
  }

  if (expense.operationId === operationId) {
    return expense.agreedValue;
  }

  return 0;
};

/**
 * Filtra despesas por mês/ano
 * @param expenses - Lista de despesas
 * @param month - Mês (0-11)
 * @param year - Ano
 * @returns Despesas do período
 */
export const filterExpensesByMonth = (
  expenses: Expense[],
  month: number,
  year: number
): Expense[] => {
  return expenses.filter((exp) => {
    const expDate = new Date(exp.createdAt);
    return expDate.getMonth() === month && expDate.getFullYear() === year;
  });
};

/**
 * Calcula totais por operação para um conjunto de despesas
 * @param expenses - Lista de despesas
 * @param operations - Lista de operações
 * @returns Totais por operação
 */
export const calculateOperationTotals = (
  expenses: Expense[],
  operations: Operation[]
): OperationTotal[] => {
  return operations
    .map((op) => {
      let total = 0;
      let paid = 0;
      let count = 0;

      expenses.forEach((exp) => {
        const value = getExpenseValueForOperation(exp, op.id);
        if (value > 0) {
          total += value;
          if (exp.status === 'paid') paid += value;
          count++;
        }
      });

      return {
        operationId: op.id,
        operationName: op.name,
        total,
        paid,
        pending: total - paid,
        count,
      };
    })
    .filter((item) => item.total > 0);
};

/**
 * Calcula totais por setor
 * @param expenses - Lista de despesas
 * @param sectors - Lista de setores
 * @param operations - Lista de operações
 * @returns Totais por setor
 */
export const calculateSectorTotals = (
  expenses: Expense[],
  sectors: Sector[],
  operations: Operation[]
): SectorTotal[] => {
  return sectors
    .map((sector) => {
      const sectorOps = operations.filter((op) => op.sectorId === sector.id);
      const sectorOpIds = sectorOps.map((op) => op.id);

      let total = 0;
      let paid = 0;
      let count = 0;

      expenses.forEach((exp) => {
        if (exp.isShared && exp.allocations) {
          exp.allocations.forEach((allocation) => {
            if (sectorOpIds.includes(allocation.operationId)) {
              total += allocation.value;
              if (exp.status === 'paid') paid += allocation.value;
              count++;
            }
          });
        } else if (sectorOpIds.includes(exp.operationId)) {
          total += exp.agreedValue;
          if (exp.status === 'paid') paid += exp.agreedValue;
          count++;
        }
      });

      return {
        sectorId: sector.id,
        sectorName: sector.name,
        total,
        paid,
        pending: total - paid,
        count,
      };
    })
    .filter((item) => item.total > 0);
};

/**
 * Calcula relatório mensal completo
 * @param expenses - Todas as despesas
 * @param operations - Todas as operações
 * @param sectors - Todos os setores
 * @param month - Mês (0-11)
 * @param year - Ano
 * @returns Relatório mensal
 */
export const calculateMonthlyReport = (
  expenses: Expense[],
  operations: Operation[],
  sectors: Sector[],
  month: number,
  year: number
): MonthlyReport => {
  const monthExpenses = filterExpensesByMonth(expenses, month, year);

  const operationTotals = calculateOperationTotals(monthExpenses, operations);
  const sectorTotals = calculateSectorTotals(monthExpenses, sectors, operations);

  const totalMonth = monthExpenses.reduce((sum, exp) => sum + exp.agreedValue, 0);
  const totalPaid = monthExpenses
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + e.agreedValue, 0);

  return {
    operationTotals,
    sectorTotals,
    totalMonth,
    totalPaid,
    totalPending: totalMonth - totalPaid,
    expenseCount: monthExpenses.length,
  };
};

/**
 * Calcula variação percentual entre dois valores
 * @param current - Valor atual
 * @param previous - Valor anterior
 * @returns Variação percentual
 */
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Distribui um valor igualmente entre operações
 * @param totalValue - Valor total a distribuir
 * @param operationIds - IDs das operações
 * @returns Array de alocações
 */
export const distributeValueEqually = (
  totalValue: number,
  operationIds: string[]
): { operationId: string; percentage: number; value: number }[] => {
  if (operationIds.length === 0) return [];

  const equalPercentage = Math.floor(100 / operationIds.length);
  const remainder = 100 - equalPercentage * operationIds.length;

  return operationIds.map((operationId, index) => {
    const percentage = equalPercentage + (index === 0 ? remainder : 0);
    return {
      operationId,
      percentage,
      value: (totalValue * percentage) / 100,
    };
  });
};

/**
 * Calcula o valor alocado com base no percentual
 * @param totalValue - Valor total
 * @param percentage - Percentual (0-100)
 * @returns Valor alocado
 */
export const calculateAllocatedValue = (totalValue: number, percentage: number): number => {
  return (totalValue * percentage) / 100;
};

/**
 * Verifica se há discrepância entre valores
 * @param agreedValue - Valor combinado
 * @param invoiceValue - Valor da nota
 * @param tolerance - Tolerância em percentual (padrão 0.01 = 1%)
 * @returns true se há discrepância significativa
 */
export const hasValueDiscrepancy = (
  agreedValue: number,
  invoiceValue: number,
  tolerance: number = 0.01
): boolean => {
  if (invoiceValue === 0) return agreedValue !== 0;
  const diff = Math.abs(agreedValue - invoiceValue);
  const percentDiff = diff / agreedValue;
  return percentDiff > tolerance;
};

/**
 * Calcula estatísticas de despesas
 * @param expenses - Lista de despesas
 * @returns Estatísticas
 */
export const calculateExpenseStats = (
  expenses: Expense[]
): {
  total: number;
  average: number;
  max: number;
  min: number;
  count: number;
  byStatus: Record<string, number>;
} => {
  if (expenses.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      min: 0,
      count: 0,
      byStatus: {},
    };
  }

  const values = expenses.map((e) => e.agreedValue);
  const total = values.reduce((sum, v) => sum + v, 0);

  const byStatus: Record<string, number> = {};
  expenses.forEach((e) => {
    byStatus[e.status] = (byStatus[e.status] || 0) + e.agreedValue;
  });

  return {
    total,
    average: total / expenses.length,
    max: Math.max(...values),
    min: Math.min(...values),
    count: expenses.length,
    byStatus,
  };
};
