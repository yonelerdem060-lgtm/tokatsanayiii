"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

export function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    // Yalnızca sayfa değişiminde üste çık.
    // ?category= gibi filtre değişimlerinde scroll konumunu bozma.
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const attempts = 6;
    let i = 0;

    const run = () => {
      const { pathname: currentPathname, search } = window.location;
      if (window.location.hash) {
        window.history.replaceState(null, "", `${currentPathname}${search}`);
      }
      window.scrollTo(0, 0);

      i += 1;
      if (i < attempts) requestAnimationFrame(run);
    };

    run();
  }, [pathname]);

  return null;
}
