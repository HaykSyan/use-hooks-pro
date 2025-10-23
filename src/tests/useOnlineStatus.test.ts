import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useOnlineStatus from "../hooks/useOnlineStatus";

describe("useOnlineStatus", () => {
  it("returns the initial online status", () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      value: true,
      configurable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it("updates status on online and offline events", () => {
    // Start as offline
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);

    // Simulate going online
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current).toBe(true);

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: false,
        configurable: true,
      });
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);
  });
});
