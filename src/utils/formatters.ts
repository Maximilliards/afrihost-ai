import { PaymentProvider } from '../types';

/**
 * Formats a number as Central African CFA Franc (FCFA)
 * Example: 75000 -> "75 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 FCFA';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

/**
 * Calculates Cameroon's 0.2% TTA (Taxe sur les Transferts Électroniques)
 * Art. 225 du Code Général des Impôts du Cameroun
 */
export function calculateTTA(amount: number): number {
  if (!amount || amount <= 0) return 0;
  return Math.round(amount * 0.002); // 0.2%
}

/**
 * Calculates Mobile Operator Processing Fee (1% for MTN MoMo & Orange Money, 0% for Cash)
 */
export function calculateOperatorFee(amount: number, provider: PaymentProvider): number {
  if (!amount || amount <= 0 || provider === 'CASH') return 0;
  return Math.round(amount * 0.01); // 1.0%
}

/**
 * Computes full financial breakdown for a transaction in Cameroon
 */
export function calculateFinancialBreakdown(amount: number, provider: PaymentProvider) {
  const tta = provider === 'CASH' ? 0 : calculateTTA(amount);
  const operatorFee = calculateOperatorFee(amount, provider);
  const netAmount = amount - tta - operatorFee;
  
  return {
    grossAmount: amount,
    ttaTax: tta,
    operatorFee: operatorFee,
    totalDeductions: tta + operatorFee,
    netAmount: netAmount,
  };
}

/**
 * Standardizes and formats Cameroonian and international phone numbers
 * e.g., "237699123456" -> "+237 699 12 34 56"
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+237') && cleaned.length === 13) {
    return `+237 ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11, 13)}`;
  }
  if (cleaned.startsWith('237') && cleaned.length === 12) {
    return `+237 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  return phone;
}

/**
 * Returns formatted date in French locale
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
}
