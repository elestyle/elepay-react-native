export function formatCard(
  input: string,
  totalDigits: number,
  splitCount: number,
  splitChars: string,
): string {
  let digits = input.replace(new RegExp(escapeRegex(splitChars), 'g'), '').replace(/\D/g, '');
  if (digits.length > totalDigits) {
    digits = digits.substring(0, totalDigits);
  }
  let result = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % splitCount === 0) {
      result += splitChars;
    }
    result += digits[i];
  }
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
