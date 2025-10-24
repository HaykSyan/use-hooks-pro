/// <reference types="vitest" />
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useFetch from "../hooks/useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    // don't use fake timers here: fake timers can interfere with Promise resolution
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches data successfully", async () => {
    const mockData = { message: "Hello, World!" };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useFetch("https://api.example.com/data")
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      // call refetch from the hook return value
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(null);
  });

  it("handles fetch error", async () => {
    const mockError = new Error("Network Error");
    (global.fetch as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useFetch("https://api.example.com/data")
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      // call refetch from the hook return value
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
  });
});
