import {FormEvent, useState} from 'react';

const CONTACT_EMAIL = 'comercial@evolveds.pt';

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
        title: 'Evolve Bronze',
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
        title: 'Evolve Silver',
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
        title: 'Evolve Gold',
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
        title: 'Evolve Bespoke',
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
    {number: '01', title: 'Briefing', text: 'Recolhemos informação, serviços, contactos, estilo visual e objetivos.'},
    {number: '02', title: 'Design', text: 'Criamos a estrutura visual e o conteúdo base do website.'},
    {
        number: '03',
        title: 'Construção',
        text: 'Desenvolvemos o website responsivo com formulários e contactos rápidos.'
    },
    {number: '04', title: 'Lançamento', text: 'Configuramos domínio, alojamento e colocamos o website online.'},
];

function App() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        business: '',
        pack: 'Tenho interesse no Bronze',
        message: '',
    });

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({...current, [field]: value}));
    };

    const sendLead = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = form.name || 'Cliente';
        const subject = `Pedido de proposta — ${form.business || name}`;
        const body = [
            `Olá Evolve, sou ${name}.`,
            '',
            `Empresa: ${form.business}`,
            `Telefone: ${form.phone}`,
            `Interesse: ${form.pack}`,
            '',
            `Mensagem: ${form.message}`,
        ].join('\n');

        const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = url;
    };

    return (
        <>
            <header>
                <a className="logo" href="#">EVOLVE</a>
                <nav>
                    <a href="#solucao">Solução</a>
                    <a href="#pacotes">Pacotes</a>
                    <a href="#care">Care</a>
                    <a href="#processo">Processo</a>
                    <a href="#contacto">Contacto</a>
                </nav>
                <a className="nav-btn" href="#contacto">Pedir proposta</a>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-inner">
                        <p className="kicker">Websites premium para negócios locais</p>
                        <h1>A sua empresa. Mais profissional online.</h1>
                        <p className="lead">Criamos websites modernos, responsivos e orientados para contactos,
                            marcações e pedidos de orçamento.</p>
                        <div className="actions">
                            <a className="btn btn-dark" href="#pacotes">Ver pacotes</a>
                            <a className="btn btn-light" href="#contacto">Pedir proposta</a>
                        </div>
                    </div>
                </section>

                <section className="statement">
                    <h2>Não criamos apenas websites. Criamos presença digital que transmite confiança antes do primeiro
                        contacto.</h2>
                </section>

                <section id="solucao">
                    <div className="section-title">
                        <p className="kicker">A solução</p>
                        <h2>Simples. Premium. Funcional.</h2>
                        <p>A Evolve desenvolve websites para negócios que precisam de parecer mais profissionais,
                            explicar melhor os seus serviços e facilitar o contacto com clientes.</p>
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
                            <article className={`plan${plan.featured ? ' featured' : ''}`} key={plan.title}>
                                <span className="tag">{plan.tag}</span>
                                <span className="num">{plan.number}</span>
                                <h3>{plan.title}</h3>
                                <p className="subtitle">{plan.subtitle}</p>
                                <div className="price">{plan.price}<small>{plan.note}</small></div>
                                <ul>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
                                <div className="bottom">{plan.bottom}</div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="care" id="care">
                    <div className="section-title">
                        <p className="kicker">Evolve Care</p>
                        <h2>Gestão e manutenção obrigatória durante 12 meses.</h2>
                        <p>Todos os websites incluem plano Care para garantir funcionamento, suporte, alojamento,
                            backups e atualizações.</p>
                    </div>
                    <div className="care-grid">
                        {carePlans.map((carePlan) => (
                            <article className="care-card" key={carePlan.title}>
                                <span className="num">{carePlan.number}</span>
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
                    <div className="process-grid">
                        {steps.map((step) => (
                            <div className="process-step" key={step.number}>
                                <span className="num">{step.number}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        ))}
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
                            <input value={form.name} onChange={(event) => updateField('name', event.target.value)}
                                   placeholder="Nome"/>
                            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)}
                                   placeholder="Telefone"/>
                            <input value={form.business}
                                   onChange={(event) => updateField('business', event.target.value)}
                                   placeholder="Nome da empresa"/>
                            <select value={form.pack} onChange={(event) => updateField('pack', event.target.value)}>
                                <option>Tenho interesse no Bronze</option>
                                <option>Tenho interesse no Silver</option>
                                <option>Tenho interesse no Gold</option>
                                <option>Tenho interesse no Bespoke</option>
                                <option>Ainda não sei</option>
                            </select>
                            <textarea value={form.message}
                                      onChange={(event) => updateField('message', event.target.value)}
                                      placeholder="Explique brevemente o que pretende"/>
                            <button type="submit">Pedir proposta por email</button>
                        </form>
                    </div>
                </section>

                <section className="final">
                    <p className="kicker">Evolve Digital</p>
                    <h2>Websites premium para negócios que querem parecer melhores online.</h2>
                    <div className="actions">
                        <a className="btn btn-final" href="#contacto">Pedir proposta</a>
                    </div>
                </section>
            </main>

            <footer>
                <strong>EVOLVE</strong>
                <span>Digital Growth & Premium Websites</span>
            </footer>
        </>
    );
}

export default App;
