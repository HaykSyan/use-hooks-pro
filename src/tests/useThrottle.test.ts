import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useThrottle from "../hooks/useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("returns the initial value immediately", () => {
    const { result } = renderHook(
      ({ value, delay }) => useThrottle<string>(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );
    expect(result.current).toBe("initial");
  });
  it("updates the throttled value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle<string>(value, delay),
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
  it("throttles rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle<string>(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );
    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // change again before first throttle finishes
    rerender({ value: "c", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // still should be the original until the delay completes
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("c");
  });
});
