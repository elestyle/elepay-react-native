import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import KeyView from '@/components/KeyView';
import TradeParamsView from '@/components/TradeParamsView';
import CardView from '@/components/CardView';
import InfosOverView from '@/components/InfosOverView';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <KeyView />
      <View style={styles.divider} />
      <TradeParamsView />
      <View style={styles.divider} />
      <CardView />
      <View style={styles.divider} />
      <InfosOverView />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});
