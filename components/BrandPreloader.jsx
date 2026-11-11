'use client';

import { useEffect, useState } from 'react';
import styles from './BrandPreloader.module.css';

const DISPLAY_DURATION = 4000;
const EXIT_DURATION = 1400;

export default function BrandPreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const exitTimer = window.setTimeout(() => {
      setLeaving(true);
    }, DISPLAY_DURATION);
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, DISPLAY_DURATION + EXIT_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.preloader} ${leaving ? styles.leaving : ''}`}
      role="status"
      aria-label="Loading UNRULY"
    >
      <div className={styles.glow} aria-hidden="true" />
      <svg className={styles.filters} aria-hidden="true" focusable="false">
        <filter id="unruly-liquid-warp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.02"
            numOctaves="2"
            seed="8"
            result="liquidNoise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.008 0.02;0.014 0.009;0.008 0.02"
              dur="4s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="liquidNoise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          >
            <animate attributeName="scale" values="18;38;18" dur="4s" repeatCount="indefinite" />
          </feDisplacementMap>
        </filter>
      </svg>
      <div className={styles.content}>
        <div className={styles.markWrap}>
          <img
            className={styles.mark}
            src="/unruly-liquid-metal.webp"
            width="1200"
            height="1200"
            alt=""
            fetchPriority="high"
            draggable="false"
          />
        </div>
        <p className={styles.wordmark}>UNRULY®</p>
        <div className={styles.loadingLine} aria-hidden="true">
          <span />
        </div>
        <p className={styles.caption}>NO RULES. JUST STYLE.</p>
      </div>
    </div>
  );
}
