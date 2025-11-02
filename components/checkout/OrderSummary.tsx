import React from 'react';
import { OrderSummaryProps } from '../../types';
import './OrderSummary.css';

export default function OrderSummary({ cartItems, subtotal }: OrderSummaryProps) {
  const shipping = 50;
  const vat = Math.round(subtotal * 0.2); // 20% VAT
  const grandTotal = subtotal + shipping + vat;

  return (
    <div className="order-summary">
      <h6>SUMMARY</h6>

      {/* Cart Items */}
      <div className="order-summary__items">
        {cartItems.map((item) => (
          <div key={item.id} className="order-summary__item">
            <div className="order-summary__item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="order-summary__item-info">
              <h6>{item.name}</h6>
              <p className="order-summary__item-price">
                $ {item.price.toLocaleString()}
              </p>
            </div>
            <div className="order-summary__item-quantity">
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="order-summary__totals">
        <div className="order-summary__row">
          <span>TOTAL</span>
          <span className="order-summary__amount">
            $ {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="order-summary__row">
          <span>SHIPPING</span>
          <span className="order-summary__amount">
            $ {shipping}
          </span>
        </div>
        <div className="order-summary__row">
          <span>VAT (INCLUDED)</span>
          <span className="order-summary__amount">
            $ {vat.toLocaleString()}
          </span>
        </div>
        <div className="order-summary__row order-summary__row--grand">
          <span>GRAND TOTAL</span>
          <span className="order-summary__grand-total">
            $ {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}