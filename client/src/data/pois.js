// Точки интереса (POI) на карте 32-го сервера GMRP.
// Категории переключаются фильтрами на вкладке «Карта».
// coords — проценты относительно картинки карты (770x771).

export const POI_CATEGORIES = [
  { id: 'housing', label: 'Дома / Квартиры', emoji: '🏠', color: '#7c3aed' },
  { id: 'dating', label: 'Свидания', emoji: '❤️', color: '#ec4899' },
  { id: 'jobs', label: 'Работы', emoji: '💼', color: '#f59e0b' },
  { id: 'parking', label: 'Стоянки', emoji: '🅿️', color: '#3b82f6' },
  { id: 'markets', label: 'Рынки', emoji: '🛒', color: '#10b981' },
];

export const POIS = [
  // ---------- ❤️ Места для свиданий ----------
  // Координаты сняты с меток игрока (скрин dating-reference)
  {
    id: 'date-1',
    category: 'dating',
    name: 'Гора у Озёрного',
    description: 'Высокая гора рядом с посёлком Озёрный. Вид сверху на озеро и весь запад карты.',
    coords: { top: '32.9%', left: '22%' },
  },
  {
    id: 'date-2',
    category: 'dating',
    name: 'Трамплин',
    description: 'Знаменитый трамплин на склоне у Элитного. Прыжки на авто и красивый вид.',
    coords: { top: '26.3%', left: '23.1%' },
  },
  {
    id: 'date-3',
    category: 'dating',
    name: 'Уединение',
    description: 'Самый северо-западный уголок карты, у Эдово. Тихо — никто не помешает.',
    coords: { top: '2.5%', left: '1.5%' },
  },
  {
    id: 'date-4',
    category: 'dating',
    name: 'Остров у ГШ',
    description: 'Островок в озере у Горячей Штучки. Добраться можно вплавь или на лодке.',
    coords: { top: '8.7%', left: '37.7%' },
  },
  {
    id: 'date-5',
    category: 'dating',
    name: 'Озеро у Твикс',
    description: 'Озеро у трассы за Батырево, рядом с «Твикс». Спокойная вода и закаты.',
    coords: { top: '16.5%', left: '95%' },
  },
  {
    id: 'date-6',
    category: 'dating',
    name: 'Причалы (большое озеро)',
    description: 'Пирс с лодками на большом озере у Арзамаса. Романтика у воды.',
    coords: { top: '32.7%', left: '72.1%' },
  },
  {
    id: 'date-6b',
    category: 'dating',
    name: 'Причалы (порт)',
    description: 'Причалы порта на юго-западном побережье. Шум волн и огни кораблей.',
    coords: { top: '84.6%', left: '8.1%' },
  },
  {
    id: 'date-7',
    category: 'dating',
    name: 'Летняя локация',
    description: 'Песчаная зона отдыха за рекой — шезлонги, музыка и пляжная атмосфера.',
    coords: { top: '53.2%', left: '69.5%' },
  },
  {
    id: 'date-8',
    category: 'dating',
    name: 'Домики у озера',
    description: 'Уютные домики на берегу озера за Лыткарино. Идеально для спокойного вечера вдвоём.',
    coords: { top: '64.5%', left: '16.5%' },
  },
  {
    id: 'date-9',
    category: 'dating',
    name: 'Пляж Южного',
    description: 'Песчаный берег у посёлка Южный. Купание и прогулки вдвоём.',
    coords: { top: '81.7%', left: '76%' },
  },
  {
    id: 'date-10',
    category: 'dating',
    name: 'Сердце',
    description: 'Локация «Сердце» на южном побережье — самое романтичное место карты.',
    coords: { top: '89.5%', left: '53.2%' },
  },
  {
    id: 'date-11',
    category: 'dating',
    name: 'Заброшенная тюрьма',
    description: 'Старая тюрьма на южном острове. Атмосферно, жутковато и незабываемо.',
    coords: { top: '96.5%', left: '21.4%' },
  },

  
  // ---------- 🛒 Рынки ----------
  {
    id: 'market-1',
    category: 'markets',
    name: 'Дром (авторынок)',
    coords: { top: '12.7%', left: '64.9%' },
    description: 'Купля-продажа авто с рук.',
  },
  {
    id: 'market-2',
    category: 'markets',
    name: 'Грандмобаил Маркет',
    coords: { top: '27.7%', left: '63.4%' },
    description: 'Аксессуары, скины.',
  },
  {
    id: 'market-3',
    category: 'markets',
    name: 'Перекупы (Центральный)',
    coords: { top: '33.8%', left: '48.3%' },
    description: 'Перекупают остатки с работ.',
  },
  {
    id: 'market-4',
    category: 'markets',
    name: 'Перекупы (Южный)',
    coords: { top: '82.7%', left: '88.6%' },
    description: 'Перекупы в Южном районе.',
  },
  {
    id: 'market-5',
    category: 'markets',
    name: 'Чёрный рынок (ОПГ)',
    coords: { top: '45.1%', left: '11.6%' },
    description: 'Нелегальный товар.',
  },
];

export { POI_CATEGORIES, POIS };