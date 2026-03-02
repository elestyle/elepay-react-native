import AsyncStorage from '@react-native-async-storage/async-storage';

const cache = new Map<string, string>();
let initialized = false;

export async function initKV(keys: string[]): Promise<void> {
  const result = await AsyncStorage.getMany(keys);
  for (const key of keys) {
    const value = result[key];
    if (value != null) {
      cache.set(key, value);
    }
  }
  initialized = true;
}

export function kvGet(key: string): string | null {
  return cache.get(key) ?? null;
}

export function kvSet(key: string, value: string): void {
  cache.set(key, value);
  AsyncStorage.setItem(key, value);
}

export function kvRemove(key: string): void {
  cache.delete(key);
  AsyncStorage.removeItem(key);
}

export function kvGetInt(key: string): number {
  const v = cache.get(key);
  return v != null ? parseInt(v, 10) || 0 : 0;
}

export function kvSetInt(key: string, value: number): void {
  kvSet(key, String(value));
}

export function isKVInitialized(): boolean {
  return initialized;
}
