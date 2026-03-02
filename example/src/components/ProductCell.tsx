import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useProducts } from '@/contexts/ProductsContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Product } from '@/models/product';

interface Props {
  product: Product;
}

export default function ProductCell({ product }: Props) {
  const { toggle, contains } = useProducts();
  const { display } = useFinance();
  const isSelected = contains(product);

  return (
    <View style={styles.card}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{product.emoji}</Text>
        <Text style={styles.name}>{product.name}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>{display([product.price])}</Text>
        <TouchableOpacity onPress={() => toggle(product)}>
          <Text style={isSelected ? styles.removeIcon : styles.addIcon}>
            {isSelected ? '\u2296' : '\u2295'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  emojiContainer: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  name: {
    position: 'absolute',
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  addIcon: {
    fontSize: 28,
    color: '#007AFF',
  },
  removeIcon: {
    fontSize: 28,
    color: '#FF3B30',
  },
});
