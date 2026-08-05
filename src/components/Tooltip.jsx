import { useState, useRef, useLayoutEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

export function Tooltip({ 
  content, 
  children, 
  position = 'bottom', // 'bottom' | 'top' | 'left' | 'right'
  delay = 150 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState(null);
  
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipId = useId();

  const handleShow = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    setCoords(null);
  };

  useLayoutEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const triggerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const margin = 8;
      const screenMargin = 12;

      const viewportWidth = document.documentElement.clientWidth;

      let top = 0;
      let left = 0;

      // Жорстке позиціонування за пропом position
      if (position === 'bottom') {
        top = triggerRect.bottom + margin;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      } else if (position === 'top') {
        top = triggerRect.top - margin - tooltipRect.height;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      } else if (position === 'right') {
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + margin;
      } else if (position === 'left') {
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - margin - tooltipRect.width;
      }

      // Клемпінг ТІЛЬКИ по горизонталі (щоб не виходив за бічні межі екрана)
      if (left < screenMargin) {
        left = screenMargin;
      } else if (left + tooltipRect.width > viewportWidth - screenMargin) {
        left = viewportWidth - screenMargin - tooltipRect.width;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position, content]);

  // Анімація висування напряму від позиції
  const fromY = position === 'bottom' ? -5 : position === 'top' ? 5 : 0;
  const fromX = position === 'right' ? -5 : position === 'left' ? 5 : 0;

  return (
    <div 
      ref={containerRef}
      className="inline-flex items-center"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
      aria-describedby={tooltipId}
    >
      {children}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && content && (
            <motion.div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0 }}
              animate={
                coords 
                  ? { opacity: 1, y: [fromY, 0], x: [fromX, 0] } 
                  : { opacity: 0 }
              }
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: `${coords?.top ?? 0}px`,
                left: `${coords?.left ?? 0}px`,
                visibility: coords ? 'visible' : 'hidden',
              }}
              className="z-[100] pointer-events-none whitespace-nowrap 
                px-2.5 py-1 rounded-xl text-xs font-medium select-none
                bg-white/95 dark:bg-zinc-900/95 
                text-stone-700 dark:text-zinc-200 
                border border-stone-300/80 dark:border-zinc-700/80 
                shadow-lg shadow-stone-900/5 dark:shadow-black/20 
                backdrop-blur-md [backface-visibility:hidden] transform-gpu"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}