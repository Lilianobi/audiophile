'use client';

import React, { useState, ChangeEvent, FormEvent, FocusEvent } from 'react';
import Button from '../common/Button';
import { CheckoutFormProps, CheckoutFormData, FormErrors } from '../../types';
import './CheckoutForm.css';

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    paymentMethod: 'e-money',
    eMoneyNumber: '',
    eMoneyPin: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const validate = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Wrong format';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) return 'Wrong format';
        if (value.replace(/\D/g, '').length < 10) return 'Phone must be at least 10 digits';
        return '';
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Address must be at least 5 characters';
        return '';
      
      case 'zipCode':
        if (!value.trim()) return 'ZIP Code is required';
        if (value.trim().length < 3) return 'Wrong format';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        return '';
      
      case 'country':
        if (!value.trim()) return 'Country is required';
        return '';
      
      case 'eMoneyNumber':
        if (formData.paymentMethod === 'e-money' && !value.trim()) {
          return 'e-Money Number is required';
        }
        if (formData.paymentMethod === 'e-money' && value.replace(/\D/g, '').length < 9) {
          return 'Must be at least 9 digits';
        }
        return '';
      
      case 'eMoneyPin':
        if (formData.paymentMethod === 'e-money' && !value.trim()) {
          return 'e-Money PIN is required';
        }
        if (formData.paymentMethod === 'e-money' && value.replace(/\D/g, '').length < 4) {
          return 'Must be at least 4 digits';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    const fieldsToValidate = [
      'name', 'email', 'phone', 'address', 'zipCode', 'city', 'country'
    ];

    if (formData.paymentMethod === 'e-money') {
      fieldsToValidate.push('eMoneyNumber', 'eMoneyPin');
    }

    fieldsToValidate.forEach(field => {
      const error = validate(field, formData[field as keyof CheckoutFormData] as string);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(fieldsToValidate.map(f => [f, true])));

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      // Focus first error field
      const firstErrorField = fieldsToValidate.find(f => newErrors[f]);
      if (firstErrorField) {
        document.querySelector<HTMLInputElement>(`[name="${firstErrorField}"]`)?.focus();
      }
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3>CHECKOUT</h3>

      {/* Billing Details */}
      <section className="form-section">
        <h6 className="form-section__title">BILLING DETAILS</h6>
        
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">
              Name
              {touched.name && errors.name && (
                <span className="form-field__error">{errors.name}</span>
              )}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Alexei Ward"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">
              Email Address
              {touched.email && errors.email && (
                <span className="form-field__error">{errors.email}</span>
              )}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="alexei@mail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="phone">
              Phone Number
              {touched.phone && errors.phone && (
                <span className="form-field__error">{errors.phone}</span>
              )}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+1 202-555-0136"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.phone && errors.phone ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="form-section">
        <h6 className="form-section__title">SHIPPING INFO</h6>
        
        <div className="form-field form-field--full">
          <label htmlFor="address">
            Address
            {touched.address && errors.address && (
              <span className="form-field__error">{errors.address}</span>
            )}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="1137 Williams Avenue"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.address && errors.address ? 'error' : ''}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="zipCode">
              ZIP Code
              {touched.zipCode && errors.zipCode && (
                <span className="form-field__error">{errors.zipCode}</span>
              )}
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="10001"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.zipCode && errors.zipCode ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="city">
              City
              {touched.city && errors.city && (
                <span className="form-field__error">{errors.city}</span>
              )}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.city && errors.city ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="country">
              Country
              {touched.country && errors.country && (
                <span className="form-field__error">{errors.country}</span>
              )}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="United States"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.country && errors.country ? 'error' : ''}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section className="form-section">
        <h6 className="form-section__title">PAYMENT DETAILS</h6>
        
        <div className="form-row">
          <div className="form-field">
            <label>Payment Method</label>
          </div>
          <div className="form-field">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="e-money"
                checked={formData.paymentMethod === 'e-money'}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="radio-custom"></span>
              e-Money
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="radio-custom"></span>
              Cash on Delivery
            </label>
          </div>
        </div>

        {formData.paymentMethod === 'e-money' && (
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="eMoneyNumber">
                e-Money Number
                {touched.eMoneyNumber && errors.eMoneyNumber && (
                  <span className="form-field__error">{errors.eMoneyNumber}</span>
                )}
              </label>
              <input
                type="text"
                id="eMoneyNumber"
                name="eMoneyNumber"
                placeholder="238521993"
                value={formData.eMoneyNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.eMoneyNumber && errors.eMoneyNumber ? 'error' : ''}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-field">
              <label htmlFor="eMoneyPin">
                e-Money PIN
                {touched.eMoneyPin && errors.eMoneyPin && (
                  <span className="form-field__error">{errors.eMoneyPin}</span>
                )}
              </label>
              <input
                type="text"
                id="eMoneyPin"
                name="eMoneyPin"
                placeholder="6891"
                value={formData.eMoneyPin}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.eMoneyPin && errors.eMoneyPin ? 'error' : ''}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        {formData.paymentMethod === 'cash' && (
          <div className="cash-message">
            <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <path d="M46.594 8.438H42.28c-.448 0-.869.213-1.134.574l-2.694 3.674a1.15 1.15 0 1 1-1.857-1.36l2.694-3.674a3.46 3.46 0 0 1 2.79-1.42h4.316c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03zm-14.53.07a1.15 1.15 0 1 0 0-2.298 1.15 1.15 0 0 0 0 2.297zM5.578 8.438H1.406C.5 8.438 0 7.5 0 6.53c0-1.07.71-2.03 1.656-2.03h4.172c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03zm11.875 0H13.28c-.945 0-1.656-.96-1.656-2.03 0-1.07.71-2.03 1.656-2.03h4.172c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03zm9.094-4.06c.562 0 1.018.457 1.018 1.019v36.148c0 .562-.456 1.02-1.018 1.02a1.019 1.019 0 0 1-1.02-1.02V5.396c0-.562.457-1.02 1.02-1.02zm-11.875 37.166h4.172c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03H14.672c-.945 0-1.656-.96-1.656-2.03 0-1.07.71-2.03 1.656-2.03zm-9.094 0h4.172c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03H5.578c-.945 0-1.656-.96-1.656-2.03 0-1.07.71-2.03 1.656-2.03zm30-2.297a1.15 1.15 0 1 0 0 2.299 1.15 1.15 0 0 0 0-2.3zm11.875 2.297H42.28c-.448 0-.869-.213-1.134-.574l-2.694-3.674a1.15 1.15 0 1 1 1.857-1.36l2.694 3.674a3.46 3.46 0 0 0 2.79 1.42h4.316c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03zm-39.844 0H1.406C.5 41.544 0 40.574 0 39.605c0-1.07.71-2.03 1.656-2.03h4.172c.945 0 1.656.96 1.656 2.03 0 1.07-.71 2.03-1.656 2.03z" fill="#D87D4A"/>
            </svg>
            <p>
              The 'Cash on Delivery' option enables you to pay in cash when our delivery 
              courier arrives at your residence. Just make sure your address is correct so 
              that your order will not be cancelled.
            </p>
          </div>
        )}
      </section>

      <Button 
        type="submit" 
        variant="primary" 
        className="btn--full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'PROCESSING...' : 'CONTINUE & PAY'}
      </Button>
    </form>
  );
}