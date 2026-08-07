import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretDownIcon, XIcon } from '@phosphor-icons/react';
import { IconButton } from './IconButton';

export function Sidebar({ tree = [], activeId, onSelectHeading, isOpen, onClose }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {/* Оверлей для мобільних */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 top-14 bg-stone-950/40 dark:bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />

          {/* Панель змісту */}
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '18rem', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed md:sticky top-14 left-0 h-[calc(100vh-3.5rem)] self-start flex-shrink-0 bg-stone-100/80 dark:bg-zinc-900/60 backdrop-blur-md border-r border-stone-300/70 dark:border-zinc-800 z-30 md:z-10 select-none shadow-2xl md:shadow-none overflow-hidden"
          >
            {/* 1. Замість p-4 залишаємо тільки py-4 (без горизонтального падінгу) */}
            <div className="w-72 py-4 flex flex-col h-full min-w-[18rem]">
              
              {/* 2. Додаємо px-4 сюди, щоб шапка зберегла відступи */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-300/70 dark:border-zinc-800 flex-shrink-0 px-4">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-zinc-400 truncate">
                  Зміст
                </span>
                <IconButton
                  icon={<XIcon size={16} />}
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  tooltip="Закрити зміст"
                  tooltipPosition="right"
                />
              </div>

              <nav className="mt-4 flex-1 space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain pl-4 pr-1.5">
                {tree.map((h1Item) => {
                  const isSectionOpen = openSections[h1Item.id] !== false;

                  return (
                    <div key={h1Item.id} className="space-y-1">
                      <div className="flex items-center justify-between gap-1 pr-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectHeading(h1Item.id);
                            if (window.innerWidth < 768) onClose();
                          }}
                          className="flex-1 min-w-0 flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-bold text-stone-800 dark:text-zinc-200 hover:bg-stone-300/50 dark:hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                        >
                          <span className="uppercase tracking-wider truncate block w-full">{h1Item.title}</span>
                        </button>

                        {h1Item.children.length > 0 && (
                          <button
                            type="button"
                            aria-label={isSectionOpen ? 'Закрити секцію' : 'Відкрити секцію'}
                            onClick={() => toggleSection(h1Item.id)}
                            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 rounded-lg hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex-shrink-0"
                          >
                            <CaretDownIcon 
                              size={14} 
                              className={`transition-transform duration-200 ${isSectionOpen ? '' : '-rotate-90'}`} 
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {isSectionOpen && h1Item.children.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pl-2 space-y-0.5 border-l border-stone-300/70 dark:border-zinc-800 ml-2 my-1 pr-2">
                              {h1Item.children.map((h2Item) => {
                                const isActive = activeId === h2Item.id;
                                return (
                                  <button
                                    key={h2Item.id}
                                    type="button"
                                    onClick={() => {
                                      onSelectHeading(h2Item.id);
                                      if (window.innerWidth < 768) onClose();
                                    }}
                                    className={`w-full text-left block px-2.5 py-1.5 rounded-md text-xs transition-all min-w-0 cursor-pointer ${
                                      isActive
                                        ? 'bg-stone-300/70 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold border-l-2 border-indigo-500 dark:border-indigo-400'
                                        : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-300/40 dark:hover:bg-zinc-800/50 hover:text-stone-900 dark:hover:text-zinc-200'
                                    }`}
                                  >
                                    <span className="truncate uppercase tracking-wider block w-full">{h2Item.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}