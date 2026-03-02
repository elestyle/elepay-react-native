import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import { KV_KEY_finance } from '@/constants/storageKeys';
import { FinanceType, parseFinanceType, displayPrice, calculateAmount } from '@/models/finance';

interface FinanceContextType {
  current: FinanceType;
  setCurrent: (type: FinanceType) => void;
  display: (prices: number[]) => string;
  amount: (prices: number[]) => number;
}

const FinanceContext = createContext<FinanceContextType>({
  current: FinanceType.JPY,
  setCurrent: () => {},
  display: () => '',
  amount: () => 0,
});

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [current, _setCurrent] = useState<FinanceType>(() =>
    parseFinanceType(kvGet(KV_KEY_finance)),
  );

  const setCurrent = useCallback((type: FinanceType) => {
    _setCurrent(type);
    kvSet(KV_KEY_finance, type);
  }, []);

  const display = useCallback((prices: number[]) => displayPrice(current, prices), [current]);

  const amount = useCallback((prices: number[]) => calculateAmount(current, prices), [current]);

  return (
    <FinanceContext.Provider value={{ current, setCurrent, display, amount }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
