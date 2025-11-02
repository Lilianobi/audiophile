'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/CartContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import { CheckoutFormData } from '../../types';
import './page.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0 && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  const handleSubmitOrder = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const subtotal = getCartTotal();
      const shipping = 50;
      const vat = Math.round(subtotal * 0.2);
      const grandTotal = subtotal + shipping + vat;

      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          zipCode: formData.zipCode,
          city: formData.city,
          country: formData.country,
        },
        payment: {
          method: formData.paymentMethod,
          ...(formData.paymentMethod === 'e-money' && {
            eMoneyNumber: formData.eMoneyNumber,
            eMoneyPin: formData.eMoneyPin,
          }),
        },
        items: cartItems,
        totals: {
          subtotal,
          shipping,
          vat,
          grandTotal,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      router.push(`/confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__container container">
        <button 
          onClick={() => router.back()} 
          className="back-button"
        >
          Go Back
        </button>

        <div className="checkout-page__grid">
          <CheckoutForm 
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
          <OrderSummary 
            cartItems={cartItems}
            subtotal={getCartTotal()}
          />
        </div>
      </div>
    </div>
  );
}