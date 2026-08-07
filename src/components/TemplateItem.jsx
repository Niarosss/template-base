import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AnimatePresence } from 'motion/react';
import { highlightText } from '../utils/parser';
import { TemplateToolbar } from './TemplateToolbar';

export function TemplateItem({ cardId, rawMarkdown, greeting, signature, isSelected, autoSelect, searchQuery }) {
  const itemRef = useRef(null);

  const handleClick = () => {
    if (autoSelect && itemRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(itemRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div
      data-card-id={cardId}
      onClick={handleClick}
      className="template-item relative p-3 rounded-2xl transition-all cursor-text select-text hover:bg-stone-200/80 dark:hover:bg-zinc-900/60"
    >
      <AnimatePresence>
        {isSelected && (
          <TemplateToolbar
            itemRef={itemRef}
            greeting={greeting}
            signature={signature}
          />
        )}
      </AnimatePresence>

      <div ref={itemRef} className="max-w-none text-left text-sm @[500px]:text-base leading-relaxed text-stone-900 dark:text-zinc-100 space-y-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => (
              <p className="whitespace-pre-line">
                {highlightText(children, searchQuery)}
              </p>
            ),
            u: ({ children }) => (
              <u className="underline underline-offset-4 decoration-stone-400 dark:decoration-zinc-500">
                {children}
              </u>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            i: ({ children }) => <i className="italic">{children}</i>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline underline-offset-4 hover:text-orange-500 hover:decoration-orange-500 transition-colors break-all"
              >
                {children}
              </a>
            ),
          }}
        >
          {rawMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}