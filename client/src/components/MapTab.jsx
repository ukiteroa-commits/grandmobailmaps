import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Layers, X } from 'lucide-react';
import { MAP_HOUSES } from '../data/houses.js';
import { POIS, POI_CATEGORIES } from '../data/pois.js';
import { JOBS } from '../data/jobs.js';
import { PARKINGS } from '../data/parkings.js';
import { MARKETS } from '../data/markets.js';
import { FACTIONS } from '../data/factions.js';
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
  const [active, setActive] = useState({
    housing: true,
    dating: false,
    jobs: false,
    parking: false,
    markets: false,
    factions: false,
  });

  const toggle = (id) => setActive((a) => ({ ...a, [id]: !a[id] }));

  const handleGlobalSearchSelect = (item) => {
    const village = MAP_HOUSES.find(v => v.id === item.villageId);
    if (village) {
      setSelected(village);
      setHighlightedMarker(item.villageId);
      setPulseMarker(item.villageId);
      setTimeout(() => setPulseMarker(null), 3000);
    }
  };

  // Объединяем все POI из разных источников
  const allPois = [
    ...POIS.filter(p => p.category === 'dating'),
    ...JOBS.map(job => ({ 
      id: `job-${job.id}`, 
      category: 'jobs', 
      name: job.name, 
      description: job.description, 
      coords: job.coords 
    })),
    ...PARKINGS.map(parking => ({ 
      id: `parking-${parking.id}`, 
      category: 'parking', 
      name: parking.name, 
      description: parking.description, 
      coords: parking.coords 
    })),
    ...MARKETS.map(market => ({ 
      id: `market-${market.id}`, 
      category: 'markets', 
      name: market.name, 
      description: market.description, 
      coords: market.coords 
    })),
    ...FACTIONS.map(faction => ({ 
      id: `faction-${faction.id}`, 
      category: 'factions', 
      name: faction.name, 
      description: faction.description, 
      coords: faction.coords 
    })),
  ];

  const visiblePois = allPois.filter((p) => active[p.category]);
  const catOf = (p) => POI_CATEGORIES.find((c) => c.id === p.category);

  const getCount = (categoryId) => {
    if (categoryId === 'housing') return MAP_HOUSES.length;
    if (categoryId === 'jobs') return JOBS.length;
    if (categoryId === 'parking') return PARKINGS.length;
    if (categoryId === 'markets') return MARKETS.length;
    if (categoryId === 'dating') return POIS.filter(p => p.category === 'dating').length;
    if (categoryId === 'factions') return FACTIONS.length;
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
    <div className="relative h-[calc(100vh-3.5rem-5rem)] w-full overflow-auto">
      {/* Глобальный поиск */}
      <GlobalSearch 
        onSelect={handleGlobalSearchSelect}
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

          {/* Маркеры POI (включая фракции) */}
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

      {/* Кнопка слоёв */}
      <button
        onClick={() => setLayersOpen((v) => !v)}
        className="glass-card fixed right-4 top-[4.5rem] z-30 flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-violet-300"
        style={layersOpen ? { boxShadow: '0 0 20px rgba(124,58,237,0.5)', borderColor: 'rgba(124,58,237,0.5)' } : undefined}
      >
        <Layers size={16} />
        Слои
        <span
          className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] text-white"
          style={{ background: '#7c3aed' }}
        >
          {activeCount}
        </span>
      </button>

      {/* Панель слоёв */}
      <AnimatePresence>
        {layersOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="glass-card fixed right-4 top-[7.25rem] z-30 w-56 p-2"
            style={{ boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
          >
            <div className="mb-1 flex items-center justify-between px-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Показывать на карте
              </span>
              <button onClick={() => setLayersOpen(false)} className="text-white/40 hover:text-white">
                <X size={14} />
              </button>
            </div>
            {POI_CATEGORIES.map((c) => {
              const on = active[c.id];
              const count = getCount(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-all ${
                    on ? 'text-white' : 'text-white/40 hover:bg-white/5'
                  }`}
                  style={
                    on
                      ? {
                          background: `linear-gradient(90deg, ${c.color}30, transparent)`,
                          border: `1px solid ${c.color}50`,
                        }
                      : { border: '1px solid transparent' }
                  }
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{
                      background: on ? c.color : 'rgba(255,255,255,0.06)',
                      boxShadow: on ? `0 0 10px ${c.color}80` : 'none',
                    }}
                  >
                    {c.emoji}
                  </span>
                  <span className="flex-1">{c.label}</span>
                  <span className="text-[10px] text-white/30">{count}</span>
                  <span
                    className="relative h-4 w-7 rounded-full transition-colors"
                    style={{ background: on ? c.color : 'rgba(255,255,255,0.15)' }}
                  >
                    <span
                      className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                      style={{ left: on ? '14px' : '2px' }}
                    />
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопки зума */}
      <div className="fixed bottom-24 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.5).toFixed(1)))}
          className="glass-card flex h-10 w-10 items-center justify-center text-violet-300 active:scale-95"
          aria-label="Приблизить"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
          className="glass-card flex h-10 w-10 items-center justify-center text-violet-300 active:scale-95"
          aria-label="Отдалить"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Модалка посёлка */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        accentColor={selected?.color}
        houses={selected?.houses}
        apartments={selected?.apartments}
        villageName={getVillageFolder(selected?.name || '')}
      />

      {/* Модалка POI (с описанием) */}
      <Modal
        open={!!selectedPoi}
        onClose={() => setSelectedPoi(null)}
        title={selectedPoi?.name}
        accentColor={selectedPoi ? catOf(selectedPoi).color : '#7c3aed'}
        description={selectedPoi?.description}
      />
    </div>
  );
}