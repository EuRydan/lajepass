// ==========================================
// COMU — Mock Data
// Experiências, Picks, Comunidade, Produtores
// ==========================================

const CATEGORIES = {
  musica: { emoji: '<i class="ph ph-music-notes"></i>', label: 'Música', color: 'var(--color-purple)', colorRaw: '#8B5CF6' },
  festas: { emoji: '<i class="ph ph-confetti"></i>', label: 'Festas', color: 'var(--color-rose)', colorRaw: '#F43F7A' },
  bares: { emoji: '<i class="ph ph-martini"></i>', label: 'Bares', color: 'var(--color-amber)', colorRaw: '#F59E0B' },
  gastronomia: { emoji: '<i class="ph ph-fork-knife"></i>', label: 'Gastronomia', color: 'var(--color-teal)', colorRaw: '#2DD4BF' },
  cultura: { emoji: '<i class="ph ph-mask-happy"></i>', label: 'Cultura', color: 'var(--color-sky)', colorRaw: '#38BDF8' },
  esportes: { emoji: '<i class="ph ph-trophy"></i>', label: 'Esportes', color: '#10B981', colorRaw: '#10B981' },
  experiencias: { emoji: '<i class="ph ph-sparkle"></i>', label: 'Experiências', color: 'var(--color-gold)', colorRaw: '#FFB84D' },
};

// Coordenadas dos bairros no mapa (geográficas lat, lng e SVG em % — left, top)
const BAIRROS = {
  maracana:    { x: 42.5, y: 32.0, lat: -22.9121, lng: -43.2302, label: 'Maracanã' },
  lapa:        { x: 42.5, y: 46.5, lat: -22.9134, lng: -43.1819, label: 'Lapa' },
  santa_teresa:{ x: 46.0, y: 44.0, lat: -22.9254, lng: -43.1932, label: 'Santa Teresa' },
  centro:      { x: 43.5, y: 42.5, lat: -22.9064, lng: -43.1798, label: 'Centro' },
  ipanema:     { x: 34.0, y: 65.5, lat: -22.9836, lng: -43.2045, label: 'Ipanema' },
  copacabana:  { x: 37.5, y: 68.0, lat: -22.9698, lng: -43.1847, label: 'Copacabana' },
  leblon:      { x: 30.5, y: 65.0, lat: -22.9847, lng: -43.2231, label: 'Leblon' },
  barra:       { x: 17.0, y: 66.5, lat: -23.0016, lng: -43.3444, label: 'Barra da Tijuca' },
  botafogo:    { x: 39.0, y: 61.0, lat: -22.9519, lng: -43.1856, label: 'Botafogo' },
  gavea:       { x: 28.0, y: 60.5, lat: -22.9789, lng: -43.2329, label: 'Gávea' },
  tijuca:      { x: 42.0, y: 35.0, lat: -22.9351, lng: -43.2431, label: 'Tijuca' },
  flamengo:    { x: 41.5, y: 56.0, lat: -22.9372, lng: -43.1789, label: 'Flamengo' },
  glória:      { x: 42.0, y: 52.0, lat: -22.9214, lng: -43.1764, label: 'Glória' },
  urca:        { x: 40.5, y: 66.5, lat: -22.9554, lng: -43.1647, label: 'Urca' },
  catete:      { x: 41.8, y: 53.5, lat: -22.9272, lng: -43.1797, label: 'Catete' },
};

