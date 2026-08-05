import { MagnifyingGlassIcon, WarningIcon } from '@phosphor-icons/react';
import { KbdShortcut } from './KbdShortcut';

export function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-4 text-center border-t border-stone-300/60 dark:border-zinc-800/80 text-stone-500 dark:text-zinc-500 select-none">
      {/* Підказки з комбінаціями клавіш */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium mb-4">
        <div className="flex items-center gap-1.5 bg-stone-200/50 dark:bg-zinc-900/60 px-1.5 py-1.5 rounded-xl border border-stone-300/50 dark:border-zinc-800">
          <MagnifyingGlassIcon size={13} className="ml-1 text-stone-400 dark:text-zinc-500" />
          <span className='leading-none'>Пошук:</span>
          <KbdShortcut keys={['Ctrl', 'F']} />
        </div>

        <div className="flex items-center gap-1.5 bg-stone-200/50 dark:bg-zinc-900/60 px-1.5 py-1.5 rounded-xl border border-stone-300/50 dark:border-zinc-800">
          <WarningIcon size={13} className="ml-1 text-stone-400 dark:text-zinc-500" />
          <span className='leading-none'>Помилка у виділеному тексті:</span>
          <KbdShortcut keys={['Ctrl', 'Enter']} />
        </div>
      </div>

      <p className="text-xs">
        © {new Date().getFullYear()} База шаблонів. Всі права захищено.
      </p>
    </footer>
  );
}