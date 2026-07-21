import { useEffect } from "react";

/**
 * Prevents background scrolling while a `locked` overlay (e.g. the mobile
 * navigation drawer) is open, restoring the previous value on cleanup.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
