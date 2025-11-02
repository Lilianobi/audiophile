'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './Header.css';

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
            <svg width="143" height="25"  viewBox="0 0 143 25" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMid meet" >
              <path d="M7.363 20.385c1.63 0 3.087-.537 4.237-1.47l.414.994h3.739V5.853h-3.605l-.495 1.087c-1.16-.958-2.637-1.51-4.29-1.51C3.069 5.43 0 8.527 0 12.88c0 4.37 3.07 7.505 7.363 7.505zm.646-4.287c-1.811 0-3.143-1.37-3.143-3.206 0-1.824 1.332-3.195 3.143-3.195 1.812 0 3.144 1.37 3.144 3.195 0 1.836-1.332 3.206-3.144 3.206zm17.535 4.287c4.148 0 6.91-2.562 6.91-6.495V5.853h-4.836v7.811c0 1.47-.782 2.357-2.074 2.357-1.292 0-2.074-.887-2.074-2.357V5.853h-4.836v8.037c0 3.933 2.762 6.495 6.91 6.495zm18.443-.827c1.443 0 2.935-.537 4.237-1.592v1.25h4.48V.435h-4.48v6.442c-1.353-1.04-2.845-1.445-4.237-1.445-4.173 0-7.398 3.062-7.398 7.506 0 4.443 3.225 7.505 7.398 7.505zm.972-4.288c-1.811 0-3.143-1.37-3.143-3.217 0-1.836 1.332-3.206 3.143-3.206 1.811 0 3.143 1.37 3.143 3.206 0 1.846-1.332 3.217-3.143 3.217zm15.4 4.288c3.314 0 5.74-2.015 6.435-5.063h-4.805c-.291.823-1.112 1.318-2.242 1.318-1.569 0-2.608-.89-2.608-2.494h9.655c.05-.434.05-.855.05-1.276 0-4.382-2.864-7.083-6.947-7.083-4.256 0-7.366 3.062-7.366 7.506 0 4.443 3.11 7.092 7.828 7.092zm2.15-8.521h-4.836c.218-1.25 1.112-2.015 2.423-2.015 1.311 0 2.205.765 2.414 2.015zM85.404 20h4.88V5.853h-4.88V20zm0-15.488h4.88V.96h-4.88v3.552zm13.357 15.873c3.167 0 5.74-1.702 6.664-4.288h-4.56c-.291.744-1.16 1.202-2.104 1.202-1.57 0-2.623-1.015-2.623-2.737 0-1.723 1.053-2.738 2.623-2.738.943 0 1.813.458 2.104 1.203h4.56c-.924-2.587-3.497-4.289-6.664-4.289-4.29 0-7.398 3.063-7.398 7.624 0 4.56 3.108 7.023 7.398 7.023zm14.759-.385V11.5c0-1.527.9-2.458 2.354-2.458.943 0 1.625.382 1.943 1.203h4.832c-.582-2.896-3.022-4.916-6.342-4.916-1.625 0-3.058.56-4.219 1.702V5.853h-4.548V20h4.98zm17.446.385c4.561 0 7.712-3.146 7.712-7.623 0-4.478-3.151-7.624-7.712-7.624-4.562 0-7.713 3.146-7.713 7.624 0 4.477 3.151 7.623 7.713 7.623zm0-4.323c-1.745 0-2.97-1.346-2.97-3.3 0-1.955 1.225-3.301 2.97-3.301 1.744 0 2.97 1.346 2.97 3.3 0 1.955-1.226 3.301-2.97 3.301zm12.364 4.323c1.468 0 2.773-.458 3.738-1.298v1.013h4.548V.435h-4.548v6.378c-.965-.84-2.27-1.298-3.738-1.298-3.907 0-6.942 3.146-6.942 7.624 0 4.477 3.035 7.623 6.942 7.623zm.984-4.323c-1.761 0-3.02-1.346-3.02-3.3 0-1.955 1.259-3.301 3.02-3.301 1.761 0 3.02 1.346 3.02 3.3 0 1.955-1.259 3.301-3.02 3.301z" fill="#FFF" fillRule="nonzero"/>
            </svg>
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