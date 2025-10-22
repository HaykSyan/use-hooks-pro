import { useEffect, useRef, useState } from "react";

/**
 * @description Custom hook to Throttle value
 * @template T the type of the value to be throttled
 * @param {T} value The value to throttle
 * @param {number} delay The throttle delay in milliseconds
 * @returns {T} The throttled value
 */
export default function useThrottle<T>(value: T, delay: number) {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }
    }, delay - (Date.now() - lastExecuted.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}
