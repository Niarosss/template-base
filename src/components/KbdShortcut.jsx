import React from 'react';

export function KbdShortcut({ 
  keys = [], 
  rounded = 'rounded-md', 
  className = '' 
}) {
  if (!keys.length) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-stone-400 dark:text-zinc-500 leading-none font-medium select-none ${className}`}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className={`inline-flex items-center justify-center leading-none font-mono text-[10px] min-w-[18px] px-1.5 py-1 bg-white dark:bg-zinc-800 border border-stone-300/80 dark:border-zinc-700/80 text-stone-700 dark:text-zinc-300 shadow-2xs font-medium ${rounded}`}>
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="text-[11px] opacity-70">+</span>}
        </React.Fragment>
      ))}
    </span>
  );
}