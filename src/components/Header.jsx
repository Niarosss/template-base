import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GearIcon, 
  MagnifyingGlassIcon, 
  XIcon, 
  CaretUpIcon, 
  CaretDownIcon,
  SidebarIcon,
  ChatDotsIcon
} from '@phosphor-icons/react';
import { useFeedback } from '../context/useFeedback';
import { KbdShortcut } from './KbdShortcut';
import { IconButton } from './IconButton';

export const Header = React.forwardRef(({ 
  searchQuery, 
  setSearchQuery, 
  matchCount, 
  activeMatchIndex, 
  onNextMatch, 
  onPrevMatch, 
  onOpenSettings,
  isSidebarOpen,
  onToggleSidebar
}, ref) => {
  const { openFeedback } = useFeedback();
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevMatch();
      } else {
        onNextMatch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNextMatch();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onPrevMatch();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 backdrop-blur-md backdrop-saturate-150 bg-stone-100/80 dark:bg-zinc-900/70 border-b border-stone-300/70 dark:border-zinc-800/80 px-4 flex items-center justify-between gap-3 select-none transition-colors duration-200">
      {/* Ліва частина */}
      <div className="flex items-center gap-3 min-w-0">
        <IconButton
          icon={<SidebarIcon size={18} />}
          onClick={onToggleSidebar}
          active={isSidebarOpen}
          tooltip={isSidebarOpen ? 'Приховати зміст' : 'Показати зміст'}
        />

        <h1 className="text-lg md:text-xl font-medium tracking-[0.12em] text-stone-900 dark:text-zinc-100 whitespace-nowrap truncate">
          <span className="font-thin opacity-50">[</span>База<span className="font-thin opacity-50">]</span> шаблонів
        </h1>
      </div>

      {/* Центральна частина: Пошук */}
      <div className="flex-1 max-w-md mx-2 relative flex items-center">
        <MagnifyingGlassIcon 
          size={18} 
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
            isFocused || searchQuery
              ? 'text-orange-500 dark:text-orange-400 scale-110'
              : 'text-stone-400 dark:text-zinc-500'
          }`} 
        />

        <input
          ref={ref}
          type="text"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Пошук..."
          className="w-full pl-10 pr-28 py-1.5 bg-white/80 dark:bg-zinc-950/60 hover:bg-white dark:hover:bg-zinc-950/90 border border-stone-300/80 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700 rounded-2xl text-sm font-sans text-stone-700 dark:text-zinc-200 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/70 transition-all shadow-sm"
        />

        <div className="absolute right-2.5 flex items-center gap-1 text-xs text-stone-400 dark:text-zinc-500">
          <AnimatePresence mode="wait">
            {!searchQuery && (
              <motion.div
                key="shortcut"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.12 }}
              >
                <KbdShortcut keys={['Ctrl', 'F']} rounded="rounded-xl" />
              </motion.div>
            )}

            {searchQuery && (
              <motion.div
                key="controls"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1"
              >
                <span className="text-[11px] font-mono px-1 select-none text-stone-500 dark:text-zinc-400 font-medium">
                  {matchCount > 0 ? `${activeMatchIndex + 1}/${matchCount}` : '0/0'}
                </span>

                {matchCount > 0 && (
                  <div className="flex items-center border-l border-stone-300/70 dark:border-zinc-800 pl-1 gap-0.5">
                    <button
                      onClick={onPrevMatch}
                      type="button"
                      className="p-1 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/60 dark:hover:bg-zinc-800 rounded transition-colors active:scale-90 cursor-pointer"
                      title="Попередній (Shift + Enter або ↑)"
                    >
                      <CaretUpIcon size={14} />
                    </button>
                    <button
                      onClick={onNextMatch}
                      type="button"
                      className="p-1 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/60 dark:hover:bg-zinc-800 rounded transition-colors active:scale-90 cursor-pointer"
                      title="Наступний (Enter або ↓)"
                    >
                      <CaretDownIcon size={14} />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSearchQuery('')}
                  type="button"
                  className="p-1 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/60 dark:hover:bg-zinc-800 rounded transition-colors active:scale-90 cursor-pointer"
                  title="Очистити пошук"
                >
                  <XIcon size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Права частина */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <IconButton
          icon={<ChatDotsIcon size={18} />}
          onClick={() => openFeedback('feedback')}
          tooltip="Зворотний зв'язок"
        />
        <IconButton
          icon={<GearIcon size={18} />}
          onClick={onOpenSettings}
          tooltip="Налаштування"
        />
      </div>
    </header>
  );
});

Header.displayName = 'Header';