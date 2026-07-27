"use client";

import { deletePromoSlide, togglePromoSlideActive } from "@/actions/promo-slides";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PromoSlide } from "@/lib/promo-slides";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { adminPath } from "@/lib/admin-path";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface PromoSlideListProps {
  slides: PromoSlide[];
}

export function PromoSlideList({ slides }: PromoSlideListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await togglePromoSlideActive(id, isActive);
      if (!result.success) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={cn(
            "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
            !slide.isActive && "opacity-70",
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div
              className={cn(
                "flex min-h-[120px] flex-1 flex-col justify-center bg-gradient-to-br p-5 text-white sm:max-w-md",
                slide.gradient,
              )}
            >
              <span className="text-xs font-semibold uppercase opacity-90">{slide.badge}</span>
              <p className={cn("mt-1 text-xs", slide.accent)}>{slide.subtitle}</p>
              <h3 className="mt-0.5 font-bold">{slide.title}</h3>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="space-y-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">{slide.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Sıra: {slide.sortOrder}</Badge>
                  <Badge className={slide.isActive ? "bg-green-50 text-green-700" : "bg-muted"}>
                    {slide.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                  <Badge className="bg-muted">{slide.ctaText}</Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={adminPath(`/promo-slides/${slide.id}/edit`)}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                    Düzenle
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => handleToggle(slide.id, !slide.isActive)}
                >
                  {slide.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Pasifleştir
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Aktifleştir
                    </>
                  )}
                </Button>
                <DeleteButton
                  onDelete={async () => {
                    const result = await deletePromoSlide(slide.id);
                    return {
                      success: result.success,
                      error: result.success ? undefined : result.error,
                    };
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
