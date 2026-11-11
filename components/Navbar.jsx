'use client';

import Link from 'next/link';
import { useApp } from '../app/providers';
import BrandLogo from './BrandLogo';
import styles from './AnnouncementBar.module.css';

export default function Navbar() {
  const { cart, setIsCartOpen } = useApp();
  const cartItemCount = cart.reduce((total, item) => total + Number(item.quantity || 1), 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black">
      <nav
        aria-label="Main navigation"
        className="mx-auto w-full max-w-[1440px] border-b border-[#e5e5e5]"
      >
        <div className="flex h-8 items-center px-1">
          <BrandLogo className="h-full justify-start" imageClassName="h-[18px] max-w-[42vw]" />
        </div>
        <div className="flex h-8 items-center justify-between px-1 text-[10px] font-semibold leading-none">
          <div className="flex items-center gap-4">
            <Link href="/collections" className="flex items-center gap-1.5 hover:opacity-60">
              <span>ALL</span>
              <span className="font-normal text-[#777]">04</span>
            </Link>
            <Link href="/shop" className="flex items-center gap-1.5 hover:opacity-60">
              <span>STORES</span>
              <span className="font-normal text-[#777]">04</span>
            </Link>
          </div>
          <button
            type="button"
            aria-label={`Open cart, ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`}
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 hover:opacity-60"
          >
            <span>CART</span>
            <span className="font-normal text-[#777]">
              {String(cartItemCount).padStart(2, '0')}
            </span>
          </button>
        </div>
      </nav>
      <div className={styles.bar} role="region" aria-label="Store announcements">
        <div className={styles.track}>
          <div className={styles.messageGroup}>
            <span className={styles.message}>Free delivery for orders over R600</span>
            <img className={styles.emblem} src="/unruly-announcement-emblem.png" alt="" aria-hidden="true" />
            <Link className={styles.message} href="/shop">Shop Black Friday Sale</Link>
          </div>
          <div className={styles.messageGroup} aria-hidden="true">
            <span className={styles.message}>Free delivery for orders over R600</span>
            <img className={styles.emblem} src="/unruly-announcement-emblem.png" alt="" />
            <Link className={styles.message} href="/shop" tabIndex={-1}>Shop Black Friday Sale</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
