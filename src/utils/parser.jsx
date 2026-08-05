import React from 'react';

export const GRID_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @[500px]:grid-cols-2',
  3: 'grid-cols-1 @[480px]:grid-cols-2 @[750px]:grid-cols-3',
  4: 'grid-cols-1 @[480px]:grid-cols-2 @[900px]:grid-cols-4',
};

export function parseGlobals(rawText) {
  let greeting = '';
  let signature = '';
  let body = rawText || '';

  body = body.replace(/:::\s*greeting\s*([\s\S]*?):::/g, (_, m) => {
    greeting = m.trim();
    return '';
  });

  body = body.replace(/:::\s*signature\s*([\s\S]*?):::/g, (_, m) => {
    signature = m.trim();
    return '';
  });

  return { greeting, signature, body: body.trim() };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(children, query) {
  if (!query || !query.trim()) return children;

  const cleanQuery = query.trim();

  if (typeof children === 'string') {
    const regex = new RegExp(`(${escapeRegExp(cleanQuery)})`, 'gi');
    const parts = children.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === cleanQuery.toLowerCase() ? (
        <mark 
          key={i} 
          className="search-highlight bg-amber-300 dark:bg-amber-500/80 text-slate-950 rounded-sm px-0.5 transition-all duration-200"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => <React.Fragment key={i}>{highlightText(child, query)}</React.Fragment>);
  }

  if (React.isValidElement(children) && children.props && children.props.children) {
    return React.cloneElement(children, {
      children: highlightText(children.props.children, query),
    });
  }

  return children;
}