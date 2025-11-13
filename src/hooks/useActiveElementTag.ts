// hooks/useActiveElementTag.ts
import { useState, useEffect } from 'react';

/**
 * Hook to detect the tagName of the DOM element that currently has focus.
 * @returns {string | null} The tagName of the focused element (e.g. 'INPUT', 'TEXTAREA', 'BUTTON')
 * or null if no relevant element is focused.
 */
export const useActiveElementTag = (): string | null => {
  const [activeElementTag, setActiveElementTag] = useState<string | null>(null);

  useEffect(() => {
    const updateActiveElement = () => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement !== document.body) {
        setActiveElementTag(activeElement.tagName);
      } else {
        setActiveElementTag(null);
      }
    };

    // Initialize state on mount
    updateActiveElement();

    // Listen for focus changes globally
    document.addEventListener('focusin', updateActiveElement);
    document.addEventListener('focusout', updateActiveElement);

    return () => {
      document.removeEventListener('focusin', updateActiveElement);
      document.removeEventListener('focusout', updateActiveElement);
    };
  }, []);

  return activeElementTag;
};