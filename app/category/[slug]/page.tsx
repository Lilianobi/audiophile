import React from 'react';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import Categories from '../../../components/home/Categories';
import BestGear from '../../../components/home/BestGear';
import { getProductsByCategory } from '../../../lib/products';
import './page.css';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'headphones' },
    { slug: 'speakers' },
    { slug: 'earphones' },
  ];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const products = getProductsByCategory(slug);
  
  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header">
        <div className="container">
          <h2>{categoryTitle}</h2>
        </div>
      </div>

      {/* Product List */}
      <section className="product-list">
        <div className="container">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`product-item ${index % 2 === 1 ? 'product-item--reverse' : ''}`}
            >
              <div className="product-item__image">
                <picture>
                  <source 
                    media="(max-width: 767px)" 
                    srcSet={product.image.mobile}
                  />
                  <source 
                    media="(max-width: 1439px)" 
                    srcSet={product.image.tablet}
                  />
                  <img 
                    src={product.image.desktop} 
                    alt={product.name}
                  />
                </picture>
              </div>
              
              <div className="product-item__content">
                {product.new && <p className="overline">NEW PRODUCT</p>}
                <h2>{product.name}</h2>
                <h3 className="product-item__category">{product.categoryName}</h3>
                <p className="product-item__description">
                  {product.description}
                </p>
                <Link href={`/product/${product.slug}`}>
                  <Button variant="primary">SEE PRODUCT</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Best Gear Section */}
      <BestGear />
    </div>
  );
}