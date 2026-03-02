import React, { createContext, useContext, useState, useCallback } from 'react';
import { kvGet, kvSet } from '@/utils/kvStorage';
import { KV_KEY_payment } from '@/constants/storageKeys';
import { PaymentMethod, parsePaymentMethod } from '@/models/payments';

interface PaymentsContextType {
  current: PaymentMethod;
  setCurrent: (type: PaymentMethod) => void;
}

const PaymentsContext = createContext<PaymentsContextType>({
  current: PaymentMethod.linepay,
  setCurrent: () => {},
});

export function PaymentsProvider({ children }: { children: React.ReactNode }) {
  const [current, _setCurrent] = useState<PaymentMethod>(() =>
    parsePaymentMethod(kvGet(KV_KEY_payment)),
  );

  const setCurrent = useCallback((type: PaymentMethod) => {
    _setCurrent(type);
    kvSet(KV_KEY_payment, type);
  }, []);

  return (
    <PaymentsContext.Provider value={{ current, setCurrent }}>{children}</PaymentsContext.Provider>
  );
}

export function usePayments() {
  return useContext(PaymentsContext);
}
