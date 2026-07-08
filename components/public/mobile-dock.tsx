"use client";

import { cn } from "@/lib/utils";
import { Home, MessageSquare, Search, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Ana", icon: Home, match: (path: string) => path === "/" },
  {
    href: "/#kategoriler",
    label: "Kategori",
    icon: Store,
    match: () => false,
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
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-[14px] px-2 py-2 text-[11px] font-medium transition",
                  item.primary
                    ? "text-blue-700"
                    : active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 active:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full",
                    item.primary && "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
                    !item.primary && active && "bg-blue-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
