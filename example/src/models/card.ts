export interface Card {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

export function isCardEmpty(card: Card): boolean {
  return !card.number || !card.expMonth || !card.expYear || !card.cvc;
}
