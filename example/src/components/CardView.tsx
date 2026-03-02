import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { useCard } from '@/contexts/CardContext';
import { formatCard } from '@/utils/cardFormatter';

export default function CardView() {
  const card = useCard();
  const [useDefault, setUseDefault] = useState(false);

  const handleToggleDefault = (flag: boolean) => {
    setUseDefault(flag);
    card.setNumber(flag ? '4242 4242 4242 4242' : '');
    card.setExpYear(flag ? '29' : '');
    card.setExpMonth(flag ? '09' : '');
    card.setCvc(flag ? '123' : '');
  };

  const expDisplay = card.expYear ? `${card.expMonth} / ${card.expYear}` : card.expMonth;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>CARD</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Use Default </Text>
          <Switch value={useDefault} onValueChange={handleToggleDefault} />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={card.number}
          placeholder="4242 4242 4242 4242"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          onChangeText={(text) => {
            const formatted = formatCard(text, 16, 4, ' ');
            card.setNumber(formatted);
          }}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Expiry Date</Text>
        <TextInput
          style={styles.input}
          value={expDisplay}
          placeholder="MM / YY"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          onChangeText={(text) => {
            const formatted = formatCard(text, 4, 2, ' / ');
            const trimmed = formatted.replace(/ /g, '');
            if (trimmed.includes('/')) {
              const parts = trimmed.split('/');
              card.setExpMonth(parts[0] ?? '');
              card.setExpYear(parts[1] ?? '');
            } else {
              card.setExpMonth(trimmed);
              card.setExpYear('');
            }
          }}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>CVC</Text>
        <TextInput
          style={styles.input}
          value={card.cvc}
          placeholder="123"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, '').substring(0, 3);
            card.setCvc(digits);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  switchLabel: {
    fontSize: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    fontSize: 14,
  },
});
