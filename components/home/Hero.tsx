import React from 'react';
import Link from 'next/link';
import Button from '../common/Button';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__container container">
        <div className="hero__content">
          <p className="overline">NEW PRODUCT</p>
          <h1>XX99 Mark II Headphones</h1>
          <p className="hero__description">
            Experience natural, lifelike audio and exceptional build quality made for the 
            passionate music enthusiast.
          </p>
          <Link href="/product/xx99-mark-two-headphones">
            <Button variant="primary">SEE PRODUCT</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}