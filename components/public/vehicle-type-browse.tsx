"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/public/motion";
import { cn } from "@/lib/utils";
import {
  Bike,
  Bus,
  Car,
  Cog,
  Construction,
  Tractor,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface VehicleTypeStat {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface VehicleTypeBrowseProps {
  vehicleTypes: VehicleTypeStat[];
}

const vehicleIcons: Record<string, LucideIcon> = {
  otomobil: Car,
  kamyonet: Truck,
  kamyon: Truck,
  tir: Truck,
  traktor: Tractor,
  motosiklet: Bike,
  "minibus-otobus": Bus,
  "is-makinesi": Construction,
  "agir-vasita": Cog,
};

function buildFilterHref(
  searchParams: URLSearchParams,
  updates: Record<string, string | null>,
) {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  params.delete("page");
  const query = params.toString();
  return query ? `/?${query}#rehber` : "/#rehber";
}

export function VehicleTypeBrowse({ vehicleTypes }: VehicleTypeBrowseProps) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("vehicleType");

  if (vehicleTypes.length === 0) return null;

  return (
    <section id="arac-tipleri" className="border-b border-border/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Araç Tipleri
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Hizmet verilen araçlar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Otomobilden ağır vasıtaya kadar uzman esnaf
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {vehicleTypes.map((type) => {
            const isActive = activeType === type.slug;
            const Icon = vehicleIcons[type.slug] ?? Car;
            const href = buildFilterHref(searchParams, {
              vehicleType: isActive ? null : type.slug,
            });

            return (
              <StaggerItem key={type.id}>
                <Link
                  href={href}
                  className={cn(
                    "card-surface flex h-full flex-col items-start gap-3 p-4",
                    isActive && "border-blue-300 bg-blue-50/70",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-[14px]",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{type.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{type.count} firma</p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
