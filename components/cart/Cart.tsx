'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartProps } from '../../types';
import './Cart.css';

export default function Cart({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveAll 
}: CartProps) {
  const router = useRouter();

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* Cart Modal */}
      <div className="cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart__header">
          <h6>CART ({cartItems.length})</h6>
          {cartItems.length > 0 && (
            <button 
              className="cart__remove-all"
              onClick={onRemoveAll}
            >
              Remove all
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart__empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <img 
                      src={item.image || '/placeholder.jpg'} 
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="cart-item__info">
                    <h6>{item.name}</h6>
                    <p className="cart-item__price">
                      $ {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="cart-item__quantity">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart__footer">
              <div className="cart__total">
                <span>TOTAL</span>
                <span className="cart__total-amount">
                  $ {calculateTotal().toLocaleString()}
                </span>
              </div>

              <button 
                className="btn btn--primary btn--full"
                onClick={handleCheckout}
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}