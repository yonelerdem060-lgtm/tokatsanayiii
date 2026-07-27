import { ContactForm } from "@/components/public/contact-form";
import { JsonLd, buildOrganizationSchema } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { getResolvedSiteConfig } from "@/lib/site-settings";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Tokat Sanayi Sitesi iletişim: Yeniyurt Mahallesi, Merkez/Tokat. Telefon, e-posta, çalışma saatleri ve mesaj formu.",
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title: "İletişim | Tokat Sanayi Sitesi",
    description:
      "Tokat Sanayi Sitesi adres, telefon ve mesaj formu. Yeniyurt Mahallesi, Merkez / Tokat.",
    url: "/iletisim",
  },
};

export default async function ContactPage() {
  const config = await getResolvedSiteConfig();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={buildOrganizationSchema()} />
      <div className="mb-10">
        <h1 className="text-3xl font-bold">İletişim — Tokat Sanayi Sitesi</h1>
        <p className="mt-2 text-muted-foreground">
          Sorularınız, önerileriniz veya reklam talepleriniz için bize ulaşın. Adresimiz Tokat
          Merkez, Yeniyurt Mahallesi’ndedir.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold">İletişim Bilgileri</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>
                  {config.address}
                  <a
                    href={siteConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-primary hover:underline"
                  >
                    Haritada aç
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </span>
              </li>
              <li>
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Phone className="h-5 w-5 text-primary" aria-hidden />
                  {config.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Mail className="h-5 w-5 text-primary" aria-hidden />
                  {config.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold">Çalışma Saatleri</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden />
                {config.workingHours.weekday}
              </li>
              <li className="pl-6">{config.workingHours.saturday}</li>
              <li className="pl-6">{config.workingHours.sunday}</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <h2 className="mb-6 font-semibold">Mesaj Gönderin</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
