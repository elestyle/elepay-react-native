import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useInfos } from '@/contexts/InfosContext';
import { usePayments } from '@/contexts/PaymentsContext';
import { useConfigs } from '@/contexts/ConfigsContext';
import {
  queryCustomer,
  createCustomer,
  updateCustomer,
  querySource,
  createSource,
} from '@/api/sourceHandler';
import { Log } from '@/utils/logger';

export default function InfosScreen() {
  const infos = useInfos();
  const payments = usePayments();
  const configs = useConfigs();
  const [sources, setSources] = useState<Array<Record<string, unknown>>>([]);

  const syncCustomer = async () => {
    Log.i('Infos', 'syncCustomer called', {
      name: infos.name,
      email: infos.email,
      phone: infos.phone,
    });

    if (!infos.name || !infos.email || !infos.phone) {
      Log.w('Infos', 'syncCustomer: missing required fields');
      Alert.alert('Error', 'Infos cannot be empty.');
      return;
    }

    const customers = await queryCustomer(configs.secKey);
    const existing = customers.find((c) => c.email === infos.email);

    let customerId: string | null = null;
    if (existing?.id) {
      Log.i('Infos', `Found existing customer: ${existing.id}, updating`);
      customerId = await updateCustomer(
        configs.secKey,
        infos.name,
        infos.email,
        infos.phone,
        existing.id as string,
      );
    } else {
      Log.i('Infos', 'No existing customer found, creating new');
      customerId = await createCustomer(configs.secKey, infos.name, infos.email, infos.phone);
    }

    if (customerId) {
      Log.i('Infos', `syncCustomer success: ${customerId}`);
      infos.setCustomerId(customerId);
      Alert.alert('Success', 'Sync Success.');
    } else {
      Log.e('Infos', 'syncCustomer failed');
      Alert.alert('Error', 'Sync Failed.');
    }
  };

  const handleSyncSources = async () => {
    if (!infos.customerId) {
      Log.w('Infos', 'handleSyncSources: no customerId');
      return;
    }
    Log.i('Infos', `handleSyncSources for customerId: ${infos.customerId}`);
    const result = await querySource(configs.secKey, infos.customerId);
    setSources(result);
    Log.i('Infos', `handleSyncSources got ${result.length} sources`);
    if (result.length === 0) {
      Alert.alert('Info', 'No source, please add one.');
    }
  };

  const handleAddSource = async () => {
    if (!infos.customerId) {
      Log.w('Infos', 'handleAddSource: no customerId');
      return;
    }
    Log.i('Infos', `handleAddSource: customerId=${infos.customerId}, payment=${payments.current}`);
    const sourceId = await createSource(configs.secKey, infos.customerId, payments.current);
    if (sourceId) {
      Log.i('Infos', `handleAddSource success: sourceId=${sourceId}`);
      infos.setSourceId(sourceId);
    } else {
      Log.e('Infos', 'handleAddSource: no sourceId returned');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={infos.name}
          placeholder="Juice"
          placeholderTextColor="#ccc"
          onChangeText={infos.setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={infos.email}
          placeholder="someone@mail"
          placeholderTextColor="#ccc"
          onChangeText={infos.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={infos.phone}
          placeholder="7010102020"
          placeholderTextColor="#ccc"
          onChangeText={infos.setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.label}>CustomerId</Text>
        <View style={styles.customerRow}>
          <Text style={styles.customerIdText}>{infos.customerId || '< need sync >'}</Text>
          <TouchableOpacity style={styles.smallButton} onPress={syncCustomer}>
            <Text>Sync</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.label}>
          SourceId:
          {infos.sourceId || '< need add or sync to selected >'}
        </Text>

        {sources.map((item) => (
          <TouchableOpacity
            key={item.id as string}
            style={styles.sourceItem}
            onPress={() => infos.setSourceId(item.id as string)}
          >
            <Text>{(item.id as string) ?? 'error'}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.sourceActions}>
          <TouchableOpacity style={styles.smallButton} onPress={handleSyncSources}>
            <Text>Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={handleAddSource}>
            <Text>Add(pre page with payment)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  customerIdText: {
    fontSize: 14,
    flex: 1,
  },
  smallButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  sourceItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  sourceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
});
