import React, { createContext, useContext, useState, useCallback } from 'react';
import { ALL_PRODUCTS, Product } from '@/models/product';

interface ProductsContextType {
  products: Product[];
  selected: Product[];
  toggle: (product: Product) => void;
  contains: (product: Product) => boolean;
  count: number;
}

const ProductsContext = createContext<ProductsContextType>({
  products: ALL_PRODUCTS,
  selected: [],
  toggle: () => {},
  contains: () => false,
  count: 0,
});

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Product[]>([]);

  const toggle = useCallback((product: Product) => {
    setSelected((prev) => {
      if (prev.includes(product)) {
        return prev.filter((p) => p !== product);
      }
      return [...prev, product];
    });
  }, []);

  const contains = useCallback((product: Product) => selected.includes(product), [selected]);

  return (
    <ProductsContext.Provider
      value={{
        products: ALL_PRODUCTS,
        selected,
        toggle,
        contains,
        count: selected.length,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
