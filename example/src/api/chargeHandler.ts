import { NativeModules, Platform, Alert } from 'react-native';
import { requestJSON } from './network';
import { API_CHARGE } from '@/contexts/ConfigsContext';
import { generateRandomString } from '@/utils/randomString';
import { Log } from '@/utils/logger';

const { Elepay } = NativeModules;

export async function handleCharge(
  secKey: string,
  amount: number,
  finance: string,
  payment: string,
  options?: { source?: boolean; customerId?: string; sourceId?: string },
) {
  const source = options?.source ?? false;
  const customerId = options?.customerId ?? '';
  const sourceId = options?.sourceId ?? '';

  Log.i('Charge', 'handleCharge called', {
    amount,
    finance,
    payment,
    source,
    customerId,
    sourceId,
  });

  if (source && (!customerId || !sourceId)) {
    Log.w('Charge', 'Missing customerId or sourceId for source charge');
    Alert.alert('Error', 'Go to setting to prepare Infos.');
    return;
  }

  const params: Record<string, unknown> = {
    capture: true,
    currency: finance,
    paymentMethod: payment,
    amount,
    resource: Platform.OS === 'ios' ? 'ios' : 'android',
    orderNo: generateRandomString(),
    description: 'example',
  };

  if (source) {
    params.customerId = customerId;
    params.sourceId = sourceId;
  }

  try {
    /* Mock
    const result = {
      amount: 50,
      ...
      status: "pending",
    };
    */
    const result = await requestJSON(API_CHARGE, secKey, 'POST', params);
    Log.i('Charge', 'Charge created, calling Elepay.handlePaymentWithPayload');
    const payload = JSON.stringify(result);

    if (!Elepay) {
      Log.e('Charge', 'Elepay native module not found');
      Alert.alert('Error', 'Elepay native module not found.');
      return;
    }

    Elepay.handlePaymentWithPayload(
      payload,
      (
        res: { state: string; paymentId?: string },
        err?: { errorCode: string; reason: string; message: string },
      ) => {
        if (err) {
          Log.e(
            'Charge',
            `Charge failed: code=${err.errorCode}, reason=${err.reason}, message=${err.message}`,
          );
          Alert.alert(
            'Charge Failed',
            `${err.errorCode}, reason=${err.reason}, message=${err.message}`,
          );
        } else if (res.state === 'succeeded') {
          Log.i('Charge', `Charge succeeded, paymentId: ${res.paymentId}`);
          Alert.alert('Success', `Charge Succeed<${res.paymentId}>.`);
        } else if (res.state === 'cancelled') {
          Log.w('Charge', `Charge cancelled, paymentId: ${res.paymentId}`);
          Alert.alert('Cancelled', `Charge Canceled<${res.paymentId}>.`);
        } else if (res.state === 'failed') {
          Log.e('Charge', `Charge failed, paymentId: ${res.paymentId}`);
          Alert.alert('Failed', `Charge Failed<${res.paymentId}>.`);
        }
      },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log.e('Charge', `Charge error: ${msg}`);
    Alert.alert('Error', `Charge error: ${msg}`);
  }
}
