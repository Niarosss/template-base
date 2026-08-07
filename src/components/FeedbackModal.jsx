import { useState, useEffect } from 'react';
import { 
  WarningIcon, 
  LightbulbIcon, 
  ChatTextIcon, 
  QuotesIcon, 
  PaperPlaneRightIcon,
  CheckIcon
} from '@phosphor-icons/react';
import { useFeedback } from '../context/useFeedback';
import { Modal } from './Modal';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export function FeedbackModal() {
  const { isOpen, type: initialType, selectedText: initialSelectedText, closeFeedback } = useFeedback();

  const [type, setType] = useState(initialType);
  const [selectedText, setSelectedText] = useState(initialSelectedText);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setSelectedText(initialSelectedText);
      setStatus('idle');
      setMessage('');
      setContact('');
      setHoneypot('');
      setErrors({});
    }
  }, [isOpen, initialType, initialSelectedText]);

  const validate = () => {
    const newErrors = {};
    const trimmedMessage = message.trim();
    const trimmedContact = contact.trim();

    if (!trimmedMessage) {
      newErrors.message = 'Повідомлення не може бути порожнім';
    } else if (trimmedMessage.length < 5) {
      newErrors.message = 'Напишіть трохи детальніше (мінімум 5 символів)';
    }

    if (trimmedContact && trimmedContact.length < 3) {
      newErrors.contact = 'Контакт занадто короткий (мінімум 3 символи)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          selectedText: selectedText ? selectedText.trim().slice(0, 1000) : '',
          message: message.trim(),
          contact: contact.trim(),
          honeypot,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      setStatus('success');
      setTimeout(() => {
        closeFeedback();
      }, 1500);
    } catch (err) {
      setStatus('idle');
      setErrors({ general: 'Не вдалося надіслати відгук. Спробуйте пізніше.' });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeFeedback} 
      maxWidth="max-w-lg"
      title={status !== 'success' ? "Зворотний зв'язок" : undefined}
      subtitle={status !== 'success' ? "Допоможіть зробити базу шаблонів кращою" : undefined}
    >
      {status === 'success' ? (
        <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckIcon size={24} weight="bold" />
          </div>
          <h3 className="text-lg font-bold">Дякуємо за відгук!</h3>
          <p className="text-sm text-stone-500 dark:text-zinc-400">Повідомлення успішно надіслано.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
          {/* Honeypot приховане поле */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          {/* Банер загальної помилки сервера */}
          {errors.general && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <WarningIcon size={16} className="shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Перемикач типу відгуку */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 dark:bg-zinc-950/60 border border-stone-300/60 dark:border-zinc-800/80 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setType('error')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                type === 'error'
                  ? 'bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <WarningIcon size={15} />
              <span className="truncate">Помилка</span>
            </button>

            <button
              type="button"
              onClick={() => setType('request')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                type === 'request'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <LightbulbIcon size={15} />
              <span className="truncate">Запит</span>
            </button>

            <button
              type="button"
              onClick={() => setType('feedback')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                type === 'feedback'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
              }`}
            >
              <ChatTextIcon size={15} />
              <span className="truncate">Відгук</span>
            </button>
          </div>

          {/* Виділений текст */}
          {selectedText && (
            <div className="bg-stone-200/50 dark:bg-zinc-950/40 border border-stone-300/70 dark:border-zinc-800/80 rounded-2xl p-3 text-xs sm:text-sm space-y-1.5 relative">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <QuotesIcon size={14} className="text-orange-500" />
                  Виділений текст:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedText('')}
                  className="hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Прибрати
                </button>
              </div>
              <p className="italic text-stone-700 dark:text-zinc-300 line-clamp-3 bg-white/50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-stone-300/40 dark:border-zinc-800 leading-relaxed">
                "{selectedText}"
              </p>
            </div>
          )}

          {/* Поле повідомлення */}
          <div>
            <label 
              htmlFor="feedback-message" 
              className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-zinc-300 mb-1.5 cursor-pointer"
            >
              {type === 'error' ? 'Опис помилки або уточнення' : type === 'request' ? 'Опис потрібного шаблону' : 'Ваш коментар'}
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={2000}
              value={message}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "feedback-message-error" : undefined}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
              }}
              placeholder={
                type === 'error' 
                  ? 'Вкажіть, що саме не так...' 
                  : type === 'request' 
                  ? 'Опишіть ситуацію чи тему для нових шаблонів...' 
                  : 'Ваші враження чи пропозиції...'
              }
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950/60 hover:bg-white dark:hover:bg-zinc-950/90 border rounded-2xl text-sm font-sans text-stone-800 dark:text-zinc-200 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all resize-none shadow-sm leading-relaxed ${
                errors.message 
                  ? 'border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500' 
                  : 'border-stone-300/80 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500/70'
              }`}
            />
            {errors.message && (
              <p 
                id="feedback-message-error"
                className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <WarningIcon size={14} className="shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Поле контакту */}
          <div>
            <label 
              htmlFor="feedback-contact" 
              className="block text-xs sm:text-sm font-semibold text-stone-700 dark:text-zinc-300 mb-1.5 cursor-pointer"
            >
              Контакт для зв'язку <span className="text-stone-400 dark:text-zinc-500 font-normal">(необов'язково)</span>
            </label>
            <input
              id="feedback-contact"
              type="text"
              maxLength={100}
              value={contact}
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? "feedback-contact-error" : undefined}
              onChange={(e) => {
                setContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: null }));
              }}
              placeholder="Telegram @username або Email"
              className={`w-full px-3.5 py-2 bg-white dark:bg-zinc-950/60 hover:bg-white dark:hover:bg-zinc-950/90 border rounded-2xl text-sm font-sans text-stone-800 dark:text-zinc-200 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all shadow-sm ${
                errors.contact
                  ? 'border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-stone-300/80 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500/70'
              }`}
            />
            {errors.contact && (
              <p 
                id="feedback-contact-error"
                className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <WarningIcon size={14} className="shrink-0" />
                <span>{errors.contact}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            <PaperPlaneRightIcon size={16} weight="bold" />
            <span>{status === 'submitting' ? 'Надсилання...' : 'Надіслати'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
}