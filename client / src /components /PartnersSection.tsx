import { Award, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const partners = [
  { name: 'Google Partner', icon: Award },
  { name: 'Meta Partner', icon: ShieldCheck },
  { name: 'RD Station', icon: Zap },
  { name: 'Shopify Experts', icon: TrendingUp },
];

export default function PartnersSection() {
  return (
    <div className="bg-card py-8 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, i) => {
            const Icon = partner.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground"
              >
                <span className="text-accent">
                  <Icon size={16} />
                </span>
                {partner.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
