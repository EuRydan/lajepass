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

const EXPERIENCES = [];

const LAJE_PICKS = [];

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
    text: 'A Laje mudou minha relação com o Rio. Descobri lugares que nem sabia que existiam, e o melhor: sempre com gente boa.',
    name: 'Marina Costa',
    role: 'Membro Laje',
    avatar: '👩🏽',
  },
  {
    text: 'Como produtor, a Laje trouxe um público que realmente valoriza o que a gente faz. É parceria de verdade.',
    name: 'Lucas Tavares',
    role: 'Produtor, Sacadura 154',
    avatar: '👨🏾',
  },
  {
    text: 'Eu usava o Instagram pra descobrir rolê. Agora uso a Laje. A curadoria é absurda.',
    name: 'Beatriz Oliveira',
    role: 'Membro Laje',
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
    description: 'Crie ofertas exclusivas para membros Laje e fidelize público.',
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
