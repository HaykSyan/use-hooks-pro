import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useDebounce from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("returns the initial value immediately", () => {
    const { result } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );
    expect(result.current).toBe("initial");
  });
  it("updates the debounced value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );
    expect(result.current).toBe("a");
    rerender({ value: "b", delay: 500 });
    // not updated before delay
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("a");
    // updated after delay
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");
  });
  it("resets the timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );
    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // change again before first debounce finishes
    rerender({ value: "c", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // still should be the original until the latest delay completes
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("c");
  });
  it("works with a generic object type", () => {
    type Item = { n: number };
    const first: Item = { n: 1 };
    const second: Item = { n: 2 };
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<Item>(value, delay),
      { initialProps: { value: first, delay: 300 } }
    );
    expect(result.current).toEqual(first);
    rerender({ value: second, delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toEqual(second);
  });
  it("cleans up timers on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      { initialProps: { value: "a", delay: 1000 } }
    );
    // schedule a change to start a timeout
    rerender({ value: "b", delay: 1000 });
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
