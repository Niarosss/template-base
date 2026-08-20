import { useEffect, useRef, useState } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from './IconButton';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, title, subtitle, maxWidth = 'max-w-lg', children }) {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Блокування скролу сторінки
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

  // Focus Trap, Escape та повернення фокуса
  useEffect(() => {
  if (!isOpen) return;

  previouslyFocusedElementRef.current = document.activeElement;

  // Фокусуємо сам контейнер (tabIndex={-1}), щоб уникнути появи тултіпа
  const timer = setTimeout(() => {
    modalRef.current?.focus();
  }, 50);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      );

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Якщо фокус все ще на самому контейнері модалки
      if (document.activeElement === modalRef.current) {
        e.preventDefault();
        if (e.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
        return;
      }

      // Циклічний перехід між елементами
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    clearTimeout(timer);
    window.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocusedElementRef.current?.focus) {
      previouslyFocusedElementRef.current.focus();
    }
  };
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
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 8,
              transition: { duration: 0.15, ease: 'easeOut' }
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full ${maxWidth} rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/80 p-6 shadow-xl border border-stone-200/80 dark:border-zinc-800 outline-none`}
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