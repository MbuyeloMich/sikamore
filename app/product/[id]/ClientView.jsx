'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../providers';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase';
import styles from './product.module.css';

const currencySymbols = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
const sizeOptions = ['S', 'M', 'L', 'XL'];

function getProductImages(payload) {
  const images = [];

  function collect(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    if (typeof value === 'object') {
      Object.values(value).forEach(collect);
      return;
    }
    if (typeof value !== 'string') return;

    const trimmed = value.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed !== value) {
          collect(parsed);
          return;
        }
      } catch {
        return;
      }
    }

    const matches = trimmed.match(/https?:\/\/[^\s,;"'\[\]{}]+|\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp|avif)/gi);
    if (matches) images.push(...matches);
  }

  collect(payload);
  return [...new Set(images)];
}

function generateSlug(name) {
  return name.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function ClientView({ product }) {
  const { addToCart, wishlist, toggleWishlist, showToast } = useApp();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currency, setCurrency] = useState('NGN');
  const [usdToNgnRate, setUsdToNgnRate] = useState(1500);

  const productImages = getProductImages(product.image);
  const isClothing = product.category?.toLowerCase() === 'clothing';
  const hasPrice = Number.isFinite(Number(product.price)) && Number(product.price) > 0;
  const isWishlisted = wishlist.some(item => item.id === String(product.id));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;

    async function loadCurrencySettings() {
      const { data, error } = await supabase
        .from('shipping_settings')
        .select('usd_to_ngn_rate')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Could not load currency settings:', error);
      } else if (active && data?.usd_to_ngn_rate) {
        setUsdToNgnRate(Number(data.usd_to_ngn_rate));
      }
    }

    loadCurrencySettings().catch(error => console.error('Could not load currency settings:', error));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (productImages.length < 2) return undefined;

    const observer = new IntersectionObserver(entries => {
      const visibleImage = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (visibleImage) {
        setCurrentImageIndex(Number(visibleImage.target.dataset.productImageIndex));
      }
    }, { threshold: [0.35, 0.6, 0.85] });

    document.querySelectorAll('[data-product-image-index]').forEach(image => observer.observe(image));
    return () => observer.disconnect();
  }, [productImages.length]);

  const formatPrice = value => {
    if (!Number.isFinite(Number(value)) || Number(value) <= 0) return 'Price on request';
    const rates = {
      NGN: 1,
      USD: 1 / usdToNgnRate,
      GBP: 1 / (usdToNgnRate * 1.32),
      EUR: 1 / (usdToNgnRate * 1.12),
    };
    const converted = Number(value) * (rates[currency] || 1);
    if (currency === 'NGN') return `₦${Math.round(converted).toLocaleString()}`;
    return `${currencySymbols[currency]}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  function handleAddToCart() {
    if (!hasPrice || product.is_sold_out) return;
    addToCart(
      {
        id: String(product.id),
        name: product.name,
        price: Number(product.price),
        image: productImages[0] || '',
        is_sold_out: product.is_sold_out,
      },
      quantity,
      isClothing ? selectedSize : 'One size',
    );
    showToast('Added to your cart.');
  }

  function shareProduct() {
    if (!navigator.clipboard?.writeText) {
      showToast('Sharing is unavailable in this browser.');
      return;
    }

    navigator.clipboard.writeText(`${window.location.origin}/product/${generateSlug(product.name)}`)
      .then(() => showToast('Product link copied.'))
      .catch(error => {
        console.error('Could not copy product link:', error);
        showToast('Could not copy the product link.');
      });
  }

  const productDetails = [
    {
      id: 'details',
      title: 'Details',
      content: product.description || 'Made to move with you. Considered details and a comfortable, everyday fit.',
    },
    {
      id: 'materials',
      title: 'Materials & care',
      content: product.additional_information || 'Please refer to the garment label for care instructions.',
    },
    {
      id: 'shipping',
      title: 'Shipping & returns',
      content: product.store_policies || 'Shipping options and delivery estimates are shown at checkout.',
    },
  ];

  return (
    <div className={styles.page}>
      <main className={styles.layout}>
        <section className={styles.gallery} aria-label={`${product.name} product images`}>
          {productImages.length > 0 ? productImages.map((image, index) => (
            <figure
              className={styles.imagePanel}
              id={`product-image-${index}`}
              data-product-image-index={index}
              key={`${image}-${index}`}
            >
              <img src={image} alt={`${product.name}, view ${index + 1}`} className={styles.image} />
              <figcaption className={styles.imageCount}>
                {String(index + 1).padStart(2, '0')} <span>/</span> {String(productImages.length).padStart(2, '0')}
              </figcaption>
            </figure>
          )) : (
            <div className={styles.emptyImage} role="img" aria-label={`${product.name} image unavailable`}>
              Image coming soon
            </div>
          )}
          <div className={styles.galleryNote}>
            <span>UNNULY — COLLECTION</span>
            <button type="button" onClick={shareProduct}>Share piece ↗</button>
          </div>
        </section>

        <aside className={styles.productInfo}>
          <div className={styles.breadcrumbs}>
            <Link href="/collections">All products</Link>
            <span>/</span>
            <span>{product.category || 'Collection'}</span>
          </div>

          <div className={styles.nameRow}>
            <div>
              <p className={styles.productType}>{product.category || 'UNNULY STUDIO'}</p>
              <h1 className={styles.name}>{product.name}</h1>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist({
                id: String(product.id),
                name: product.name,
                price: product.price,
                image: productImages[0] || '',
              })}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className={styles.wishlist}
            >
              <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </button>
          </div>

          <div className={styles.priceRow}>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            {hasPrice && (
              <label className={styles.currencyControl}>
                <span className={styles.visuallyHidden}>Currency</span>
                <select value={currency} onChange={event => setCurrency(event.target.value)}>
                  <option value="NGN">NGN ₦</option>
                  <option value="USD">USD $</option>
                  <option value="GBP">GBP £</option>
                  <option value="EUR">EUR €</option>
                </select>
              </label>
            )}
          </div>

          {productImages.length > 0 && (
            <div className={styles.imagePicker} aria-label="Product images">
              <span className={styles.fieldLabel}>
                IMG <span className={styles.imagePickerCount}>
                  {String(currentImageIndex + 1).padStart(2, '0')} / {String(productImages.length).padStart(2, '0')}
                </span>
              </span>
              <div className={styles.imageThumbnails}>
                {productImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={styles.imageThumbnail}
                    aria-label={`View image ${index + 1}`}
                    onClick={() => document.getElementById(`product-image-${index}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isClothing && (
            <fieldset className={styles.sizeField}>
              <legend className={styles.fieldLabel}>Select size</legend>
              <div className={styles.sizeGrid}>
                {sizeOptions.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`${styles.sizeOption} ${selectedSize === size ? styles.sizeSelected : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <Link href="/contact" className={styles.sizeGuide}>Size & fit help ↗</Link>
            </fieldset>
          )}

          <div className={styles.quantityRow}>
            <span className={styles.fieldLabel}>Quantity</span>
            <div className={styles.quantityControl}>
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(value => Math.max(1, value - 1))}
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(value => value + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasPrice || product.is_sold_out}
            className={styles.addButton}
          >
            <span>{product.is_sold_out ? 'Sold out' : hasPrice ? 'Add to bag' : 'Price on request'}</span>
            <span>{hasPrice ? formatPrice(Number(product.price) * quantity) : '—'}</span>
          </button>
          <p className={styles.purchaseNote}>Taxes and shipping calculated at checkout.</p>

          <div className={styles.accordions}>
            {productDetails.map(detail => (
              <section className={styles.accordion} key={detail.id}>
                <button
                  type="button"
                  className={styles.accordionToggle}
                  aria-expanded={openAccordion === detail.id}
                  onClick={() => setOpenAccordion(openAccordion === detail.id ? '' : detail.id)}
                >
                  <span>{detail.title}</span>
                  <span aria-hidden="true">{openAccordion === detail.id ? '−' : '+'}</span>
                </button>
                {openAccordion === detail.id && (
                  <p className={styles.accordionContent}>{detail.content}</p>
                )}
              </section>
            ))}
          </div>
        </aside>
      </main>

    </div>
  );
}
