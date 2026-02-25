/**
 * Funções de formatação para valores monetários, datas e números
 */

/**
 * Formata um número para moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada em BRL (ex: R$ 1.234,56)
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata um valor monetário a partir de uma string de input
 * Usado para campos de entrada de valores
 * @param value - String contendo apenas números (em centavos)
 * @returns String formatada (ex: 1.234,56)
 */
export const formatCurrencyInput = (value: string): string => {
  const number = value.replace(/\D/g, '');
  if (!number) return '';

  const formatted = (parseInt(number) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
};

/**
 * Converte string de input para valor numérico
 * @param text - Texto do input
 * @returns Valor numérico ou null se inválido
 */
export const parseCurrencyInput = (text: string): number | null => {
  const numbers = text.replace(/\D/g, '');
  if (!numbers) return null;
  return parseInt(numbers) / 100;
};

/**
 * Formata uma data para exibição curta (dia e mês abreviado)
 * @param dateString - Data em formato ISO ou string válida
 * @returns String formatada (ex: 15 jan.)
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
};

/**
 * Formata uma data para exibição completa
 * @param dateString - Data em formato ISO ou string válida
 * @returns String formatada (ex: 15/01/2024)
 */
export const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata uma data para input de formulário (dd/mm/aaaa)
 * @param dateString - Data em formato ISO
 * @returns String no formato dd/mm/aaaa
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Converte data do formato brasileiro para ISO
 * @param dateString - Data no formato dd/mm/aaaa
 * @returns Data no formato ISO ou null se inválida
 */
export const parseDateFromInput = (dateString: string): string | null => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  const date = new Date(year, month - 1, day);

  // Verifica se a data é válida (ex: 31/02 seria inválido)
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return null;
  }

  // Formata manualmente para evitar problemas de timezone com toISOString()
  const yy = String(year).padStart(4, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

/**
 * Formata o nome do mês em português
 * @param date - Objeto Date
 * @returns Nome do mês capitalizado (ex: Janeiro)
 */
export const formatMonthName = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
};

/**
 * Formata mês e ano
 * @param date - Objeto Date
 * @returns String no formato "Mês/Ano" (ex: Janeiro/2024)
 */
export const formatMonthYear = (date: Date): string => {
  const month = formatMonthName(date);
  const year = date.getFullYear();
  return `${month}/${year}`;
};

/**
 * Formata um número decimal com casas decimais específicas
 * @param value - Valor numérico
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada
 */
export const formatDecimal = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formata percentual
 * @param value - Valor numérico (ex: 0.25 para 25%)
 * @param decimals - Número de casas decimais
 * @returns String formatada com símbolo de percentual
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};
