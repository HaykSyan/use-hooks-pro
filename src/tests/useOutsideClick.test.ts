import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useOutsideClick from "../hooks/useOutsideClick";

describe("useOutsideClick", () => {
  it("calls the callback when clicking outside", () => {
    const callback = vi.fn();

    // Create the element to attach the ref to
    const el = document.createElement("div");
    document.body.appendChild(el);

    const ref = { current: el } as React.RefObject<HTMLDivElement>;

    // Hook setup
    renderHook(() => useOutsideClick(ref, callback));

    // real click event outside the element
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(callback).toHaveBeenCalledTimes(1);

    el.remove();
    outside.remove();
  });

  it("does NOT call the callback when clicking inside", () => {
    const callback = vi.fn();

    const el = document.createElement("div");
    const child = document.createElement("div");
    el.appendChild(child);
    document.body.appendChild(el);

    const ref = { current: el } as React.RefObject<HTMLDivElement>;

    renderHook(() => useOutsideClick(ref, callback));

    // Simulate click inside the element
    child.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();

    el.remove();
  });
});
