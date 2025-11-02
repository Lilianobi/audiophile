import { ReactNode } from 'react';

// Product Types
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'headphones' | 'speakers' | 'earphones';
  categoryName: string;
  new: boolean;
  price: number;
  description: string;
  features: string;
  includes: ProductInclude[];
  gallery: ProductGallery;
  image: ProductImage;
  cartImage: string;
  others: string[];
}

export interface ProductInclude {
  quantity: number;
  item: string;
}

export interface ProductGallery {
  first: string;
  second: string;
  third: string;
}

export interface ProductImage {
  mobile: string;
  tablet: string;
  desktop: string;
}

// Cart Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

// Order Types
export interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    zipCode: string;
    city: string;
    country: string;
  };
  payment: {
    method: 'e-money' | 'cash';
    eMoneyNumber?: string;
    eMoneyPin?: string;
  };
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    vat: number;
    grandTotal: number;
  };
  status: string;
  createdAt: string;
}

// Form Types
export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  paymentMethod: 'e-money' | 'cash';
  eMoneyNumber: string;
  eMoneyPin: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'black';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode; // Changed from React.ReactNode
  className?: string;
}

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveAll: () => void;
}

export interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
}

export interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  isSubmitting: boolean;
}