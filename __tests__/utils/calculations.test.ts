import {
  getExpenseValueForOperation,
  filterExpensesByMonth,
  calculateOperationTotals,
  calculateSectorTotals,
  calculateMonthlyReport,
  calculatePercentChange,
  distributeValueEqually,
  calculateAllocatedValue,
  hasValueDiscrepancy,
  calculateExpenseStats,
} from '../../utils/calculations';
import { Expense, Operation, Sector } from '../../types';

// Mock data
const mockOperations: Operation[] = [
  {
    id: '1',
    sectorId: 's1',
    name: 'Operação 1',
    type: 'outro',
    description: '',
    color: '#000',
    icon: '',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    sectorId: 's1',
    name: 'Operação 2',
    type: 'outro',
    description: '',
    color: '#000',
    icon: '',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    sectorId: 's2',
    name: 'Operação 3',
    type: 'outro',
    description: '',
    color: '#000',
    icon: '',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

const mockSectors: Sector[] = [
  {
    id: 's1',
    name: 'Setor 1',
    description: '',
    color: '#000',
    icon: '',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 's2',
    name: 'Setor 2',
    description: '',
    color: '#000',
    icon: '',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

const mockExpenses: Expense[] = [
  {
    id: 'e1',
    operationId: '1',
    description: 'Despesa 1',
    supplier: 'Fornecedor A',
    category: 'Insumos',
    agreedValue: 1000,
    negotiatedValue: 1000,
    date: '2024-01-10',
    dueDate: '2024-01-15',
    competence: '2024-01-01T00:00:00.000Z',
    paymentMethod: 'boleto',
    createdAt: '2024-01-10',
    createdBy: 'User',
    status: 'paid',
    isShared: false,
  },
  {
    id: 'e2',
    operationId: '2',
    description: 'Despesa 2',
    supplier: 'Fornecedor B',
    category: 'Mão de Obra',
    agreedValue: 500,
    negotiatedValue: 500,
    date: '2024-01-15',
    dueDate: '2024-01-20',
    competence: '2024-01-01T00:00:00.000Z',
    paymentMethod: 'pix',
    createdAt: '2024-01-15',
    createdBy: 'User',
    status: 'pending',
    isShared: false,
  },
  {
    id: 'e3',
    operationId: '1',
    description: 'Despesa Compartilhada',
    supplier: 'Fornecedor C',
    category: 'Energia',
    agreedValue: 600,
    negotiatedValue: 600,
    date: '2024-02-05',
    dueDate: '2024-02-10',
    competence: '2024-02-01T00:00:00.000Z',
    paymentMethod: 'boleto',
    createdAt: '2024-02-05',
    createdBy: 'User',
    status: 'paid',
    isShared: true,
    allocations: [
      { operationId: '1', percentage: 50, value: 300 },
      { operationId: '2', percentage: 50, value: 300 },
    ],
  },
];

describe('Calculations', () => {
  describe('getExpenseValueForOperation', () => {
    it('deve retornar valor total para despesa não compartilhada da operação', () => {
      const result = getExpenseValueForOperation(mockExpenses[0], '1');
      expect(result).toBe(1000);
    });

    it('deve retornar 0 para despesa de outra operação', () => {
      const result = getExpenseValueForOperation(mockExpenses[0], '2');
      expect(result).toBe(0);
    });

    it('deve retornar valor alocado para despesa compartilhada', () => {
      const result = getExpenseValueForOperation(mockExpenses[2], '1');
      expect(result).toBe(300);
    });

    it('deve retornar valor alocado correto para segunda operação', () => {
      const result = getExpenseValueForOperation(mockExpenses[2], '2');
      expect(result).toBe(300);
    });

    it('deve retornar 0 para operação não incluída no rateio', () => {
      const result = getExpenseValueForOperation(mockExpenses[2], '3');
      expect(result).toBe(0);
    });
  });

  describe('filterExpensesByMonth', () => {
    it('deve filtrar despesas de janeiro 2024', () => {
      const result = filterExpensesByMonth(mockExpenses, 0, 2024);
      expect(result).toHaveLength(2);
    });

    it('deve filtrar despesas de fevereiro 2024', () => {
      const result = filterExpensesByMonth(mockExpenses, 1, 2024);
      expect(result).toHaveLength(1);
    });

    it('deve retornar array vazio para mês sem despesas', () => {
      const result = filterExpensesByMonth(mockExpenses, 11, 2024);
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateOperationTotals', () => {
    it('deve calcular totais por operação', () => {
      const januaryExpenses = filterExpensesByMonth(mockExpenses, 0, 2024);
      const result = calculateOperationTotals(januaryExpenses, mockOperations);

      const op1Total = result.find((r) => r.operationId === '1');
      expect(op1Total?.total).toBe(1000);
      expect(op1Total?.paid).toBe(1000);
      expect(op1Total?.pending).toBe(0);
    });

    it('deve calcular pendente corretamente', () => {
      const januaryExpenses = filterExpensesByMonth(mockExpenses, 0, 2024);
      const result = calculateOperationTotals(januaryExpenses, mockOperations);

      const op2Total = result.find((r) => r.operationId === '2');
      expect(op2Total?.total).toBe(500);
      expect(op2Total?.paid).toBe(0);
      expect(op2Total?.pending).toBe(500);
    });

    it('deve considerar alocações em despesas compartilhadas', () => {
      const februaryExpenses = filterExpensesByMonth(mockExpenses, 1, 2024);
      const result = calculateOperationTotals(februaryExpenses, mockOperations);

      const op1Total = result.find((r) => r.operationId === '1');
      const op2Total = result.find((r) => r.operationId === '2');

      expect(op1Total?.total).toBe(300);
      expect(op2Total?.total).toBe(300);
    });

    it('deve filtrar operações sem despesas', () => {
      const result = calculateOperationTotals(mockExpenses, mockOperations);
      const op3Total = result.find((r) => r.operationId === '3');
      expect(op3Total).toBeUndefined();
    });
  });

  describe('calculateSectorTotals', () => {
    it('deve calcular totais por setor', () => {
      const januaryExpenses = filterExpensesByMonth(mockExpenses, 0, 2024);
      const result = calculateSectorTotals(januaryExpenses, mockSectors, mockOperations);

      const sector1Total = result.find((r) => r.sectorId === 's1');
      expect(sector1Total?.total).toBe(1500); // 1000 + 500
    });

    it('deve filtrar setores sem despesas', () => {
      const januaryExpenses = filterExpensesByMonth(mockExpenses, 0, 2024);
      const result = calculateSectorTotals(januaryExpenses, mockSectors, mockOperations);

      const sector2Total = result.find((r) => r.sectorId === 's2');
      expect(sector2Total).toBeUndefined();
    });

    it('deve considerar alocações em despesas compartilhadas pagas', () => {
      const februaryExpenses = filterExpensesByMonth(mockExpenses, 1, 2024);
      const result = calculateSectorTotals(februaryExpenses, mockSectors, mockOperations);

      const sector1Total = result.find((r) => r.sectorId === 's1');
      expect(sector1Total?.total).toBe(600); // 300 + 300 das alocações
      expect(sector1Total?.paid).toBe(600); // despesa compartilhada está paga
    });

    it('deve calcular pending em despesas compartilhadas não pagas', () => {
      const expensesWithPending: Expense[] = [
        {
          id: 'e4',
          operationId: '1',
          description: 'Despesa Compartilhada Pendente',
          supplier: 'Fornecedor D',
          category: 'Energia',
          agreedValue: 400,
          negotiatedValue: 400,
          date: '2024-03-05',
          dueDate: '2024-03-10',
          competence: '2024-03-01T00:00:00.000Z',
          paymentMethod: 'pix',
          createdAt: '2024-03-05',
          createdBy: 'User',
          status: 'pending',
          isShared: true,
          allocations: [
            { operationId: '1', percentage: 50, value: 200 },
            { operationId: '2', percentage: 50, value: 200 },
          ],
        },
      ];
      const result = calculateSectorTotals(expensesWithPending, mockSectors, mockOperations);

      const sector1Total = result.find((r) => r.sectorId === 's1');
      expect(sector1Total?.total).toBe(400);
      expect(sector1Total?.paid).toBe(0);
      expect(sector1Total?.pending).toBe(400);
    });
  });

  describe('calculateMonthlyReport', () => {
    it('deve gerar relatório mensal completo', () => {
      const result = calculateMonthlyReport(mockExpenses, mockOperations, mockSectors, 0, 2024);

      expect(result.totalMonth).toBe(1500);
      expect(result.totalPaid).toBe(1000);
      expect(result.totalPending).toBe(500);
      expect(result.expenseCount).toBe(2);
    });

    it('deve retornar valores zerados para mês sem despesas', () => {
      const result = calculateMonthlyReport(mockExpenses, mockOperations, mockSectors, 11, 2024);

      expect(result.totalMonth).toBe(0);
      expect(result.expenseCount).toBe(0);
    });
  });

  describe('calculatePercentChange', () => {
    it('deve calcular aumento percentual', () => {
      expect(calculatePercentChange(150, 100)).toBe(50);
    });

    it('deve calcular redução percentual', () => {
      expect(calculatePercentChange(50, 100)).toBe(-50);
    });

    it('deve retornar 0 quando valor anterior é 0', () => {
      expect(calculatePercentChange(100, 0)).toBe(0);
    });

    it('deve calcular corretamente quando valores são iguais', () => {
      expect(calculatePercentChange(100, 100)).toBe(0);
    });
  });

  describe('distributeValueEqually', () => {
    it('deve distribuir igualmente entre 2 operações', () => {
      const result = distributeValueEqually(1000, ['1', '2']);

      expect(result).toHaveLength(2);
      expect(result[0].percentage).toBe(50);
      expect(result[1].percentage).toBe(50);
      expect(result[0].value).toBe(500);
      expect(result[1].value).toBe(500);
    });

    it('deve distribuir com resto na primeira operação', () => {
      const result = distributeValueEqually(1000, ['1', '2', '3']);

      expect(result[0].percentage).toBe(34); // 33 + 1 resto
      expect(result[1].percentage).toBe(33);
      expect(result[2].percentage).toBe(33);
    });

    it('deve retornar array vazio se não houver operações', () => {
      const result = distributeValueEqually(1000, []);
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateAllocatedValue', () => {
    it('deve calcular valor alocado corretamente', () => {
      expect(calculateAllocatedValue(1000, 25)).toBe(250);
    });

    it('deve retornar 0 para 0%', () => {
      expect(calculateAllocatedValue(1000, 0)).toBe(0);
    });

    it('deve retornar valor total para 100%', () => {
      expect(calculateAllocatedValue(1000, 100)).toBe(1000);
    });
  });

  describe('hasValueDiscrepancy', () => {
    it('deve detectar discrepância significativa', () => {
      expect(hasValueDiscrepancy(1000, 900)).toBe(true);
    });

    it('deve não detectar discrepância dentro da tolerância', () => {
      expect(hasValueDiscrepancy(1000, 995)).toBe(false);
    });

    it('deve detectar quando nota é zero e valor combinado não', () => {
      expect(hasValueDiscrepancy(1000, 0)).toBe(true);
    });

    it('deve respeitar tolerância customizada', () => {
      expect(hasValueDiscrepancy(1000, 900, 0.15)).toBe(false); // 10% < 15% tolerância
    });
  });

  describe('calculateExpenseStats', () => {
    it('deve calcular estatísticas corretamente', () => {
      const result = calculateExpenseStats(mockExpenses);

      expect(result.count).toBe(3);
      expect(result.total).toBe(2100); // 1000 + 500 + 600
      expect(result.average).toBe(700);
      expect(result.max).toBe(1000);
      expect(result.min).toBe(500);
    });

    it('deve calcular totais por status', () => {
      const result = calculateExpenseStats(mockExpenses);

      expect(result.byStatus['paid']).toBe(1600); // 1000 + 600
      expect(result.byStatus['pending']).toBe(500);
    });

    it('deve retornar valores zerados para array vazio', () => {
      const result = calculateExpenseStats([]);

      expect(result.count).toBe(0);
      expect(result.total).toBe(0);
      expect(result.average).toBe(0);
    });
  });
});
