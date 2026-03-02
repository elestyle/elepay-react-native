export enum TradingType {
  Charge = 'Charge',
  Source = 'Source',
  Checkout = 'Checkout',
}

export const ALL_TRADING_TYPES = Object.values(TradingType);

export function parseTradingType(input: string | null): TradingType {
  if (input && Object.values(TradingType).includes(input as TradingType)) {
    return input as TradingType;
  }
  return TradingType.Charge;
}
