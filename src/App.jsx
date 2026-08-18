import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AnimatePresence } from 'motion/react';

import { GRID_CLASSES, parseGlobals } from './utils/parser';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SectionBlock } from './components/SectionBlock';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';
import { PacmanLoader } from './components/PacmanLoader';
import { FeedbackProvider } from './context/FeedbackContext';
import { useFeedback } from './context/useFeedback';
import { slugify } from './utils/slugify';

function AppContent({ rawMarkdown }) {
  const { openFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(true);

  const { greeting, signature, body } = useMemo(
    () => parseGlobals(rawMarkdown || ''),
    [rawMarkdown]
  );

  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".84em" font-size="84">🐼</text></svg>`;
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;

  }, []);

  useEffect(() => {
    if (rawMarkdown) {
      const animationFrame = requestAnimationFrame(() => {
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [rawMarkdown]);

  const [selectedId, setSelectedId] = useState(null);
  const [activeHeadingId, setActiveHeadingId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [matchCount, setMatchCount] = useState(0);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  const searchInputRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [autoSelect, setAutoSelect] = useState(() => {
    const saved = localStorage.getItem('autoSelect');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const navigationTree = useMemo(() => {
    if (!body) return [];
    const tree = [];
    let currentH1 = null;

    const lines = body.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        const title = trimmed.replace(/^#\s+/, '').trim();
        const id = `h1-${slugify(title)}`;
        currentH1 = { id, title, children: [] };
        tree.push(currentH1);
      } else if (trimmed.startsWith('## ')) {
        const title = trimmed.replace(/^##\s+/, '').trim();
        const id = `h2-${slugify(title)}`;
        if (!currentH1) {
          currentH1 = { id: 'h1-general', title: 'Загальне', children: [] };
          tree.push(currentH1);
        }
        if (!currentH1.children.some(c => c.id === id)) {
          currentH1.children.push({ id, title });
        }
      }
    });

    return tree;
  }, [body]);

  const handleSelectHeading = (id) => {
    setActiveHeadingId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : '';

        if (text) {
          e.preventDefault();
          openFeedback('error', text);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openFeedback]);

  const updateActiveMark = (marks, index) => {
    marks.forEach((m, i) => {
      if (i === index) {
        m.classList.add('ring-1', 'ring-indigo-500', 'bg-amber-400', 'dark:bg-amber-400');
        m.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        m.classList.remove('ring-1', 'ring-indigo-500', 'bg-amber-400', 'dark:bg-amber-400');
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const marks = document.querySelectorAll('mark.search-highlight');
      setMatchCount(marks.length);

      if (marks.length > 0) {
        setActiveMatchIndex(0);
        updateActiveMark(marks, 0);
      } else {
        setActiveMatchIndex(0);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNextMatch = () => {
    const marks = document.querySelectorAll('mark.search-highlight');
    if (marks.length === 0) return;

    const nextIdx = (activeMatchIndex + 1) % marks.length;
    setActiveMatchIndex(nextIdx);
    updateActiveMark(marks, nextIdx);
  };

  const handlePrevMatch = () => {
    const marks = document.querySelectorAll('mark.search-highlight');
    if (marks.length === 0) return;

    const prevIdx = (activeMatchIndex - 1 + marks.length) % marks.length;
    setActiveMatchIndex(prevIdx);
    updateActiveMark(marks, prevIdx);
  };

  useEffect(() => {
  const handleKeyDown = (e) => {
    // 1. Зворотний зв'язок на виділений текст
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const text = window.getSelection()?.toString().trim();
      if (text) {
        e.preventDefault();
        openFeedback('error', text);
        return;
      }
    }

    // 2. Фокус на пошук (Ctrl+F, Ctrl+K, /)
    const isSearchHotKey = (e.ctrlKey || e.metaKey) && (e.code === 'KeyF' || e.code === 'KeyK');
    const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    if (isSearchHotKey || isSlash) {
      e.preventDefault();
      e.stopPropagation();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
      return;
    }

    // 3. Системний перехід F3 / Shift+F3
    if (e.key === 'F3') {
      e.preventDefault();
      if (e.shiftKey) handlePrevMatch();
      else handleNextMatch();
    }
  };

  window.addEventListener('keydown', handleKeyDown, true);
  return () => window.removeEventListener('keydown', handleKeyDown, true);
}, [openFeedback, activeMatchIndex, matchCount]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
        setSelectedId(null);
        return;
      }

      const anchorNode = selection.anchorNode;
      if (!anchorNode) return;

      const element = anchorNode.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode.parentElement;
      const itemEl = element?.closest('.template-item');

      if (itemEl && itemEl.dataset.cardId) {
        setSelectedId(itemEl.dataset.cardId);
      } else {
        setSelectedId(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('autoSelect', JSON.stringify(autoSelect));
  }, [autoSelect]);

  const renderContent = (content) => {
    if (!content) return null;
    const parts = content.split(/(:::\s*cols-\d+[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      const match = part.match(/^:::\s*cols-(\d+)([\s\S]*?):::$/);

      if (match) {
        const colsCount = parseInt(match[1], 10) || 2;
        const innerMd = match[2].trim();
        const gridClass = GRID_CLASSES[colsCount] || GRID_CLASSES[2];

        const sections = innerMd.split(/(?=\n##\s|^##\s)/g).filter(Boolean);

        return (
          <div key={index} className={`grid ${gridClass} gap-6 my-8 items-stretch`}>
            {sections.map((secMd, secIdx) => {
              const firstLine = secMd.trim().split('\n')[0] || '';
              const titleMatch = firstLine.match(/^##\s*(.*)/);
              const title = titleMatch ? titleMatch[1].trim() : '';
              const sectionId = title ? `h2-${slugify(title)}` : undefined;

              return (
                <SectionBlock
                  key={secIdx}
                  id={sectionId}
                  sectionMd={secMd.trim()}
                  greeting={greeting}
                  signature={signature}
                  selectedId={selectedId}
                  autoSelect={autoSelect}
                  searchQuery={searchQuery}
                />
              );
            })}
          </div>
        );
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Без highlightText — h1 не бере участі в пошуку
            h1: ({ children }) => {
              const text = Array.isArray(children) ? children.join('') : String(children || '');
              const h1Id = `h1-${slugify(text)}`;
              return (
                <h1 id={h1Id} className="scroll-mt-24 uppercase tracking-[0.2em] text-center text-lg md:text-2xl font-bold text-stone-900 dark:text-zinc-100 mt-10 mb-6 select-none">
                  {children}
                </h1>
              );
            },
          }}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-200/60 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors duration-200">
      <AnimatePresence>
        {isLoading && <PacmanLoader key="pacman-loader" />}
      </AnimatePresence>

      <Header 
        ref={searchInputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        matchCount={matchCount}
        activeMatchIndex={activeMatchIndex}
        onNextMatch={handleNextMatch}
        onPrevMatch={handlePrevMatch}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex relative w-full">
        <Sidebar 
          tree={navigationTree}
          activeId={activeHeadingId}
          onSelectHeading={handleSelectHeading}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 min-w-0 px-4 sm:px-8 pb-8 transition-colors duration-200 @container flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
            <main className="flex-1">{renderContent(body)}</main>

            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              theme={theme}
              setTheme={setTheme}
              autoSelect={autoSelect}
              setAutoSelect={setAutoSelect}
            />

            <FeedbackModal />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App({ rawMarkdown }) {
  return (
    <FeedbackProvider>
      <AppContent rawMarkdown={rawMarkdown} />
    </FeedbackProvider>
  );
}