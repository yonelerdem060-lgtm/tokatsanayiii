import Link from "next/link";
import { siteConfig, TOKAT_DISTRICTS } from "@/lib/site-config";
import { JsonLd, buildFaqSchema } from "@/components/seo/json-ld";
import { MapPin } from "lucide-react";

/** Anasayfa yerel SEO içeriği + FAQ (H1 sayfada bir kez — arama bandında) */
export function HomeSeoContent() {
  return (
    <section
      aria-labelledby="tokat-sanayi-seo-heading"
      className="border-b border-border bg-white"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Tokat Sanayi
          </p>
          <h2
            id="tokat-sanayi-seo-heading"
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Tokat Sanayi Sitesi’nde oto ustası ve dükkân nasıl bulunur?
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            <strong>Tokat Sanayi Sitesi</strong>, Yeniyurt Mahallesi’nde faaliyet gösteren oto
            tamir, yedek parça, kaporta, lastik, elektrik ve mobilya-kereste esnafının buluşma
            noktasıdır. Bu dijital rehber; Google’da “tokat sanayi” arayan Merkez, Erbaa, Turhal,
            Niksar ve diğer ilçe sakinlerinin doğru ustaya hızlı ulaşması için hazırlanmıştır.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Tokat Sanayi’de yüzlerce iş yeri yan yana çalışır. Motor arızası, periyodik bakım,
            balata, debriyaj, klima gazı, lastik değişimi veya kaporta-boya ihtiyacınız olduğunda
            kategori, araç tipi ya da marka filtresiyle daraltın; dükkân telefonu ve WhatsApp
            bilgisine tek tıkla erişin. Rehberimiz hem yerinde gelen hem de önceden arayan
            ziyaretçiler için sade ve hızlı bir arama deneyimi sunar.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Sanayi sitesi yalnızca otomotivle sınırlı değildir. Aynı alanda{" "}
            <Link
              href="/mobilya-kereste"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              mobilya ve kereste bölgesi
            </Link>
            ; marangoz, doğrama, mutfak dolabı ve ahşap işleri için de sık ziyaret edilir.{" "}
            <Link
              href="/hakkimizda"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Hakkımızda
            </Link>{" "}
            sayfasından site tarihçesini,{" "}
            <Link
              href="/iletisim"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              iletişim
            </Link>{" "}
            sayfasından ise adres ve harita bilgisini inceleyebilirsiniz.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Tokat Sanayi Sitesi rehberi; esnafı dijitalde görünür kılmak, müşterinin doğru ustayı
            kolay bulmasını sağlamak ve yerel arama sonuçlarında güvenilir bir kaynak olmak için
            güncellenir. Favorilere eklediğiniz firmalar bu cihazda saklanır; tekrar aramanıza gerek
            kalmaz. Haberler bölümünden site duyurularını da takip edebilirsiniz.
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
          <h2 className="text-lg font-semibold text-slate-900">
            Tokat Sanayi’de sık aranan hizmetler
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Oto tamirden yedek parçaya, lastikten kaporta-boyaya kadar Tokat Sanayi Sitesi’ndeki
            temel ihtiyaçlar
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Motor ve mekanik tamir",
              "Yedek parça ve yağ-filtre",
              "Kaporta ve boya",
              "Lastik, jant ve balata",
              "Oto elektrik ve klima",
              "Egzoz, sönümleyici ve çekici",
              "Mobilya imalatı ve marangoz",
              "Kereste, kontrplak ve doğrama",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Tokat Sanayi’ye hangi bölgelerden gelinir?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tokat il ve ilçe sınırlarından sanayi sitesine gelen ziyaretçiler için yerel rehber
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
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Erbaa, Turhal, Niksar, Zile ve diğer ilçelerden Tokat Sanayi’ye gelen sürücüler; yol
            üstünde doğru ustayı aramak yerine bu rehberden kategori seçerek zaman kazanır. Özellikle
            acil lastik, akü veya kaporta ihtiyacında telefonla önce teyit edip sonra gelmek yaygındır.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Tokat Sanayi Sitesi hakkında sık sorulan sorular
          </h2>
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
