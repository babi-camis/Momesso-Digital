import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 mt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-black text-xl italic">M</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-foreground">
                MOMESSO<span className="text-accent">DIGITAL</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transformamos estratégias digitais em resultados reais e mensuráveis para seu negócio.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-sm tracking-widest">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <a href="#sobre" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Clientes
                </a>
              </li>
              <li>
                <a href="#contato" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-sm tracking-widest">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Tráfego Pago
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Desenvolvimento Web
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  Branding
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                  SEO
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-black text-foreground uppercase text-sm tracking-widest">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={16} className="text-accent" />
                <a href="mailto:momessodigitalldns@gmail.com" className="hover:text-accent transition-colors">
                  momessodigitalldns@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone size={16} className="text-accent" />
                <a href="tel:+5543998579615" className="hover:text-accent transition-colors">
                  +55 (43) 99857-9615
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/momesso_digital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://linkedin.com/company/momesso-digital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>
            © {currentYear} Momesso Digital. Todos os direitos reservados. | Desenvolvido com propósito
          </p>
        </div>
      </div>
    </footer>
  );
}
