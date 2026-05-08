import { TrendingUp } from 'lucide-react';

const cases = [
  {
    company: 'Indústria Global Tech',
    metric: 'ROI 15.8x',
    description: 'Reestruturação de funil B2B com foco em leads qualificados.',
    sub: 'Crescimento sustentável e previsível.',
  },
  {
    company: 'E-commerce Premium',
    metric: '+410% Escala',
    description: 'Escalabilidade mantendo a essência da marca e rentabilidade.',
    sub: 'Aumento real de faturamento.',
  },
];

export default function CasesSection() {
  return (
    <section id="proposito" className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c, i) => (
            <div
              key={i}
              className="bg-card p-10 rounded-2xl border border-border hover:border-accent/30 shadow-lg relative overflow-hidden transition-all"
            >
              <TrendingUp
                className="absolute -top-4 -right-4 text-accent opacity-5"
                size={120}
              />
              <span className="text-accent font-black uppercase text-xs tracking-widest block mb-4">
                {c.company}
              </span>
              <div className="text-6xl font-black text-foreground mb-4">{c.metric}</div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{c.description}</p>
              <p className="text-muted-foreground font-bold uppercase tracking-tighter text-xs">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
