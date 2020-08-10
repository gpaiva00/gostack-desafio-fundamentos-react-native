import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storagedProducts = await AsyncStorage.getItem('@GoMarket');

      if (storagedProducts) setProducts(JSON.parse(storagedProducts));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productObject = products.find(p => p.id === product.id);

      if (productObject) return increment(productObject.id);

      product.quantity = 1;
      const newProducts = [...products, product];
      setProducts(newProducts);

      await AsyncStorage.setItem('@GoMarket', JSON.stringify(newProducts));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newProducts = [...products];
      const productIndex = newProducts.findIndex(p => p.id === id);
      const item = newProducts[productIndex];
      newProducts[productIndex] = { ...item, quantity: item.quantity + 1 };

      setProducts(newProducts);

      await AsyncStorage.setItem('@GoMarket', JSON.stringify(newProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = [...products];
      const productIndex = newProducts.findIndex(p => p.id === id);
      const item = newProducts[productIndex];
      const newQuantity = item.quantity - 1;

      if (newQuantity > 0)
        newProducts[productIndex] = { ...item, quantity: newQuantity };
      else newProducts.splice(productIndex, 1);

      setProducts(newProducts);

      await AsyncStorage.setItem('@GoMarket', JSON.stringify(newProducts));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