// Helper: generate dates relative to "today"
function getRelativeDate(daysFromNow, hours = 20, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function getDayOfWeek(date) {
  return date.getDay(); // 0=Sun, 6=Sat
}

function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisMonth(date) {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function isThisWeek(date) {
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  return date >= today && date <= endOfWeek;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
}

const EXPERIENCES = [
  {
    id: 'encontrin-di-proposito',
    name: 'Encontrin com Di Propósito',
    subtitle: 'Quintas Feiras @ Planetário da Gávea',
    category: 'musica',
    categories: ['musica', 'festas'],
    date: new Date('2026-09-03T21:00:00'),
    location: 'Planetário da Gávea',
    venue: 'Villa Gávea, no Planetário da Gávea',
    address: 'R. Vice-Governador Rubens Berardo, 100 - Gávea, Rio de Janeiro - RJ',
    bairro: 'gavea',
    description: 'O Encontrin com Di Propósito é a festa autoral do Di Propósito que rodou o Brasil e levou pagode, samba e alegria para os quatro cantos do país. Chegou a hora de fazermos um projeto bem intimista na nossa casa, o Rio de Janeiro. Nossas Quintas Feiras, a partir de agora, serão muito especiais: Di Propósito e convidados especiais, em formato de roda 360º graus, exclusivo para 500 pessoas. Um sonho, né? O local escolhido é o Villa Gávea, no Planetário da Gávea, no coração da Zona Sul. Vem pro Rio, vem pro Encontrin! #Pagode',
    fullDescription: [
      'O Encontrin com Di Propósito é a festa autoral do Di Propósito que rodou o Brasil e levou pagode, samba e alegria para os quatro cantos do país.',
      'Chegou a hora de fazermos um projeto bem intimista na nossa casa, o Rio de Janeiro. Nossas Quintas Feiras, a partir de agora, serão muito especiais: Di Propósito e convidados especiais, em formato de roda 360º graus, exclusivo para 500 pessoas. Um sonho, né?',
      'O local escolhido é o Villa Gávea, no Planetário da Gávea, no coração da Zona Sul.',
      'Vem pro Rio, vem pro Encontrin! #Pagode'
    ],
    image: 'public/encontrin-di-proposito.png',
    price: 'Ingressos na Ingresse (Cupom: BRAGA)',
    ticketUrl: 'https://embedstore.ingresse.com/tickets/www.ingresse.com/event/104283?passkey=BRAGA',
    ticketPartner: 'Ingresse',
    promoCode: 'BRAGA',
    vipListUrl: 'https://docs.google.com/forms/d/14L9gErjwC8RBl95x8fpNE-CNvgIWrbgchfQa9tqWUXk/viewform?edit_requested=true',
    birthdayConditionsUrl: 'http://tinyurl.com/AniversariosDespedidas',
    attractions: 'DI PROPÓSITO & Convidados Especiais',
    capacity: 'Exclusivo para 500 pessoas',
    format: 'Roda 360º graus',
    schedule: 'Quintas Feiras às 21h'
  },
  {
    id: 'the-fucking-party-open-bar',
    name: 'The Fucking Party Open Bar',
    subtitle: 'Open Bar @ Rio de Janeiro',
    category: 'festas',
    categories: ['festas', 'musica', 'experiencias'],
    date: new Date('2026-10-03T21:00:00'),
    location: 'Rio de Janeiro',
    venue: 'Espaço de Eventos — Rio de Janeiro',
    address: 'Rio de Janeiro - RJ',
    bairro: 'centro',
    description: 'A The Fucking Party está de volta ao Rio de Janeiro para sua segunda edição em 2026. Pra quem não conhece, somos mais que uma festa. Somos um momento. Uma memória. Ou melhor, várias delas. Somos esse sentimento que você não consegue descrever, mas fecha os olhos pra curtir. A gente não tem nome, mas uma coisa é certa, vamos dar o que falar! Dia 03 de Outubro, preparem-se para uma experiência surreal com muito funk, open format e bons amigos no Rio de Janeiro. Vem ser feliz com a gente!',
    fullDescription: [
      'A The Fucking Party está de volta ao Rio de Janeiro para sua segunda edição em 2026.',
      'Pra quem não conhece, somos mais que uma festa. Somos um momento. Uma memória. Ou melhor, várias delas. Somos esse sentimento que você não consegue descrever, mas fecha os olhos pra curtir.',
      'A gente não tem nome, mas uma coisa é certa, vamos dar o que falar! Dia 03 de Outubro, preparem-se para uma experiência surreal com muito funk, open format e bons amigos no Rio de Janeiro. Vem ser feliz com a gente!'
    ],
    image: 'public/the-fucking-party.png',
    price: 'Bilheteria Digital (Cupom: BRAGA)',
    ticketUrl: 'https://checkout2.bilheteriadigital.com/the-fucking-party-open-bar-premium-03-de-outubro?c=141506',
    ticketPartner: 'Bilheteria Digital',
    promoCode: 'BRAGA',
    birthdayConditionsUrl: 'http://tinyurl.com/AniversariosDespedidas',
    attractions: 'EM BREVE.',
    capacity: 'Open Bar Premium',
    format: 'Funk, Open Format & Open Bar',
    schedule: 'Sábado, 03/10 às 21h'
  },
  {
    id: '5521-06-anos-open-bar',
    name: '+5521 06 Anos Open Bar',
    subtitle: '04.09 @ Rio de Janeiro',
    category: 'musica',
    categories: ['musica', 'festas'],
    date: new Date('2026-09-04T21:00:00'),
    location: 'Rio de Janeiro',
    venue: 'Rio de Janeiro',
    address: 'Rio de Janeiro - RJ',
    bairro: 'leblon',
    description: 'A 5521 está completando 06 anos. Como o tempo voa! Parece que foi ontem que um grupo de amigos esbanjava alto astral pelos bares do Leblon no Rio de Janeiro. E de uma grande brincadeira que reunia muitos amigos com um pagodinho despretensioso, surgiu a tão amada festa 5521! A festa que tem o propósito de reunir amigos de todo o brasil ao redor do caldeirão laranja repleto de muito pagode e alegria. Dia 04 de Setembro, a 5521 completa 06 anos no Rio de Janeiro, em formato Premium Open Bar, durante o Feriado da Independencia. Vai ser histórico! #Pagode #FeriadodaIndependencia',
    fullDescription: [
      'A 5521 está completando 06 anos. Como o tempo voa!',
      'Parece que foi ontem que um grupo de amigos esbanjava alto astral pelos bares do Leblon no Rio de Janeiro.',
      'E de uma grande brincadeira que reunia muitos amigos com um pagodinho despretensioso, surgiu a tão amada festa 5521!',
      'A festa que tem o propósito de reunir amigos de todo o brasil ao redor do caldeirão laranja repleto de muito pagode e alegria.',
      'Dia 04 de Setembro, a 5521 completa 06 anos no Rio de Janeiro, em formato Premium Open Bar, durante o Feriado da Independencia.',
      'Vai ser histórico! #Pagode #FeriadodaIndependencia'
    ],
    image: 'public/5521-06-anos.png',
    price: 'Ingressos na Ingresse (Cupom: BRAGA)',
    ticketUrl: 'https://embedstore.ingresse.com/tickets/www.ingresse.com/event/104342?passkey=5521DOBRAGA',
    ticketPartner: 'Ingresse',
    promoCode: 'BRAGA',
    pixUrl: 'http://tinyurl.com/PIXSemTaxas',
    birthdayConditionsUrl: 'https://api.whatsapp.com/send?phone=5521966650815&text=Ol%C3%A1!%20Quero%20comemorar%20anivers%C3%A1rio/despedida%205521.%20Quais%20os%20benef%C3%ADcios?',
    attractions: 'RODA DA 5521 & Convidados Especiais',
    openBar: 'Gin Tanqueray, Vodka Ketel One, Red Bull, Cerveja Cacildis, Whisky Johnnie Walker Blonde. Bar de shots com: Bananazinha, Ballena, Don Luiz e Fireball.',
    capacity: 'Premium Open Bar',
    format: 'Roda de Pagode & Open Bar',
    schedule: 'Sexta-feira, 04/09 às 21h'
  },
  {
    id: 'trem-do-corcovado-cristo-redentor',
    name: 'Trem do Corcovado & Cristo Redentor (Acesso Sem Filas)',
    subtitle: 'Todos os dias · Saídas às 09h, 11h, 13h e 15h',
    category: 'experiencias',
    categories: ['experiencias', 'cultura'],
    date: new Date('2026-09-03T09:00:00'),
    location: 'Corcovado / Cosme Velho',
    venue: 'Estação Trem do Corcovado',
    address: 'Rua Cosme Velho, 513 - Cosme Velho, Rio de Janeiro - RJ',
    bairro: 'santa_teresa',
    description: 'Contemple o Rio de Janeiro de um dos pontos turísticos mais famosos do mundo, e sem ter de esperar na fila! O seu ingresso o leva em uma viagem de ida e volta em trem de plano inclinado pelo Morro do Corcovado. Uma vez no alto, ultrapasse as filas e veja a famosa estátua em todo o seu esplendor.',
    fullDescription: [
      'Contemple o Rio de Janeiro de um dos pontos turísticos mais famosos do mundo, e sem ter de esperar na fila! O seu ingresso o leva em uma viagem de ida e volta em trem de plano inclinado pelo Morro do Corcovado.',
      'Uma vez no alto, ultrapasse as filas e veja a famosa estátua em todo o seu esplendor. Uma das novas Sete Maravilhas do Mundo, e cartão postal da cidade, apenas à distância de uma viagem de trem. Vai subir ou ficar só a olhar cá de baixo?',
      'Compre já os seus ingressos para Trem do Corcovado e acesso sem filas ao Cristo Redentor, no Rio de Janeiro!'
    ],
    highlights: [
      '🚡 Suba e desça o Morro do Corcovado em um trem de plano inclinado',
      '🚀 Ultrapasse as filas para ver o famoso Cristo Redentor em todo o seu esplendor',
      '😎 Contemple toda a beleza e encanto da Cidade Maravilhosa desde o alto'
    ],
    infoList: [
      '📅 Data: Todos os dias',
      '🕒 Horários: às 09h, 11h, 13h e 15h',
      '⏳ Duração: 20 minutos (cada direção)',
      '📍 Localização: Estação Trem do Corcovado (Rua Cosme Velho, 513)',
      '👤 Idade: Apto para todas as idades (grátis até 5 anos no colo do responsável)',
      '♿ Acessibilidade: Atividade acessível para cadeirantes',
      '📱 Entrada: Confirmação e ingresso digital via e-mail',
      '❓ Cancelamento: Vendas definitivas, não reembolsáveis nem passíveis de troca'
    ],
    image: 'public/trem-do-corcovado.jpg',
    price: 'Ingresso Adulto (a partir dos 12 anos)',
    ticketUrl: 'https://docs.google.com/document/d/e/2PACX-1vQyTk3AiBNjOm4HjbIdCNc4pNzUUe7O5U5sDuB0WIXwqSubKrtZnsjiO9iTXhPdYl9dgPrTSmYibSz9/pub',
    ticketPartner: 'Trem do Corcovado Oficial',
    termsUrl: 'https://docs.google.com/document/d/e/2PACX-1vQyTk3AiBNjOm4HjbIdCNc4pNzUUe7O5U5sDuB0WIXwqSubKrtZnsjiO9iTXhPdYl9dgPrTSmYibSz9/pub',
    capacity: 'Acesso Sem Filas',
    format: 'Passeio Turístico & Trem',
    schedule: 'Todos os dias às 09h, 11h, 13h e 15h'
  },
  {
    id: 'pearl-jam-symphonic',
    name: 'Pearl Jam Symphonic com Black Circle + Nova Orquestra',
    subtitle: '02 de Novembro (Feriado) às 20h @ Teatro Multiplan VillageMall',
    category: 'musica',
    categories: ['musica', 'cultura'],
    date: new Date('2026-11-02T20:00:00'),
    location: 'Barra da Tijuca, Rio de Janeiro',
    venue: 'Teatro Multiplan - VillageMall',
    address: 'Av. das Américas, 3900 - Piso SS1 - Barra da Tijuca, Rio de Janeiro - RJ',
    bairro: 'barra',
    description: 'Projeto sinfônico que homenageia o Pearl Jam reúne orquestra e banda apadrinhada por Eddie Vedder. No projeto Pearl Jam Symphonic a Black Circle executa clássicos do Pearl Jam com arranjo de orquestra, além de surpresas grunge para o público.',
    fullDescription: [
      'Projeto sinfônico que homenageia o Pearl Jam reúne orquestra e banda apadrinhada por Eddie Vedder.',
      'No projeto “Pearl Jam Symphonic” a Black Circle executa clássicos do Pearl Jam com arranjo de orquestra, além de algumas “surpresas grunge” para o público. O espetáculo é arranjado e regido por Dhouglas Umabel, violinista da Ospa (Orquestra Sinfônica de Porto Alegre), uma das orquestras mais respeitadas da América Latina.',
      'Em quase duas horas de show, o público irá presenciar um espetáculo feito de fã para fã, revisitando todos os álbuns do grupo de Seattle e todas as fases dessa banda que marcou história. Em 2026 o projeto entra em sua terceira temporada, com um repertório novo, homenageando além do Pearl Jam, outras bandas de Seattle.',
      'A direção artística é de Sérgio Filho e a produção executiva é de Mauricio Trilha, especialista na criação de espetáculos do gênero.'
    ],
    attractions: 'Black Circle & Nova Orquestra (Regência: Dhouglas Umabel)',
    highlights: [
      '🎸 Clássicos do Pearl Jam e do movimento grunge de Seattle com arranjo orquestral ao vivo',
      '🎻 Regência por Dhouglas Umabel (violinista da OSPA)',
      '✨ Quaze duas horas de espetáculo épico no Teatro Multiplan VillageMall',
      '🎟️ Descontos exclusivos para clientes participantes do programa Multi (App Multi)'
    ],
    infoList: [
      '📅 Data: 02 de Novembro de 2026 (Feriado) às 20h',
      '⏳ Duração: 110 minutos | Classificação: Livre',
      '📍 Local: Teatro Multiplan - VillageMall (Piso SS1)',
      '🎟️ Descontos Multi: Green 10% / Silver 15% / Gold 20% / Platinum 25% (via App Multi)',
      '🎓 Meia Entrada: Estudantes, menores de 21 anos, maiores de 60 anos, professores e PCD',
      '💳 Pagamento: Cartão de Crédito/Débito, Dinheiro, PIX e Boleto no site',
      '🏢 Bilheteria Física: Terça a Sábado das 13h às 21h e Domingo das 13h às 20h',
      '❓ Cancelamento: Até 48h antes do evento e dentro de 7 dias da compra (sac.bileto@sympla.com.br)'
    ],
    image: 'public/pearl-jam-symphonic.jpg',
    price: 'Ingressos na Sympla Bileto',
    ticketUrl: 'https://bileto.sympla.com.br/event/118528/d/375542?mp_rloc=O%2Bque%2Bfazer%2Bem%2BRio%2Bde%2BJaneiro&mp_rtil=O%2Bque%2Bfazer%2Bno%2BRio%2Bde%2BJaneiro%2Bhoje',
    ticketPartner: 'Sympla Bileto',
    capacity: 'Teatro Multiplan VillageMall',
    format: 'Show Sinfônico & Rock',
    schedule: 'Segunda-feira, 02/11 (Feriado) às 20h'
  },
  {
    id: 'sulamericano-volei-maracanazinho',
    name: 'Campeonato Sul-Americano de Vôlei',
    subtitle: '08 a 20 de Setembro @ Maracanãzinho',
    category: 'esportes',
    categories: ['esportes', 'experiencias'],
    date: new Date('2026-09-08T10:30:00'),
    location: 'Maracanãzinho, Rio de Janeiro',
    venue: 'Ginásio do Maracanãzinho',
    address: 'Rua Professor Eurico Rabelo, s/n - Maracanã, Rio de Janeiro - RJ',
    bairro: 'maracana',
    description: 'Do dia 08 a 20 de setembro, o Maracanãzinho recebe o Campeonato Sul-Americano de Vôlei, que inaugura o caminho para as vagas olímpicas de LA2028. Entre os dias 08 e 13, o time feminino entra em quadra, já do dia 15 a 20 é o time masculino que compete pela vaga.',
    fullDescription: [
      'Do dia 08 a 20 de setembro, o Maracanãzinho recebe o Campeonato Sul-Americano de Vôlei, que inaugura o caminho para as vagas olímpicas de LA2028.',
      'Entre os dias 08 e 13 de setembro, a Seleção Brasileira Feminina entra em quadra para disputar o título sul-americano e a vaga olímpica.',
      'Já entre os dias 15 e 20 de setembro, é a vez da Seleção Brasileira Masculina competir em grandes confrontos no templo do voleibol brasileiro.',
      'Os ingressos já estão à venda na Bilheteria Digital e no ponto de venda presencial.'
    ],
    highlights: [
      '🏐 Disputa pelas vagas olímpicas para os Jogos Olímpicos de Los Angeles (LA2028)',
      '🇧🇷 Seleção Feminina: 08 a 13 de Setembro (Clássico Brasil x Argentina em 13/09 às 10h30)',
      '🇧🇷 Seleção Masculina: 15 a 20 de Setembro (Clássico Brasil x Argentina em 20/09 às 10h)',
      '🏟️ O retorno das grandes competições internacionais de voleibol ao mítico Maracanãzinho'
    ],
    infoList: [
      '📅 Jogos Vôlei Feminino: 08 a 10/09 (20h), 12/09 (10h30) e 13/09 (Brasil x Argentina às 10h30)',
      '📅 Jogos Vôlei Masculino: 15 a 17/09 (20h), 19/09 (11h) e 20/09 (Brasil x Argentina às 10h)',
      '📍 Local: Ginásio do Maracanãzinho (Rua Professor Eurico Rabelo, s/n)',
      '🏢 Ponto Físico: Banzai Tattoo — Shopping Downtown (Av. das Américas, 500, Bloco 6 Loja 117 - Seg a Sáb 11h às 19h30)',
      '📱 Ingressos Online: Disponíveis na Bilheteria Digital'
    ],
    image: 'public/sulamericano-volei.jpg',
    price: 'Ingressos na Bilheteria Digital',
    ticketUrl: 'https://sulamericano2026.bilheteriadigital.com/',
    ticketPartner: 'Bilheteria Digital',
    capacity: 'Ginásio do Maracanãzinho',
    format: 'Torneio Internacional de Vôlei',
    schedule: '08 a 20 de Setembro de 2026'
  }
];

const COMU_PICKS = [
  {
    experienceId: 'sulamericano-volei-maracanazinho',
    reason: 'O retorno do vôlei internacional ao Maracanãzinho com as seleções brasileiras disputando vagas para as Olimpíadas de LA2028.',
    curator: 'Equipe Comu'
  },
  {
    experienceId: 'pearl-jam-symphonic',
    reason: 'Encontro imperdível da Black Circle com a Nova Orquestra homenageando o Pearl Jam e clássicos de Seattle no Teatro Multiplan.',
    curator: 'Equipe Comu'
  },
  {
    experienceId: 'trem-do-corcovado-cristo-redentor',
    reason: 'Passeio imperdível de trem pelo Corcovado com acesso sem filas ao Cristo Redentor e vista panorâmica do Rio.',
    curator: 'Equipe Comu'
  },
  {
    experienceId: 'encontrin-di-proposito',
    reason: 'Projeto intimista em formato 360º no Planetário da Gávea com Di Propósito e convidados especiais. Exclusivo para 500 pessoas.',
    curator: 'Equipe Comu'
  },
  {
    experienceId: '5521-06-anos-open-bar',
    reason: 'Comemoração de 6 anos da 5521 em formato Premium Open Bar no feriado da Independência.',
    curator: 'Equipe Comu'
  },
  {
    experienceId: 'the-fucking-party-open-bar',
    reason: 'Segunda edição da festa mais comentada com open bar premium, muito funk e open format.',
    curator: 'Lucas, Comu Radar'
  }
];

const PASS_BENEFITS = [
  {
    icon: '<i class="ph ph-ticket"></i>',
    title: 'Descontos',
    description: 'Preços especiais em experiências, restaurantes e bares parceiros.',
  },
  {
    icon: '<i class="ph ph-list-dashes"></i>',
    title: 'Listas',
    description: 'Nome na lista VIP dos melhores eventos do Rio.',
  },
  {
    icon: '🚪',
    title: 'Acessos',
    description: 'Entrada em eventos exclusivos e fechados para a comunidade.',
  },
  {
    icon: '<i class="ph ph-star"></i>',
    title: 'Experiências',
    description: 'Vivências curadas que você não encontra em nenhum outro lugar.',
  },
  {
    icon: '💌',
    title: 'Convites',
    description: 'Convites para pré-estreias, aberturas e lançamentos.',
  },
  {
    icon: '📖',
    title: 'Conteúdos',
    description: 'Guias, recomendações e bastidores da cena carioca.',
  },
  {
    icon: '<i class="ph ph-users"></i>',
    title: 'Comunidade',
    description: 'Faça parte de uma rede de pessoas que vivem o Rio de verdade.',
  },
];

const COMMUNITY_STATS = [
  { value: 1247, label: 'Membros', suffix: '+' },
  { value: 85, label: 'Produtores', suffix: '' },
  { value: 42, label: 'Creators', suffix: '' },
  { value: 120, label: 'Lugares', suffix: '+' },
  { value: 340, label: 'Experiências', suffix: '+' },
];

const TESTIMONIALS = [
  {
    text: 'A Comu mudou minha relação com o Rio. Descobri lugares que nem sabia que existiam, e o melhor: sempre com gente boa.',
    name: 'Marina Costa',
    role: 'Membro Comu',
    avatar: '👩🏽',
  },
  {
    text: 'Como produtor, a Comu trouxe um público que realmente valoriza o que a gente faz. É parceria de verdade.',
    name: 'Lucas Tavares',
    role: 'Produtor, Sacadura 154',
    avatar: '👨🏾',
  },
  {
    text: 'Eu usava o Instagram pra descobrir rolê. Agora uso a Comu. A curadoria é absurda.',
    name: 'Beatriz Oliveira',
    role: 'Membro Comu',
    avatar: '👩🏻',
  },
];

const PRODUCER_BENEFITS = [
  {
    icon: '<i class="ph ph-target"></i>',
    title: 'Curadoria',
    description: 'Seu evento é apresentado para um público engajado e qualificado.',
  },
  {
    icon: '📢',
    title: 'Distribuição',
    description: 'Amplifique o alcance do seu evento através da nossa rede.',
  },
  {
    icon: '<i class="ph ph-users"></i>',
    title: 'Comunidade',
    description: 'Conecte-se com membros que buscam experiências autênticas.',
  },
  {
    icon: '🎁',
    title: 'Benefícios',
    description: 'Crie ofertas exclusivas para membros Comu e fidelize público.',
  },
  {
    icon: '📊',
    title: 'Dados',
    description: 'Entenda seu público com insights de engajamento e conversão.',
  },
];

// Export for module usage (if needed later)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORIES,
    EXPERIENCES,
    COMU_PICKS,
    PASS_BENEFITS,
    COMMUNITY_STATS,
    TESTIMONIALS,
    PRODUCER_BENEFITS,
    getRelativeDate,
    isToday,
    isThisMonth,
    isThisWeek,
    isWeekend,
  };
}
