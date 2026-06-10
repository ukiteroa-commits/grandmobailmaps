// src/data/markets.js
// Рынки на карте 32-го сервера GMRP
// Координаты получены вручную кликами по карте

export const MARKETS = [
  {
    id: 1,
    name: 'Дром (авторынок)',
    coords: { top: '13.0%', left: '64.8%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Купля-продажа авто с рук. Осторожно: проверяйте машины на угон!',
  },
  {
    id: 2,
    name: 'Грандмаркет (аксессуары, скины)',
    coords: { top: '28.1%', left: '63.7%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Аксессуары, скины на оружие и транспорт. Широкий ассортимент.',
  },
  {
    id: 3,
    name: 'Перекупы (Центральный рынок)',
    coords: { top: '34.0%', left: '48.2%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Продажа барахла с работ.',
  },
  {
    id: 4,
    name: 'Перекупы (Южный)',
    coords: { top: '82.2%', left: '88.9%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Перекупы в Южном районе. Удобно после работы на заводе.',
  },
  {
    id: 5,
    name: 'Чёрный рынок (ОПГ)',
    coords: { top: '45.3%', left: '11.6%' },
    color: '#10b981',
    category: 'markets',
    onMap: true,
    description: 'Нелегальный товар. Только для ОПГ. Продажа оружия и угнанных авто.',
  },
];