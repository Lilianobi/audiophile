'use client';

import React, { MouseEvent } from 'react';
import { ButtonProps } from '../../types';
import './Button.css';

export default function Button({ 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  onClick,
  children,
  className = '',
  ...props 
}: ButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`btn btn--${variant} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}