import { resolveShopMapUrl } from "@/lib/maps";
import { ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopAddressLinkProps {
  address: string;
  mapUrl?: string | null;
  className?: string;
  textClassName?: string;
  showIcon?: boolean;
  showHint?: boolean;
  lineClamp?: boolean;
}

/** Adrese tıklanınca Google Haritalar’da açılır */
export function ShopAddressLink({
  address,
  mapUrl,
  className,
  textClassName,
  showIcon = true,
  showHint = false,
  lineClamp = false,
}: ShopAddressLinkProps) {
  const href = resolveShopMapUrl(address, mapUrl);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Google Haritalar’da aç"
      className={cn(
        "group inline-flex items-start gap-2 text-left transition hover:text-primary",
        className,
      )}
    >
      {showIcon && (
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      )}
      <span className="min-w-0">
        <span
          className={cn(
            "underline-offset-2 group-hover:underline",
            lineClamp && "line-clamp-2",
            textClassName,
          )}
        >
          {address}
        </span>
        {showHint && (
          <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
            Haritada aç
            <ExternalLink className="h-3 w-3" aria-hidden />
          </span>
        )}
      </span>
    </a>
  );
}
