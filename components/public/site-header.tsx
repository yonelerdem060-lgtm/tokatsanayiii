import Link from "next/link";
import type { ResolvedSiteConfig } from "@/lib/site-settings";
import type { TokatWeather } from "@/lib/weather";
import { Mail, Megaphone, MessageSquareQuote, Phone } from "lucide-react";
import { MobileNav } from "@/components/public/mobile-nav";
import { TokatWeatherBadge } from "@/components/public/tokat-weather";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Kurumsal" },
  { href: "/#ara", label: "Ara" },
  { href: "/haberler", label: "Haberler" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteHeader({
  config,
  weather,
}: {
  config: ResolvedSiteConfig;
  weather?: TokatWeather | null;
}) {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-slate-800 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${config.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {config.phone}
            </a>
            <a
              href={`mailto:${config.email}`}
              className="hidden items-center gap-1.5 transition hover:text-white sm:flex"
            >
              <Mail className="h-4 w-4" />
              {config.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <TokatWeatherBadge weather={weather ?? null} />
            <Link
              href={`mailto:${config.adEmail}?subject=Reklam%20Talebi`}
              className="flex items-center gap-2 text-[15px] font-semibold text-amber-300 transition hover:text-amber-200 sm:text-base"
            >
              <Megaphone className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">Reklam Vermek İçin</span>
              <span className="sm:hidden">Reklam</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 group">
            <p className="text-caption text-[10px] tracking-[0.18em] transition group-hover:opacity-80">
              {config.shortName}
            </p>
            <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {config.name}
            </h1>
          </Link>

          <nav className="hidden items-center gap-1.5 text-[15px] lg:flex">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="rounded-[var(--ds-radius-md)] border border-transparent px-3.5 py-2 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-primary-soft hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#ara"
              className="ml-1.5 rounded-[var(--ds-radius-lg)] bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-md shadow-blue-600/25 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Ara
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
        </div>
      </div>

      <div className="border-b border-blue-100/80 bg-primary-soft/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 lg:px-8">
          <MessageSquareQuote className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <p className="min-w-0 truncate text-xs text-slate-600 sm:text-[13px]">
            <span className="font-semibold text-primary">Başkanın Mesajı · </span>
            Sanayi sitemizde esnafımızı ve vatandaşlarımızı daha hızlı buluşturan, güvenilir
            ve düzenli bir dijital rehber oluşturmak için çalışıyoruz.
          </p>
        </div>
      </div>
    </header>
  );
}
