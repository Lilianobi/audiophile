import React from 'react';
import Link from 'next/link';
import './Categories.css';

interface Category {
  name: string;
  slug: string;
  image: string;
}

export default function Categories() {
  const categories: Category[] = [
    {
      name: 'HEADPHONES',
      slug: 'headphones',
      image: '/assets/shared/desktop/image-category-thumbnail-headphones.png',
    },
    {
      name: 'SPEAKERS',
      slug: 'speakers',
      image: '/assets/shared/desktop/image-category-thumbnail-speakers.png',
    },
    {
      name: 'EARPHONES',
      slug: 'earphones',
      image: '/assets/shared/desktop/image-category-thumbnail-earphones.png',
    },
  ];

  return (
    <section className="categories">
      <div className="categories__container container">
        <div className="categories__grid">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`}
              className="category-card"
            >
              <div className="category-card__image-wrapper">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-card__image"
                />
              </div>
              <h6 className="category-card__title">{category.name}</h6>
              <div className="category-card__link">
                <span>SHOP</span>
                <svg width="8" height="12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.322 1l5 5-5 5" stroke="#D87D4A" strokeWidth="2" fill="none" fillRule="evenodd"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}