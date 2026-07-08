import Link from "next/link";
import type { ResolvedSiteConfig } from "@/lib/site-settings";
import { Mail, Megaphone, MessageSquareQuote, Phone } from "lucide-react";
import { MobileNav } from "@/components/public/mobile-nav";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/mobilya-kereste", label: "Mobilya / Kereste" },
  { href: "/#kategoriler", label: "Kategoriler" },
  { href: "/haberler", label: "Haberler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteHeader({ config }: { config: ResolvedSiteConfig }) {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-slate-800 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${config.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              {config.phone}
            </a>
            <a
              href={`mailto:${config.email}`}
              className="hidden items-center gap-1.5 transition hover:text-white sm:flex"
            >
              <Mail className="h-3.5 w-3.5" />
              {config.email}
            </a>
          </div>
          <Link
            href={`mailto:${config.adEmail}?subject=Reklam%20Talebi`}
            className="flex items-center gap-1.5 font-medium text-amber-300 transition hover:text-amber-200"
          >
            <Megaphone className="h-3.5 w-3.5" />
            Reklam Vermek İçin
          </Link>
        </div>
      </div>

      <div className="border-b border-border/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              {config.shortName}
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              {config.name}
            </h1>
          </Link>

          <nav className="hidden items-center gap-1 text-sm text-slate-600 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[12px] px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#rehber"
              className="ml-2 rounded-[14px] bg-blue-600 px-3.5 py-2 text-white shadow-sm shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Firma Ara
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
        </div>
      </div>

      <div className="border-b border-blue-100 bg-linear-to-r from-blue-50 via-white to-blue-50/80">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <MessageSquareQuote className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              Başkanın Mesajı
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              Sanayi sitemizde esnafımızı ve vatandaşlarımızı daha hızlı buluşturan, güvenilir
              ve düzenli bir dijital rehber oluşturmak için çalışıyoruz.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
