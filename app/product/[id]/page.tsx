'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../../components/common/Button';
import QuantitySelector from '../../../components/common/QuantitySelector';
import Categories from '../../../components/home/Categories';
import BestGear from '../../../components/home/BestGear';
import { getProductBySlug, getRelatedProducts } from '../../../lib/products';
import { useCart } from '../../../lib/CartContext';
import './page.css';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductBySlug(resolvedParams.id);
  const relatedProducts = getRelatedProducts(product?.id || '');

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link href="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.cartImage,
    }, quantity);
  };

  return (
    <div className="product-detail-page">
      {/* Back Button */}
      <div className="container">
        <button 
          onClick={() => router.back()} 
          className="back-button"
        >
          Go Back
        </button>
      </div>

      {/* Product Overview */}
      <section className="product-overview">
        <div className="container">
          <div className="product-overview__grid">
            <div className="product-overview__image">
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
            
            <div className="product-overview__content">
              {product.new && <p className="overline">NEW PRODUCT</p>}
              <h2>{product.name}</h2>
              <h3 className="product-overview__category">{product.categoryName}</h3>
              <p className="product-overview__description">
                {product.description}
              </p>
              <p className="product-overview__price">
                $ {product.price.toLocaleString()}
              </p>
              
              <div className="product-overview__actions">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(q => q + 1)}
                  onDecrease={() => setQuantity(q => q - 1)}
                />
                <Button 
                  variant="primary" 
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Includes */}
      <section className="product-details">
        <div className="container">
          <div className="product-details__grid">
            <div className="product-details__features">
              <h3>FEATURES</h3>
              <p>{product.features}</p>
            </div>
            
            <div className="product-details__includes">
              <h3>IN THE BOX</h3>
              <ul>
                {product.includes.map((item, index) => (
                  <li key={index}>
                    <span className="quantity">{item.quantity}x</span>
                    <span className="item">{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="product-gallery">
        <div className="container">
          <div className="product-gallery__grid">
            <div className="product-gallery__column">
              <img src={product.gallery.first} alt={`${product.name} gallery 1`} />
              <img src={product.gallery.second} alt={`${product.name} gallery 2`} />
            </div>
            <div className="product-gallery__large">
              <img src={product.gallery.third} alt={`${product.name} gallery 3`} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="related-products">
        <div className="container">
          <h3>YOU MAY ALSO LIKE</h3>
          <div className="related-products__grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product">
                <div className="related-product__image">
                  <picture>
                    <source 
                      media="(max-width: 767px)" 
                      srcSet={relatedProduct.image.mobile}
                    />
                    <source 
                      media="(max-width: 1439px)" 
                      srcSet={relatedProduct.image.tablet}
                    />
                    <img 
                      src={relatedProduct.image.desktop} 
                      alt={relatedProduct.name}
                    />
                  </picture>
                </div>
                <h5>{relatedProduct.name}</h5>
                <Link href={`/product/${relatedProduct.slug}`}>
                  <Button variant="primary">SEE PRODUCT</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Best Gear Section */}
      <BestGear />
    </div>
  );
}