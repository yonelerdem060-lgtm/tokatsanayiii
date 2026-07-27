/**
 * Adres metninden Google Haritalar arama URL’si üretir.
 * mapUrl varsa (yönetici özel pin/link girdiyse) onu tercih eder.
 */
export function resolveShopMapUrl(
  address: string,
  mapUrl?: string | null,
): string {
  const custom = mapUrl?.trim();
  if (custom) return custom;

  const query = address.trim();
  if (!query) return "https://www.google.com/maps";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
