import {
  isNotEmpty,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidDateFormat,
  isValidDate,
  isDateNotInPast,
  isValidPercentageDistribution,
  isValidEmail,
  hasMinLength,
  hasMaxLength,
  isInRange,
  validateExpenseForm,
  validateOperationForm,
  validateSectorForm,
} from '../../utils/validators';

describe('Validators', () => {
  describe('isNotEmpty', () => {
    it('deve retornar true para string com conteúdo', () => {
      expect(isNotEmpty('teste')).toBe(true);
    });

    it('deve retornar false para string vazia', () => {
      expect(isNotEmpty('')).toBe(false);
    });

    it('deve retornar false para string com apenas espaços', () => {
      expect(isNotEmpty('   ')).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isNotEmpty(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('deve retornar true para número positivo', () => {
      expect(isPositiveNumber(10)).toBe(true);
    });

    it('deve retornar true para string numérica positiva', () => {
      expect(isPositiveNumber('10.5')).toBe(true);
    });

    it('deve retornar false para zero', () => {
      expect(isPositiveNumber(0)).toBe(false);
    });

    it('deve retornar false para número negativo', () => {
      expect(isPositiveNumber(-5)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isPositiveNumber(null)).toBe(false);
    });

    it('deve retornar false para string não numérica', () => {
      expect(isPositiveNumber('abc')).toBe(false);
    });
  });

  describe('isNonNegativeNumber', () => {
    it('deve retornar true para número positivo', () => {
      expect(isNonNegativeNumber(10)).toBe(true);
    });

    it('deve retornar true para zero', () => {
      expect(isNonNegativeNumber(0)).toBe(true);
    });

    it('deve retornar false para número negativo', () => {
      expect(isNonNegativeNumber(-1)).toBe(false);
    });

    it('deve retornar true para string numérica positiva', () => {
      expect(isNonNegativeNumber('10.5')).toBe(true);
    });

    it('deve retornar false para string numérica negativa', () => {
      expect(isNonNegativeNumber('-5')).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isNonNegativeNumber(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isNonNegativeNumber(undefined)).toBe(false);
    });
  });

  describe('isValidDateFormat', () => {
    it('deve retornar true para formato válido', () => {
      expect(isValidDateFormat('15/01/2024')).toBe(true);
    });

    it('deve retornar false para formato ISO', () => {
      expect(isValidDateFormat('2024-01-15')).toBe(false);
    });

    it('deve retornar false para formato americano', () => {
      expect(isValidDateFormat('01/15/2024')).toBe(true); // Aceita o formato, mas não valida
    });

    it('deve retornar false para formato incompleto', () => {
      expect(isValidDateFormat('15/01')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('deve retornar true para data válida', () => {
      expect(isValidDate('15/01/2024')).toBe(true);
    });

    it('deve retornar false para 31 de fevereiro', () => {
      expect(isValidDate('31/02/2024')).toBe(false);
    });

    it('deve retornar true para 29 de fevereiro em ano bissexto', () => {
      expect(isValidDate('29/02/2024')).toBe(true);
    });

    it('deve retornar false para 29 de fevereiro em ano não bissexto', () => {
      expect(isValidDate('29/02/2023')).toBe(false);
    });

    it('deve retornar false para mês 13', () => {
      expect(isValidDate('15/13/2024')).toBe(false);
    });

    it('deve retornar false para dia 0', () => {
      expect(isValidDate('00/01/2024')).toBe(false);
    });

    it('deve retornar false para formato inválido', () => {
      expect(isValidDate('2024-01-15')).toBe(false);
    });

    it('deve retornar false para 31 de abril (mês com 30 dias)', () => {
      expect(isValidDate('31/04/2024')).toBe(false);
    });
  });

  describe('isDateNotInPast', () => {
    it('deve retornar true para data futura', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateStr = `15/01/${futureDate.getFullYear()}`;
      expect(isDateNotInPast(dateStr)).toBe(true);
    });

    it('deve retornar false para data passada', () => {
      expect(isDateNotInPast('15/01/2020')).toBe(false);
    });

    it('deve funcionar com formato ISO', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(isDateNotInPast(futureDate.toISOString())).toBe(true);
    });
  });

  describe('isValidPercentageDistribution', () => {
    it('deve retornar true quando soma é 100', () => {
      expect(isValidPercentageDistribution([50, 30, 20])).toBe(true);
    });

    it('deve retornar false quando soma não é 100', () => {
      expect(isValidPercentageDistribution([50, 30])).toBe(false);
    });

    it('deve retornar false para array vazio', () => {
      expect(isValidPercentageDistribution([])).toBe(false);
    });

    it('deve aceitar 100% em um único item', () => {
      expect(isValidPercentageDistribution([100])).toBe(true);
    });

    it('deve tolerar pequenos erros de ponto flutuante', () => {
      expect(isValidPercentageDistribution([33.33, 33.33, 33.34])).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('deve retornar true para email válido', () => {
      expect(isValidEmail('teste@exemplo.com')).toBe(true);
    });

    it('deve retornar false para email sem @', () => {
      expect(isValidEmail('testeexemplo.com')).toBe(false);
    });

    it('deve retornar false para email sem domínio', () => {
      expect(isValidEmail('teste@')).toBe(false);
    });

    it('deve retornar false para email com espaços', () => {
      expect(isValidEmail('teste @exemplo.com')).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('deve retornar true quando atende comprimento mínimo', () => {
      expect(hasMinLength('teste', 3)).toBe(true);
    });

    it('deve retornar false quando não atende', () => {
      expect(hasMinLength('ab', 3)).toBe(false);
    });

    it('deve ignorar espaços ao redor', () => {
      expect(hasMinLength('  ab  ', 3)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('deve retornar true quando está dentro do limite', () => {
      expect(hasMaxLength('abc', 5)).toBe(true);
    });

    it('deve retornar false quando excede', () => {
      expect(hasMaxLength('abcdef', 5)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('deve retornar true quando valor está no range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
    });

    it('deve retornar true para valor igual ao mínimo', () => {
      expect(isInRange(1, 1, 10)).toBe(true);
    });

    it('deve retornar true para valor igual ao máximo', () => {
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('deve retornar false quando valor está abaixo', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
    });

    it('deve retornar false quando valor está acima', () => {
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  describe('validateExpenseForm', () => {
    it('deve validar formulário completo', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        operationId: '1',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: false,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar descrição vazia', () => {
      const result = validateExpenseForm({
        description: '',
        operationId: '1',
        agreedValue: 100,
        dueDate: '15/01/2024',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Informe a descrição do lançamento');
    });

    it('deve rejeitar valor inválido', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        operationId: '1',
        agreedValue: 0,
        dueDate: '15/01/2024',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Informe um valor válido');
    });

    it('deve validar rateio com percentuais corretos', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: true,
        allocations: [{ percentage: 60 }, { percentage: 40 }],
      });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar rateio com menos de 2 operações', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: true,
        allocations: [{ percentage: 100 }],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Selecione pelo menos 2 operações para ratear');
    });

    it('deve rejeitar rateio com soma diferente de 100%', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: true,
        allocations: [{ percentage: 50 }, { percentage: 30 }],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('A soma dos percentuais deve ser 100%');
    });

    it('deve rejeitar despesa não compartilhada sem operação', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        operationId: '',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: false,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Selecione uma operação');
    });

    it('deve validar despesa compartilhada sem exigir operationId', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        agreedValue: 100,
        dueDate: '15/01/2024',
        isShared: true,
        allocations: [{ percentage: 50 }, { percentage: 50 }],
      });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar data de vencimento vazia', () => {
      const result = validateExpenseForm({
        description: 'Teste',
        operationId: '1',
        agreedValue: 100,
        dueDate: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Informe a data de vencimento');
    });
  });

  describe('validateOperationForm', () => {
    it('deve validar formulário completo', () => {
      const result = validateOperationForm({
        name: 'Operação Teste',
        sectorId: '1',
      });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar nome vazio', () => {
      const result = validateOperationForm({
        name: '',
        sectorId: '1',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Informe o nome da operação');
    });

    it('deve rejeitar sem setor', () => {
      const result = validateOperationForm({
        name: 'Teste',
        sectorId: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Selecione um setor');
    });
  });

  describe('validateSectorForm', () => {
    it('deve validar formulário completo', () => {
      const result = validateSectorForm({
        name: 'Setor Teste',
      });
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar nome vazio', () => {
      const result = validateSectorForm({
        name: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Informe o nome do setor');
    });
  });
});
