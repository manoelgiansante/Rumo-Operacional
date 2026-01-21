/**
 * Funções de validação para formulários e dados
 */

/**
 * Valida se uma string não está vazia
 * @param value - Valor a ser validado
 * @returns true se a string tem conteúdo
 */
export const isNotEmpty = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

/**
 * Valida se um valor é um número positivo válido
 * @param value - Valor a ser validado (string ou número)
 * @returns true se é um número positivo
 */
export const isPositiveNumber = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Valida se um valor é um número não negativo
 * @param value - Valor a ser validado
 * @returns true se é um número >= 0
 */
export const isNonNegativeNumber = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
};

/**
 * Valida formato de data brasileira (dd/mm/aaaa)
 * @param dateString - String de data
 * @returns true se o formato é válido
 */
export const isValidDateFormat = (dateString: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
};

/**
 * Valida se uma data é válida e real
 * @param dateString - Data no formato dd/mm/aaaa
 * @returns true se a data existe (ex: 31/02 retorna false)
 */
export const isValidDate = (dateString: string): boolean => {
  if (!isValidDateFormat(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year;
};

/**
 * Valida se uma data não é no passado
 * @param dateString - Data no formato dd/mm/aaaa ou ISO
 * @returns true se a data é hoje ou no futuro
 */
export const isDateNotInPast = (dateString: string): boolean => {
  let date: Date;
  
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateString);
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today;
};

/**
 * Valida se a soma dos percentuais é igual a 100
 * @param percentages - Array de percentuais
 * @returns true se a soma é 100
 */
export const isValidPercentageDistribution = (percentages: number[]): boolean => {
  if (percentages.length === 0) return false;
  const sum = percentages.reduce((acc, val) => acc + val, 0);
  return Math.abs(sum - 100) < 0.01; // Tolerância para erros de ponto flutuante
};

/**
 * Valida se um email tem formato válido
 * @param email - Email a ser validado
 * @returns true se o formato é válido
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida comprimento mínimo de string
 * @param value - String a ser validada
 * @param minLength - Comprimento mínimo
 * @returns true se a string tem pelo menos minLength caracteres
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Valida comprimento máximo de string
 * @param value - String a ser validada
 * @param maxLength - Comprimento máximo
 * @returns true se a string tem no máximo maxLength caracteres
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Valida se um valor está dentro de um range
 * @param value - Valor numérico
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns true se min <= value <= max
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida um formulário de despesa
 * @param expense - Dados da despesa
 * @returns Objeto com isValid e array de erros
 */
export const validateExpenseForm = (expense: {
  description?: string;
  operationId?: string;
  agreedValue?: number | string;
  dueDate?: string;
  isShared?: boolean;
  allocations?: { percentage: number }[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isNotEmpty(expense.description)) {
    errors.push('Informe a descrição do lançamento');
  }
  
  if (!expense.isShared && !isNotEmpty(expense.operationId)) {
    errors.push('Selecione uma operação');
  }
  
  if (!isPositiveNumber(expense.agreedValue)) {
    errors.push('Informe um valor válido');
  }
  
  if (!isNotEmpty(expense.dueDate)) {
    errors.push('Informe a data de vencimento');
  }
  
  if (expense.isShared && expense.allocations) {
    if (expense.allocations.length < 2) {
      errors.push('Selecione pelo menos 2 operações para ratear');
    }
    
    const percentages = expense.allocations.map(a => a.percentage);
    if (!isValidPercentageDistribution(percentages)) {
      errors.push('A soma dos percentuais deve ser 100%');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida um formulário de operação
 * @param operation - Dados da operação
 * @returns Objeto com isValid e array de erros
 */
export const validateOperationForm = (operation: {
  name?: string;
  sectorId?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isNotEmpty(operation.name)) {
    errors.push('Informe o nome da operação');
  }
  
  if (!isNotEmpty(operation.sectorId)) {
    errors.push('Selecione um setor');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida um formulário de setor
 * @param sector - Dados do setor
 * @returns Objeto com isValid e array de erros
 */
export const validateSectorForm = (sector: {
  name?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isNotEmpty(sector.name)) {
    errors.push('Informe o nome do setor');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
