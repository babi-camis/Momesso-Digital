import {
  Target,
  Monitor,
  Sparkles,
  TrendingUp,
  Search,
  Layers,
  Video,
  CheckCircle,
} from 'lucide-react';

const services = [
  {
    title: 'Tráfego Pago',
    description:
      'Gestão agressiva de campanhas no Google, Meta e TikTok Ads focada exclusivamente em ROI e escala.',
    icon: Target,
    features: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Retargeting'],
  },
  {
    title: 'Desenvolvimento Web',
    description:
      'Criação de Landing Pages, Sites Institucionais e E-commerces otimizados para alta conversão e velocidade.',
    icon: Monitor,
    features: ['Landing Pages', 'E-commerce', 'Institucionais', 'Otimização UX/UI'],
  },
  {
    title: 'Branding e Rebranding',
    description:
      'Construção de identidades visuais memoráveis e reformulação de marcas que precisam de um posicionamento premium.',
    icon: Sparkles,
    features: ['Identidade Visual', 'Naming', 'Manual da Marca', 'Design System'],
  },
  {
    title: 'Posicionamento de Marca',
    description:
      'Estratégia de comunicação e percepção de valor para tornar a sua empresa a autoridade máxima do seu nicho.',
    icon: TrendingUp,
    features: ['Tom de Voz', 'Estratégia de Conteúdo', 'Diferenciação', 'Arquétipos'],
  },
  {
    title: 'SEO',
    description:
      'Colocamos o seu negócio no topo das pesquisas do Google de forma orgânica, gerando tráfego qualificado gratuito.',
    icon: Search,
    features: ['SEO On-page', 'SEO Local (GMN)', 'Link Building', 'Auditoria Técnica'],
  },
  {
    title: 'Social Media',
    description:
      'Transformamos as suas redes sociais num canal ativo de vendas, comunidade e construção de autoridade.',
    icon: Layers,
    features: ['Gestão de Conteúdo', 'Copywriting', 'Design de Posts', 'Análise de Métricas'],
  },
  {
    title: 'Captação e Edição de Vídeo',
    description:
      'Produção audiovisual estratégica desenhada para reter a atenção e escalar a conversão dos seus anúncios e conteúdos.',
    icon: Video,
    features: ['Criativos para Ads', 'Vídeos Institucionais', 'Reels e Shorts', 'Edição Dinâmica'],
  },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black text-foreground mb-20 uppercase tracking-tighter">
          Nosso Ecossistema de <span className="text-accent">Crescimento</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={i}
                className="bg-card p-10 rounded-2xl border border-border hover:border-accent/30 transition-all group"
              >
                <div className="mb-6 text-accent">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <CheckCircle size={14} className="text-accent" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
