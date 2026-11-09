'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AkuOyiboWaitlist() {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    whatsapp: '',
    country: '',
    designInterest: '',
    purchaseIntent: ''
  });

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
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#4A3025] font-sans selection:bg-[#A3523B] selection:text-white">
      
      {/* 1. HERO SECTION (Seamless Background Overlay) */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col bg-[#4A3025]">
        
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {products.length > 0 ? (
            <img 
              src={products[0].image_url} 
              alt="Aku Oyibo Hero" 
              className="w-full h-full object-cover object-center md:object-right"
            />
          ) : (
            <div className="w-full h-full bg-[#4A3025]"></div>
          )}
          {/* Gradient: Darker on mobile for text readability, faded on the right for desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A3025]/90 via-[#4A3025]/80 to-[#4A3025]/40 md:bg-gradient-to-r md:from-[#4A3025] md:via-[#4A3025]/90 md:to-transparent"></div>
        </div>

        {/* HEADER */}
        <header className="w-full pt-8 px-6 sm:px-12 flex justify-between items-center z-10 relative">
          <Link href="/" className="text-sm tracking-[0.3em] font-serif uppercase text-[#F4EFE6]">
            S. Sikamòre
          </Link>
          <nav className="hidden md:flex gap-10 text-[9px] uppercase tracking-widest text-[#D1C7BD]">
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <Link href="/bags" className="hover:text-white transition-colors">Bags</Link>
            <Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex gap-4 text-[#D1C7BD] items-center">
             <svg className="w-4 h-4 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <svg className="w-4 h-4 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             <svg className="w-4 h-4 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 z-10 relative max-w-[1400px] mx-auto w-full pt-16 md:pt-0">
          <div className="max-w-lg">
            <span className="text-[11px] tracking-[0.5em] uppercase text-[#D1C7BD] mb-4 block">T H E</span>
            <h1 className="text-5xl sm:text-7xl font-serif font-light uppercase leading-none mb-4 text-[#F4EFE6]">
              AKU OYIBO
            </h1>
            <span className="text-[11px] tracking-[0.5em] uppercase text-[#D1C7BD] mb-8 block">W A I T L I S T</span>
            
            <div className="w-16 h-px bg-[#D1C7BD] mb-8"></div>
            
            <p className="font-serif italic text-lg sm:text-xl text-[#F4EFE6] mb-6">
              Some pieces are made to be worn.<br/>Others are made to be kept.
            </p>
            
            <div className="text-[11px] tracking-[0.05em] text-[#D1C7BD] mb-8 leading-loose">
              <p>
                Aku Oyibo is a collectible expression of material exploration, distinctive design and intricate beadwork, created for the woman who appreciates pieces with character, craftsmanship and a story.
              </p>
            </div>
            
            <p className="text-[10px] tracking-widest text-[#D1C7BD] mb-12 uppercase">
              From Ala Oma — Resort 2027.
            </p>
            
            <button 
              onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#A3523B] text-white px-8 py-3.5 text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#8A422D] transition-colors w-full sm:w-auto"
            >
              JOIN THE WAITLIST →
            </button>
          </div>
        </div>
      </section>

      {/* 2. COLLECTION GALLERY */}
      <section className="py-20 md:py-24 bg-[#F5F0E6]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-lg md:text-xl tracking-[0.25em] font-serif uppercase mb-3 text-[#4A3025]">
            Explore the Aku Oyibo Collection
          </h2>
          <p className="text-[10px] md:text-[11px] tracking-wider text-[#735A4D] mb-12 md:mb-16">
            Six unique expressions. Same story of craft, culture and reimagining.
          </p>
          
          {products.length === 0 ? (
            <div className="py-20">
              <p className="text-[10px] uppercase tracking-widest text-[#A3523B]">The collection is currently behind the vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
              {products.map((item) => (
                <div key={item.id} className="flex flex-col items-center group">
                  <div className="w-full aspect-[4/5] mb-4 relative overflow-hidden bg-[#EAE2D6]">
                    {item.badge && (
                      <span className="absolute bottom-2 left-2 bg-[#A3523B] text-white text-[6px] md:text-[7px] px-2 py-1 uppercase tracking-widest z-10 font-bold">
                        {item.badge}
                      </span>
                    )}
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[9px] md:text-[11px] tracking-widest mb-1 text-[#4A3025] font-medium leading-tight">{item.name}</h3>
                  <p className="text-[10px] md:text-[11px] font-bold text-[#A3523B]">{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WAITLIST FORM SECTION */}
      <section id="waitlist-form" className="py-20 md:py-24 px-6 sm:px-12 max-w-[1400px] mx-auto border-t border-[#D1C7BD] grid md:grid-cols-12 gap-12 lg:gap-24">
        
        {/* Form Column */}
        <div className="md:col-span-7 lg:col-span-8">
          <h2 className="text-xl md:text-2xl tracking-[0.2em] font-serif uppercase mb-3 text-[#4A3025]">
            Join the Waitlist
          </h2>
          <p className="text-[10px] md:text-[11px] tracking-wider text-[#735A4D] mb-8 leading-relaxed font-medium">
            Be the first to know when pre-orders open on<br/>16th November and get early access to order.
          </p>

          {submitStatus === 'success' ? (
            <div className="bg-[#EAE2D6] text-[#4A3025] p-10 border border-[#D1C7BD] text-center animate-fade-in">
              <h3 className="text-sm tracking-[0.2em] uppercase font-bold mb-4">You're on the list</h3>
              <p className="text-[11px] tracking-wider text-[#735A4D] leading-relaxed">
                Thank you for your interest. You will be notified directly when the private reserve unlocks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <input 
                  type="text" name="firstName" placeholder="First Name *" required
                  value={formData.firstName} onChange={handleChange}
                  className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] placeholder-[#8C7A6B] focus:border-[#4A3025] focus:outline-none transition-colors rounded-sm"
                />
                <input 
                  type="email" name="email" placeholder="Email Address *" required
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] placeholder-[#8C7A6B] focus:border-[#4A3025] focus:outline-none transition-colors rounded-sm"
                />
              </div>
              
              <div className="relative">
                <input 
                  type="tel" name="whatsapp" placeholder="WhatsApp Number (Optional)"
                  value={formData.whatsapp} onChange={handleChange}
                  className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] placeholder-[#8C7A6B] focus:border-[#4A3025] focus:outline-none transition-colors rounded-sm"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              
              <select 
                name="country" required value={formData.country} onChange={handleChange}
                className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] focus:border-[#4A3025] focus:outline-none transition-colors appearance-none rounded-sm"
              >
                <option value="" disabled>Country of Residence *</option>
                <option value="NG">Nigeria</option>
                <option value="UK">United Kingdom</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="EU">Europe</option>
                <option value="OTHER">Other</option>
              </select>

              <select 
                name="designInterest" required value={formData.designInterest} onChange={handleChange}
                className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] focus:border-[#4A3025] focus:outline-none transition-colors appearance-none rounded-sm"
              >
                <option value="" disabled>Which Aku Oyibo design are you most interested in? *</option>
                {products.length > 0 ? (
                  products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                ) : (
                  <option value="Any Design">Any Available Design</option>
                )}
              </select>

              <select 
                name="purchaseIntent" required value={formData.purchaseIntent} onChange={handleChange}
                className="w-full bg-transparent border border-[#C6B6A5] px-4 py-3.5 text-[10px] md:text-[11px] tracking-wider text-[#4A3025] focus:border-[#4A3025] focus:outline-none transition-colors appearance-none rounded-sm"
              >
                <option value="" disabled>Are you considering purchasing during the November pre-order? *</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
                <option value="No">No, just browsing</option>
              </select>

              {submitStatus === 'error' && (
                <p className="text-[10px] text-[#A3523B] uppercase tracking-widest mt-2">A network error occurred. Please try again.</p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#A3523B] text-white px-10 py-4 mt-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#8A422D] transition-colors disabled:opacity-50 rounded-sm"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'JOIN THE WAITLIST →'}
              </button>
            </form>
          )}
        </div>

        {/* Value Props Column */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-center space-y-8 md:space-y-10 md:pl-10 md:border-l border-[#D1C7BD] mt-8 md:mt-0">
          
          <div className="flex gap-4 md:gap-5 items-start">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#4A3025] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
            <div>
              <h4 className="text-[11px] md:text-[12px] tracking-[0.1em] font-bold text-[#4A3025] uppercase mb-1">Handcrafted</h4>
              <p className="text-[10px] md:text-[11px] tracking-wide text-[#735A4D] leading-relaxed">
                Thoughtfully made with attention to detail.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 md:gap-5 items-start">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#4A3025] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <div>
              <h4 className="text-[11px] md:text-[12px] tracking-[0.1em] font-bold text-[#4A3025] uppercase mb-1">Collectible Design</h4>
              <p className="text-[10px] md:text-[11px] tracking-wide text-[#735A4D] leading-relaxed">
                A statement piece to wear, keep and pass on.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 md:gap-5 items-start">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#4A3025] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <div>
              <h4 className="text-[11px] md:text-[12px] tracking-[0.1em] font-bold text-[#4A3025] uppercase mb-1">Limited Production</h4>
              <p className="text-[10px] md:text-[11px] tracking-wide text-[#735A4D] leading-relaxed">
                Produced in small batches to ensure quality and craftsmanship.
              </p>
            </div>
          </div>

        </div>
        
      </section>
    </div>
  );
}
