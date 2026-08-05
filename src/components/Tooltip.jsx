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

      // Беремо ширину та висоту БЕЗ урахування скролбарів
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      let actualPosition = position;

      // 1. Автоперевертання за необхідності
      if (position === 'top' && triggerRect.top - margin - tooltipRect.height < screenMargin) {
        actualPosition = 'bottom';
      } else if (position === 'bottom' && triggerRect.bottom + margin + tooltipRect.height > viewportHeight - screenMargin) {
        actualPosition = 'top';
      }

      let top = 0;
      let left = 0;

      if (actualPosition === 'bottom') {
        top = triggerRect.bottom + margin;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      } else if (actualPosition === 'top') {
        top = triggerRect.top - margin - tooltipRect.height;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      } else if (actualPosition === 'right') {
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + margin;
      } else if (actualPosition === 'left') {
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - margin - tooltipRect.width;
      }

      // 2. Клемпінг по горизонталі (зараз чітко враховує лівий край скролбару)
      if (left < screenMargin) {
        left = screenMargin;
      } else if (left + tooltipRect.width > viewportWidth - screenMargin) {
        left = viewportWidth - screenMargin - tooltipRect.width;
      }

      // 3. Клемпінг по вертикалі
      if (top < screenMargin) {
        top = screenMargin;
      } else if (top + tooltipRect.height > viewportHeight - screenMargin) {
        top = viewportHeight - screenMargin - tooltipRect.height;
      }

      setCoords({ top, left, actualPosition });
    }
  }, [isVisible, position, content]);

  const effectivePosition = coords?.actualPosition || position;
  const initialY = effectivePosition === 'bottom' ? -4 : effectivePosition === 'top' ? 4 : 0;
  const initialX = effectivePosition === 'right' ? -4 : effectivePosition === 'left' ? 4 : 0;

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
              initial={{ opacity: 0, scale: 0.94, y: initialY, x: initialX }}
              animate={{ opacity: coords ? 1 : 0, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.1 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
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
                backdrop-blur-md"
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