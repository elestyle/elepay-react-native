import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfos } from '@/contexts/InfosContext';
import { useConfigs } from '@/contexts/ConfigsContext';

export default function InfosOverView() {
  const infos = useInfos();
  const configs = useConfigs();
  const router = useRouter();

  const renderField = (label: string, value: string) => {
    const display = value || 'unknown';
    const color = value ? '#000' : 'red';
    return (
      <View style={styles.row} key={label}>
        <Text>{label}: </Text>
        <Text style={{ color }}>{display}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Infos</Text>
      <View style={styles.fields}>
        {renderField('Name', infos.name)}
        {renderField('Email', infos.email)}
        {renderField('Phone', infos.phone)}
        {renderField('CustomerId', infos.customerId)}
        {renderField('SourceId', infos.sourceId)}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!configs.secKey || !configs.pubKey) {
            Alert.alert('Error', 'Go to setting to set keys.');
            return;
          }
          router.push('/infos');
        }}
      >
        <Text style={styles.buttonText}>{infos.noSource ? 'Add' : 'Update'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  fields: {
    paddingLeft: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
  },
});
