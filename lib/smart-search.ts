import {
  CATALOG_CAR_BRANDS,
  CATALOG_CATEGORIES,
  CATALOG_VEHICLE_TYPES,
} from "@/lib/catalog";
import { slugify } from "@/lib/utils";

/** Kullanıcı dili → arama terimleri / kategori eşlemesi */
const SYNONYM_GROUPS: string[][] = [
  ["lastik", "jant", "rot balans", "balans", "stepne", "lastikci"],
  ["motor", "motorcu", "revizyon", "motor ustasi", "motor ustası"],
  ["yedek", "yedek parca", "yedek parça", "parca", "parça", "otomotiv"],
  ["kaporta", "kaportaci", "kaportacı", "hasar", "ezik", "göçük", "gocuk"],
  ["boya", "badana", "boyacı", "boyaci", "pasta cila"],
  ["elektrik", "elektronik", "aku", "akü", "alternator", "marş", "mars", "beyin"],
  ["sanziman", "şanzıman", "vites kutusu", "şanzuman", "sanzuman"],
  ["fren", "balata", "disk", "abs", "frenci"],
  ["egzoz", "egsoz", "egzozcu", "susturucu", "katalitik"],
  ["klima", "isitma", "ısıtma", "kalorifer", "klima gazı", "klima gazi"],
  ["cam", "filo", "camcı", "camci", "filmcı", "filmci"],
  ["doseme", "döşeme", "koltuk", "döşemeci", "dosemeci"],
  ["kuaför", "kuafor", "detay", "yıkama", "yikama", "temizlik", "cila"],
  ["hidrolik", "pnomatik", "pnömatik", "hava"],
  ["kaynak", "torna", "cnc", "işleme", "isleme"],
  ["radyator", "radyatör", "sogutma", "soğutma"],
  ["cekici", "çekici", "kurtarici", "kurtarıcı", "cekici kurtarici"],
  ["hurda", "hurdacı", "hurdaci", "geri donusum", "geri dönüşüm"],
  ["galeri", "galerici", "2. el", "ikinci el", "satılık", "satilik"],
  ["lpg", "otogaz", "yakit", "yakıt", "enjeksiyon"],
  ["mobilya", "mobilyacı", "mobilyaci", "kanepe", "mutfak dolabı"],
  ["kereste", "ahsap", "ahşap", "keresteci"],
  ["marangoz", "dograma", "doğrama", "pencere", "kapi", "kapı"],
  ["hiravat", "hırdavat", "yapi market", "yapı market", "nalbur"],
  ["restoran", "yemek", "lokanta", "asci", "aşçı"],
  ["cafe", "kafe", "pastane", "kahve"],
  ["market", "toptan", "bakkal"],
  ["kargo", "lojistik", "nakliye", "tasima", "taşıma"],
  ["akaryakit", "akaryakıt", "benzin", "mazot", "dizel", "pompa"],
  ["otomobil", "araba", "binek", "oto"],
  ["kamyonet", "pickup", "pikap"],
  ["kamyon", "tir", "tır", "agir vasita", "ağır vasıta"],
  ["traktor", "traktör", "tarim", "tarım"],
  ["motosiklet", "motor bisiklet", "scooter"],
  ["minibus", "minibüs", "otobus", "otobüs"],
  ["is makinesi", "iş makinesi", "kepce", "kepçe", "forklift"],
];

const POPULAR_QUERIES = [
  "lastik",
  "motor",
  "klima",
  "egzoz",
  "fren",
  "kaporta",
  "yedek parça",
  "traktör",
  "mobilya",
  "elektrik",
] as const;

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .trim()
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ");
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = normalize(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value.trim());
  }
  return result;
}

/** Arama kutusuna yazılan metni eşanlamlılarıyla genişlet */
export function expandSearchTerms(query: string): string[] {
  const raw = query.trim();
  if (!raw) return [];

  const normalizedQuery = normalize(raw);
  const terms = [raw];

  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((alias) => {
      const n = normalize(alias);
      return normalizedQuery.includes(n) || n.includes(normalizedQuery);
    });
    if (hit) {
      terms.push(...group);
    }
  }

  // Katalog adlarından kısmi eşleşme (örn. "Lastik & Jant")
  for (const name of CATALOG_CATEGORIES) {
    if (normalize(name).includes(normalizedQuery) || normalizedQuery.includes(normalize(name))) {
      terms.push(name);
    }
  }

  return uniqueStrings(terms).slice(0, 24);
}

