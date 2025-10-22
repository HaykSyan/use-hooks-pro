import { useEffect, useState } from "react";

/**
 * @description Custom hook to Debounce value
 * @template T the type of the value to be debounced
 * @param {T} value The value to debounce
 * @param {number} delay The debounce delay in milliseconds
 * @returns {T} The debounced value
 */
export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
