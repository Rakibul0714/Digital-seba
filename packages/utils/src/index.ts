const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const EN_DIGITS = '0123456789';

export function toBn(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)]);
}

export function toEn(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => EN_DIGITS[BN_DIGITS.indexOf(digit)]);
}

export function formatBnNumber(value: number): string {
  return toBn(new Intl.NumberFormat('en-IN').format(value));
}

export function formatBnDate(date: Date | string): string {
  return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}
