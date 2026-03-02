export enum FinanceType {
  USD = 'USD',
  AUD = 'AUD',
  BRL = 'BRL',
  GBP = 'GBP',
  CAD = 'CAD',
  CNY = 'CNY',
  EUR = 'EUR',
  HKD = 'HKD',
  INR = 'INR',
  JPY = 'JPY',
  KRW = 'KRW',
  PLN = 'PLN',
  SEK = 'SEK',
  CHF = 'CHF',
}

interface FinanceDetail {
  name: string;
  symbol: string;
  rate: number;
}

const FINANCE_DATA: Record<FinanceType, FinanceDetail> = {
  [FinanceType.USD]: { name: 'USD', symbol: '$', rate: 1.0 },
  [FinanceType.AUD]: { name: 'AUD', symbol: 'A$', rate: 0.6902 },
  [FinanceType.BRL]: { name: 'BRL', symbol: 'R$', rate: 0.205 },
  [FinanceType.GBP]: { name: 'GBP', symbol: '\u00a3', rate: 1.2296 },
  [FinanceType.CAD]: { name: 'CAD', symbol: 'C$', rate: 0.7374 },
  [FinanceType.CNY]: { name: 'CNY', symbol: '\u00a5', rate: 0.1408 },
  [FinanceType.EUR]: { name: 'EUR', symbol: '\u20ac', rate: 1.0557 },
  [FinanceType.HKD]: { name: 'HKD', symbol: 'HK$', rate: 0.1279 },
  [FinanceType.INR]: { name: 'INR', symbol: '\u20b9', rate: 0.0122 },
  [FinanceType.JPY]: { name: 'JPY', symbol: '\u00a5', rate: 0.0073 },
  [FinanceType.KRW]: { name: 'KRW', symbol: '\u20a9', rate: 0.00077 },
  [FinanceType.PLN]: { name: 'PLN', symbol: 'z\u0142', rate: 0.2417 },
  [FinanceType.SEK]: { name: 'SEK', symbol: 'kr', rate: 0.0953 },
  [FinanceType.CHF]: { name: 'CHF', symbol: 'CHF', rate: 1.0697 },
};

export const ALL_FINANCE_TYPES = Object.values(FinanceType);

export function parseFinanceType(input: string | null): FinanceType {
  if (input && Object.values(FinanceType).includes(input as FinanceType)) {
    return input as FinanceType;
  }
  return FinanceType.JPY;
}

export function getFinanceDetail(type: FinanceType): FinanceDetail {
  return FINANCE_DATA[type];
}

export function displayPrice(type: FinanceType, prices: number[]): string {
  const detail = FINANCE_DATA[type];
  const amt = calculateAmount(type, prices);
  return `${detail.name} ${detail.symbol}${amt}`;
}

export function calculateAmount(type: FinanceType, prices: number[]): number {
  const detail = FINANCE_DATA[type];
  const total = prices.reduce((sum, price) => sum + price / detail.rate, 0);
  return Math.floor(total);
}
