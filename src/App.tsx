import { FormEvent, useEffect, useRef, useState } from 'react';
import logo from './assets/logo1.png';
import logoSvg from './assets/logo1.svg';
import logoVet from './assets/LogoVetdaQuinta.png';
import logoFuneraria from './assets/LogoFunerariaRoma.png';
import BookingModal from './BookingModal';

type Plan = {
    number: string;
    tag: string;
    title: string;
    subtitle: string;
    price: string;
    note: string;
    items: string[];
    bottom: string;
    featured?: boolean;
};

type CarePlan = {
    number: string;
    title: string;
    price: string;
    note: string;
    items: string[];
};

type Step = {
    number: string;
    title: string;
    text: string;
};

const values = [
    {
        number: '01',
        title: 'Imagem profissional',
        text: 'Design moderno, minimalista e adaptado ao negócio.',
    },
    {
        number: '02',
        title: 'Mais contactos',
        text: 'Botões de contacto, email, formulários e pedidos rápidos.',
    },
    {
        number: '03',
        title: 'Gestão contínua',
        text: 'Manutenção obrigatória para manter o site online, atualizado e funcional.',
    },
];

const plans: Plan[] = [
    {
        number: '01',
        tag: 'Bronze',
        title: 'Evolve',
        subtitle: 'Presença online profissional, simples e moderna.',
        price: '199,99€',
        note: 'promoção lançamento · antes 399,99€',
        items: [
            'Landing page completa',
            'Design moderno e responsivo',
            'Contactos rápidos',
            'Integração com email',
            'Botão de chamada direta',
            'Adaptado a computador e telemóvel',
            'Implementação base: domínio + alojamento',
        ],
        bottom: 'Prazo médio: 7–10 dias úteis',
    },
    {
        number: '02',
        tag: 'Silver',
        title: 'Evolve',
        subtitle: 'Para empresas que querem gerar mais contactos.',
        price: '399,99€',
        note: 'promoção lançamento · antes 799,99€',
        items: [
            'Inclui Evolve Bronze',
            'Sistema de marcações',
            'Pedido de orçamento online',
            'Secção de avaliações',
            'Galeria de fotografias',
            'Formulários personalizados',
            '1 sessão de captação de conteúdo',
        ],
        bottom: 'Prazo médio: 7–10 dias úteis',
    },
    {
        number: '03',
        tag: 'Gold',
        title: 'Evolve',
        subtitle: 'Imagem premium, autoridade e maior personalização.',
        price: '749,99€',
        note: 'promoção lançamento · antes 1499,99€',
        items: [
            'Inclui Evolve Silver',
            'Website premium personalizado',
            'Estrutura de conversão avançada',
            'Animações premium',
            'Experiência visual tipo marcas premium',
            'Formulários avançados',
            'Captação premium de conteúdo',
        ],
        bottom: 'Prazo médio: 15–25 dias úteis',
        featured: true,
    },
    {
        number: '04',
        tag: 'Bespoke',
        title: 'Evolve',
        subtitle: 'Solução personalizada para necessidades específicas.',
        price: 'Sob consulta',
        note: 'desenvolvimento à medida',
        items: [
            'Sistemas de reservas',
            'Upload de fotos/vídeos',
            'Área privada',
            'Lojas online',
            'Funcionalidades exclusivas',
            'Automatizações',
            'Integrações personalizadas',
        ],
        bottom: 'Prazo médio: até 30 dias úteis',
    },
];

const carePlans: CarePlan[] = [
    {
        number: '01',
        title: 'Bronze Care',
        price: '39,99€',
        note: 'mensalidade · 12 meses',
        items: [
            'Alojamento do website',
            'Gestão técnica base',
            'Monitorização',
            'Backup mensal',
            'Pequenas alterações de texto/contactos',
            'Suporte por email',
        ],
    },
    {
        number: '02',
        title: 'Silver Care',
        price: '69,99€',
        note: 'mensalidade · 12 meses',
        items: [
            'Inclui Bronze Care',
            'Até 2 alterações mensais',
            'Atualização de imagens e conteúdo',
            'Inserção de campanhas/promoções',
            'Ajustes visuais simples',
            'Apoio prioritário',
        ],
    },
    {
        number: '03',
        title: 'Gold Care',
        price: '119,99€',
        note: 'mensalidade · 12 meses',
        items: [
            'Inclui Silver Care',
            'Alterações mensais frequentes',
            'Criação de novas secções simples',
            'Landing pages básicas',
            'Atualizações recorrentes',
            'Prioridade máxima de suporte',
        ],
    },
    {
        number: '04',
        title: 'Bespoke Care',
        price: 'Sob consulta',
        note: 'mensalidade · 12 meses',
        items: [
            'Gestão contínua do website',
            'Atualizações frequentes',
            'Desenvolvimento de novas funcionalidades',
            'Criação de páginas adicionais',
            'Apoio dedicado',
            'Soluções à medida',
        ],
    },
];

