// src/data/parkings.js
// Стоянки на карте 32-го сервера GMRP
// Координаты получены вручную кликами по карте

export const PARKINGS = [
  {
    id: 1,
    name: 'Центральная стоянка (Арзамас)',
    coords: { top: '38.8%', left: '57.3%' },
    color: '#3b82f6', // синий
    category: 'parking',
    onMap: true,
    description: 'Главная парковка города у мэрии. Спавн личного транспорта.',
  },
  {
    id: 2,
    name: 'Стоянка Батырево',
    coords: { top: '8.5%', left: '79.0%' },
    color: '#3b82f6',
    category: 'parking',
    onMap: true,
    description: 'Парковка у жилых домов Батырево.',
  },
  {
    id: 3,
    name: 'Стоянка Южный',
    coords: { top: '78.6%', left: '90.3%' },
    color: '#3b82f6',
    category: 'parking',
    onMap: true,
    description: 'Большая парковка у промзоны Южного.',
  },
];