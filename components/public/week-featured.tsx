import { Reveal } from "@/components/public/motion";
import { ShopAddressLink } from "@/components/public/shop-address-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon, Phone, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface WeekShopData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  mapUrl?: string | null;
  phone: string;
  whatsapp?: string | null;
  image: string | null;
  categories: { id: string; name: string; slug: string }[];
}

interface WeekFeaturedProps {
  shop: WeekShopData | null;
}

export function WeekFeatured({ shop }: WeekFeaturedProps) {
  if (!shop) return null;

  return (
    <section className="border-b border-border/70 bg-linear-to-br from-amber-50/80 via-white to-primary-soft/40 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                <Trophy className="h-3.5 w-3.5" />
                Haftanın Firması
              </div>
              <h2 className="text-title">Tokat Sanayi’de haftanın firması</h2>
              <p className="mt-1 text-body">
                Bu hafta rehberimizde öne çıkardığımız güvenilir işletme
              </p>
            </div>
            <Link
              href="/#rehber"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition hover:brightness-90 sm:inline-flex"
            >
              Tüm firmalar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <article className="grid overflow-hidden rounded-[var(--ds-radius-xl)] border border-amber-200/80 bg-white shadow-[var(--ds-shadow-card)] lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[220px] bg-muted sm:min-h-[280px]">
              {shop.image ? (
                <Image
                  src={shop.image}
                  alt={shop.name}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-50 to-slate-100 text-slate-400">
                  <ImageIcon className="h-10 w-10 opacity-40" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-4 p-5 sm:p-8">
              {shop.categories[0] && (
                <Badge className="w-fit rounded-full bg-primary-soft text-primary">
                  {shop.categories[0].name}
                </Badge>
              )}
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {shop.name}
                </h3>
                {shop.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {shop.description}
                  </p>
                )}
              </div>

              <ShopAddressLink
                address={shop.address}
                mapUrl={shop.mapUrl}
                className="text-sm text-muted-foreground"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href={`/dukkan/${shop.slug}`}>
                  <Button variant="primary" className="transition hover:-translate-y-0.5">
                    Firmayı incele
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={`tel:${shop.phone.replace(/\s/g, "")}`}>
                  <Button variant="secondary" className="transition hover:-translate-y-0.5">
                    <Phone className="h-4 w-4" />
                    Ara
                  </Button>
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
