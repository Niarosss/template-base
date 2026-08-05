import { useEffect, useState } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from './IconButton';

export function Modal({ isOpen, onClose, title, subtitle, maxWidth = 'max-w-lg', children }) {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(width);

      document.body.style.overflow = 'hidden';
      if (width > 0) {
        document.body.style.paddingRight = `${width}px`;
      }
    }
  }, [isOpen]);

  const handleExitComplete = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 bg-stone-950/40 dark:bg-black/70 backdrop-blur-sm" 
            onClick={onClose} 
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 8,
              transition: { duration: 0.15, ease: 'easeOut' }
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full ${maxWidth} rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 p-6 shadow-xl border border-stone-200/80 dark:border-zinc-800`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {title || subtitle ? (
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-300/60 dark:border-zinc-800">
                <div className="space-y-0.5">
                  {title && (
                    <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
                      {subtitle}
                    </p>
                  )}
                </div>
                <IconButton
                  icon={<XIcon size={18} />}
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  tooltip="Закрити"
                  tooltipPosition="left"
                />
              </div>
            ) : (
              <IconButton
                icon={<XIcon size={18} />}
                onClick={onClose}
                variant="ghost"
                size="sm"
                tooltip="Закрити"
                tooltipPosition="left"
                className="absolute top-5 right-5"
              />
            )}

            {/* Content */}
            <div className={title || subtitle ? 'pt-4' : ''}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}