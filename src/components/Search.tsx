import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

export default function Search() {
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
