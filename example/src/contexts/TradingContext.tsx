import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import { KV_KEY_trading } from '@/constants/storageKeys';
import { TradingType, parseTradingType } from '@/models/tradingType';

interface TradingContextType {
  current: TradingType;
  setCurrent: (type: TradingType) => void;
}

const TradingContext = createContext<TradingContextType>({
  current: TradingType.Charge,
  setCurrent: () => {},
});

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [current, _setCurrent] = useState<TradingType>(() =>
    parseTradingType(kvGet(KV_KEY_trading)),
  );

  const setCurrent = useCallback((type: TradingType) => {
    _setCurrent(type);
    kvSet(KV_KEY_trading, type);
  }, []);

  return (
    <TradingContext.Provider value={{ current, setCurrent }}>{children}</TradingContext.Provider>
  );
}

export function useTrading() {
  return useContext(TradingContext);
}
