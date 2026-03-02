import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useConfigs } from '@/contexts/ConfigsContext';

export default function KeyView() {
  const { pubKey, secKey, setPubKey, setSecKey } = useConfigs();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>KEYS *</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Public Key</Text>
        <TextInput
          style={styles.input}
          value={pubKey}
          placeholder="pk_live_xxx"
          placeholderTextColor="#ff000044"
          onChangeText={setPubKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Secret Key</Text>
        <TextInput
          style={styles.input}
          value={secKey}
          placeholder="sk_live_xxx"
          placeholderTextColor="#ff000044"
          onChangeText={setSecKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert('Reboot Required', 'Please restart the app to apply the new keys.');
        }}
      >
        <Text style={styles.buttonText}>Reboot to apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: 'red',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'red',
    paddingVertical: 6,
    fontSize: 14,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'red',
  },
});
