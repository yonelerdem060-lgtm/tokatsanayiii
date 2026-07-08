import { ContactForm } from "@/components/public/contact-form";
import { getResolvedSiteConfig } from "@/lib/site-settings";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Tokat Sanayi Sitesi Rehberi",
  description: "Tokat Sanayi Sitesi iletişim bilgileri ve mesaj formu",
};

export default async function ContactPage() {
  const config = await getResolvedSiteConfig();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">İletişim</h1>
        <p className="mt-2 text-muted-foreground">
          Sorularınız, önerileriniz veya reklam talepleriniz için bize ulaşın
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold">İletişim Bilgileri</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {config.address}
              </li>
              <li>
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  {config.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  {config.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold">Çalışma Saatleri</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
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
