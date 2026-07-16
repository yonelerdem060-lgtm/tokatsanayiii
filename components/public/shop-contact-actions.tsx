"use client";

import { trackShopClick } from "@/components/public/shop-view-tracker";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopContactActionsProps {
  shopId: string;
  phone: string;
  whatsappHref: string | null;
  layout?: "stack" | "row";
  className?: string;
  showPhoneNumber?: boolean;
}

export function ShopContactActions({
  shopId,
  phone,
  whatsappHref,
  layout = "stack",
  className,
  showPhoneNumber = false,
}: ShopContactActionsProps) {
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div
      className={cn(
        layout === "row" ? "flex gap-2" : "flex w-full flex-col gap-2",
        className,
      )}
    >
      <a
        href={phoneHref}
        className={layout === "row" ? "flex-1" : undefined}
        onClick={() => trackShopClick(shopId, "phone")}
      >
        <Button
          size="lg"
          variant="primary"
          className={cn("w-full", layout === "row" && "h-12 rounded-[var(--ds-radius-lg)]")}
        >
          <Phone className="h-4 w-4" />
          {showPhoneNumber ? `Ara: ${phone}` : "Ara"}
        </Button>
      </a>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={layout === "row" ? "flex-1" : undefined}
          onClick={() => trackShopClick(shopId, "whatsapp")}
        >
          <Button
            size="lg"
            variant="whatsapp"
            className={cn("w-full", layout === "row" && "h-12 rounded-[var(--ds-radius-lg)]")}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </a>
      )}
    </div>
  );
}
