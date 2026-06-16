import { useCallback, useRef } from 'react';

type Setter<T> = (value: T) => void;

/**
 * 用于表单 → store 的防抖 setter
 */
export function useDebouncedStoreSetter<T>(setter: Setter<T>, delay = 300) {
  const timerRef = useRef<number | null>(null);

  return useCallback(
    (value: T) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setter(value);
      }, delay);
    },
    [setter, delay],
  );
}
