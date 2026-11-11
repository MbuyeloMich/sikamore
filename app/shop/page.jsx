'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { generateProductSlug, localProducts } from '../../lib/local-products';
import styles from '../collections/collections.module.css';

function getPrimaryImage(payload) {
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) return payload.map(getPrimaryImage).find(Boolean) || '';
  if (payload && typeof payload === 'object') {
    return Object.values(payload).map(getPrimaryImage).find(Boolean) || '';
  }
  return '';
}

function duplicateInventory(products, count, prefix) {
  if (!products.length) return [];
  return Array.from({ length: count }, (_, index) => ({
    ...products[index % products.length],
    listingId: `${prefix}-${index + 1}`,
    listingNumber: index + 1,
  }));
}

function ProductListing({ products, eyebrow, title, id, showViewAll = false }) {
  return (
    <section className={styles.category} aria-labelledby={`${id}-heading`} id={id}>
      <div className={styles.productGrid}>
        {products.map(product => {
          const image = getPrimaryImage(product.image);
          const productName = product.name || 'Collection piece';

          return (
            <div className={styles.product} key={product.listingId}>
              {image ? (
                <img
                  src={image}
                  alt={productName}
                  loading={product.listingNumber <= 6 ? 'eager' : 'lazy'}
                  className={styles.productImage}
                />
              ) : (
                <span className={styles.imagePlaceholder} aria-hidden="true" />
              )}
              <span className={styles.productIndex}>
                {String(product.listingNumber).padStart(2, '0')}
              </span>
              <Link
                href={`/product/${generateProductSlug(product.name)}`}
                className={styles.productAction}
                aria-label={`View ${productName}, listing ${product.listingNumber}`}
              >
                View product <span aria-hidden="true">↗</span>
              </Link>
            </div>
          );
        })}
        {showViewAll && (
          <a href="#all-products" className={styles.viewAllTile}>
            <span>View</span>
            <span>Products ↗</span>
          </a>
        )}
      </div>

      <div className={styles.categoryHeading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id={`${id}-heading`} className={styles.categoryTitle}>
            {title}
          </h1>
        </div>
        <p className={styles.productCount}>
          Products <span>{String(products.length).padStart(2, '0')}</span>
        </p>
      </div>
    </section>
  );
}

export default function ShopPage() {
  const [inventory, setInventory] = useState(localProducts);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const gender = params.get('gender')?.toLowerCase();
    if (['clothing', 'accessories', 'bags'].includes(category)) {
      setSelectedCategory(category);
    }
    if (['men', 'female'].includes(gender)) {
      setSelectedGender(gender);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;

    async function loadInventory() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load shop inventory:', error);
        if (active) setErrorMessage('We couldn’t load the products. Please try again.');
      } else if (active) {
        setInventory(data?.length ? data : localProducts);
      }

      if (active) setLoading(false);
    }

    loadInventory().catch(error => {
      console.error('Failed to load shop inventory:', error);
      if (active) {
        setErrorMessage('We couldn’t load the products. Please try again.');
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredInventory = selectedCategory
    ? inventory.filter(product => (product.category || 'bags').toLowerCase() === selectedCategory)
    : inventory;
  const categoryInventory = selectedGender
    ? filteredInventory.filter(product => {
      const gender = String(product.gender || product.audience || product.target_gender || '').toLowerCase();
      return selectedGender === 'men'
        ? ['men', 'male', 'mens', "men's"].includes(gender)
        : ['female', 'women', 'womens', "women's"].includes(gender);
    })
    : filteredInventory;
  const dropProducts = duplicateInventory(categoryInventory, 21, 'drop');
  const allProducts = duplicateInventory(categoryInventory, 97, 'all');

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div className={styles.masthead} aria-hidden="true" />
        <main className={styles.main}>
          {loading && <p role="status" className={styles.message}>Loading products...</p>}
          {!loading && errorMessage && <p role="alert" className={styles.message}>{errorMessage}</p>}
          {!loading && !errorMessage && categoryInventory.length === 0 && (
            <p className={styles.message}>
              {selectedGender
                ? `There are no ${selectedGender === 'men' ? "men's" : "women's"} products in this collection yet.`
                : 'There are no products in this collection yet.'}
            </p>
          )}
          {!loading && !errorMessage && categoryInventory.length > 0 && (
            <>
              <ProductListing
                products={dropProducts}
                eyebrow="Category 01 / 02"
                title="Heroines Drop"
                id="heroines-drop"
                showViewAll
              />
              <ProductListing
                products={allProducts}
                eyebrow="Next"
                title="Products"
                id="all-products"
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
