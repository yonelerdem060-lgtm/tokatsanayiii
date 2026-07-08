import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight, MapPin, Trees, Hammer } from "lucide-react";

export function MobilyaKeresteTeaser() {
  const zone = siteConfig.mobilyaKereste;

  return (
    <section className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[22px] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 p-6 shadow-[0_8px_30px_-12px_rgba(180,83,9,0.25)] sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                <Trees className="h-3.5 w-3.5" />
                Sanayi Sitesi Bölgesi
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{zone.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                {zone.description}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm text-stone-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                {zone.location}
              </p>
              <Link
                href={`/${zone.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-amber-800 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-amber-900"
              >
                Bölgeyi Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {zone.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-[18px] border border-amber-200/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Hammer className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <span className="text-sm font-medium text-stone-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
