// src/data/markets.js
// Рынки на карте 32-го сервера GMRP
// Координаты получены вручную кликами по карте

export const MARKETS = [
  {
    id: 1,
    name: 'Дром (авторынок)',
    coords: { top: '12.7%', left: '64.9%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Купля-продажа авто с рук. Осторожно: проверяйте машины на угон!',
  },
  {
    id: 2,
    name: 'Грандмобаил Маркет (аксессуары, скины)',
    coords: { top: '27.7%', left: '63.4%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Аксессуары, скины на оружие и транспорт. Широкий ассортимент.',
  },
  {
    id: 3,
    name: 'Перекупы (Центральный рынок)',
    coords: { top: '33.8%', left: '48.3%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Перекупают остатки с работ. Продажа барахла.',
  },
  {
    id: 4,
    name: 'Перекупы (Южный)',
    coords: { top: '82.7%', left: '88.6%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Перекупы в Южном районе. Удобно после работы на заводе.',
  },
  {
    id: 5,
    name: 'Чёрный рынок (ОПГ)',
    coords: { top: '45.1%', left: '11.6%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Нелегальный товар. Только для ОПГ. Продажа оружия и угнанных авто.',
  },
];