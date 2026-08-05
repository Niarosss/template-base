import { motion } from 'motion/react';

export function PacmanLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-100/90 dark:bg-zinc-950/90 backdrop-blur-md text-stone-900 dark:text-zinc-100 select-none"
    >
      <div className="relative flex items-center justify-center h-8">

        {/* Pac-Man */}
        <div className="relative w-8 h-8 flex-shrink-0 z-10">
          {/* Верхня щелепа */}
          <motion.div
            animate={{ rotate: [0, -70, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            className="absolute top-0 w-8 h-4 bg-stone-900 dark:bg-zinc-100 rounded-t-full origin-bottom"
          >
            {/* Око */}
            <div className="absolute top-1.5 left-4 w-1 h-1 bg-stone-100 dark:bg-zinc-950 rounded-full" />
          </motion.div>

          {/* Нижня щелепа */}
          <motion.div
            animate={{ rotate: [0, 70, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            className="absolute bottom-0 w-8 h-4 bg-stone-900 dark:bg-zinc-100 rounded-b-full origin-top"
          />
        </div>

        {/* Трек кульок (-ml-4 заводить лівий край точно під рот Пакмана) */}
        <div className="w-20 h-8 overflow-hidden relative flex items-center -ml-4 z-0">
          <motion.div
            animate={{ x: [0, -24] }}
            transition={{
              repeat: Infinity,
              duration: 0.5,
              ease: 'linear',
            }}
            className="flex items-center gap-4 pl-4"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-stone-400 dark:bg-zinc-600 flex-shrink-0"
              />
            ))}
          </motion.div>
        </div>
      </div>

      <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.25em] text-stone-400 dark:text-zinc-500">
        Завантаження...
      </p>
    </motion.div>
  );
}