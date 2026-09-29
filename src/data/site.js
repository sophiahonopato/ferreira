/**
 * CONTEÚDO DO SITE — fonte única de verdade.
 * Todos os textos vêm do site atual (pauloferreiraadvogados.com.br), apenas reorganizados.
 * Itens marcados com [PREENCHER] ou [CONFIRMAR] dependem do escritório.
 */

export const BRAND = {
  name: 'Paulo F. Ferreira Advogados',
  legalName: 'Paulo F. Ferreira - Sociedade Individual de Advocacia',
  kind: 'Sociedade Individual de Advocacia',
  tagline: 'Direito que conecta pessoas, negócios e oportunidades.',
  // [PREENCHER] Salvar o logo oficial em /public/brand/logo.svg (ou .png)
  // e informar o caminho aqui. Enquanto for null, o site usa o monograma "PF".
  logoSrc: null,
};

/**
 * Quando o aparelho pede menos movimento (Windows: "Efeitos de animação" desligado;
 * Android: "Remover animações" ou economia de bateria):
 *  'calm'   mantém o 3D guiado pelo scroll, sem movimentos automáticos (padrão)
 *  'static' mostra a versão vetorizada
 */
export const EXPERIENCE = { reducedMotion: 'calm' };

export const CONTACT = {
  // Endereço informado pelo cliente para o novo site.
  // [CONFIRMAR] O site atual ainda exibe Alameda dos Maracatins, 1435 (Indianópolis).
  address: {
    street: 'Av. Adolfo Pinheiro, 1029 - Sala 103',
    district: 'Alto da Boa Vista',
    city: 'São Paulo - SP',
    zip: '04733-100',
  },
  mapsQuery: 'Av. Adolfo Pinheiro, 1029, Alto da Boa Vista, São Paulo - SP, 04733-100',
  email: 'paulo@pauloferreiraadvogados.com.br',
  phone: { label: '(11) 5542-1895', href: 'tel:+551155421895' },
  whatsapp: {
    label: '(11) 95861-1479',
    href: 'https://api.whatsapp.com/send?phone=5511958611479&text=' +
      encodeURIComponent('Olá, gostaria de conversar sobre o meu caso.'),
  },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/paulofferreiraadvogados/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/dr-paulo-f-ferreira-advogados/' },
    { label: 'Facebook', href: 'https://www.facebook.com/pg/paulofferreiraadvogados/' },
  ],
};

export const NAV = [
  { label: 'O Escritório', href: '#escritorio' },
  { label: 'Áreas de Atuação', href: '#areas-de-atuacao' },
  { label: 'Corpo Jurídico', href: '#corpo-juridico' },
  { label: 'Contato', href: '#contato' },
];

/**
 * Capítulos da narrativa 3D. `stage` = índice do estado das partículas
 * (ver src/three/lib/stages.js). `side` = lado do texto no desktop.
 */
