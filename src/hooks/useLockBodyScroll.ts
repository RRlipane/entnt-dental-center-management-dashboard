import { useLayoutEffect } from 'react';

export const useLockBodyScroll = (lock: boolean): void => {
  useLayoutEffect(() => {
    if (!lock) return; // do nothing

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* cleanup */
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
};
