import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'CEO da TechFlow',
    content:
      'A Momesso não é uma agência comum. Eles sentaram com a gente, entenderam as nossas dores e trataram o nosso negócio como se fosse deles.',
    image: 'AS',
  },
  {
    id: 2,
    name: 'Ricardo Mendes',
    role: 'Fundador da Aura E-commerce',
    content:
      'A transparência foi o diferencial. Sabíamos exatamente para onde o investimento ia e o retorno veio em 3 meses.',
    image: 'RM',
  },
  {
    id: 3,
    name: 'Carla Ferreira',
    role: 'Diretora de Marketing Grupo Prime',
    content:
      'Finalmente encontramos parceiros que se importam com os nossos lucros tanto quanto nós. Confiança total.',
    image: 'CF',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-32 bg-card border-y border-border">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-black mb-4 tracking-tight text-foreground uppercase">
          Vozes que confiam em nós
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-background p-10 rounded-2xl border border-border relative group text-left flex flex-col justify-between shadow-lg hover:border-accent/30 transition-all"
            >
              <div>
                <Quote className="text-accent/20 absolute top-8 right-8" size={40} />
                <p className="text-muted-foreground italic mb-10 relative z-10 leading-relaxed">
                  "{t.content}"
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 bg-border rounded-full flex items-center justify-center font-black text-foreground">
                  {t.image}
                </div>
                <div>
                  <h5 className="font-bold text-foreground">{t.name}</h5>
                  <p className="text-[10px] text-accent uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
