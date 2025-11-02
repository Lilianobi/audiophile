'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Cart from '../cart/Cart';
import { useCart } from '../../lib/CartContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { 
    cartItems, 
    isCartOpen, 
    getCartCount, 
    updateQuantity, 
    clearCart, 
    toggleCart, 
    closeCart 
  } = useCart();

  return (
    <>
      <Header 
        cartItemsCount={getCartCount()} 
        onCartClick={toggleCart}
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveAll={clearCart}
      />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}