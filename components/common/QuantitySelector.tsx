import React from 'react';
import { QuantitySelectorProps } from '../../types';
import './QuantitySelector.css';

export default function QuantitySelector({ 
  quantity = 1, 
  onIncrease, 
  onDecrease,
  min = 1,
  max = 99 
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onIncrease();
    }
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="quantity-selector__btn"
      >
        -
      </button>
      <span className="quantity-selector__value">{quantity}</span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="quantity-selector__btn"
      >
        +
      </button>
    </div>
  );
}