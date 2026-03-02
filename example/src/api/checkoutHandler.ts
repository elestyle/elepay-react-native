import { NativeModules, Alert } from 'react-native';
import { requestJSON } from './network';
import { API_CHECKOUT } from '@/contexts/ConfigsContext';
import { generateRandomString } from '@/utils/randomString';
import { Log } from '@/utils/logger';

const { Elepay } = NativeModules;

export async function handleCheckout(
  secKey: string,
  amount: number,
  finance: string,
  products: Array<{ name: string; image: string; price: number; count: number }>,
) {
  const params: Record<string, unknown> = {
    currency: finance,
    amount,
    orderNo: generateRandomString(),
    description: 'example',
    items: products,
  };

  Log.i('Checkout', 'handleCheckout called', { amount, finance, productCount: products.length });

  try {
    const result = await requestJSON(API_CHECKOUT, secKey, 'POST', params);
    Log.i('Checkout', 'Checkout created, calling Elepay.checkoutWithPayload');
    const payload = JSON.stringify(result);

    if (!Elepay) {
      Log.e('Checkout', 'Elepay native module not found');
      Alert.alert('Error', 'Elepay native module not found.');
      return;
    }

    Elepay.checkoutWithPayload(
      payload,
      (
        res: { state: string; paymentId?: string },
        err?: { errorCode: string; reason: string; message: string },
      ) => {
        if (err) {
          Log.e(
            'Checkout',
            `Checkout failed: code=${err.errorCode}, reason=${err.reason}, message=${err.message}`,
          );
          Alert.alert(
            'Checkout Failed',
            `${err.errorCode}, reason=${err.reason}, message=${err.message}`,
          );
        } else if (res.state === 'succeeded') {
          Log.i('Checkout', `Checkout succeeded, paymentId: ${res.paymentId}`);
          Alert.alert('Success', `Checkout Succeed<${res.paymentId}>.`);
        } else if (res.state === 'cancelled') {
          Log.w('Checkout', `Checkout cancelled, paymentId: ${res.paymentId}`);
          Alert.alert('Cancelled', `Checkout Canceled<${res.paymentId}>.`);
        } else if (res.state === 'failed') {
          Log.e('Checkout', `Checkout failed, paymentId: ${res.paymentId}`);
          Alert.alert('Failed', `Checkout Failed<${res.paymentId}>.`);
        }
      },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log.e('Checkout', `Checkout error: ${msg}`);
    Alert.alert('Error', `Checkout error: ${msg}`);
  }
}
