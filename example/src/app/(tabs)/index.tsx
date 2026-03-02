import React from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/contexts/ProductsContext';
import { useConfigs } from '@/contexts/ConfigsContext';
import ProductCell from '@/components/ProductCell';
import { Product } from '@/models/product';
import { Log } from '@/utils/logger';

export default function ProductsScreen() {
  const { products, count } = useProducts();
  const configs = useConfigs();
  const router = useRouter();

  const handleCartPress = () => {
    Log.i('Products', `Cart pressed, selected: ${count} items`);
    if (!configs.pubKey || !configs.secKey) {
      Log.w('Products', 'Keys not configured');
      Alert.alert('Error', 'Go to setting to set keys.');
      return;
    }
    if (count <= 0) {
      Log.w('Products', 'No products selected');
      Alert.alert('Error', 'Select the product first.');
      return;
    }
    Log.i('Products', 'Navigating to payment screen');
    router.push('/payment');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Ionicons
              name="cart-outline"
              size={24}
              color="#007AFF"
              onPress={handleCartPress}
              style={{ marginRight: 8 }}
            />
          ),
        }}
      />
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item: Product) => item.name}
        renderItem={({ item }) => <ProductCell product={item} />}
        contentContainerStyle={styles.list}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 5,
  },
});