export const CHAPTERS = [
  {
    id: 'inicio',
    stage: 0,
    side: 'hero',
  },
  {
    id: 'escritorio',
    stage: 1,
    side: 'left',
    marker: '§ 1',
    kicker: 'O Escritório',
    title: 'Formação sólida, tratamento artesanal.',
    body: [
      'O escritório nasceu da união de advogados com sólida formação acadêmica e ampla experiência nas mais diversas áreas do Direito, com o propósito de crescer sem perder a maneira artesanal de tratar as demandas de cada cliente.',
    ],
  },
  {
    id: 'atendimento',
    stage: 2,
    side: 'right',
    marker: '§ 2',
    kicker: 'Atendimento',
    title: 'Cada caso é analisado minuciosamente.',
    body: [
      'Para cada caso, a equipe realiza um profundo debate interno em busca da melhor solução jurídica, com dedicação e agilidade. Equipes adaptadas às necessidades de cada cliente e de cada projeto.',
    ],
  },
  {
    id: 'direito',
    stage: 3,
    side: 'left',
    marker: '§ 3',
    kicker: 'Direito',
    title: 'Soluções legais, robustas e criativas.',
    body: [
      'Prevenção de demandas, assessoria e consultoria jurídica como instrumentos de planejamento e otimização das atividades de pessoas e empresas — de forma eficaz, ágil e com menor custo.',
    ],
  },
  {
    id: 'direito-imigratorio',
    stage: 4,
    side: 'right',
    marker: '§ 4',
    kicker: 'Direito Imigratório',
    title: 'Conectando pessoas, negócios e oportunidades além das fronteiras.',
    body: [
      'Emissão e regularização de visto nacional e estrangeiro. Defesa e assessoria a estrangeiros residentes no país, e a brasileiros em outros países.',
    ],
    note: 'Uma das especialidades dentro da atuação ampla do escritório.',
  },
  {
    id: 'mapa',
    stage: 5,
    side: 'left',
    marker: '§ 5',
    kicker: 'Fronteiras',
    title: 'Da documentação ao destino.',
    body: [
      'Obtenção de vistos e registro de operações no Banco Central, estruturação jurídica de negócios entre sócios residentes e não residentes, e acompanhamento de processos de extradição.',
    ],
  },
  {
    id: 'atuacao-internacional',
    stage: 6,
    side: 'right',
    marker: '§ 6',
    kicker: 'Atuação Internacional',
    title: 'Do Brasil para os Estados Unidos, a Europa e outros mercados.',
    body: [
      'Equipe jurídica atuante em mais de 40 países nas esferas penal, administrativa e tributária, em cooperação com escritórios estrangeiros. Contratos internacionais, due diligence, fusões e aquisições e pareceres (legal opinion).',
    ],
  },
  {
    id: 'brasil',
    stage: 7,
    side: 'left',
    marker: '§ 7',
    kicker: 'Brasil',
    title: 'Presença firme junto às instituições.',
    body: [
      'Atuação, representação e assistência junto ao Ministério da Justiça, Ministério Público Federal, Polícia Federal e Justiça Federal. No contencioso e no consultivo, sempre em busca do equilíbrio entre a justiça e o direito.',
    ],
  },
];

export const QUOTE = {
  text: 'A injustiça num lugar qualquer é uma ameaça à justiça em todo o lugar.',
  author: 'Martin Luther King Jr.',
};

