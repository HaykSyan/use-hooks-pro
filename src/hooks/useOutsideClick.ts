import { useEffect } from "react";

/**
 * @description Custom hook to handle outside click events
 * @param {React.RefObject<HTMLElement>} ref - The ref of the element to detect outside clicks
 * @param {() => void} callback - The callback to call when an outside click is detected
 */
export default function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
