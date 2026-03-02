import { NativeModules, Platform, Alert } from 'react-native';
import { requestJSON } from './network';
import { API_CUSTOMERS, apiSource } from '@/contexts/ConfigsContext';
import { Log } from '@/utils/logger';

const { Elepay } = NativeModules;

type JSONMap = Record<string, unknown>;

export async function queryCustomer(secKey: string): Promise<JSONMap[]> {
  Log.i('Source', 'queryCustomer');
  try {
    const result = await requestJSON(API_CUSTOMERS, secKey, 'GET');
    if (Array.isArray(result.customers)) {
      const customers = result.customers as JSONMap[];
      Log.i('Source', `queryCustomer returned ${customers.length} customers`);
      return customers;
    }
    Log.w('Source', 'queryCustomer: no customers array in response');
    return [];
  } catch (error) {
    Log.e('Source', `queryCustomer error: ${error}`);
    return [];
  }
}

export async function createCustomer(
  secKey: string,
  name: string,
  email: string,
  phone: string,
): Promise<string | null> {
  Log.i('Source', 'createCustomer', { name, email, phone });
  try {
    const result = await requestJSON(API_CUSTOMERS, secKey, 'POST', {
      name,
      email,
      phone,
    });
    const id = (result.id as string) ?? null;
    Log.i('Source', `createCustomer result: ${id}`);
    return id;
  } catch (error) {
    Log.e('Source', `createCustomer error: ${error}`);
    return null;
  }
}

export async function updateCustomer(
  secKey: string,
  name: string,
  email: string,
  phone: string,
  customerId: string,
): Promise<string | null> {
  Log.i('Source', `updateCustomer: ${customerId}`, { name, email, phone });
  try {
    const result = await requestJSON(`${API_CUSTOMERS}/${customerId}`, secKey, 'POST', {
      name,
      email,
      phone,
    });
    const id = (result.id as string) ?? null;
    Log.i('Source', `updateCustomer result: ${id}`);
    return id;
  } catch (error) {
    Log.e('Source', `updateCustomer error: ${error}`);
    return null;
  }
}

export async function querySource(secKey: string, customerId: string): Promise<JSONMap[]> {
  Log.i('Source', `querySource for customerId: ${customerId}`);
  try {
    const result = await requestJSON(apiSource(customerId), secKey, 'GET');
    if (Array.isArray(result.sources)) {
      const sources = result.sources as JSONMap[];
      Log.i('Source', `querySource returned ${sources.length} sources`);
      return sources;
    }
    Log.w('Source', 'querySource: no sources array in response');
    return [];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    Log.e('Source', `querySource error: ${message}`);
    Alert.alert('Error', `Source error<${message}>.`);
    return [];
  }
}

export async function createSource(
  secKey: string,
  customerId: string,
  payment: string,
): Promise<string | null> {
  Log.i('Source', `createSource for customerId: ${customerId}, payment: ${payment}`);
  try {
    const result = await requestJSON(apiSource(customerId), secKey, 'POST', {
      paymentMethod: payment,
      resource: Platform.OS === 'ios' ? 'ios' : 'android',
    });

    const sourceId = result.id as string;
    if (!sourceId) {
      Log.e('Source', 'createSource: empty sourceId in response');
      Alert.alert('Error', 'Source error.');
      return null;
    }

    Log.i(
      'Source',
      `createSource got sourceId: ${sourceId}, calling Elepay.handleSourceWithPayload`,
    );
    const payload = JSON.stringify(result);

    return new Promise((resolve) => {
      Elepay.handleSourceWithPayload(
        payload,
        (
          res: { state: string; paymentId?: string },
          err?: { errorCode: string; reason: string; message: string },
        ) => {
          if (err) {
            Log.e(
              'Source',
              `Source failed: code=${err.errorCode}, reason=${err.reason}, message=${err.message}`,
            );
            Alert.alert(
              'Source Failed',
              `${err.errorCode}, reason=${err.reason}, message=${err.message}`,
            );
          } else if (res.state === 'succeeded') {
            Log.i('Source', `Source succeeded, paymentId: ${res.paymentId}`);
            Alert.alert('Success', `Source Succeed<${res.paymentId}>.`);
          } else if (res.state === 'cancelled') {
            Log.w('Source', `Source cancelled, paymentId: ${res.paymentId}`);
            Alert.alert('Cancelled', `Source Canceled<${res.paymentId}>.`);
          }
          resolve(sourceId);
        },
      );
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    Log.e('Source', `createSource error: ${message}`);
    Alert.alert('Error', `Source error<${message}>.`);
    return null;
  }
}
