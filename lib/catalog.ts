/**
 * Tokat Sanayi Sitesi — referans katalog verisi.
 * Seed ve admin formları bu listeleri kullanır.
 */

export const CATALOG_CATEGORIES = [
  "Motor Ustası",
  "Yedek Parça",
  "Kaportacı",
  "Boya & Badana",
  "Elektrik & Elektronik",
  "Şanzıman",
  "Fren Sistemi",
  "Egzoz",
  "Klima & Isıtma",
  "Lastik & Jant",
  "Cam & Filo",
  "Döşeme & Koltuk",
  "Oto Kuaför & Detay",
  "Rot Balans & Jant",
  "Hidrolik & Pnomatik",
  "Kaynak & Torna",
  "Radyatör",
  "Çekici & Kurtarıcı",
  "Hurdacı & Geri Dönüşüm",
  "Galerici & 2. El",
  "LPG & Yakıt Sistemi",
  "Mobilya",
  "Kereste & Ahşap",
  "Marangoz & Doğrama",
  "Yapı Market & Hırdavat",
  "Restoran & Yemek",
  "Cafe & Pastane",
  "Market & Toptan",
  "Kargo & Lojistik",
  "Akaryakıt",
] as const;

/** Sanayi sitesi içindeki mobilya / kereste bölgesi kategorileri */
export const MOBILYA_KERESTE_CATEGORY_SLUGS = [
  "mobilya",
  "kereste-ahsap",
  "marangoz-dograma",
] as const;

export const CATALOG_VEHICLE_TYPES = [
  "Otomobil",
  "Kamyonet",
  "Kamyon",
  "Tır",
  "Traktör",
  "Motosiklet",
  "Minibüs & Otobüs",
  "İş Makinesi",
  "Ağır Vasıta",
] as const;

/** Türkiye pazarında yaygın otomobil markaları */
export const CATALOG_CAR_BRANDS = [
  "Abarth",
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Chery",
  "Chevrolet",
  "Citroën",
  "Cupra",
  "Dacia",
  "DS Automobiles",
  "Fiat",
  "Ford",
  "Geely",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Seat",
  "Skoda",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Togg",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

/** Ticari araç / kamyon / tır markaları */
export const CATALOG_COMMERCIAL_BRANDS = [
  "BMC",
  "DAF",
  "Ford Trucks",
  "Isuzu",
  "Iveco",
  "MAN",
  "Mercedes-Benz Kamyon",
  "Otokar",
  "Renault Trucks",
  "Scania",
  "Temsa",
  "Volvo Trucks",
] as const;

/** Traktör markaları */
export const CATALOG_TRACTOR_BRANDS = [
  "Case IH",
  "Claas",
  "Deutz-Fahr",
  "Fendt",
  "Hattat",
  "John Deere",
  "Kubota",
  "Landini",
  "Massey Ferguson",
  "New Holland",
  "Same",
  "Tafe",
  "Ursus",
  "Zetor",
] as const;

/** Motosiklet markaları */
export const CATALOG_MOTORCYCLE_BRANDS = [
  "Aprilia",
  "Bajaj",
  "Benelli",
  "BMW Motorrad",
  "Ducati",
  "Harley-Davidson",
  "Honda Motosiklet",
  "Kawasaki",
  "KTM",
  "Piaggio",
  "Royal Enfield",
  "Suzuki Motosiklet",
  "Triumph",
  "Vespa",
  "Yamaha",
] as const;

export const CATALOG_BRAND_GROUPS = [
  { label: "Otomobil", brands: CATALOG_CAR_BRANDS },
  { label: "Ticari Araç", brands: CATALOG_COMMERCIAL_BRANDS },
  { label: "Traktör", brands: CATALOG_TRACTOR_BRANDS },
  { label: "Motosiklet", brands: CATALOG_MOTORCYCLE_BRANDS },
] as const;

/** Alfabetik birleşik marka listesi (tekrarsız) */
export const CATALOG_ALL_BRANDS = [
  ...new Set([
    ...CATALOG_CAR_BRANDS,
    ...CATALOG_COMMERCIAL_BRANDS,
    ...CATALOG_TRACTOR_BRANDS,
    ...CATALOG_MOTORCYCLE_BRANDS,
  ]),
].sort((a, b) => a.localeCompare(b, "tr"));
