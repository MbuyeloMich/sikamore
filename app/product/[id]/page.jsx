export const dynamic = 'force-dynamic';

import Link from 'next/link';
import ClientView from './ClientView';
import { generateProductSlug, localProducts } from '../../../lib/local-products';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

async function findProduct(slug) {
  if (isSupabaseConfigured) {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) throw error;

    const product = products?.find(item => generateProductSlug(item.name) === slug);
    if (product) return product;
  }

  return localProducts.find(product => generateProductSlug(product.name) === slug) || null;
}

function getPrimaryImage(product) {
  const images = [];

  function collect(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collect);
    } else if (typeof value === 'object') {
      Object.values(value).forEach(collect);
    } else if (typeof value === 'string') {
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          collect(JSON.parse(value));
        } catch {
          return;
        }
      } else if (/^https?:\/\//i.test(value)) {
        images.push(value);
      }
    }
  }

  collect(product?.image);
  return images[0] || '';
}

export async function generateMetadata(props) {
  const { id: slug } = await props.params;
  const product = await findProduct(slug);

  if (!product) {
    return { title: 'Piece Not Found | S. SIKAMÒRE' };
  }

  const description = product.description || 'Discover this exclusive piece in the S. Sikamòre Archive.';
  const primaryImage = getPrimaryImage(product) || 'https://ssikamore.com/client-logo.jpeg';

  return {
    title: `${product.name} | S. SIKAMÒRE`,
    description,
    openGraph: {
      title: `${product.name} | S. SIKAMÒRE`,
      description,
      url: `https://ssikamore.com/product/${slug}`,
      images: [{ url: primaryImage, width: 1080, height: 1080, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | S. SIKAMÒRE`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage(props) {
  const { id: slug } = await props.params;
  const product = await findProduct(slug);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-white text-[10px] uppercase tracking-widest text-black">
        <p>Piece not found in the archive.</p>
        <Link href="/collections" className="border border-black px-8 py-4 transition-colors hover:bg-black hover:text-white">
          Return to Collection
        </Link>
      </div>
    );
  }

  return <ClientView key={String(product.id)} product={product} />;
}
