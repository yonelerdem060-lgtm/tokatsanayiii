/**
 * Mobil kullanıcıların "ne lazım?" sorusuna tek dokunuşla cevap.
 * q ve/veya kategori filtresine yönlendirir.
 */
export type NeedIntent = {
  id: string;
  /** Kartta görünen kısa metin */
  label: string;
  /** Alt satır / yardımcı */
  hint: string;
  /** Arama kutusu için q (opsiyonel) */
  q?: string;
  /** Direkt kategori slug (opsiyonel) */
  category?: string;
  /** Accent renk sınıfları */
  tone: string;
};

export const NEED_INTENTS: NeedIntent[] = [
  {
    id: "lastik",
    label: "Lastik / Jant",
    hint: "Patlak, balans, jant",
    q: "lastik",
    category: "lastik-jant",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    id: "motor",
    label: "Motor",
    hint: "Revizyon, bakım",
    q: "motor",
    category: "motor-ustasi",
    tone: "border-blue-200 bg-blue-50 text-blue-950",
  },
  {
    id: "kaporta",
    label: "Kaporta / Boya",
    hint: "Hasar, ezik, boya",
    q: "kaporta",
    category: "kaportaci",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
  },
  {
    id: "elektrik",
    label: "Elektrik",
    hint: "Akü, marş, beyin",
    q: "elektrik",
    category: "elektrik-elektronik",
    tone: "border-violet-200 bg-violet-50 text-violet-950",
  },
  {
    id: "klima",
    label: "Klima",
    hint: "Gaz, ısıtma",
    q: "klima",
    category: "klima-isitma",
    tone: "border-cyan-200 bg-cyan-50 text-cyan-950",
  },
  {
    id: "egzoz",
    label: "Egzoz",
    hint: "Susturucu, kat",
    q: "egzoz",
    category: "egzoz",
    tone: "border-slate-200 bg-slate-50 text-slate-900",
  },
  {
    id: "yedek",
    label: "Yedek Parça",
    hint: "Orijinal / muadil",
    q: "yedek parça",
    category: "yedek-parca",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  {
    id: "traktor",
    label: "Traktör",
    hint: "Tarım makineleri",
    q: "traktör",
    tone: "border-lime-200 bg-lime-50 text-lime-950",
  },
  {
    id: "mobilya",
    label: "Mobilya",
    hint: "Kereste, marangoz",
    q: "mobilya",
    category: "mobilya",
    tone: "border-orange-200 bg-orange-50 text-orange-950",
  },
  {
    id: "cekici",
    label: "Çekici",
    hint: "Kurtarma, yol yardım",
    q: "çekici",
    category: "cekici-kurtarici",
    tone: "border-red-200 bg-red-50 text-red-950",
  },
];

/** Kategori varsa onu kullan; yoksa metin araması */
export function needIntentHref(intent: NeedIntent): string {
  const params = new URLSearchParams();
  if (intent.category) {
    params.set("category", intent.category);
  } else if (intent.q) {
    params.set("q", intent.q);
  }
  const qs = params.toString();
  return qs ? `/?${qs}#rehber` : "/#rehber";
}
