import Link from "next/link";
import { siteConfig, TOKAT_DISTRICTS } from "@/lib/site-config";
import { JsonLd, buildFaqSchema } from "@/components/seo/json-ld";
import { MapPin } from "lucide-react";

/** Anasayfa yerel SEO içeriği + FAQ (one-page / GEO sinyalleri) */
export function HomeSeoContent() {
  return (
    <section
      aria-labelledby="tokat-sanayi-seo-heading"
      className="border-b border-border bg-white"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Tokat Sanayi Sitesi
          </p>
          <h1
            id="tokat-sanayi-seo-heading"
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Tokat Sanayi Sitesi Rehberi — Oto ustası ve dükkân arama
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            <strong>Tokat Sanayi Sitesi</strong>, Yeniyurt Mahallesi’nde faaliyet gösteren oto
            tamir, yedek parça, kaporta, lastik, elektrik ve mobilya-kereste esnafının buluşma
            noktasıdır. Bu dijital rehber; Google’da “tokat sanayi” arayan Merkez, Erbaa, Turhal,
            Niksar ve diğer ilçe sakinlerinin doğru ustaya hızlı ulaşması için hazırlanmıştır.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Kategori, araç tipi veya marka ile filtreleyin; dükkân telefonu ve WhatsApp bilgisine
            tek tıkla erişin.{" "}
            <Link
              href="/iletisim"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              İletişim
            </Link>
            ,{" "}
            <Link
              href="/hakkimizda"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              hakkımızda
            </Link>{" "}
            ve{" "}
            <Link
              href="/mobilya-kereste"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              mobilya &amp; kereste bölgesi
            </Link>{" "}
            sayfalarından da detay alabilirsiniz.
          </p>
          <p className="flex items-start gap-2 text-sm text-slate-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              Adres: {siteConfig.address} · Tel:{" "}
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="font-medium text-slate-700 hover:text-primary"
              >
                {siteConfig.phone}
              </a>
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">Hizmet verilen bölgeler</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tokat il ve ilçe sınırlarından sanayi sitesine gelen ziyaretçiler için
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TOKAT_DISTRICTS.map((district) => (
              <li
                key={district}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
              >
                {district}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sık sorulan sorular</h2>
          <div className="mt-4 space-y-3">
            {siteConfig.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {faq.question}
                    <span className="text-slate-400 transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <JsonLd data={buildFaqSchema()} />
        </div>
      </div>
    </section>
  );
}
