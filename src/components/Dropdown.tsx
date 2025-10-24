import { useRef, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

export default function Dropdown() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen((v) => !v)}>Toggle</button>
      {open && <div className="menu">Menu content</div>}
    </div>
  );
}
