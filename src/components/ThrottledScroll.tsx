import { useState, useEffect } from "react";
import useThrottle from "../hooks/useThrottle";

export default function ThrottledScroll() {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    function onScroll() {
      setPos(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // throttledPos updates at most once every 200ms
  const throttledPos = useThrottle(pos, 200);

  return <div>Throttled scroll Y: {throttledPos}</div>;
}