const steps: Step[] = [
    { number: '01', title: 'Briefing', text: 'Recolhemos informação, serviços, contactos, estilo visual e objetivos.' },
    { number: '02', title: 'Design', text: 'Criamos a estrutura visual e o conteúdo base do website.' },
    { number: '03', title: 'Construção', text: 'Desenvolvemos o website responsivo com formulários e contactos rápidos.' },
    { number: '04', title: 'Lançamento', text: 'Configuramos domínio, alojamento e colocamos o website online.' },
];

function App() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [business, setBusiness] = useState('');
    const [pack, setPack] = useState('Tenho interesse no Bronze');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);
    const [processAnimated, setProcessAnimated] = useState(false);
    const footerRef = useRef<HTMLElement>(null);
    const processRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setFooterVisible(true); },
            { threshold: 0.3 }
        );
        if (footerRef.current) observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { setProcessAnimated(entry.isIntersecting); },
            { threshold: 0.2 }
        );
        if (processRef.current) observer.observe(processRef.current);
        return () => observer.disconnect();
    }, []);

    const sendLead = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSending(true);

        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, business, pack, message }),
        });

        setIsSending(false);

        if (response.ok) {
            alert('Pedido enviado com sucesso!');
            setName('');
            setPhone('');
            setBusiness('');
            setPack('Tenho interesse no Bronze');
            setMessage('');
        } else {
            alert('Erro ao enviar pedido. Tente novamente.');
        }
    };

    return (
        <>
            {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
            <header>
                <img src={logo} alt="Evolve Solutions" className="logo-image" />
                <nav>
                    <a href="#solucao" onClick={() => setMenuOpen(false)}>Solução</a>
                    <a href="#pacotes" onClick={() => setMenuOpen(false)}>Pacotes</a>
                    <a href="#care" onClick={() => setMenuOpen(false)}>Care</a>
                    <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
                    <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
                </nav>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="nav-btn" onClick={() => setShowBooking(true)}>Agendar reunião</button>
                    <a className="nav-btn" href="#contacto">Pedir proposta</a>
                </div>
                <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                    <span /><span /><span />
                </button>
            </header>
            {menuOpen && (
                <div className="mobile-menu">
                    <a href="#solucao" onClick={() => setMenuOpen(false)}>Solução</a>
                    <a href="#pacotes" onClick={() => setMenuOpen(false)}>Pacotes</a>
                    <a href="#care" onClick={() => setMenuOpen(false)}>Care</a>
                    <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
                    <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
                    <button className="nav-btn" onClick={() => { setShowBooking(true); setMenuOpen(false); }}>Agendar reunião</button>
                    <a className="nav-btn" href="#contacto" onClick={() => setMenuOpen(false)}>Pedir proposta</a>
                </div>
            )}

            <main>
                <section className="hero">
                    <div className="hero-inner">
                        <p className="kicker">Websites premium para negócios locais</p>
                        <h1>A sua empresa. Mais profissional online.</h1>
                        <p className="lead">
                            Criamos websites modernos, responsivos e orientados para contactos,
                            marcações e pedidos de orçamento.
                        </p>
                        <div className="actions">
                            <button className="btn btn-light hero-cta-book" onClick={() => setShowBooking(true)}>Agendar reunião</button>
                            <a className="btn btn-light" href="#contacto">Pedir proposta</a>
                            <a className="btn btn-dark hero-cta-pacotes" href="#pacotes">Ver pacotes</a>
                        </div>
                    </div>
                </section>

                <section className="statement">
                    <div className="light-beam beam-1" />
                    <div className="light-beam beam-2" />
                    <div className="light-beam beam-3" />
                    <h2>
                        Não criamos apenas websites. Criamos presença digital que transmite
                        confiança antes do primeiro contacto.
                    </h2>
                </section>

                <section id="solucao">
                    <div className="section-title">
                        <p className="kicker">A solução</p>
                        <h2>Simples. Premium. Funcional.</h2>
                        <p>
                            A Evolve desenvolve websites para negócios que precisam de parecer
                            mais profissionais, explicar melhor os seus serviços e facilitar o
                            contacto com clientes.
                        </p>
                    </div>

                    <div className="grid-3">
                        {values.map((value) => (
                            <div className="value-card" key={value.number}>
                                <span>{value.number}</span>
                                <h3>{value.title}</h3>
                                <p>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="pacotes">
                    <div className="section-title">
                        <p className="kicker">Pacotes Evolve</p>
                        <h2>Escolha o nível certo para o seu negócio.</h2>
                        <p>Todos os valores acrescem IVA à taxa legal. Promoção de lançamento com desconto limitado.</p>
                    </div>

                    <div className="pricing-grid">
                        {plans.map((plan) => (
                            <article className={`plan plan-${plan.tag.toLowerCase()}${plan.featured ? ' featured' : ''}`} key={plan.title}>
                                <img src={logo} alt="Evolve" className="plan-logo" />
                                <span className="tag">{plan.tag}</span>
                                <p className="subtitle">{plan.subtitle}</p>
                                <div className="price">{plan.price}<small>{plan.note}</small></div>
                                <ul>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
                                <div className="bottom">{plan.bottom}</div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="care" id="care">
                    <div className="light-beam beam-1" />
                    <div className="light-beam beam-2" />
                    <div className="light-beam beam-3" />
                    <div className="section-title">
                        <p className="kicker">Evolve Care</p>
                        <h2>Gestão e manutenção obrigatória durante 12 meses.</h2>
                        <p>
                            Todos os websites incluem plano Care para garantir funcionamento,
                            suporte, alojamento, backups e atualizações.
                        </p>
                    </div>

                    <div className="care-grid">
                        {carePlans.map((carePlan) => (
                            <article className="care-card" key={carePlan.title}>
                                <h3>{carePlan.title}</h3>
                                <div className="care-price">{carePlan.price}<small>{carePlan.note}</small></div>
                                <ul>{carePlan.items.map((item) => <li key={item}>{item}</li>)}</ul>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="processo">
                    <div className="section-title">
                        <p className="kicker">Processo</p>
                        <h2>Da ideia ao website online.</h2>
                        <p>Um processo simples, rápido e pensado para negócios que não querem perder tempo.</p>
                    </div>

                    <div ref={processRef} className={`process-grid${processAnimated ? ' process-animated' : ''}`}>
                        {steps.map((step) => (
                            <div className="process-step" key={step.number}>
                                <span className="num">{step.number}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="partners">
                    <div className="partners-pill">
                        <div className="light-beam beam-1" />
                        <div className="light-beam beam-2" />
                        <div className="light-beam beam-3" />
                        <p className="kicker" style={{textAlign:'center',marginBottom:'32px',color:'#c8cdd5',position:'relative',zIndex:1}}>Empresas que confiam em nós</p>
                        <div className="partners-static" style={{position:'relative',zIndex:1}}>
                            <a href="https://vetdaquinta.pt" target="_blank" rel="noreferrer"><img src={logoVet} alt="Vet da Quinta" className="partner-logo" /></a>
                            <a href="https://agenciafunerariaroma.pt/" target="_blank" rel="noreferrer"><img src={logoFuneraria} alt="Funerária Roma" className="partner-logo" /></a>
                        </div>
                    </div>
                </section>

                <section id="contacto">
                    <div className="lead-box">
                        <div>
                            <p className="kicker">Pedido de proposta</p>
                            <h3>Quer melhorar a presença digital da sua empresa?</h3>
                            <p className="lead lead-box-text">Envie os dados e indicamos o pacote mais adequado.</p>
                        </div>

                        <form onSubmit={sendLead}>
                            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome" />
                            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefone" />
                            <input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Nome da empresa" />

                            <select value={pack} onChange={(event) => setPack(event.target.value)}>
                                <option>Tenho interesse no Bronze</option>
                                <option>Tenho interesse no Silver</option>
                                <option>Tenho interesse no Gold</option>
                                <option>Tenho interesse no Bespoke</option>
                                <option>Ainda não sei</option>
                            </select>

                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Explique brevemente o que pretende"
                            />

                            <button type="submit" disabled={isSending}>
                                {isSending ? 'A enviar...' : 'Pedir proposta por email'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="final">
                    <div className="light-beam beam-1" />
                    <div className="light-beam beam-2" />
                    <div className="light-beam beam-3" />
                    <p className="kicker">Evolve Digital</p>
                    <h2>Websites premium para negócios que querem parecer melhores online.</h2>
                    <div className="actions">
                        <a className="btn btn-final" href="#contacto">Pedir proposta</a>
                    </div>
                </section>
            </main>

            <footer ref={footerRef} className={footerVisible ? 'footer-visible' : ''}>
                <img src={logo} alt="Evolve" className="footer-logo" />
                <span>Digital Growth & Premium Websites</span>
            </footer>
        </>
    );
}

export default App;