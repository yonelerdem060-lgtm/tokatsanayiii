export interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string | null;
  gradient: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
}

export const SLIDER_AUTOPLAY_MS = 5000;

export const BADGE_OPTIONS = ["Reklam", "Sponsorlu", "Duyuru", "Kampanya"] as const;

export const GRADIENT_PRESETS = [
  {
    id: "blue",
    label: "Mavi",
    gradient: "from-blue-700 via-blue-600 to-indigo-700",
    accent: "text-blue-200",
  },
  {
    id: "emerald",
    label: "Yeşil",
    gradient: "from-emerald-700 via-teal-600 to-cyan-700",
    accent: "text-emerald-200",
  },
  {
    id: "slate",
    label: "Koyu Gri",
    gradient: "from-slate-800 via-slate-700 to-zinc-800",
    accent: "text-slate-300",
  },
  {
    id: "orange",
    label: "Turuncu",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    accent: "text-orange-100",
  },
  {
    id: "rose",
    label: "Kırmızı",
    gradient: "from-rose-700 via-red-600 to-pink-700",
    accent: "text-rose-200",
  },
  {
    id: "violet",
    label: "Mor",
    gradient: "from-violet-700 via-purple-600 to-fuchsia-700",
    accent: "text-violet-200",
  },
] as const;

export function getGradientPreset(gradient: string) {
  return GRADIENT_PRESETS.find((preset) => preset.gradient === gradient);
}
