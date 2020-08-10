import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

interface Product {
  totalPrice: number;
}
// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const { totalPrice } = products.reduce(
      (acc, current): Product => {
        acc.totalPrice += current.quantity * current.price;
        return acc;
      },
      {
        totalPrice: 0,
      },
    );

    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const { totalItems } = products.reduce(
      (acc, current) => {
        acc.totalItems += current.quantity;
        return acc;
      },
      {
        totalItems: 0,
      },
    );

    return totalItems;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
