import React from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BestGear from '../components/home/BestGear';
import './page.css';

export default function HomePage() {
  return (
    <div className="homepage">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <BestGear />
    </div>
  );
}