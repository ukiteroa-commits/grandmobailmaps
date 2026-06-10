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

  // ---------- 💼 Работы ----------
  {
    id: 'job-1',
    category: 'jobs',
    name: 'Почтовое отделение',
    description: 'Работа почтальоном: развоз посылок по адресам. 50-70k$ за смену, без рисков.',
    coords: { top: '31%', left: '50%' },
  },
  {
    id: 'job-2',
    category: 'jobs',
    name: 'Автобусный парк',
    description: 'Маршруты по всему городу. Стабильная оплата, нужна лицензия категории D.',
    coords: { top: '38%', left: '57%' },
  },
  {
    id: 'job-3',
    category: 'jobs',
    name: 'Грузоперевозки (дальнобой)',
    description: 'Фуры из промзоны: чем дальше рейс, тем больше платят.',
    coords: { top: '47%', left: '75%' },
  },
  {
    id: 'job-4',
    category: 'jobs',
    name: 'Шахта (Гарель)',
    description: 'Добыча руды киркой. Тяжело, но руда дорого сдаётся на заводе.',
    coords: { top: '57%', left: '83%' },
  },
  {
    id: 'job-5',
    category: 'jobs',
    name: 'Порт (грузчик)',
    description: 'Разгрузка контейнеров на юго-западе. Оплата сразу после смены.',
    coords: { top: '80%', left: '8%' },
  },
  {
    id: 'job-6',
    category: 'jobs',
    name: 'Ферма (Корякино)',
    description: 'Сбор урожая и работа на тракторе. Спокойная работа для новичков.',
    coords: { top: '66%', left: '52%' },
  },
  {
    id: 'job-7',
    category: 'jobs',
    name: 'Инкассатор (банк)',
    description: 'Развоз мешков с деньгами по точкам. 15-40k$ за рейс, нужен 3+ уровень.',
    coords: { top: '35%', left: '47%' },
  },
  {
    id: 'job-8',
    category: 'jobs',
    name: 'Завод Tesla',
    description: 'Сборка электрокаров в Южном. Высокая зарплата, нужна квалификация.',
    coords: { top: '90%', left: '78%' },
  },

  // ---------- 🅿️ Стоянки ----------
  {
    id: 'park-1',
    category: 'parking',
    name: 'Центральная стоянка (Арзамас)',
    description: 'Главная парковка города у мэрии. Спавн личного транспорта.',
    coords: { top: '34%', left: '56%' },
  },
  {
    id: 'park-2',
    category: 'parking',
    name: 'Стоянка Элитного посёлка',
    description: 'Охраняемая парковка у въезда в Элитный.',
    coords: { top: '21%', left: '23%' },
  },
  {
    id: 'park-3',
    category: 'parking',
    name: 'Стоянка Лыткарино',
    description: 'Парковка у жилых домов Лыткарино.',
    coords: { top: '51%', left: '14%' },
  },
  {
    id: 'park-4',
    category: 'parking',
    name: 'Стоянка Южного',
    description: 'Большая парковка у промзоны Южного.',
    coords: { top: '84%', left: '91%' },
  },
  {
    id: 'park-5',
    category: 'parking',
    name: 'Штрафстоянка',
    description: 'Сюда эвакуируют транспорт. Выкуп машины — у НПЦ на въезде.',
    coords: { top: '44%', left: '60%' },
  },

  // ---------- 🛒 Рынки ----------
  {
    id: 'mark-1',
    category: 'markets',
    name: 'Центральный рынок',
    description: 'Продукты, расходники и торговля между игроками в центре Арзамаса.',
    coords: { top: '30%', left: '55%' },
  },
  {
    id: 'mark-2',
    category: 'markets',
    name: 'Авторынок',
    description: 'Купля-продажа авто с рук. Осторожно: проверяйте машины на угон!',
    coords: { top: '40%', left: '44%' },
  },
  {
    id: 'mark-3',
    category: 'markets',
    name: 'Чёрный рынок',
    description: 'Нелегальный товар у барыги. Локация меняется, спросите у бывалых.',
    coords: { top: '62%', left: '30%' },
  },
  {
    id: 'mark-4',
    category: 'markets',
    name: 'Рыбный рынок (порт)',
    description: 'Сдача улова и снасти. Лучшие цены на редкую рыбу.',
    coords: { top: '76%', left: '12%' },
  },
  {
    id: 'mark-5',
    category: 'markets',
    name: 'Рынок Южного',
    description: 'Местный рынок промтоваров рядом с заводом.',
    coords: { top: '87%', left: '72%' },
  },
];
