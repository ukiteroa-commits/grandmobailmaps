import { AnimatePresence, motion } from 'framer-motion';
import { X, Home, Building2, Image, Search } from 'lucide-react';
import { useState } from 'react';

export default function Modal({ open, onClose, title, accentColor = '#7c3aed', houses, apartments, villageName, description }) {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Генерация списка из диапазона
  const getListFromRange = (range) => {
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

  const houseNumbers = getListFromRange(houses);
  const apartmentNumbers = getListFromRange(apartments);

  const filteredHouses = houseNumbers.filter(num => 
    searchQuery === '' || num.toString().includes(searchQuery)
  );
  const filteredApartments = apartmentNumbers.filter(num => 
    searchQuery === '' || num.toString().includes(searchQuery)
  );

  const getScreenshotUrl = (village, number) => {
    return `/screenshots/${village}_${number}.jpg`;
  };

  // Правильное определение POI:
  // 1. Если есть description И (нет houses/apartments ИЛИ это не посёлок)
  // 2. ИЛИ если передан явный флаг isPoi
  const hasHousesOrApartments = (houseNumbers.length > 0 || apartmentNumbers.length > 0);
  const isPoi = description && !hasHousesOrApartments;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(5,5,12,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="glass-card w-full max-w-lg p-5 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: `0 0 30px ${accentColor}40`, borderColor: `${accentColor}50` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* POI — показываем описание */}
            {isPoi && description && (
              <div className="p-4 bg-white/5 rounded-xl">
                <div
                  className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-3"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  📍 Точка интереса
                </div>
                <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Если есть дома или квартиры — показываем их */}
            {!isPoi && hasHousesOrApartments && (
              <>
                {/* Поиск */}
                <div className="mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Поиск по номеру дома или квартиры..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-white/40 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  {searchQuery && (
                    <p className="mt-2 text-[10px] text-white/40 text-center">
                      Найдено: {filteredHouses.length + filteredApartments.length}
                    </p>
                  )}
                </div>

                {/* Список домов */}
                {filteredHouses.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home size={16} style={{ color: accentColor }} />
                      <span className="text-sm font-semibold">
                        Дома ({filteredHouses.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl">
                      {filteredHouses.map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedHouse(selectedHouse === num ? null : num)}
                          className={`p-2 rounded-lg text-xs font-bold transition-all ${
                            selectedHouse === num
                              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Скриншот выбранного дома */}
                {selectedHouse && villageName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Image size={16} className="text-cyan-400" />
                      <span className="text-sm font-semibold">Дом/Квартира №{selectedHouse}</span>
                    </div>
                    <img
                      src={getScreenshotUrl(villageName, selectedHouse)}
                      alt={`Объект ${selectedHouse}`}
                      className="w-full rounded-lg border border-white/20"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400/1a1a2e/ffffff?text=Скриншот+пока+отсутствует';
                      }}
                    />
                    <p className="text-[10px] text-white/40 text-center mt-2">
                      Скриншот объекта №{selectedHouse}
                    </p>
                  </motion.div>
                )}

                {/* Список квартир */}
                {filteredApartments.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={16} style={{ color: accentColor }} />
                      <span className="text-sm font-semibold">
                        Квартиры ({filteredApartments.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl">
                      {filteredApartments.map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedHouse(selectedHouse === num ? null : num)}
                          className={`p-2 rounded-lg text-xs font-bold transition-all ${
                            selectedHouse === num
                              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Если нет ни домов, ни квартир, ни описания */}
            {!isPoi && !hasHousesOrApartments && !description && (
              <div className="text-center py-8 text-white/40">
                <p className="text-sm">Нет данных о домах и квартирах</p>
              </div>
            )}

            {/* Если поиск не дал результатов */}
            {searchQuery && filteredHouses.length === 0 && filteredApartments.length === 0 && (
              <div className="text-center py-4 text-white/40">
                <p className="text-sm">Ничего не найдено</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="btn-buy mt-5 w-full rounded-xl py-3 text-sm font-semibold"
            >
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}