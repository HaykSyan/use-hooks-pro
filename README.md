# 🚀 Use Hooks Pro

A small collection of reusable, typed React hooks (TypeScript) with tests and examples.

## Tech

- React
- TypeScript
- Vite
- Vitest

## Features (quick)

- ✅ `useDebounce` — Debounce a value (great for search inputs)
- ✅ `useThrottle` — Throttle updates or calls (scroll/resize handlers)
- ✅ `useOutsideClick` — Detect clicks outside a referenced element
- ✅ `useOnlineStatus` — Track browser online/offline status
- ✅ `useFetch` — Lightweight fetch hook with loading/error flags and manual/auto modes

## Quick start

Install dependencies and run the dev server:

```bash
# Yarn
yarn install
yarn dev

# npm
npm install
npm run dev
```

Run tests:

```bash
yarn test
# or
npm test
```

## Hooks (API quick reference)

- `useDebounce<T>(value: T, delay: number): T`

  - Returns a debounced version of `value`. Useful for stabilizing inputs before firing network calls.
  - Example: `const debounced = useDebounce(query, 300);`

- `useThrottle<T>(value: T, limitMs: number): T`

  - Returns a throttled value that updates at most once per `limitMs`.
  - Example: `const throttled = useThrottle(scrollY, 200);`

- `useOutsideClick(ref: RefObject<HTMLElement>, callback: () => void): void`

  - Calls `callback` when the user clicks outside `ref.current`.
  - Example: `useOutsideClick(menuRef, () => setOpen(false));`

- `useOnlineStatus(): boolean`

  - Returns `true` when the browser is online, `false` otherwise.
  - Example: `const online = useOnlineStatus();`

- `useFetch<T = unknown>(initialUrl?: RequestInfo | null, initialInit?: RequestInit, options?: { manual?: boolean })`

  - Returns `{ data, error, isLoading, refetch, run, setUrl, setInit }`.
  - Supports aborting previous requests and manual/auto modes.
  - Example (manual):
    ```ts
    const { data, isLoading, refetch } = useFetch("/api/data", undefined, {
      manual: true,
    });
    await refetch();
    ```

  ## Examples (copy/paste)

  Below are small, ready-to-use examples showing how each hook can be used in a component.

  ### useDebounce

  ```tsx
  import { useState, useEffect } from "react";
  import useDebounce from "./src/hooks/useDebounce";

  function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
      if (!debouncedQuery) return;
      // perform search with debouncedQuery
      // fetch(`/search?q=${encodeURIComponent(debouncedQuery)}`)...
    }, [debouncedQuery]);

    return (
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    );
  }
  ```

  ### useThrottle

  ```tsx
  import { useState, useEffect } from "react";
  import useThrottle from "./src/hooks/useThrottle";

  function ThrottledScroll() {
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
  ```

  ### useOutsideClick

  ```tsx
  import { useRef, useState } from "react";
  import useOutsideClick from "./src/hooks/useOutsideClick";

  function Dropdown() {
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
  ```

  ### useOnlineStatus

  ```tsx
  import useOnlineStatus from "./src/hooks/useOnlineStatus";

  function NetworkBanner() {
    const online = useOnlineStatus();
    if (online) return null;
    return <div style={{ background: "salmon" }}>You are offline</div>;
  }
  ```

  ### useFetch

  ```tsx
  import { useEffect } from "react";
  import useFetch from "./src/hooks/useFetch";

  function DataLoader() {
    // manual mode: call refetch() when you want
    const { data, isLoading, error, refetch } = useFetch(
      "/api/items",
      undefined,
      { manual: true }
    );

    useEffect(() => {
      void refetch();
    }, [refetch]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
  ```

## Project structure

```
src/
  ├─ components/
  ├─ hooks/         # hook implementations (useDebounce.ts, useFetch.ts, ...)
  ├─ tests/         # unit tests (Vitest)
  ├─ App.tsx
  └─ main.tsx
```

## Contributing

PRs welcome. Please add tests for new behavior and keep functions small and typed.

## License

MIT © Hayk Sargsyan
