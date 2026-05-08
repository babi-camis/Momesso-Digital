import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';
import CasesSection from '@/components/CasesSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import FloatingChat from '@/components/FloatingChat';
import Footer from '@/components/Footer';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground scroll-smooth">
      <Navbar scrolled={scrolled} />
      <main>
        <HeroSection />
        <section id="sobre" className="py-20 bg-background border-b border-border">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-4xl font-black text-foreground mb-6 uppercase tracking-tighter">
              Sobre a <span className="text-accent">Momesso Digital</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos uma agencia de marketing digital focada em resultados reais e mensuraveis. Trabalhamos com empresas que querem escalar seu faturamento atraves de estrategias digitais bem estruturadas e orientadas a ROI.
            </p>
          </div>
        </section>
        <PartnersSection />
        <CasesSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
