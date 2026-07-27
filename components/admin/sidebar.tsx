"use client";

import { Button } from "@/components/ui/button";
import { adminPath } from "@/lib/admin-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Newspaper,
  Settings,
  Store,
  Tag,
  Wrench,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: adminPath(), label: "Panel", icon: LayoutDashboard, exact: true },
  { href: adminPath("/shops"), label: "Dükkânlar", icon: Store },
  { href: adminPath("/promo-slides"), label: "Reklam Slider", icon: Megaphone },
  { href: adminPath("/news"), label: "Haberler", icon: Newspaper },
  {
    href: adminPath("/messages"),
    label: "Mesajlar",
    icon: MessageSquare,
    badgeKey: "messages" as const,
  },
  { href: adminPath("/categories"), label: "Kategoriler", icon: Wrench },
  { href: adminPath("/vehicle-types"), label: "Araç Tipleri", icon: Car },
  { href: adminPath("/brands"), label: "Markalar", icon: Tag },
  { href: adminPath("/settings"), label: "Ayarlar", icon: Settings },
];

interface AdminSidebarProps {
  unreadMessages?: number;
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({
  unreadMessages = 0,
  className,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border p-5 pr-12 md:p-6 md:pr-6">
        <Link href={adminPath()} className="block" onClick={onNavigate}>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Tokat Sanayi
          </p>
          <h1 className="mt-1 text-lg font-bold">Yönetim Paneli</h1>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map(({ href, label, icon: Icon, exact, badgeKey }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          const badge =
            badgeKey === "messages" && unreadMessages > 0 ? unreadMessages : null;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                    isActive ? "bg-white/20" : "bg-primary text-primary-foreground",
                  )}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href={adminPath("/settings")}
          onClick={onNavigate}
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <KeyRound className="h-4 w-4" />
          Şifre / Ayarlar
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="mb-2 block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ← Siteye Dön
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: adminPath("/login") })}
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    </aside>
  );
}
