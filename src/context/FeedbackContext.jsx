import { useState, useCallback } from 'react';
import { FeedbackContext } from './feedbackContext';

export function FeedbackProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('feedback'); // 'error' | 'request' | 'feedback'
  const [selectedText, setSelectedText] = useState('');

  const openFeedback = useCallback((initialType = 'feedback', initialText = '') => {
    setType(initialType);
    setSelectedText(initialText);
    setIsOpen(true);
  }, []);

  const closeFeedback = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <FeedbackContext.Provider value={{ isOpen, type, selectedText, openFeedback, closeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}