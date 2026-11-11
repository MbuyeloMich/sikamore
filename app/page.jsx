import Link from 'next/link';
import { generateProductSlug, localProducts } from '../lib/local-products';
import styles from './home.module.css';

export default function HomePage() {
  const featuredProducts = Array.from({ length: 12 }, (_, index) => ({
    ...localProducts[index % localProducts.length],
    listingNumber: index + 1,
  }));

  return (
    <main className={styles.home}>
      <section className={styles.brandHero} aria-label="UNRULY">
        <img
          className={styles.brandArtwork}
          src="/unruly-header-artwork.webp"
          alt="UNRULY logos"
          width="1023"
          height="577"
          fetchPriority="high"
        />
        <div className={styles.heroActions}>
          <Link href="/shop" className={styles.shopLink}>
            Shop the collection <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/shop?gender=men" className={styles.genderLink}>
            Men
          </Link>
          <Link href="/shop?gender=female" className={styles.genderLink}>
            Female
          </Link>
        </div>
      </section>

      <section className={styles.hero} aria-label="Shop the women's collection">
        <div className={styles.carousel} role="group" aria-label="Shop the women's collection">
          {[
            {
              name: 'UNRULY camo look, model one',
              image: '/unruly-camo-model-cutout.png',
            },
            {
              name: 'UNRULY camo look, model two',
              image: '/unruly-camo-model-editorial.png',
            },
            {
              name: 'UNRULY desert camo look, model three',
              image: '/unruly-camo-model-desert.png',
            },
            {
              name: 'UNRULY grey camo look, model four',
              image: '/unruly-camo-model-green-bag.png',
            },
          ].map(model => (
            <Link
              className={styles.productCard}
              href="/shop?gender=female"
              aria-label={`Shop the women's collection — ${model.name}`}
              key={model.image}
            >
              <img
                className={styles.modelImage}
                src={model.image}
                alt={model.name}
                loading="eager"
                draggable="false"
              />
              <span className={styles.modelAction}>
                Shop the collection <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.collectionNote}>
          <span>UNRULY® — NO RULES. JUST STYLE.</span>
          <span>01 — 04</span>
        </div>
      </section>

      <section className={styles.featured} aria-labelledby="featured-heading">
        <div className={styles.featuredHeading}>
          <div>
            <p className={styles.featuredEyebrow}>Selected pieces</p>
            <h2 id="featured-heading">Shop the collection</h2>
          </div>
          <Link href="/shop" className={styles.viewAll}>
            View all <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.map(product => {
            const image = product.featuredImage || product.image;
            return (
              <Link
                className={styles.listingCard}
                href={`/product/${generateProductSlug(product.name)}`}
                aria-label={`View ${product.name}, listing ${product.listingNumber}`}
                key={`featured-${product.listingNumber}`}
              >
                <img
                  src={image}
                  alt={product.name}
                  loading={product.listingNumber <= 6 ? 'eager' : 'lazy'}
                  draggable="false"
                />
                <span className={styles.listingIndex}>
                  {String(product.listingNumber).padStart(2, '0')}
                </span>
                <span className={styles.listingAction}>
                  View product <span aria-hidden="true">↗</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
