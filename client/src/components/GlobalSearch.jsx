import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Home, Building2, MapPin } from 'lucide-react';
import { MAP_HOUSES } from '../data/houses.js';

export default function GlobalSearch({ onSelect, onHighlight, highlightedId }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Парсинг диапазонов домов/квартир
  const parseRange = (range) => {
    if (!range) return [];
    const parts = range.toString().split('-');
    if (parts.length !== 2) return [];
    const start = parseInt(parts[0]);
    const end = parseInt(parts[1]);
    if (isNaN(start) || isNaN(end)) return [];
    const list = [];
    for (let i = start; i <= end; i++) list.push(i);
    return list;
  };

  // Сбор всех домов и квартир
  const getAllHousesAndApartments = () => {
    const items = [];
    MAP_HOUSES.forEach(village => {
      // Дома
      const houses = parseRange(village.houses);
      houses.forEach(houseNum => {
        items.push({
          id: `${village.id}-house-${houseNum}`,
          villageId: village.id,
          villageName: village.name,
          villageCoords: village.coords,
          color: village.color,
          type: 'house',
          number: houseNum,
          label: `Дом ${houseNum}`,
          full: `${village.name}, дом ${houseNum}`
        });
      });
      // Квартиры
      const apartments = parseRange(village.apartments);
      apartments.forEach(aptNum => {
        items.push({
          id: `${village.id}-apt-${aptNum}`,
          villageId: village.id,
          villageName: village.name,
          villageCoords: village.coords,
          color: village.color,
          type: 'apartment',
          number: aptNum,
          label: `Кв ${aptNum}`,
          full: `${village.name}, квартира ${aptNum}`
        });
      });
    });
    return items;
  };

  const allItems = getAllHousesAndApartments();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    const searchNum = parseInt(query);
    const filtered = allItems.filter(item => {
      if (!isNaN(searchNum) && item.number === searchNum) return true;
      return item.full.toLowerCase().includes(query.toLowerCase());
    });
    setResults(filtered.slice(0, 20));
  }, [query]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <div className="relative">
        <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl">
          <Search size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="Поиск по номеру дома или квартиры (например: 506)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/40"
            autoComplete="off"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
            >
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/10 ${
                    highlightedId === item.id ? 'bg-white/15' : ''
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ background: `${item.color}30`, color: item.color }}
                  >
                    {item.type === 'house' ? <Home size={14} /> : <Building2 size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.full}</div>
                    <div className="text-xs text-white/40">{item.villageName}</div>
                  </div>
                  <MapPin size={14} className="text-white/30" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}