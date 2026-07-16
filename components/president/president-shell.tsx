"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Newspaper, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PresidentShellProps {
  children: React.ReactNode;
  userName?: string | null;
}

export function PresidentShell({ children, userName }: PresidentShellProps) {
  const pathname = usePathname();
  const isNew = pathname.startsWith("/baskan/haberler/yeni");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4fb_0%,#f4f7fb_40%,#f8fafc_100%)]">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/baskan" className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Tokat Sanayi Sitesi
            </p>
            <p className="truncate text-base font-bold text-foreground sm:text-lg">
              Başkan Haber Paneli
            </p>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => signOut({ callbackUrl: "/baskan/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </Button>
        </div>

        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          <Link
            href="/baskan"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              !isNew
                ? "bg-primary text-primary-foreground"
                : "bg-white text-muted-foreground ring-1 ring-border hover:text-foreground",
            )}
          >
            <Newspaper className="h-4 w-4" />
            Haberlerim
          </Link>
          <Link
            href="/baskan/haberler/yeni"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isNew
                ? "bg-primary text-primary-foreground"
                : "bg-white text-muted-foreground ring-1 ring-border hover:text-foreground",
            )}
          >
            <Plus className="h-4 w-4" />
            Yeni Haber
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {userName ? (
          <p className="mb-5 text-sm text-muted-foreground">
            Hoş geldiniz, <span className="font-medium text-foreground">{userName}</span>
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
