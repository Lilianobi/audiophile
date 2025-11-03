'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './Header.css';
import Image from 'next/image';



interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemsCount = 0, onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header__container container">
          {/* Mobile Menu Button */}
          <button 
            className="header__hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
          </button>

          {/* Logo */}
          
      <Link href="/" className="header__logo" onClick={closeMobileMenu}>
        <Image 
          src="/audiophile 2.svg"
          alt="Audiophile"
          width={143}
          height={25}
          priority
        />
      </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav" aria-label="Main navigation">
            <ul className="header__nav-list">
              <li><Link href="/" onClick={closeMobileMenu}>HOME</Link></li>
              <li><Link href="/category/headphones" onClick={closeMobileMenu}>HEADPHONES</Link></li>
              <li><Link href="/category/speakers" onClick={closeMobileMenu}>SPEAKERS</Link></li>
              <li><Link href="/category/earphones" onClick={closeMobileMenu}>EARPHONES</Link></li>
            </ul>
          </nav>

          {/* Cart Button */}
          <button 
            className="header__cart"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${cartItemsCount} items`}
          >
            <svg width="23" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.625 15.833c1.132 0 2.054.935 2.054 2.084 0 1.148-.922 2.083-2.054 2.083-1.132 0-2.054-.935-2.054-2.083 0-1.15.922-2.084 2.054-2.084zm9.857 0c1.132 0 2.054.935 2.054 2.084 0 1.148-.922 2.083-2.054 2.083-1.132 0-2.053-.935-2.053-2.083 0-1.15.92-2.084 2.053-2.084zm-9.857 1.39a.69.69 0 00-.685.694.69.69 0 00.685.694.69.69 0 00.685-.694.69.69 0 00-.685-.695zm9.857 0a.69.69 0 00-.684.694.69.69 0 00.684.694.69.69 0 00.685-.694.69.69 0 00-.685-.695zM4.717 0c.316 0 .59.215.658.517l.481 2.122h16.47a.68.68 0 01.538.262c.127.166.168.38.11.579l-2.695 9.236a.672.672 0 01-.648.478H7.41a.667.667 0 00-.673.66c0 .364.303.66.674.66h12.219c.372 0 .674.295.674.66 0 .364-.302.66-.674.66H7.412c-1.115 0-2.021-.889-2.021-1.98 0-.812.502-1.511 1.218-1.816L4.176 1.32H.674A.667.667 0 010 .66C0 .296.302 0 .674 0zm16.716 3.958H6.156l1.797 7.917h11.17l2.31-7.917z" fill="#FFF" fillRule="nonzero"/>
            </svg>
            {cartItemsCount > 0 && (
              <span className="header__cart-count">{cartItemsCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu__content container">
              <div className="mobile-menu__categories">
                <Link href="/category/headphones" className="category-card" onClick={closeMobileMenu}>
                  <div className="category-card__image">
                    {/* Placeholder for headphones image */}
                    <div className="category-card__placeholder"></div>
                  </div>
                  <h6>HEADPHONES</h6>
                  <span className="category-card__link">SHOP</span>
                </Link>
                
                <Link href="/category/speakers" className="category-card" onClick={closeMobileMenu}>
                  <div className="category-card__image">
                    <div className="category-card__placeholder"></div>
                  </div>
                  <h6>SPEAKERS</h6>
                  <span className="category-card__link">SHOP</span>
                </Link>
                
                <Link href="/category/earphones" className="category-card" onClick={closeMobileMenu}>
                  <div className="category-card__image">
                    <div className="category-card__placeholder"></div>
                  </div>
                  <h6>EARPHONES</h6>
                  <span className="category-card__link">SHOP</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}