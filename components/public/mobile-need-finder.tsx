"use client";

import { NEED_INTENTS, needIntentHref } from "@/lib/need-intents";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Mobil hızlı ihtiyaç kısayolları (arama ana kutuda; burada sadece niyet chip'leri).
 */
export function MobileNeedFinder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeQuery = (searchParams.get("q") ?? "").toLocaleLowerCase("tr");

  function goToRehber(href: string) {
    router.push(href);
    window.setTimeout(() => {
      document.getElementById("rehber")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("rehber-search")?.focus();
    }, 80);
  }

  return (
    <section
      aria-label="Hızlı ihtiyaçlar"
      className="border-b border-border bg-white lg:hidden"
    >
      <div className="mx-auto max-w-7xl space-y-3 px-3 py-4 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Hızlı seç
          </p>
          <h2 className="mt-0.5 text-base font-bold tracking-tight text-slate-900">
            Sık aranan ihtiyaçlar
          </h2>
        </div>

        <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
          {NEED_INTENTS.map((intent) => {
            const active =
              (intent.category && activeCategory === intent.category) ||
              (!!intent.q && activeQuery === intent.q.toLocaleLowerCase("tr"));
            return (
              <button
                key={intent.id}
                type="button"
                onClick={() => goToRehber(needIntentHref(intent))}
                className={cn(
                  "min-w-[9.5rem] shrink-0 rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-blue-600/20"
                    : intent.tone,
                )}
              >
                <p className="text-sm font-bold leading-tight">{intent.label}</p>
                <p
                  className={cn(
                    "mt-1 text-[11px] leading-snug",
                    active ? "text-white/80" : "opacity-70",
                  )}
                >
                  {intent.hint}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
