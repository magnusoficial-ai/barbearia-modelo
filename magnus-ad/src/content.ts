/**
 * Todo o texto do comercial fica aqui.
 * Troque as frases à vontade: os componentes leem deste arquivo.
 * Frases longas demais podem quebrar linha em lugares feios no formato vertical,
 * então confira no Remotion Studio (npm run dev) depois de editar.
 */

export const brand = {
  name: 'MAGNUS',
  handle: '@magnus.ia',
  cta: 'Fale com a Magnus',
  slogan: 'O futuro não espera. Seja Magnus.',
};

// CENA 1: o problema
export const problem = {
  closedLabel: 'Expediente encerrado às 18h',
  clock: '23:47',
  appName: 'WhatsApp',
  justNow: 'agora',
  unreadSingular: 'mensagem sem resposta',
  unreadPlural: 'mensagens sem resposta',
  // Em ordem de chegada. O corte de 15s usa só as 3 primeiras.
  notifications: [
    {from: 'Mariana', text: 'Oi, ainda tá aberto?'},
    {from: 'Carlos', text: 'Quanto custa?'},
    {from: 'Júlia', text: 'Alguém aí?'},
    {from: 'Mariana', text: 'Deixa, vou ver em outro lugar.'},
  ],
  headline: 'Seu cliente\nnão espera.',
};

// CENA 3: o cubo
export const system = {
  title: 'Um sistema.',
  subtitle: 'Seu negócio no automático.',
};

// CENA 4: produtos (o nome curto aparece gravado nas faces do cubo)
export const products = {
  sites: {
    index: '01',
    name: 'Sites',
    headline: 'Site pronto para o Google e para o celular.',
    badge: 'No ar em 7 dias',
    demo: {
      url: 'casanovaimoveis.com.br',
      business: 'Casa Nova',
      nav: ['Comprar', 'Alugar', 'Contato'],
      heroTitle: 'Seu próximo endereço está aqui.',
      heroCta: 'Agendar visita',
      cards: ['Casa · 3 quartos', 'Apartamento · 2 quartos', 'Sala comercial'],
    },
  },
  atende: {
    index: '02',
    name: 'Atende',
    headline: 'Responde às 3h da manhã e fecha o pedido.',
    badge: '24h. Sem folga.',
    demo: {
      business: 'Forno da Vila',
      initials: 'FV',
      status: 'online',
      time: '03:12',
      messages: [
        {from: 'cliente', text: 'Ainda dá pra pedir?'},
        {from: 'ia', text: 'Dá sim! Calabresa grande, chega em 35 min. Confirmo?'},
        {from: 'cliente', text: 'Pode confirmar.'},
      ],
      confirmation: 'Pedido confirmado',
      aiLabel: 'IA Magnus',
    },
  },
  agenda: {
    index: '03',
    name: 'Agenda',
    headline: 'Marca, confirma e lembra. Sozinha.',
    demo: {
      business: 'Studio Bela',
      day: 'Quinta-feira',
      slots: [
        {time: '09:00', text: 'Ana · Escova', status: 'Confirmado'},
        {time: '10:30', text: 'Júlia · Corte', status: 'Confirmado'},
        {time: '14:00', newTime: '16:00', text: 'Carla · Manicure', status: 'Remarcado'},
        {time: '17:30', text: 'Rita · Coloração', status: 'Confirmado'},
      ],
      reminderTitle: 'Lembrete enviado',
      reminderText: 'Paula, seu horário é amanhã às 9h.',
    },
  },
  flow: {
    index: '04',
    name: 'Flow',
    headline: 'Lead entra. Tudo acontece.',
    steps: [
      {icon: 'whatsapp', label: 'WhatsApp', detail: 'Lead chega'},
      {icon: 'sheet', label: 'Planilha', detail: 'Dados salvos'},
      {icon: 'mail', label: 'E-mail', detail: 'Proposta enviada'},
      {icon: 'crm', label: 'CRM', detail: 'Venda no funil'},
    ],
  },
  pulse: {
    index: '05',
    name: 'Pulse',
    headline: 'Seus números, ao vivo.',
    live: 'Ao vivo',
    leadsLabel: 'Leads no mês',
    leads: 1248,
    growth: '+142%',
    roiLabel: 'Retorno sobre o investimento',
    roi: 4.7,
    disclaimer: 'Simulação. Valores ilustrativos.',
  },
  voz: {
    index: '06',
    name: 'Voz',
    headline: 'Atende o telefone com voz natural.',
    demo: {
      business: 'Clínica Bem-Estar',
      status: 'Chamada em andamento',
      agent: 'Atendente de IA',
      speech: 'Alô, Clínica Bem-Estar, posso ajudar?',
    },
  },
} as const;

export type ProductKey = keyof typeof products;
export const productOrder: ProductKey[] = ['sites', 'atende', 'agenda', 'flow', 'pulse', 'voz'];

// CENA 5: nichos (os ícones ficam em src/components/icons.ts)
export const niches = {
  headline: 'Feito para quem faz\no Brasil girar.',
  items: [
    {icon: 'clinica', label: 'Clínicas'},
    {icon: 'restaurante', label: 'Restaurantes'},
    {icon: 'imobiliaria', label: 'Imobiliárias'},
    {icon: 'salao', label: 'Salões'},
    {icon: 'loja', label: 'Lojas'},
    {icon: 'advocacia', label: 'Advocacia'},
  ],
} as const;
