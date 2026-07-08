export const siteConfig = {
  name: "Tokat Sanayi Sitesi Rehberi",
  shortName: "Tokat Sanayi",
  phone: "0356 212 00 00",
  email: "info@tokatsanayi.local",
  address: "Tokat Organize Sanayi Sitesi, Tokat",
  adEmail: "reklam@tokatsanayi.local",
  workingHours: {
    weekday: "Hafta İçi: 08:30 – 18:00",
    saturday: "Cumartesi: 08:00 – 13:00",
    sunday: "Pazar: Kapalı",
  },
  about:
    "Tokat Sanayi Sitesi rehberi; otomotiv esnafının yanı sıra mobilya, kereste ve marangoz atölyelerine de ulaşmanızı kolaylaştırır.",
  mobilyaKereste: {
    title: "Mobilya & Kereste Bölgesi",
    shortTitle: "Mobilya / Kereste",
    slug: "mobilya-kereste",
    description:
      "Sanayi sitemizin mobilya ve kereste bölgesinde marangoz atölyeleri, mobilya imalathaneleri, kereste ticareti ve doğrama işletmeleri yer almaktadır.",
    location: "Tokat Sanayi Sitesi — Mobilya & Kereste Bölgesi (F–G Blok)",
    highlights: [
      "Özel ölçü mobilya imalatı",
      "Kereste ve kontrplak satışı",
      "Mutfak, dolap ve kapı doğrama",
      "Ahşap merdiven ve parke işleri",
    ],
    categorySlugs: ["mobilya", "kereste-ahsap", "marangoz-dograma"],
  },
  aboutPage: {
    title: "Sitemiz Hakkında",
    paragraphs: [
      "Tokat Sanayi Sitesi, yıllardır bölgenin otomotiv ve sanayi ihtiyaçlarına hizmet veren köklü bir esnaf merkezidir. Yüzlerce iş yeri ve binlerce çalışanıyla motor tamiri, yedek parça, kaporta, boya ve daha birçok alanda kaliteli hizmet sunmaktadır.",
      "Bu rehber platformu, site ziyaretçilerinin ve müşterilerin ihtiyaç duydukları esnafa kategori, araç tipi ve marka bazlı filtreleme ile hızlıca ulaşmasını sağlamak amacıyla oluşturulmuştur.",
      "Amacımız; esnafımızı dijital ortamda görünür kılmak, müşterilerin doğru ustayı kolayca bulmasını sağlamak ve sanayi sitemizin tanıtımına katkıda bulunmaktır.",
    ],
    stats: [
      { label: "İş Yeri", value: "200+" },
      { label: "Sektör", value: "30+" },
      { label: "Marka", value: "50+" },
    ],
  },
} as const;
