'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AkuOyiboWaitlist() {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    whatsapp: '',
    country: '',
    designInterest: '',
    purchaseIntent: ''
  });

  // Fetch live Waitlist products from Supabase on load
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('waitlist_products')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from('waitlist_leads').insert([{
        first_name: formData.firstName,
        email: formData.email.toLowerCase(),
        whatsapp: formData.whatsapp || null,
        country: formData.country,
        design_interest: formData.designInterest,
        purchase_intent: formData.purchaseIntent
      }]);

      if (error) throw error;
      
      setSubmitStatus('success');
      setFormData({ firstName: '', email: '', whatsapp: '', country: '', designInterest: '', purchaseIntent: '' });
    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-zinc-800">
      
      {/* HEADER */}
      <header className="w-full pt-8 px-6 sm:px-10 flex justify-between items-center border-b border-zinc-900 pb-6">
        <Link href="/" className="text-xl tracking-[0.4em] font-serif font-light uppercase">
          S. Sikamòre
        </Link>
        <nav className="hidden md:flex gap-8 text-[9px] uppercase tracking-widest text-zinc-400">
          <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
          <Link href="/bags" className="hover:text-white transition-colors">Bags</Link>
          <Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </nav>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative px-6 sm:px-10 py-20 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start animate-fade-in">
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-4">The</span>
          <h1 className="text-4xl sm:text-6xl tracking-[0.2em] font-serif font-light uppercase mb-6 leading-tight">
            Aku Oyibo <br/> Waitlist
          </h1>
          
          <p className="font-serif italic text-lg sm:text-xl text-zinc-300 mb-6">
            Some pieces are made to be worn. <br/> Others are made to be kept.
          </p>
          
          <div className="text-[11px] tracking-[0.1em] text-zinc-400 mb-8 max-w-md leading-relaxed uppercase space-y-4">
            <p>
              Aku Oyibo is a collectible expression of thoughtful craftsmanship, the beauty of transformed materials and intricate hand-beadwork.
            </p>
            <p>
              Crafted from natural coconut shells, no two pieces are exactly alike. Each shell carries its own markings, shape and colour, making every Aku Oyibo a one-of-one piece.
            </p>
            <p>
              Created for the woman who appreciates pieces with character, craftsmanship and a story.
            </p>
          </div>
          
          <p className="text-[9px] tracking-widest text-zinc-500 mb-10 uppercase">
            From Ala Oma - Resort 2027
          </p>
          
          <button 
            onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-10 py-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-zinc-200 transition-colors"
          >
            Join the Waitlist →
          </button>
        </div>
        
        {/* Dynamic Hero Image based on first uploaded product, or dark placeholder if empty */}
        <div className="relative h-[60vh] w-full bg-zinc-900 border border-zinc-800">
          {products.length > 0 ? (
            <img 
              src={products[0].image_url} 
              alt="Aku Oyibo Hero" 
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase text-zinc-600">Editorial Asset Pending</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. COLLECTION GALLERY */}
      <section className="py-20 bg-[#0F0F0F] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <h2 className="text-xl sm:text-2xl tracking-[0.3em] font-serif uppercase mb-4">
            Explore the Aku Oyibo Collection
          </h2>
          <p className="text-[10px] tracking-widest text-zinc-400 uppercase mb-16">
            Six unique expressions. Same story of craft, culture and reimagining.
          </p>
          
          {products.length === 0 ? (
            <div className="py-20 border border-zinc-900 bg-[#0A0A0A]">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">The collection is currently behind the vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 sm:gap-8">
              {products.map((item) => (
                <div key={item.id} className="flex flex-col items-center group">
                  <div className="w-full aspect-[4/5] bg-zinc-900 mb-6 relative overflow-hidden">
                    {item.badge && (
                      <span className="absolute top-4 left-4 bg-white text-black text-[8px] px-2 py-1 uppercase tracking-widest z-10 font-bold">
                        {item.badge}
                      </span>
                    )}
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[11px] tracking-widest uppercase mb-2 text-zinc-200">{item.name}</h3>
                  <p className="text-[10px] tracking-widest text-zinc-500 font-mono">{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WAITLIST FORM SECTION */}
      <section id="waitlist-form" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
        
        {/* Form Column */}
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-[0.2em] font-serif uppercase mb-4">
            Join the Waitlist
          </h2>
          <p className="text-[10px] tracking-widest text-zinc-400 uppercase mb-10 leading-relaxed">
            Be the first to know when pre-orders open on 16th November and get early access to order.
          </p>

          {submitStatus === 'success' ? (
            <div className="bg-white text-black p-10 border border-zinc-800 text-center animate-fade-in">
              <h3 className="text-sm tracking-[0.2em] uppercase font-bold mb-4">You're on the list</h3>
              <p className="text-[10px] tracking-widest text-zinc-600 uppercase leading-relaxed">
                Thank you for your interest. You will be notified directly when the private reserve unlocks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="firstName" placeholder="FIRST NAME *" required
                  value={formData.firstName} onChange={handleChange}
                  className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase focus:border-white focus:outline-none transition-colors"
                />
                <input 
                  type="email" name="email" placeholder="EMAIL ADDRESS *" required
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase focus:border-white focus:outline-none transition-colors"
                />
              </div>
              
              <input 
                type="tel" name="whatsapp" placeholder="WHATSAPP NUMBER (OPTIONAL)"
                value={formData.whatsapp} onChange={handleChange}
                className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase focus:border-white focus:outline-none transition-colors"
              />
              
              <select 
                name="country" required value={formData.country} onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 focus:text-white focus:border-white focus:outline-none transition-colors appearance-none"
              >
                <option value="" disabled>COUNTRY OF RESIDENCE *</option>
                <option value="NG">Nigeria</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="EU">Europe</option>
                <option value="OTHER">Other</option>
              </select>

              <select 
                name="designInterest" required value={formData.designInterest} onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 focus:text-white focus:border-white focus:outline-none transition-colors appearance-none"
              >
                <option value="" disabled>WHICH AKU OYIBO DESIGN ARE YOU MOST INTERESTED IN? *</option>
                {products.length > 0 ? (
                  products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                ) : (
                  <option value="Any Design">Any Available Design</option>
                )}
              </select>

              <select 
                name="purchaseIntent" required value={formData.purchaseIntent} onChange={handleChange}
                className="w-full bg-[#0A0A0A] border border-zinc-800 px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 focus:text-white focus:border-white focus:outline-none transition-colors appearance-none"
              >
                <option value="" disabled>ARE YOU CONSIDERING PURCHASING DURING THE NOVEMBER PRE-ORDER? *</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
                <option value="No">No, just browsing</option>
              </select>

              {submitStatus === 'error' && (
                <p className="text-[9px] text-red-500 uppercase tracking-widest">A network error occurred. Please try again.</p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 mt-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SECURELY TRANSMITTING...' : 'Join the Waitlist →'}
              </button>
            </form>
          )}
        </div>

        {/* Value Props Column */}
        <div className="flex flex-col justify-center space-y-12 border-l border-zinc-900 pl-10">
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-2">Handcrafted</h4>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase leading-relaxed">
              Thoughtfully made with attention to detail.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-2">Collectible Design</h4>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase leading-relaxed">
              A statement piece to wear, keep and pass on.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-2">Limited Production</h4>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase leading-relaxed">
              Produced in small batches to ensure quality and craftsmanship.
            </p>
          </div>
        </div>
        
      </section>

      {/* FOOTER */}
      <footer className="w-full pb-8 pt-10 flex flex-col items-center text-center border-t border-zinc-900">
        <p className="text-[8px] tracking-[0.3em] text-zinc-600 uppercase">
          S. Sikamore Collectibles © {new Date().getFullYear()}
        </p>
      </footer>
      
    </div>
  );
}
