import React, { useEffect, useState } from 'react';
import { NativeModules, ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { AppProviders } from '@/contexts/AppProviders';
import { initKV } from '@/utils/kvStorage';
import { kvGet } from '@/utils/kvStorage';
import { API_HOST } from '@/contexts/ConfigsContext';
import { Log } from '@/utils/logger';
import {
  KV_KEY_pubKey,
  KV_KEY_secKey,
  KV_KEY_cardNumber,
  KV_KEY_cardExpMonth,
  KV_KEY_cardExpYear,
  KV_KEY_cardCVC,
  KV_KEY_trading,
  KV_KEY_payment,
  KV_KEY_finance,
  KV_KEY_infosName,
  KV_KEY_infosEmail,
  KV_KEY_infosPhone,
  KV_KEY_infosCustomerId,
  KV_KEY_infosSourceId,
} from '@/constants/storageKeys';

const { Elepay } = NativeModules;

const ALL_KEYS = [
  KV_KEY_pubKey,
  KV_KEY_secKey,
  KV_KEY_cardNumber,
  KV_KEY_cardExpMonth,
  KV_KEY_cardExpYear,
  KV_KEY_cardCVC,
  KV_KEY_trading,
  KV_KEY_payment,
  KV_KEY_finance,
  KV_KEY_infosName,
  KV_KEY_infosEmail,
  KV_KEY_infosPhone,
  KV_KEY_infosCustomerId,
  KV_KEY_infosSourceId,
];

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      Log.i('App', '=== Application starting ===');

      await initKV(ALL_KEYS);
      Log.i('App', 'KVStorage initialized');

      const pubKey = kvGet(KV_KEY_pubKey) ?? '';
      if (pubKey) {
        Log.i('App', 'Initializing Elepay SDK', { pubKey, apiUrl: API_HOST });
        Elepay.initElepay({ publicKey: pubKey, apiUrl: API_HOST });
        Log.i('App', 'Elepay SDK initialized');
      } else {
        Log.w('App', 'No pubKey found, skipping Elepay SDK init');
      }

      setReady(true);
      Log.i('App', 'App ready');
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: 'Back' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment', headerBackTitle: 'Back' }} />
        <Stack.Screen name="infos" options={{ title: 'Infos', headerBackTitle: 'Back' }} />
      </Stack>
    </AppProviders>
  );
}
