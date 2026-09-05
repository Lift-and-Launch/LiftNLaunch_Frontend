import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset window scroll on every route change (SPA keeps previous scroll otherwise). */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
