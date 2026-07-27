import Link from "next/link";
import type { ResolvedSiteConfig } from "@/lib/site-settings";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/haberler", label: "Haberler" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/#ara", label: "Ara" },
];

export function SiteFooter({ config }: { config: ResolvedSiteConfig }) {
  return (
    <footer className="mt-auto border-t border-border bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-bold text-white">{config.shortName}</h3>
          <p className="mt-3 text-sm leading-relaxed">{config.about}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Site Haritası</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Çalışma Saatleri</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {config.workingHours.weekday}
            </li>
            <li className="pl-6">{config.workingHours.saturday}</li>
            <li className="pl-6">{config.workingHours.sunday}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">İletişim</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {config.address}
            </li>
            <li>
              <a
                href={`tel:${config.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 text-primary" />
                {config.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary" />
                {config.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {config.name}</p>
        <p className="mt-1.5">
          <span className="text-slate-600">Media: </span>
          <a
            href="https://bariscanyonel.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-300 transition hover:text-white"
          >
            Barış Can Yönel
          </a>
        </p>
      </div>
    </footer>
  );
}
