import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useProducts } from '@/contexts/ProductsContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useTrading } from '@/contexts/TradingContext';
import { usePayments } from '@/contexts/PaymentsContext';
import { useInfos } from '@/contexts/InfosContext';
import { useConfigs } from '@/contexts/ConfigsContext';
import TradeParamsView from '@/components/TradeParamsView';
import { handleCharge } from '@/api/chargeHandler';
import { handleCheckout } from '@/api/checkoutHandler';
import { TradingType } from '@/models/tradingType';
import { Log } from '@/utils/logger';

export default function PaymentScreen() {
  const { selected } = useProducts();
  const finance = useFinance();
  const trading = useTrading();
  const payments = usePayments();
  const infos = useInfos();
  const configs = useConfigs();

  const prices = selected.map((p) => p.price);

  const handlePay = async () => {
    try {
      const amt = finance.amount(prices);
      const fin = finance.current;
      const pay = payments.current;

      Log.i('Payment', 'handlePay called', {
        tradingType: trading.current,
        amount: amt,
        currency: fin,
        paymentMethod: pay,
        selectedProducts: selected.map((p) => p.name),
      });

      switch (trading.current) {
        case TradingType.Charge:
          Log.i('Payment', 'Starting Charge flow');
          await handleCharge(configs.secKey, amt, fin, pay);
          break;
        case TradingType.Source:
          Log.i('Payment', 'Starting Source Charge flow', {
            customerId: infos.customerId,
            sourceId: infos.sourceId,
          });
          await handleCharge(configs.secKey, amt, fin, pay, {
            source: true,
            customerId: infos.customerId,
            sourceId: infos.sourceId,
          });
          break;
        case TradingType.Checkout: {
          const productsConv = selected.map((product) => ({
            name: product.name,
            image: product.img,
            price: finance.amount([product.price]),
            count: 1,
          }));
          Log.i('Payment', 'Starting Checkout flow', { items: productsConv });
          await handleCheckout(configs.secKey, amt, fin, productsConv);
          break;
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      Log.e('Payment', `Unhandled error: ${msg}`);
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {selected.map((item) => (
          <View style={styles.productRow} key={item.name}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{finance.display([item.price])}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{finance.display(prices)}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>-&gt; Go to Pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
      <TradeParamsView />
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
  productName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },
  productPrice: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  payButtonText: {
    fontSize: 16,
  },
  spacer: {
    height: 40,
  },
});
