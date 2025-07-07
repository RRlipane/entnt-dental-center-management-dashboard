import { useEffect } from 'react';

export const useFocusTrap = (
  container: React.RefObject<HTMLElement>,
  active: boolean,
  initialRef?: React.RefObject<HTMLElement>,
): void => {
  useEffect(() => {
    if (!active || !container.current) return;

    const focusable = container.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );

    const first = initialRef?.current ?? focusable[0];
    first?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, container, initialRef]);
};
