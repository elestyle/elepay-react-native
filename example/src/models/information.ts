export interface Information {
  name: string;
  email: string;
  phone: string;
  customerId: string;
  sourceId: string;
}

export function hasNoInfos(info: Information): boolean {
  return !info.name || !info.email || !info.phone;
}

export function hasNoSource(info: Information): boolean {
  return !info.customerId || !info.sourceId;
}
