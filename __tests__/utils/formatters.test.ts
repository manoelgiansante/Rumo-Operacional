import {
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
  formatDateShort,
  formatDateFull,
  formatDateForInput,
  parseDateFromInput,
  formatMonthName,
  formatMonthYear,
  formatDecimal,
  formatPercent,
} from '../../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('deve formatar valor positivo em BRL', () => {
      expect(formatCurrency(1234.56)).toBe('R$\u00A01.234,56');
    });

    it('deve formatar valor zero', () => {
      expect(formatCurrency(0)).toBe('R$\u00A00,00');
    });

    it('deve formatar valor negativo', () => {
      expect(formatCurrency(-1234.56)).toBe('-R$\u00A01.234,56');
    });

    it('deve formatar valores grandes', () => {
      expect(formatCurrency(1000000)).toBe('R$\u00A01.000.000,00');
    });

    it('deve formatar valores pequenos com centavos', () => {
      expect(formatCurrency(0.99)).toBe('R$\u00A00,99');
    });
  });

  describe('formatCurrencyInput', () => {
    it('deve formatar input de centavos', () => {
      expect(formatCurrencyInput('12345')).toBe('123,45');
    });

    it('deve retornar vazio para string vazia', () => {
      expect(formatCurrencyInput('')).toBe('');
    });

    it('deve ignorar caracteres não numéricos', () => {
      expect(formatCurrencyInput('abc123def')).toBe('1,23');
    });

    it('deve formatar valores grandes', () => {
      expect(formatCurrencyInput('1234567')).toBe('12.345,67');
    });

    it('deve formatar valores pequenos', () => {
      expect(formatCurrencyInput('1')).toBe('0,01');
    });
  });

  describe('parseCurrencyInput', () => {
    it('deve converter string de centavos para número', () => {
      expect(parseCurrencyInput('12345')).toBe(123.45);
    });

    it('deve retornar null para string vazia', () => {
      expect(parseCurrencyInput('')).toBeNull();
    });

    it('deve ignorar caracteres não numéricos', () => {
      expect(parseCurrencyInput('R$ 1.234,56')).toBe(1234.56);
    });
  });

  describe('formatDateShort', () => {
    it('deve formatar data corretamente', () => {
      // Usando data local para evitar problemas de timezone
      const date = new Date(2024, 0, 15); // Janeiro 15, 2024
      const result = formatDateShort(date.toISOString());
      expect(result).toMatch(/15/);
      expect(result.toLowerCase()).toMatch(/jan/);
    });

    it('deve retornar mensagem de erro para data inválida', () => {
      expect(formatDateShort('invalid-date')).toBe('Data inválida');
    });
  });

  describe('formatDateFull', () => {
    it('deve formatar data completa', () => {
      const date = new Date(2024, 0, 15); // Janeiro 15, 2024
      expect(formatDateFull(date.toISOString())).toBe('15/01/2024');
    });

    it('deve retornar mensagem de erro para data inválida', () => {
      expect(formatDateFull('not-a-date')).toBe('Data inválida');
    });
  });

  describe('formatDateForInput', () => {
    it('deve formatar data ISO para input brasileiro', () => {
      const date = new Date(2024, 0, 15); // Janeiro 15, 2024
      expect(formatDateForInput(date.toISOString())).toBe('15/01/2024');
    });

    it('deve retornar vazio para data inválida', () => {
      expect(formatDateForInput('invalid')).toBe('');
    });

    it('deve adicionar zeros à esquerda', () => {
      const date = new Date(2024, 0, 5); // Janeiro 5, 2024
      expect(formatDateForInput(date.toISOString())).toBe('05/01/2024');
    });
  });

  describe('parseDateFromInput', () => {
    it('deve converter data brasileira para ISO', () => {
      expect(parseDateFromInput('15/01/2024')).toBe('2024-01-15');
    });

    it('deve retornar null para formato inválido', () => {
      expect(parseDateFromInput('15-01-2024')).toBeNull();
      expect(parseDateFromInput('2024/01/15')).toBeNull();
    });

    it('deve retornar null para dia inválido', () => {
      expect(parseDateFromInput('32/01/2024')).toBeNull();
      expect(parseDateFromInput('00/01/2024')).toBeNull();
    });

    it('deve retornar null para mês inválido', () => {
      expect(parseDateFromInput('15/13/2024')).toBeNull();
      expect(parseDateFromInput('15/00/2024')).toBeNull();
    });

    it('deve retornar null para datas impossíveis (31 de fevereiro)', () => {
      expect(parseDateFromInput('31/02/2024')).toBeNull();
    });

    it('deve aceitar 29 de fevereiro em ano bissexto', () => {
      expect(parseDateFromInput('29/02/2024')).toBe('2024-02-29');
    });

    it('deve rejeitar 29 de fevereiro em ano não bissexto', () => {
      expect(parseDateFromInput('29/02/2023')).toBeNull();
    });

    it('deve retornar null para ano fora do range válido', () => {
      expect(parseDateFromInput('15/01/1899')).toBeNull();
      expect(parseDateFromInput('15/01/2101')).toBeNull();
    });
  });

  describe('formatMonthName', () => {
    it('deve formatar nome do mês em português', () => {
      const date = new Date(2024, 0, 15); // Janeiro
      const result = formatMonthName(date).toLowerCase();
      expect(result).toBe('janeiro');
    });

    it('deve capitalizar primeira letra', () => {
      const date = new Date(2024, 11, 15); // Dezembro
      const result = formatMonthName(date);
      expect(result[0]).toBe(result[0].toUpperCase());
    });
  });

  describe('formatMonthYear', () => {
    it('deve formatar mês e ano', () => {
      const date = new Date(2024, 0, 15);
      const result = formatMonthYear(date);
      expect(result.toLowerCase()).toContain('janeiro');
      expect(result).toContain('2024');
    });
  });

  describe('formatDecimal', () => {
    it('deve formatar com 2 casas decimais por padrão', () => {
      expect(formatDecimal(1234.5)).toBe('1.234,50');
    });

    it('deve formatar com casas decimais customizadas', () => {
      expect(formatDecimal(1234.5678, 3)).toBe('1.234,568');
    });

    it('deve formatar valores inteiros', () => {
      expect(formatDecimal(1000, 2)).toBe('1.000,00');
    });
  });

  describe('formatPercent', () => {
    it('deve formatar percentual', () => {
      expect(formatPercent(0.25)).toBe('25.0%');
    });

    it('deve formatar com casas decimais customizadas', () => {
      expect(formatPercent(0.3333, 2)).toBe('33.33%');
    });

    it('deve formatar 100%', () => {
      expect(formatPercent(1)).toBe('100.0%');
    });

    it('deve formatar 0%', () => {
      expect(formatPercent(0)).toBe('0.0%');
    });
  });
});
