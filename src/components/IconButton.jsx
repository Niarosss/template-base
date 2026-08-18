import React from 'react';
import { Tooltip } from './Tooltip';

export function IconButton({
  icon: Icon,
  onClick,
  tooltip,
  tooltipPosition,
  active = false,
  variant = 'default', // 'default' | 'ghost'
  size = 'md', // 'xs' | 'sm' | 'md'
  ariaLabel,
  className = '',
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
  }[size] || 'p-2';

  let variantClasses = '';
  if (variant === 'ghost') {
    variantClasses =
      'text-stone-400 dark:text-zinc-500 hover:text-stone-800 dark:hover:text-zinc-200 hover:bg-stone-200/60 dark:hover:bg-zinc-800';
  } else if (active) {
    variantClasses =
      'bg-stone-200/90 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm';
  } else {
    variantClasses =
      'bg-white/80 dark:bg-zinc-900/80 border border-stone-300/80 dark:border-zinc-800 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 shadow-sm';
  }

  const buttonElement = (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || tooltip}
      className={`rounded-xl transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0 flex items-center justify-center ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
}