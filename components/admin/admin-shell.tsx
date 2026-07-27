"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { adminPath } from "@/lib/admin-path";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminShellProps {
  unreadMessages?: number;
  children: React.ReactNode;
}

export function AdminShell({ unreadMessages = 0, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:flex">
        <AdminSidebar unreadMessages={unreadMessages} className="h-full w-full" />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Yönetim menüsü"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)]"
          >
            <AdminSidebar
              unreadMessages={unreadMessages}
              className="h-full w-full shadow-xl"
              onNavigate={() => setOpen(false)}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
            aria-expanded={open}
            className="shrink-0"
          >
            <Menu className="h-4 w-4" />
            <span>Menü</span>
          </Button>
          <Link href={adminPath()} className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-primary">
              Tokat Sanayi
            </p>
            <p className="truncate text-sm font-bold">Yönetim Paneli</p>
          </Link>
          {unreadMessages > 0 ? (
            <Link
              href={adminPath("/messages")}
              className={cn(
                "rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold tabular-nums text-primary-foreground",
              )}
            >
              {unreadMessages > 99 ? "99+" : unreadMessages}
            </Link>
          ) : null}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
