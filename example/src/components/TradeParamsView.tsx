import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownSelect from './DropdownSelect';
import { useFinance } from '@/contexts/FinanceContext';
import { useTrading } from '@/contexts/TradingContext';
import { usePayments } from '@/contexts/PaymentsContext';
import { ALL_FINANCE_TYPES, FinanceType } from '@/models/finance';
import { ALL_TRADING_TYPES, TradingType } from '@/models/tradingType';
import { ALL_PAYMENTS, PaymentMethod } from '@/models/payments';

export default function TradeParamsView() {
  const finance = useFinance();
  const trading = useTrading();
  const payments = usePayments();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TRADE PARAMS</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Currency (now support JPY)</Text>
        <DropdownSelect<FinanceType>
          selectedValue={finance.current}
          items={ALL_FINANCE_TYPES}
          onValueChange={() => {}}
          disabled
          itemColor={(v) => (v === FinanceType.JPY ? '#000' : '#ccc')}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Trading Type</Text>
        <DropdownSelect<TradingType>
          selectedValue={trading.current}
          items={ALL_TRADING_TYPES}
          onValueChange={(value) => trading.setCurrent(value)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Payment Selected</Text>
        <DropdownSelect<PaymentMethod>
          selectedValue={payments.current}
          items={ALL_PAYMENTS}
          onValueChange={(value) => payments.setCurrent(value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
});
