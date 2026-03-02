import React from 'react';
import { ConfigsProvider } from './ConfigsContext';
import { ProductsProvider } from './ProductsContext';
import { FinanceProvider } from './FinanceContext';
import { TradingProvider } from './TradingContext';
import { PaymentsProvider } from './PaymentsContext';
import { InfosProvider } from './InfosContext';
import { CardProvider } from './CardContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigsProvider>
      <ProductsProvider>
        <FinanceProvider>
          <TradingProvider>
            <PaymentsProvider>
              <InfosProvider>
                <CardProvider>{children}</CardProvider>
              </InfosProvider>
            </PaymentsProvider>
          </TradingProvider>
        </FinanceProvider>
      </ProductsProvider>
    </ConfigsProvider>
  );
}
