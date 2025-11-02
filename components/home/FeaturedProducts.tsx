import React from 'react';
import Link from 'next/link';
import Button from '../common/Button';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
  return (
    <section className="featured">
      <div className="featured__container container">
        
        {/* ZX9 Speaker - Large featured card */}
        <div className="featured__card featured__card--zx9">
          <div className="featured__card-image">
            <img 
              src="/assets/home/desktop/image-speaker-zx9.png" 
              alt="ZX9 Speaker"
            />
          </div>
          <div className="featured__card-content">
            <h1>ZX9 SPEAKER</h1>
            <p>
              Upgrade to premium speakers that are phenomenally built to deliver 
              truly remarkable sound.
            </p>
            <Link href="/product/zx9-speaker">
              <Button variant="black">SEE PRODUCT</Button>
            </Link>
          </div>
        </div>

        {/* ZX7 Speaker - Medium featured card */}
        <div className="featured__card featured__card--zx7">
          <div className="featured__card-content">
            <h4>ZX7 SPEAKER</h4>
            <Link href="/product/zx7-speaker">
              <Button variant="secondary">SEE PRODUCT</Button>
            </Link>
          </div>
        </div>

        {/* YX1 Earphones - Two column card */}
        <div className="featured__card-group">
          <div className="featured__card featured__card--yx1-image">
            <img 
              src="/assets/home/desktop/image-earphones-yx1.jpg" 
              alt="YX1 Earphones"
            />
          </div>
          <div className="featured__card featured__card--yx1-content">
            <div className="featured__card-content">
              <h4>YX1 EARPHONES</h4>
              <Link href="/product/yx1-earphones">
                <Button variant="secondary">SEE PRODUCT</Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}