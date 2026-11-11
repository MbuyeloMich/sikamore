'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { generateProductSlug, localProducts } from '../../lib/local-products';
import styles from './collections.module.css';

const categoryOrder = [
  { id: 'clothing', label: 'Clothing' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'bags', label: 'Bags' },
];

function getPrimaryImage(payload) {
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) return payload.map(getPrimaryImage).find(Boolean) || '';
  if (payload && typeof payload === 'object') {
    return Object.values(payload).map(getPrimaryImage).find(Boolean) || '';
  }
  return '';
}

function groupProducts(products) {
  const grouped = { bags: [], accessories: [], clothing: [] };

  products.forEach(product => {
    const category = product.category || 'bags';
    if (grouped[category]) grouped[category].push(product);
  });

  return grouped;
}

async function fetchGroupedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return groupProducts(data || []);
}

function ProductGrid({ products, categoryName, categoryNumber, title }) {
  return (
    <section className={styles.category} aria-labelledby={`collection-${categoryName}`}>
      <div className={styles.productGrid}>
        {products.map((product, index) => {
          const image = getPrimaryImage(product.image);
          const productName = product.name || 'Collection piece';

          return (
            <div className={styles.product} key={product.id}>
              {image ? (
                <img
                  src={image}
                  alt={productName}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  className={styles.productImage}
                />
              ) : (
                <span className={styles.imagePlaceholder} aria-hidden="true" />
              )}
              <span className={styles.productIndex}>{String(index + 1).padStart(2, '0')}</span>
              <Link
                href={`/product/${generateProductSlug(product.name)}`}
                className={styles.productAction}
                aria-label={`View ${productName}`}
              >
                View product <span aria-hidden="true">↗</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className={styles.categoryHeading}>
        <div>
          <p className={styles.eyebrow}>Category {categoryNumber} / 03</p>
          <h2 id={`collection-${categoryName}`} className={styles.categoryTitle}>
            {title}
          </h2>
        </div>
        <p className={styles.productCount}>
          Products <span>{String(products.length).padStart(2, '0')}</span>
        </p>
      </div>
    </section>
  );
}

export default function CollectionsPage() {
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({
    bags: [],
    accessories: [],
    clothing: [],
  });
  const visibleCategories = selectedCategory
    ? categoryOrder.filter(category => category.id === selectedCategory)
    : categoryOrder;
  const visibleProductCount = visibleCategories.reduce(
    (total, category) => total + groupedProducts[category.id].length,
    0,
  );
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    if (categoryOrder.some(item => item.id === category)) setSelectedCategory(category);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const products = isSupabaseConfigured
          ? await fetchGroupedProducts()
          : groupProducts(localProducts);

        if (isMounted) {
          setGroupedProducts(products);
          setProductsError(false);
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
        if (isMounted) setProductsError(true);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  async function retryFetchProducts() {
    setProductsLoading(true);
    setProductsError(false);
    try {
      setGroupedProducts(await fetchGroupedProducts());
    } catch (error) {
      console.error('Failed to load collections:', error);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div className={styles.masthead} aria-hidden="true" />

        <main id="collection-products" className={styles.main}>
          {productsLoading && (
            <p role="status" className={styles.message}>Loading collections...</p>
          )}

          {!productsLoading && productsError && (
            <div role="alert" className={styles.message}>
              <p>We couldn&apos;t load the collections. Check your connection and try again.</p>
              <button type="button" onClick={retryFetchProducts} className={styles.retryButton}>
                Try again
              </button>
            </div>
          )}

          {!productsLoading && !productsError && visibleProductCount === 0 && (
            <p className={styles.message}>There are no products in the collections yet.</p>
          )}

          {!productsLoading && !productsError && visibleCategories.map((category, index) => {
            const products = groupedProducts[category.id];
            if (!products.length) return null;

            return (
              <ProductGrid
                key={category.id}
                products={products}
                categoryName={category.id}
                categoryNumber={String(index + 1).padStart(2, '0')}
                title={category.label}
              />
            );
          })}
        </main>
      </div>
    </div>
  );
}
