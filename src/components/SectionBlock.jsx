import React from 'react';
import { TemplateItem } from './TemplateItem';
import { highlightText } from '../utils/parser';
import { slugify } from '../utils/slugify';

export function SectionBlock({ id, sectionMd, greeting, signature, selectedId, autoSelect, searchQuery }) {
  const lines = sectionMd.trim().split('\n');
  let title = '';
  const contentLines = [];

  for (const line of lines) {
    if (!title && line.trim().startsWith('##')) {
      title = line.replace(/^##\s*/, '').trim();
    } else {
      contentLines.push(line);
    }
  }

  const sectionContent = contentLines.join('\n');
  const rawTemplates = sectionContent.split(/\n\s*---\s*\n/g).filter(t => t.trim().length > 0);
  const computedId = id || (title ? `h2-${slugify(title)}` : undefined);

  return (
    <div 
      id={computedId}
      className="scroll-mt-24 bg-stone-100/60 dark:bg-zinc-800/40 border border-stone-300/70 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
    >
      {/* Заголовок секції (h2) підсвічується при пошуку */}
      {title && (
        <div className="select-none shrink-0 mb-3">
          <h2 className="uppercase tracking-[0.18em] text-md md:text-lg font-semibold text-stone-900 dark:text-zinc-100 text-center pb-3">
            {highlightText(title, searchQuery)}
          </h2>
          <div className="w-full h-px bg-stone-300/80 dark:bg-zinc-800" />
        </div>
      )}

      {/* Список шаблонів */}
      <div className="flex-1 flex flex-col">
        {rawTemplates.map((tplMd, idx) => {
          const cardId = `${title}-${idx}`;
          return (
            <React.Fragment key={cardId}>
              {idx > 0 && (
                <div className="flex justify-center my-3.5 shrink-0">
                  <div className="w-12 h-px bg-stone-300/70 dark:bg-zinc-800/80 rounded-full" />
                </div>
              )}
              <TemplateItem
                cardId={cardId}
                rawMarkdown={tplMd.trim()}
                greeting={greeting}
                signature={signature}
                isSelected={selectedId === cardId}
                autoSelect={autoSelect}
                searchQuery={searchQuery}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}