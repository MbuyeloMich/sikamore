'use client';

import { useState } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import styles from './GlobalFooter.module.css';

export default function GlobalFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubscribe(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!isSupabaseConfigured) {
      setStatus('unavailable');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: email.trim().toLowerCase() });

      if (error?.code === '23505') {
        setStatus('already-subscribed');
      } else if (error) {
        console.error('Newsletter subscription failed:', error);
        setStatus('error');
      } else {
        setEmail('');
        setStatus('success');
      }
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusMessages = {
    success: 'Thank you for subscribing.',
    'already-subscribed': 'This email is already subscribed.',
    unavailable: 'Newsletter sign-up is currently unavailable. Please try again later.',
    error: 'We could not subscribe you right now. Please try again.',
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.socials} aria-label="Social media">
          <a
            href="https://instagram.com/ssikamore"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle className={styles.socialDot} cx="17.6" cy="6.8" r="1" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M22 7.2a2.8 2.8 0 0 0-2-2C18.2 4.7 12 4.7 12 4.7s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2C1.5 9 1.5 12 1.5 12s0 3 .5 4.8a2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8Z" />
              <path className={styles.play} d="m10 15.5 5.2-3.5L10 8.5v7Z" />
            </svg>
          </a>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <Link href="/contact">Contact Us</Link>
          <Link href="/about">About Us</Link>
          <Link href="/shipping#shipping">Shipping Information</Link>
          <Link href="/shipping#returns">Refunds and Returns</Link>
          <Link href="/shipping#payments">Payment Policy</Link>
        </nav>

        <div className={styles.newsletter}>
          <p>Subscribe to our newsletter to stay informed about our latest releases and updates.</p>
          <form className={styles.form} onSubmit={handleSubscribe}>
            <label className={styles.visuallyHidden} htmlFor="footer-newsletter-email">
              Enter email
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="Enter Email *"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          <p className={styles.status} aria-live="polite">
            {statusMessages[status] || ''}
          </p>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 UNRULY®. All rights reserved.
      </div>
    </footer>
  );
}
