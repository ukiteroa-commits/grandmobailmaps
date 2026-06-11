// Данные посёлков 32-го сервера GMRP.
// Диапазоны домов/квартир и координаты сняты с реальной карты Abram Grand Mobile
// (см. docs/houses-reference.jpg). Нумерация сквозная по всей карте:
// дома №1-388, квартиры №1-760.
//
// onMap: false — посёлок есть в чатах, но на реальной карте не подписан
// (координаты не подтверждены, можно добавить вручную).
export const HOUSES = [
  {
    id: 1,
    name: 'Элитный поселок',
    houses: '1-21',
    apartments: null,
    coords: { top: '17%', left: '17%' },
    color: '#f59e0b', // золотой
    onMap: true,
  },
  {
    id: 2,
    name: 'Эдово',
    houses: '62-66',
    apartments: '443-557',
    coords: { top: '3.5%', left: '8%' },
    color: '#10b981', // зелёный
    onMap: true,
  },
  {
    id: 3,
    name: 'Богатырево',
    houses: '233-287',
    apartments: null,
    coords: { top: '12%', left: '46%' },
    color: '#ef4444', // красный
    onMap: true,
  },
  {
    id: 4,
    name: 'Батырево',
    houses: '67-77',
    apartments: null,
    coords: { top: '11%', left: '81%' },
    color: '#3b82f6', // синий
    onMap: true,
  },
  {
    id: 5,
    name: 'Арзамас',
    houses: '78-116',
    apartments: '559-760',
    coords: { top: '33%', left: '53%' },
    color: '#f97316', // оранжевый
    onMap: true,
  },
  {
    id: 6,
    name: 'Дачи (восток Арзамаса)',
    houses: '170-198',
    apartments: null,
    coords: { top: '25%', left: '85%' },
    color: '#8b5cf6', // фиолетовый
    onMap: true,
  },
  {
    id: 7,
    name: 'Южный берег (Арзамас)',
    houses: null,
    apartments: '1-36',
    coords: { top: '46%', left: '47%' },
    color: '#06b6d4', // голубой
    onMap: true,
  },
  {
    id: 8,
    name: 'Лыткарино',
    houses: '199-232',
    apartments: '356-441',
    coords: { top: '48%', left: '11%' },
    color: '#a855f7', // светло-фиолетовый
    onMap: true,
  },
  {
    id: 9,
    name: 'Гарель',
    houses: '22-39',
    apartments: null,
    coords: { top: '52%', left: '88%' },
    color: '#84cc16', // лайм
    onMap: true,
  },
  {
    id: 10,
    name: 'Корякино',
    houses: '40-61',
    apartments: null,
    coords: { top: '70%', left: '61%' },
    color: '#6366f1', // индиго
    onMap: true,
  },
  {
    id: 11,
    name: 'Бусаево',
    houses: '117-169',
    apartments: null,
    coords: { top: '78%', left: '42%' },
    color: '#ec4899', // розовый
    onMap: true,
  },
  {
    id: 12,
    name: 'Южный',
    houses: '288-388',
    apartments: '37-354',
    coords: { top: '86%', left: '86%' },
    color: '#eab308', // жёлтый
    onMap: true,
  },
  // ---- Посёлки, отмеченные вручную на карте ----
  {
    id: 13,
    name: 'Горячая Штучка',
    houses: '1-40',
    apartments: null,
    coords: { top: '15.5%', left: '37%' },
    color: '#ef4444',
    onMap: true,
  },
{
  id: 14,
  name: 'Озёрный',
  houses: '506-560',  // ← меняем с '1-35' на '506-560'
  apartments: null,
  coords: { top: '34.5%', left: '25.5%' },
  color: '#06b6d4',
  onMap: true,
},
  {
    id: 15,
    name: 'Рыболовная-1',
    houses: '1-30',
    apartments: null,
    coords: { top: '29%', left: '71%' },
    color: '#14b8a6',
    onMap: true,
  },
  {
    id: 16,
    name: 'Рыболовная-2',
    houses: '1-25',
    apartments: null,
    coords: { top: '81.5%', left: '9%' },
    color: '#0ea5e9',
    onMap: true,
  },
];

// Только посёлки, отображаемые маркерами на карте
export const MAP_HOUSES = HOUSES.filter((h) => h.onMap);
