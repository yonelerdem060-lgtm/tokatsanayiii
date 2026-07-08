"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    // `#rehber` gibi hash’ler bazı navigasyonlarda tarayıcıyı orta kısma kaydırıyor.
    // Kullanıcı her tıklamada en üstten başlasın diye hash’i kaldırıp birkaç kez
    // scroll'u sıfırlıyoruz.
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
  }, [pathname, searchParams]);

  return null;
}
