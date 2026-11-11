export const localProducts = [
  {
    id: 'woodland-camo-trousers',
    name: 'Woodland Camo Trousers',
    category: 'clothing',
    gender: 'female',
    image: '/unnuly-woodland-camo-trousers.jpg',
    description: 'A woodland-print trouser with a relaxed shape and confident, utility-inspired character.',
  },
  {
    id: 'grey-camo-cargo-pants',
    name: 'Grey Camo Cargo Pants',
    category: 'clothing',
    gender: 'female',
    image: '/unnuly-grey-camo-cargo-pants.jpeg',
    description: 'A soft-toned camouflage print and cargo detailing create a versatile, relaxed silhouette.',
  },
  {
    id: 'desert-camo-cargo-pants',
    name: 'Desert Camo Cargo Pants',
    category: 'clothing',
    gender: 'female',
    featuredImage: '/unnuly-desert-camo-model.png',
    image: '/unnuly-desert-camo-cargo-pants.jpg',
    description: 'A warm desert camouflage palette with practical cargo details and an easy, straight-leg shape.',
  },
  {
    id: 'forest-camo-cargo-pants',
    name: 'Forest Camo Cargo Pants',
    category: 'clothing',
    gender: 'female',
    image: '/unnuly-forest-camo-cargo-pants.jpg',
    description: 'A deep forest camouflage print brings a grounded, expressive edge to a classic cargo silhouette.',
  },
];

export function generateProductSlug(name) {
  if (!name) return '';
  return name.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
