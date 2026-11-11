import Image from 'next/image';
import Link from 'next/link';

export default function BrandLogo({ href = '/', className = '', imageClassName = '', variant = 'default' }) {
  return (
    <Link href={href} aria-label="Unnuly home" className={`flex items-center justify-center ${className}`}>
      <Image
        src={variant === 'light' ? '/unnuly-logo-light.png' : '/unnuly-logo.png'}
        alt="Unnuly"
        width={550}
        height={168}
        priority
        className={`h-10 w-auto max-w-[42vw] object-contain ${imageClassName}`}
      />
    </Link>
  );
}
