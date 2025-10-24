import { useState, useRef, useCallback, useEffect } from "react";

type UseFetchOptions = {
  manual?: boolean;
};

type UseFetchReturn<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  // kick off a fetch using the last used url/init
  refetch: () => Promise<T | null>;
  // start a fetch for a specific url/init and return typed data
  run: <U = T>(url: RequestInfo, init?: RequestInit) => Promise<U | null>;
  // allow updating defaults
  setUrl: (url: RequestInfo | null) => void;
  setInit: (init?: RequestInit) => void;
};

export default function useFetch<T = unknown>(
  initialUrl?: RequestInfo | null,
  initialInit?: RequestInit,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const [url, setUrl] = useState<RequestInfo | null>(initialUrl ?? null);
  const [init, setInit] = useState<RequestInit | undefined>(initialInit);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(
    async (overrideUrl?: RequestInfo | null, overrideInit?: RequestInit) => {
      const finalUrl = overrideUrl ?? url;
      if (!finalUrl) {
        setError(new Error("No URL provided"));
        return null;
      }

      // Abort previous request
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(finalUrl, {
          ...(overrideInit ?? init),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Fetch error: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type") ?? "";
        let parsed: unknown;
        if (contentType.includes("application/json")) {
          parsed = await response.json();
        } else {
          parsed = await response.text();
        }

        if (!isMounted.current) return null;

        setData(parsed as T);
        setIsLoading(false);
        return parsed as T;
      } catch (err: any) {
        // Ignore aborts
        if (err?.name === "AbortError") {
          return null;
        }

        if (!isMounted.current) return null;

        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, init] // intentionally minimal deps
  );

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const run = useCallback(
    async <U = T>(runUrl: RequestInfo, runInit?: RequestInit) => {
      // update defaults so subsequent refetch uses them
      setUrl(runUrl);
      setInit(runInit);
      const result = await fetchData(runUrl, runInit);
      return result as U | null;
    },
    [fetchData]
  );

  useEffect(() => {
    isMounted.current = true;
    if (!options.manual && url) {
      // kick off initial fetch automatically when not manual and url exists
      void fetchData();
    }
    return () => {
      isMounted.current = false;
      controllerRef.current?.abort();
    };
  }, [url, options.manual, fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch,
    run,
    setUrl,
    setInit,
  };
}
