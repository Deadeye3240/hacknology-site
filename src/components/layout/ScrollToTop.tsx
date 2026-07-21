import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position to the top on every route change so navigating
 * between pages always starts at the top, matching typical MPA behavior.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
