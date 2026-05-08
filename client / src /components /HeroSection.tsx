import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden px-6">
      {/* Background glow effect */}
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full -ml-32"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] bg-card px-4 py-1.5 rounded-full border border-border flex items-center gap-2">
            <Heart size={14} className="text-accent" /> Parceria & Resultados
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-foreground uppercase">
          Estratégia digital <br />
          com <span className="text-accent italic underline decoration-accent/30">propósito real.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Não somos uma agência de métricas de vaidade. Somos o parceiro que entende o seu fluxo de caixa e escala o seu lucro.
        </p>

        {/* CTA Button */}
        <a
          href="#contato"
          className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] uppercase"
        >
          Solicitar Diagnóstico <ArrowRight size={24} />
        </a>
      </div>
    </section>
  );
}
