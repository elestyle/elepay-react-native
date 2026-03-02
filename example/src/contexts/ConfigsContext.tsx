import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import { KV_KEY_pubKey, KV_KEY_secKey } from '@/constants/storageKeys';

export const API_HOST = 'https://api.elepay.io';
export const API_CHARGE = `${API_HOST}/charges`;
export const API_CUSTOMERS = `${API_HOST}/customers`;
export const API_CHECKOUT = `${API_HOST}/codes`;
export function apiSource(customerId: string) {
  return `${API_CUSTOMERS}/${customerId}/sources`;
}

interface ConfigsContextType {
  pubKey: string;
  secKey: string;
  setPubKey: (v: string) => void;
  setSecKey: (v: string) => void;
}

const ConfigsContext = createContext<ConfigsContextType>({
  pubKey: '',
  secKey: '',
  setPubKey: () => {},
  setSecKey: () => {},
});

export function ConfigsProvider({ children }: { children: React.ReactNode }) {
  const [pubKey, _setPubKey] = useState(() => kvGet(KV_KEY_pubKey) ?? '');
  const [secKey, _setSecKey] = useState(() => kvGet(KV_KEY_secKey) ?? '');

  const setPubKey = useCallback((v: string) => {
    _setPubKey(v);
    kvSet(KV_KEY_pubKey, v);
  }, []);

  const setSecKey = useCallback((v: string) => {
    _setSecKey(v);
    kvSet(KV_KEY_secKey, v);
  }, []);

  return (
    <ConfigsContext.Provider value={{ pubKey, secKey, setPubKey, setSecKey }}>
      {children}
    </ConfigsContext.Provider>
  );
}

export function useConfigs() {
  return useContext(ConfigsContext);
}
