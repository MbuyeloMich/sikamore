import EditorialInfoPage from '../../components/EditorialInfoPage';

export const metadata = {
  title: 'About Us | UNRULY',
  description: 'Discover the ideas and craft behind UNRULY.',
};

const sections = [
  {
    id: 'our-story',
    title: 'Made to mean something',
    subtitle: 'A point of view, expressed through what we wear.',
    paragraphs: [
      'S. SIKAMÒRE was born from a desire to create more than accessories. We create pieces that feel like identity: bold, intentional, feminine, and spiritually grounded.',
      'Inspired by the symbolism of the sycamore tree, S. SIKAMÒRE stands for elevation, vision, and the pursuit of light. We exist for audacious women who carry light wherever they go. Every piece is designed to feel expressive yet timeless, artistic yet refined.',
    ],
  },
  {
    id: 'our-craft',
    title: 'Rooted in craft',
    subtitle: 'Texture, symbolism, storytelling, and detail.',
    paragraphs: [
      'Rooted in African craftsmanship and handcrafted in Lagos, Nigeria, our work celebrates texture, symbolism, storytelling, and detail. From hand-beaded patterns inspired by indigenous markings and feminine strength, to silhouettes that feel both modern and soulful, every SIKAMÒRE piece is created with intention.',
      'We believe fashion should not only be worn. It should be felt.',
    ],
  },
  {
    id: 'our-founder',
    title: 'A vision with purpose',
    subtitle: 'The woman behind S. SIKAMÒRE.',
    paragraphs: [
      'Founded by Stephanie C. Ajuluchukwu, S. SIKAMÒRE represents a woman who embraces beauty boldly, moves with purpose, and understands that elegance can still carry depth and meaning.',
      'Climb to see the light.',
    ],
  },
];

export default function AboutPage() {
  return (
    <EditorialInfoPage
      eyebrow="UNRULY® / OUR STORY"
      title="About us."
      intro="Distinctive pieces, made with intention and a point of view."
      navigation={[
        { href: '#our-story', label: 'Our story' },
        { href: '#our-craft', label: 'Our craft' },
        { href: '#our-founder', label: 'Our founder' },
      ]}
      sections={sections}
      callout={{
        eyebrow: 'DISCOVER THE COLLECTION',
        title: 'Find your point of view.',
        description: 'Explore the pieces made to stand apart.',
        actions: [
          { href: '/shop', label: 'Shop UNRULY' },
          { href: '/contact', label: 'Contact us', secondary: true },
        ],
      }}
    />
  );
}