export type SmartSuggestionKind = "popular" | "category" | "vehicleType" | "brand" | "search";

export type SmartSuggestion = {
  label: string;
  kind: SmartSuggestionKind;
  /** URL'ye yazılacak q değeri (boş olabilir) */
  q?: string;
  category?: string;
  vehicleType?: string;
  brand?: string;
};

const KIND_LABEL: Record<SmartSuggestionKind, string> = {
  popular: "Popüler",
  category: "Kategori",
  vehicleType: "Araç tipi",
  brand: "Marka",
  search: "Arama",
};

export function smartSuggestionKindLabel(kind: SmartSuggestionKind): string {
  return KIND_LABEL[kind];
}

/**
 * Yazarken gösterilecek akıllı öneriler.
 * Kategori/marka seçilirse doğrudan filtreye gider.
 */
export function buildSmartSuggestions(input: {
  query: string;
  shopNames?: string[];
  categoryOptions?: { name: string; slug: string }[];
  vehicleOptions?: { name: string; slug: string }[];
  brandOptions?: { name: string; slug: string }[];
  limit?: number;
}): SmartSuggestion[] {
  const limit = input.limit ?? 10;
  const q = input.query.trim();
  const nq = normalize(q);
  const results: SmartSuggestion[] = [];

  if (!nq) {
    for (const popular of POPULAR_QUERIES) {
      results.push({ label: popular, kind: "popular", q: popular });
    }
    return results.slice(0, limit);
  }

  const categories =
    input.categoryOptions ??
    CATALOG_CATEGORIES.map((name) => ({ name, slug: slugify(name) }));
  const vehicles =
    input.vehicleOptions ??
    CATALOG_VEHICLE_TYPES.map((name) => ({ name, slug: slugify(name) }));
  const brands =
    input.brandOptions ??
    CATALOG_CAR_BRANDS.map((name) => ({ name, slug: slugify(name) }));

  for (const item of categories) {
    if (matchesSuggestion(nq, item.name)) {
      results.push({ label: item.name, kind: "category", category: item.slug });
    }
  }
  for (const item of vehicles) {
    if (matchesSuggestion(nq, item.name)) {
      results.push({ label: item.name, kind: "vehicleType", vehicleType: item.slug });
    }
  }
  for (const item of brands) {
    if (matchesSuggestion(nq, item.name)) {
      results.push({ label: item.name, kind: "brand", brand: item.slug });
    }
  }

  // Eşanlamlı gruplardan ekstra arama önerileri
  for (const group of SYNONYM_GROUPS) {
    if (group.some((alias) => matchesSuggestion(nq, alias))) {
      const primary = group[0];
      if (!results.some((r) => normalize(r.label) === normalize(primary))) {
        results.push({ label: primary, kind: "search", q: primary });
      }
    }
  }

  for (const name of input.shopNames ?? []) {
    if (matchesSuggestion(nq, name)) {
      results.push({ label: name, kind: "search", q: name });
    }
  }

  // Tam yazılan metin de öneri olarak kalsın
  if (!results.some((r) => normalize(r.label) === nq)) {
    results.unshift({ label: q, kind: "search", q });
  }

  return uniqueSuggestions(results).slice(0, limit);
}

function matchesSuggestion(normalizedQuery: string, candidate: string): boolean {
  const nc = normalize(candidate);
  if (!nc) return false;
  if (nc.includes(normalizedQuery) || normalizedQuery.includes(nc)) return true;

  // Eşanlamlı gruptan eşleşme
  for (const group of SYNONYM_GROUPS) {
    const queryInGroup = group.some((alias) => {
      const na = normalize(alias);
      return na.includes(normalizedQuery) || normalizedQuery.includes(na);
    });
    if (!queryInGroup) continue;
    if (group.some((alias) => nc.includes(normalize(alias)) || normalize(alias).includes(nc))) {
      return true;
    }
  }
  return false;
}

function uniqueSuggestions(items: SmartSuggestion[]): SmartSuggestion[] {
  const seen = new Set<string>();
  const result: SmartSuggestion[] = [];
  for (const item of items) {
    const key = `${item.kind}:${item.category ?? ""}:${item.vehicleType ?? ""}:${item.brand ?? ""}:${normalize(item.label)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export { POPULAR_QUERIES };
