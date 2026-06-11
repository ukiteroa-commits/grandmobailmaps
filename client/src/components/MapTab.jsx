import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Layers, X } from 'lucide-react';
import { MAP_HOUSES } from '../data/houses.js';
import { POIS, POI_CATEGORIES } from '../data/pois.js';
import { JOBS } from '../data/jobs.js';
import { PARKINGS } from '../data/parkings.js';
import { MARKETS } from '../data/markets.js';
import Modal from './Modal.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import mapImage from '../assets/map.jpg';

export default function MapTab() {
  const [selected, setSelected] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [layersOpen, setLayersOpen] = useState(false);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const [pulseMarker, setPulseMarker] = useState(null);
  const mapContainerRef = useRef(null);
  
  const [active, setActive] = useState({
    housing: true,
    dating: false,
    jobs: false,
    parking: false,
    markets: false,
  });

  const toggle = (id) => setActive((a) => ({ ...a, [id]: !a[id] }));

  // Обработка выбора из глобального поиска
  const handleGlobalSearchSelect = (item) => {
    // Находим посёлок
    const village = MAP_HOUSES.find(v => v.id === item.villageId);
    if (village) {
      setSelected(village);
      // Подсвечиваем маркер
      setHighlightedMarker(item.villageId);
      setPulseMarker(item.villageId);
      // Через 3 секунды убираем пульсацию
      setTimeout(() => setPulseMarker(null), 3000);
      // Прокручиваем карту к маркеру (опционально)
      if (mapContainerRef.current) {
        // Здесь можно добавить скролл к маркеру
      }
    }
  };

  const allPois = [
    ...POIS.filter(p => p.category === 'dating'),
    ...JOBS.map(job => ({ id: `job-${job.id}`, category: 'jobs', name: job.name, description: job.description, coords: job.coords })),
    ...PARKINGS.map(parking => ({ id: `parking-${parking.id}`, category: 'parking', name: parking.name, description: parking.description, coords: parking.coords })),
    ...MARKETS.map(market => ({ id: `market-${market.id}`, category: 'markets', name: market.name, description: market.description, coords: market.coords })),
  ];

  const visiblePois = allPois.filter((p) => active[p.category]);
  const catOf = (p) => POI_CATEGORIES.find((c) => c.id === p.category);

  const getCount = (categoryId) => {
    if (categoryId === 'housing') return MAP_HOUSES.length;
    if (categoryId === 'jobs') return JOBS.length;
    if (categoryId === 'parking') return PARKINGS.length;
    if (categoryId === 'markets') return MARKETS.length;
    if (categoryId === 'dating') return POIS.filter(p => p.category === 'dating').length;
    return 0;
  };

  const activeCount = Object.values(active).filter(Boolean).length;

  const getVillageFolder = (name) => {
    const map = {
      'Элитный поселок': 'elitny',
      'Эдово': 'edovo',
      'Богатырево': 'bogatyrevo',
      'Батырево': 'batyrevo',
      'Арзамас': 'arzamas',
      'Дачи (восток Арзамаса)': 'dachi',
      'Южный берег (Арзамас)': 'yuzhny-bereg',
      'Лыткарино': 'lytkarino',
      'Гарель': 'garel',
      'Корякино': 'koryakino',
      'Бусаево': 'busaevo',
      'Южный': 'yuzhny',
      'Горячая Штучка': 'goryachaya',
      'Озёрный': 'ozerny',
      'Рыболовная-1': 'rybolovnaya1',
      'Рыболовная-2': 'rybolovnaya2',
    };
    return map[name] || name.toLowerCase().replace(/[^a-zа-яё]/gi, '');
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem-5rem)] w-full overflow-auto" ref={mapContainerRef}>
      {/* Глобальный поиск */}
      <GlobalSearch 
        onSelect={handleGlobalSearchSelect}
        onHighlight={setHighlightedMarker}
        highlightedId={highlightedMarker}
      />

      <div
        className="relative mx-auto transition-[width] duration-200"
        style={{ width: `${100 * zoom}%`, maxWidth: zoom === 1 ? '900px' : 'none' }}
      >
        <div className="relative w-full" style={{ aspectRatio: '770 / 771' }}>
          <img
            src={mapImage}
            alt="Карта GMRP 32"
            className="absolute inset-0 h-full w-full select-none object-fill"
            draggable={false}
          />

          {/* Маркеры посёлков */}
          <AnimatePresence>
            {active.housing &&
              MAP_HOUSES.map((h, i) => (
                <motion.button
                  key={h.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 18 }}
                  onClick={() => setSelected(h)}
                  className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: h.coords.top, left: h.coords.left }}
                  aria-label={h.name}
                >
                  <span
                    className={`block h-4 w-4 rounded-full border-2 border-white/90 transition-all ${
                      pulseMarker === h.id ? 'animate-ping' : ''
                    } ${highlightedMarker === h.id ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                    style={{ 
                      background: h.color, 
                      boxShadow: highlightedMarker === h.id ? `0 0 0 4px ${h.color}80` : 'none'
                    }}
                  />
                  <span
                    className="pointer-events-none absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap rounded px-1 py-px text-[8px] font-bold leading-tight"
                    style={{
                      background: 'rgba(10,10,20,0.78)',
                      color: h.color,
                      border: `1px solid ${h.color}50`,
                    }}
                  >
                    {h.name}
                  </span>
                </motion.button>
              ))}
          </AnimatePresence>

          {/* Маркеры POI */}
          <AnimatePresence>
            {visiblePois.map((p, i) => {
              const cat = catOf(p);
              if (!cat) return null;
              return (
                <motion.button
                  key={p.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: i * 0.02, type: 'spring', stiffness: 300, damping: 18 }}
                  onClick={() => setSelectedPoi(p)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: p.coords.top, left: p.coords.left }}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/90 text-[11px] leading-none"
                    style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}90` }}
                  >
                    {cat.emoji}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Кнопка слоёв и зум — без изменений */}
      {/* ... (оставляем как было) ... */}

      {/* Модалки */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        accentColor={selected?.color}
        houses={selected?.houses}
        apartments={selected?.apartments}
        villageName={getVillageFolder(selected?.name || '')}
      />

      <Modal
        open={!!selectedPoi}
        onClose={() => setSelectedPoi(null)}
        title={selectedPoi?.name}
        accentColor={selectedPoi ? catOf(selectedPoi).color : '#7c3aed'}
      />
    </div>
  );
}