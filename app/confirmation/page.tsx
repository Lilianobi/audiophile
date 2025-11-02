'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/common/Button';
import { useCart } from '../../lib/CartContext';
import './page.css';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [showAllItems, setShowAllItems] = useState(false);
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart after successful order
    if (orderId) {
      clearCart();
    }
  }, [orderId, clearCart]);

  if (!orderId) {
    return (
      <div className="confirmation-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>No order found</h2>
          <p style={{ marginBottom: '40px', opacity: 0.5 }}>
            It looks like you have not completed an order yet.
          </p>
          <Link href="/">
            <Button variant="primary">BACK TO HOME</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock order data (in real app, fetch from Convex using orderId)
  const order = {
    id: orderId,
    items: cartItems.length > 0 ? cartItems : [
      {
        id: 'xx99-mark-two-headphones',
        name: 'XX99 MK II',
        price: 2999,
        quantity: 1,
        image: '/assets/cart/image-xx99-mark-two-headphones.jpg',
      }
    ],
    grandTotal: cartItems.length > 0 
      ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50 + Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.2)
      : 3599,
  };

  const firstItem = order.items[0];
  const otherItemsCount = order.items.length - 1;

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-overlay" />
      <div className="confirmation-container container">
        <div className="confirmation-modal">
          {/* Success Icon */}
          <div className="confirmation-icon">
            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <circle fill="#D87D4A" cx="32" cy="32" r="32"/>
                <path stroke="#FFF" strokeWidth="4" d="M20.754 33.333l6.751 6.751 15.804-15.803"/>
              </g>
            </svg>
          </div>

          {/* Title */}
          <h3>
            THANK YOU<br />
            FOR YOUR ORDER
          </h3>
          <p className="confirmation-message">
            You will receive an email confirmation shortly.
          </p>

          {/* Order Summary */}
          <div className="confirmation-summary">
            <div className="confirmation-summary__items">
              {/* First Item */}
              <div className="confirmation-item">
                <div className="confirmation-item__image">
                  <img src={firstItem.image} alt={firstItem.name} />
                </div>
                <div className="confirmation-item__info">
                  <h6>{firstItem.name}</h6>
                  <p>$ {firstItem.price.toLocaleString()}</p>
                </div>
                <div className="confirmation-item__quantity">
                  x{firstItem.quantity}
                </div>
              </div>

              {/* Other Items Toggle */}
              {otherItemsCount > 0 && (
                <>
                  {!showAllItems && (
                    <button 
                      className="confirmation-toggle"
                      onClick={() => setShowAllItems(true)}
                    >
                      and {otherItemsCount} other item{otherItemsCount > 1 ? 's' : ''}
                    </button>
                  )}
                  
                  {showAllItems && (
                    <>
                      <div className="confirmation-divider" />
                      {order.items.slice(1).map((item) => (
                        <div key={item.id} className="confirmation-item">
                          <div className="confirmation-item__image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="confirmation-item__info">
                            <h6>{item.name}</h6>
                            <p>$ {item.price.toLocaleString()}</p>
                          </div>
                          <div className="confirmation-item__quantity">
                            x{item.quantity}
                          </div>
                        </div>
                      ))}
                      <button 
                        className="confirmation-toggle"
                        onClick={() => setShowAllItems(false)}
                      >
                        View less
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="confirmation-summary__total">
              <p>GRAND TOTAL</p>
              <h6>$ {order.grandTotal.toLocaleString()}</h6>
            </div>
          </div>

         
          <Button 
            variant="primary" 
            className="btn--full"
            onClick={handleBackToHome}
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="confirmation-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}