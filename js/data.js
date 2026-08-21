// ==========================================
// LAJE — Mock Data
// Experiências, Picks, Comunidade, Produtores
// ==========================================

const CATEGORIES = {
  musica: { emoji: '<i class="ph ph-music-notes"></i>', label: 'Música', color: 'var(--color-purple)', colorRaw: '#8B5CF6' },
  festas: { emoji: '<i class="ph ph-confetti"></i>', label: 'Festas', color: 'var(--color-rose)', colorRaw: '#F43F7A' },
  bares: { emoji: '<i class="ph ph-martini"></i>', label: 'Bares', color: 'var(--color-amber)', colorRaw: '#F59E0B' },
  gastronomia: { emoji: '<i class="ph ph-fork-knife"></i>', label: 'Gastronomia', color: 'var(--color-teal)', colorRaw: '#2DD4BF' },
  cultura: { emoji: '<i class="ph ph-mask-happy"></i>', label: 'Cultura', color: 'var(--color-sky)', colorRaw: '#38BDF8' },
  experiencias: { emoji: '<i class="ph ph-sparkle"></i>', label: 'Experiências', color: 'var(--color-gold)', colorRaw: '#FFB84D' },
};

// Coordenadas dos bairros no mapa (geográficas lat, lng e SVG em % — left, top)
const BAIRROS = {
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
    id: 'exp-001',
    name: 'Noite de Jazz na Lapa',
    category: 'musica',
    date: getRelativeDate(0, 21, 30),
    location: 'Lapa',
    bairro: 'lapa',
    description: 'Uma noite inesquecível de jazz ao vivo no coração da boêmia carioca. Músicos locais e convidados especiais.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Lista gratuita para membros',
    price: 'Grátis com Comu Pass',
  },
  {
    id: 'exp-002',
    name: 'Gastrobar Ipanema',
    category: 'gastronomia',
    date: getRelativeDate(1, 19, 0),
    location: 'Ipanema',
    bairro: 'ipanema',
    description: 'Menu especial de frutos do mar com vista para o pôr do sol de Ipanema. Reserva obrigatória.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: '20% de desconto',
    price: 'A partir de R$80',
  },
  {
    id: 'exp-003',
    name: 'Roda de Samba — Botafogo',
    category: 'musica',
    date: getRelativeDate(2, 17, 0),
    location: 'Botafogo',
    bairro: 'botafogo',
    description: 'Samba raiz no quintal do Botafogo com petiscos e chopp gelado. O Rio que a gente ama.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Mesa reservada',
    price: 'R$30 por pessoa',
  },
  {
    id: 'exp-004',
    name: 'Exposição no MAR',
    category: 'cultura',
    date: getRelativeDate(3, 10, 0),
    location: 'Centro',
    bairro: 'centro',
    description: 'Mostra de arte contemporânea com artistas cariocas emergentes. Visita guiada exclusiva para membros Comu.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: 'Visita guiada exclusiva',
    price: 'R$20',
  },
  {
    id: 'exp-005',
    name: 'Balada Leblon — Open Bar',
    category: 'festas',
    date: getRelativeDate(4, 23, 0),
    location: 'Leblon',
    bairro: 'leblon',
    description: 'A festa mais aguardada do mês no Leblon. Open bar premium, DJ residente e convidados internacionais.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Lista VIP + open bar',
    price: 'R$120',
  },
  {
    id: 'exp-006',
    name: 'Bar do Góes — Santa Teresa',
    category: 'bares',
    date: getRelativeDate(0, 18, 0),
    location: 'Santa Teresa',
    bairro: 'santa_teresa',
    description: 'O melhor boteco de Santa Teresa com vista panorâmica do Rio. Caldo de feijão e MPB ao vivo.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: 'Petisco grátis',
    price: 'R$15 consumação mínima',
  },
  {
    id: 'exp-007',
    name: 'Sunset Barra da Tijuca',
    category: 'experiencias',
    date: getRelativeDate(5, 16, 30),
    location: 'Barra da Tijuca',
    bairro: 'barra',
    description: 'Passeio de barco com pôr do sol na Barra da Tijuca. Drinks, música e o melhor horizonte do Rio.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Drink de boas-vindas',
    price: 'R$150',
  },
  {
    id: 'exp-008',
    name: 'Brunch Gávea Garden',
    category: 'gastronomia',
    date: getRelativeDate(6, 11, 0),
    location: 'Gávea',
    bairro: 'gavea',
    description: 'Brunch especial ao ar livre na Gávea com música acústica, mimosas e mesa farta.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: 'Mimosa gratuita',
    price: 'R$95 por pessoa',
  },
  {
    id: 'exp-009',
    name: 'Show de Rock — Flamengo',
    category: 'musica',
    date: getRelativeDate(1, 20, 0),
    location: 'Flamengo',
    bairro: 'flamengo',
    description: 'As melhores bandas de rock independente do Rio em uma única noite no Flamengo.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Ingresso com 30% off',
    price: 'R$60',
  },
  {
    id: 'exp-010',
    name: 'Teatro Tijuca — Comédia Especial',
    category: 'cultura',
    date: getRelativeDate(7, 20, 0),
    location: 'Tijuca',
    bairro: 'tijuca',
    description: 'Espetáculo de stand-up comedy com os maiores nomes da comédia carioca. Noite de muitas risadas.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: '2 ingressos pelo preço de 1',
    price: 'R$80',
  },
  {
    id: 'exp-011',
    name: 'Rooftop Copacabana',
    category: 'festas',
    date: getRelativeDate(2, 22, 0),
    location: 'Copacabana',
    bairro: 'copacabana',
    description: 'Festa no rooftop mais concorrido de Copa. Vista da orla, DJs e coquetéis autorais.',
    image: 'public/pexels-maumascaro-15987495.jpg',
    lajeBenefit: 'Acesso prioritário',
    price: 'R$100',
  },
  {
    id: 'exp-012',
    name: 'Bar na Urca — Vista da Baía',
    category: 'bares',
    date: getRelativeDate(3, 17, 30),
    location: 'Urca',
    bairro: 'urca',
    description: 'Tradição carioca: cerveja gelada e pastéis na mureta da Urca com vista para o Pão de Açúcar.',
    image: 'public/tai-s-captures-OQDDvB5r0bM-unsplash.jpg',
    lajeBenefit: 'Cerveja inclusa',
    price: 'R$25',
  },
];

const LAJE_PICKS = [
  { experienceId: 'exp-001', reason: 'Jazz ao vivo com músicos incríveis. Uma noite que o Rio merece mais vezes.', curator: 'Equipe Comu' },
  { experienceId: 'exp-005', reason: 'A festa mais completa do mês. Open bar, vista boa e lista exclusiva pra quem é Comu.', curator: 'Lucas, Comu Picks' },
  { experienceId: 'exp-007', reason: 'Pôr do sol de barco é sempre uma das experiências mais bonitas do Rio. Não dá pra perder.', curator: 'Equipe Comu' },
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
    LAJE_PICKS,
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
