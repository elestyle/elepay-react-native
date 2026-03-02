import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import {
  KV_KEY_cardNumber,
  KV_KEY_cardExpMonth,
  KV_KEY_cardExpYear,
  KV_KEY_cardCVC,
} from '@/constants/storageKeys';

interface CardContextType {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  setNumber: (v: string) => void;
  setExpMonth: (v: string) => void;
  setExpYear: (v: string) => void;
  setCvc: (v: string) => void;
  isEmpty: boolean;
}

const CardContext = createContext<CardContextType>({
  number: '',
  expMonth: '',
  expYear: '',
  cvc: '',
  setNumber: () => {},
  setExpMonth: () => {},
  setExpYear: () => {},
  setCvc: () => {},
  isEmpty: true,
});

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [number, _setNumber] = useState(() => kvGet(KV_KEY_cardNumber) ?? '');
  const [expMonth, _setExpMonth] = useState(() => kvGet(KV_KEY_cardExpMonth) ?? '');
  const [expYear, _setExpYear] = useState(() => kvGet(KV_KEY_cardExpYear) ?? '');
  const [cvc, _setCvc] = useState(() => kvGet(KV_KEY_cardCVC) ?? '');

  const setNumber = useCallback((v: string) => {
    _setNumber(v);
    kvSet(KV_KEY_cardNumber, v);
  }, []);
  const setExpMonth = useCallback((v: string) => {
    _setExpMonth(v);
    kvSet(KV_KEY_cardExpMonth, v);
  }, []);
  const setExpYear = useCallback((v: string) => {
    _setExpYear(v);
    kvSet(KV_KEY_cardExpYear, v);
  }, []);
  const setCvc = useCallback((v: string) => {
    _setCvc(v);
    kvSet(KV_KEY_cardCVC, v);
  }, []);

  return (
    <CardContext.Provider
      value={{
        number,
        expMonth,
        expYear,
        cvc,
        setNumber,
        setExpMonth,
        setExpYear,
        setCvc,
        isEmpty: !number || !expMonth || !expYear || !cvc,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCard() {
  return useContext(CardContext);
}
