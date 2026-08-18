import { useState } from 'react';
import { motion } from 'motion/react';
import { CopyIcon, CheckIcon, XIcon, WarningIcon } from '@phosphor-icons/react';
import { useFeedback } from '../context/useFeedback';
import { KbdShortcut } from './KbdShortcut';
import { Tooltip } from './Tooltip';

export function TemplateToolbar({ itemRef, greeting, signature }) {
  const { openFeedback } = useFeedback();
  const [copied, setCopied] = useState(false);
  const [addGreeting, setAddGreeting] = useState(false);
  const [addSignature, setAddSignature] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();

    const selection = window.getSelection();
    let selectedText = selection ? selection.toString().trim() : '';

    if (!selectedText && itemRef.current) {
      selectedText = itemRef.current.innerText.trim();
    }

    let textToCopy = selectedText;

    if (addGreeting && greeting) {
      textToCopy = `${greeting}\n\n${textToCopy}`;
    }
    if (addSignature && signature) {
      textToCopy = `${textToCopy}\n\n${signature}`;
    }

    navigator.clipboard.writeText(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 6, x: '-50%' }}
    animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, scale: 0.95, y: 6, x: '-50%' }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
    onMouseDown={(e) => e.preventDefault()}
    onClick={(e) => e.stopPropagation()}
    className="floating-toolbar transform-gpu will-change-transform backface-hidden antialiased absolute -top-12 left-1/2 bg-zinc-900/80 dark:bg-zinc-950/80 backdrop-blur-xl text-zinc-100 rounded-2xl border border-zinc-800 dark:border-zinc-800/80 shadow-xl shadow-stone-950/30 dark:shadow-none ring-1 ring-black/10 dark:ring-white/5 px-2 py-1.5 flex items-center gap-2 z-30 text-xs whitespace-nowrap select-none"
    >
      {/* Кнопка копіювання */}
      <button
        onClick={handleCopy}
        type="button"
        className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/90 hover:bg-orange-600 active:scale-95 text-white font-medium transition-all shadow-[0_2px_12px_rgba(234,88,12,0.35)] hover:shadow-[0_2px_16px_rgba(234,88,12,0.5)] border border-orange-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer select-none"
      >
        {copied ? <CheckIcon size={16} className="text-amber-100" /> : <CopyIcon size={16} />}
        <span>{copied ? 'Скопійовано!' : 'Копіювати'}</span>
      </button>

      {(greeting || signature) && (
        <div className="flex items-stretch gap-1 text-zinc-300 border-x border-white/10 px-1.5">
          {greeting && (
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white active:bg-white/15 transition-all select-none group">
              <input
                type="checkbox"
                checked={addGreeting}
                onChange={(e) => setAddGreeting(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`flex items-center justify-center w-4 h-4 rounded-md border transition-all duration-150 ${
                  addGreeting
                    ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    : 'bg-white/5 border-white/15 text-zinc-500 group-hover:border-white/30'
                }`}
              >
                {addGreeting ? <CheckIcon size={12} weight="bold" /> : <XIcon size={10} weight="bold" className="opacity-40" />}
              </span>
              <span className="leading-none font-medium text-[11px] tracking-wide">Привітання</span>
            </label>
          )}

          {signature && (
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white active:bg-white/15 transition-all select-none group">
              <input
                type="checkbox"
                checked={addSignature}
                onChange={(e) => setAddSignature(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`flex items-center justify-center w-4 h-4 rounded-md border transition-all duration-150 ${
                  addSignature
                    ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    : 'bg-white/5 border-white/15 text-zinc-500 group-hover:border-white/30'
                }`}
              >
                {addSignature ? <CheckIcon size={12} weight="bold" /> : <XIcon size={10} weight="bold" className="opacity-40" />}
              </span>
              <span className="font-medium text-[11px] tracking-wide">Підпис</span>
            </label>
          )}
        </div>
      )}

      {/* Повідомити про помилку */}
      <Tooltip
        position="right"
        content={
          <div className="flex items-center gap-2">
            <span>Повідомити про помилку</span>
            <KbdShortcut keys={['Ctrl', 'Enter']} />
          </div>
        }
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            const selection = window.getSelection();
            const text = selection ? selection.toString().trim() : '';
            openFeedback('error', text);
          }}
          type="button"
          aria-label="Повідомити про помилку (Ctrl + Enter)"
          className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer flex-shrink-0 active:scale-90"
        >
          <WarningIcon size={14} />
        </button>
      </Tooltip>
    </motion.div>
  );
}