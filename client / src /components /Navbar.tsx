import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Settings } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { href: '#sobre', label: 'Sobre Nós' },
    { href: '#proposito', label: 'Propósito' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#depoimentos', label: 'Clientes' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-accent-foreground font-black text-xl italic">M</span>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-foreground">
            MOMESSO<span className="text-accent">DIGITAL</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors outline-none"
            >
              {link.label}
            </a>
          ))}
          {user?.role === 'admin' && (
            <a
              href="/admin"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors"
              title="Painel Admin"
            >
              <Settings size={18} />
              Admin
            </a>
          )}
          <a
            href="https://wa.me/5543998579615"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-accent/90 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            Falar com Especialista
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-8 flex flex-col gap-6 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-bold text-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user?.role === 'admin' && (
            <a
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-muted text-foreground p-3 rounded-lg font-bold uppercase hover:bg-muted/80 transition-all"
            >
              <Settings size={18} />
              Painel Admin
            </a>
          )}
          <a
            href="https://wa.me/5543998579615"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="bg-accent text-accent-foreground p-4 rounded-xl text-center font-black uppercase hover:bg-accent/90 transition-all"
          >
            Começar Agora
          </a>
        </div>
      )}
    </nav>
  );
}
