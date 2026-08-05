import { SunIcon, MoonIcon, DesktopIcon } from '@phosphor-icons/react';
import { Modal } from './Modal';

export function SettingsModal({ isOpen, onClose, theme, setTheme, autoSelect, setAutoSelect }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-md"
      title="Налаштування"
    >
      <div className="space-y-6">
        {/* Перемикач теми */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            Тема оформлення
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 dark:bg-zinc-950/60 border border-stone-300/60 dark:border-zinc-800/80 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                theme === 'light'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <SunIcon size={16} />
              <span className="truncate">Світла</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <MoonIcon size={16} />
              <span className="truncate">Темна</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                theme === 'system'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <DesktopIcon size={16} />
              <span className="truncate">Системна</span>
            </button>
          </div>
        </div>

        {/* Тогл автовиділення */}
        <div className="flex items-center justify-between pt-1 gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
              Автовиділення шаблону
            </div>
            <div className="text-xs text-stone-500 dark:text-zinc-400">
              Виділяти весь текст при кліку ЛКМ
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAutoSelect(!autoSelect)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
              autoSelect ? 'bg-orange-600 shadow-sm shadow-orange-600/30' : 'bg-stone-300 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                autoSelect ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
}