"use client";

import { cn } from "@/lib/utils";
import { Heart, Home, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/hooks/use-favorites";

const items = [
  { href: "/", label: "Ana", icon: Home, match: (path: string) => path === "/" },
  {
    href: "/favoriler",
    label: "Favori",
    icon: Heart,
    match: (path: string) => path.startsWith("/favoriler"),
  },
  {
    href: "/#rehber",
    label: "Ara",
    icon: Search,
    match: () => false,
    primary: true,
  },
  {
    href: "/iletisim",
    label: "İletişim",
    icon: MessageSquare,
    match: (path: string) => path.startsWith("/iletisim"),
  },
];

export function MobileDock() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl md:hidden"
      aria-label="Mobil hızlı erişim"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 pt-1.5">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-[14px] px-2 py-2 text-[11px] font-medium transition",
                  item.primary
                    ? "text-primary"
                    : active
                      ? "bg-primary-soft text-primary"
                      : "text-slate-500 active:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full",
                    item.primary && "bg-primary text-white shadow-lg shadow-blue-600/30",
                    !item.primary && active && "bg-blue-100",
                  )}
                >
                  <Icon className={cn("h-4 w-4", item.href === "/favoriler" && count > 0 && active && "fill-current")} />
                </span>
                {item.label}
                {item.href === "/favoriler" && count > 0 && (
                  <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-border/60 px-2 py-1 text-center text-[10px] text-slate-400">
        Media:{" "}
        <a
          href="https://bariscanyonel.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-600 hover:text-primary"
        >
          Barış Can Yönel
        </a>
      </p>
    </nav>
  );
}