/** Áreas de atuação — textos do site atual. */
export const AREAS = [
  {
    id: 'direito-tributario',
    name: 'Direito Tributário',
    summary: 'Defesa do contribuinte nas esferas federal, estadual e municipal, no contencioso administrativo e judicial.',
    items: [
      'Consultivo tributário federal, estadual e municipal',
      'Planejamento tributário e due diligence tributária',
      'Revisão fiscal e recuperação de créditos tributários',
      'Litigioso tributário federal, estadual e municipal',
      'Defesas e recursos em processos administrativos (autuações e multas)',
      'Defesas e acompanhamento em processos judiciais, incluindo execuções fiscais',
    ],
  },
  {
    id: 'direito-civil',
    name: 'Direito Civil',
    summary: 'Consultoria e defesas cíveis, patrimônio, família e sucessões, contratos e direito do consumidor.',
    items: [
      'Direito imobiliário: locação, condomínio, compra e venda, posse, usucapião',
      'Responsabilidade civil: danos materiais e morais',
      'Família e sucessões: inventário, testamento, divórcio, guarda, adoção',
      'Direito do consumidor: práticas abusivas, contratos, cobranças',
      'Gestão e planejamento patrimonial, compliance e contencioso em geral',
      'Elaboração de contratos',
    ],
  },
  {
    id: 'direito-criminal',
    name: 'Direito Criminal',
    summary: 'Contencioso processual penal e consultivo, na defesa ou na assistência à acusação.',
    items: [
      'Crimes tributários, financeiros, ambientais e de lavagem de capitais',
      'Crimes econômicos, falimentares, contra as relações de consumo e contra a honra',
      'Crimes eleitorais e da competência do Tribunal do Júri',
      'Inquéritos, ações penais e atuação nos tribunais',
      'Assessoria à vítima e acompanhamento junto ao Ministério Público',
      'Elaboração de pareceres',
    ],
  },
  {
    id: 'direito-empresarial',
    name: 'Direito Empresarial',
    summary: 'Contratos de todas as naturezas, nacionais ou internacionais, com atuação preventiva e estratégica.',
    items: [
      'Elaboração, análise e negociação de contratos',
      'Gerenciamento, controles e fluxos contratuais',
      'Pareceres e consultas com atuação preventiva',
      'Auditoria em contratos',
      'Contencioso arbitral e judicial',
      'Direito societário e compliance',
    ],
  },
  {
    id: 'direito-trabalhista',
    name: 'Direito Trabalhista',
    summary: 'Prevenção e estratégia, consultivo e litigioso trabalhista, individual e coletivo.',
    items: [
      'Instrumentos de contratação, acordos coletivos e políticas internas',
      'Planos de participação nos lucros',
      'Análise de contingências em cisões, fusões e aquisições',
      'Defesas administrativas e em segurança do trabalho',
      'Defesas perante o Ministério Público do Trabalho e em todas as instâncias',
    ],
  },
  {
    id: 'direito-internacional',
    name: 'Direito Internacional',
    summary: 'Direito Internacional Público e Privado, com cooperação com escritórios estrangeiros.',
    items: [
      'Preparação e revisão de contratos internacionais',
      'Estruturação jurídica entre sócios residentes e não residentes',
      'Legal due diligence, fusões e aquisições',
      'Redação de pareceres (legal opinion)',
      'Registro de operações no Banco Central',
      'Investigação fiscal e criminal junto a órgãos federais',
    ],
  },
  {
    // [CONFIRMAR] No site atual estes serviços estão dentro de "Direito Internacional".
    // Aqui aparecem agrupados como área própria, conforme o briefing do novo site.
    id: 'direito-imigratorio',
    name: 'Direito Imigratório',
    summary: 'Vistos, regularização e defesa de estrangeiros no Brasil e de brasileiros no exterior.',
    items: [
      'Emissão e regularização de visto nacional e estrangeiro',
      'Defesa e assessoria criminal de estrangeiro residente no país',
      'Assessoria em outros países',
      'Extradição',
    ],
  },
];

/**
 * CORPO JURÍDICO
 * Para adicionar um integrante: trocar um objeto `placeholder: true` pelos dados reais.
 * Fotos: salvar em /public/images/equipe/ (sugestão: 800x1000, JPG/WebP).
 */
export const TEAM = [
  {
    name: 'Paulo Cesar da Silva Ferreira',
    role: 'Advogado',
    // [PREENCHER] OAB não publicada no site atual
    oab: null,
    // [PREENCHER] Copiar a foto do site atual: /assets/img/equipe/paulo-cesar.jpg
    photo: '/images/equipe/paulo-cesar.jpg',
    bio: [
      'Bacharel em Direito (2005)',
      'Doutorado em Direito Penal e Processo Penal pela PUC',
      'Mestrado em Direito Ambiental',
      'Pós-graduado em Direito Público (Direitos Difusos e Coletivos) e em Direito Penal e Processo Penal',
      'Especialista em Direito Público e Crimes Eleitorais pela PUC',
      'Juiz Arbitral, Conciliador e Mediador',
      'Membro do Conselho Federal dos Parlamentares (Procurador)',
      'Autor do livro “Crimes Eleitorais e Corrupção Eleitoral” (Editora Livronovo)',
    ],
    languages: 'Inglês, espanhol e japonês fluentes. Mandarim em curso.',
    areas: ['Direito Penal', 'Direito Público', 'Direito Eleitoral'],
    linkedin: null,
  },
  {
    placeholder: true,
    name: 'Advogado(a) — modelo',
    role: '[Cargo]',
    oab: '[OAB/SP nº]',
    photo: null,
    bio: ['[Mini bio: formação e experiência]'],
    languages: '[Idiomas]',
    areas: ['[Área de atuação]'],
    linkedin: null,
  },
  {
    placeholder: true,
    name: 'Advogado(a) — modelo',
    role: '[Cargo]',
    oab: '[OAB/SP nº]',
    photo: null,
    bio: ['[Mini bio: formação e experiência]'],
    languages: '[Idiomas]',
    areas: ['[Área de atuação]'],
    linkedin: null,
  },
];
