"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Kurumsal" },
  { href: "/#ara", label: "Ara" },
  { href: "/#firmalar", label: "Öne Çıkan Firmalar" },
  { href: "/haberler", label: "Haberler" },
  { href: "/mobilya-kereste", label: "Mobilya / Kereste" },
  { href: "/iletisim", label: "İletişim" },
];

export function MobileNav() {
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative z-[60] inline-flex items-center gap-2 rounded-[var(--ds-radius-md)] border border-blue-200 bg-primary-soft px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-blue-100"
        aria-label="Menü"
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span>Menü</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-40 bg-slate-950/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-white shadow-lg">
            <nav className="flex flex-col gap-1 p-3">
              {links.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[var(--ds-radius-md)] border border-transparent px-3.5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-primary-soft hover:text-primary",
                    pathname === link.href && "border-blue-200 bg-primary-soft text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#ara"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-[var(--ds-radius-lg)] bg-primary px-3.5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-md shadow-blue-600/25"
              >
                Ara
              </Link>
              <p className="mt-3 border-t border-border pt-3 text-center text-[11px] text-slate-500">
                Media:{" "}
                <a
                  href="https://bariscanyonel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Barış Can Yönel
                </a>
              </p>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
