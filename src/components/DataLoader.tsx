import { useEffect } from "react";
import useFetch from "../hooks/useFetch";

export default function DataLoader() {
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
