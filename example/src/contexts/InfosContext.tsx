import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import {
  KV_KEY_infosName,
  KV_KEY_infosEmail,
  KV_KEY_infosPhone,
  KV_KEY_infosCustomerId,
  KV_KEY_infosSourceId,
} from '@/constants/storageKeys';

interface InfosContextType {
  name: string;
  email: string;
  phone: string;
  customerId: string;
  sourceId: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setCustomerId: (v: string) => void;
  setSourceId: (v: string) => void;
  noInfos: boolean;
  noSource: boolean;
}

const InfosContext = createContext<InfosContextType>({
  name: '',
  email: '',
  phone: '',
  customerId: '',
  sourceId: '',
  setName: () => {},
  setEmail: () => {},
  setPhone: () => {},
  setCustomerId: () => {},
  setSourceId: () => {},
  noInfos: true,
  noSource: true,
});

export function InfosProvider({ children }: { children: React.ReactNode }) {
  const [name, _setName] = useState(() => kvGet(KV_KEY_infosName) ?? '');
  const [email, _setEmail] = useState(() => kvGet(KV_KEY_infosEmail) ?? '');
  const [phone, _setPhone] = useState(() => kvGet(KV_KEY_infosPhone) ?? '');
  const [customerId, _setCustomerId] = useState(() => kvGet(KV_KEY_infosCustomerId) ?? '');
  const [sourceId, _setSourceId] = useState(() => kvGet(KV_KEY_infosSourceId) ?? '');

  const setName = useCallback((v: string) => {
    _setName(v);
    kvSet(KV_KEY_infosName, v);
  }, []);
  const setEmail = useCallback((v: string) => {
    _setEmail(v);
    kvSet(KV_KEY_infosEmail, v);
  }, []);
  const setPhone = useCallback((v: string) => {
    _setPhone(v);
    kvSet(KV_KEY_infosPhone, v);
  }, []);
  const setCustomerId = useCallback((v: string) => {
    _setCustomerId(v);
    kvSet(KV_KEY_infosCustomerId, v);
  }, []);
  const setSourceId = useCallback((v: string) => {
    _setSourceId(v);
    kvSet(KV_KEY_infosSourceId, v);
  }, []);

  return (
    <InfosContext.Provider
      value={{
        name,
        email,
        phone,
        customerId,
        sourceId,
        setName,
        setEmail,
        setPhone,
        setCustomerId,
        setSourceId,
        noInfos: !name || !email || !phone,
        noSource: !customerId || !sourceId,
      }}
    >
      {children}
    </InfosContext.Provider>
  );
}

export function useInfos() {
  return useContext(InfosContext);
}
