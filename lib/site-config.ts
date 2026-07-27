export const TOKAT_DISTRICTS = [
  "Merkez",
  "Almus",
  "Artova",
  "Başçiftlik",
  "Erbaa",
  "Niksar",
  "Pazar",
  "Reşadiye",
  "Sulusaray",
  "Turhal",
  "Yeşilyurt",
  "Zile",
] as const;

export const siteConfig = {
  name: "Tokat Sanayi Sitesi Rehberi",
  shortName: "Tokat Sanayi",
  phone: "0356 212 00 00",
  email: "info@tokatsanayisitesi.com",
  /** NAP — Google yerel SEO ile uyumlu gerçek adres */
  address: "Yeniyurt Mahallesi, Tokat Sanayi Sitesi, Merkez / Tokat",
  streetAddress: "Yeniyurt Mahallesi, Tokat Sanayi Sitesi",
  addressLocality: "Merkez",
  addressRegion: "Tokat",
  postalCode: "60100",
  addressCountry: "TR",
  geo: {
    latitude: 40.3235,
    longitude: 36.5522,
  },
  mapUrl: "https://maps.google.com/?q=Tokat+Sanayi+Sitesi+Yeniyurt",
  adEmail: "reklam@tokatsanayisitesi.com",
  workingHours: {
    weekday: "Hafta İçi: 08:30 – 18:00",
    saturday: "Cumartesi: 08:00 – 13:00",
    sunday: "Pazar: Kapalı",
  },
  openingHoursSpecification: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
    {
      days: ["Saturday"],
      opens: "08:00",
      closes: "13:00",
    },
  ],
  areaServed: TOKAT_DISTRICTS,
  about:
    "Tokat Sanayi Sitesi rehberi; otomotiv esnafının yanı sıra mobilya, kereste ve marangoz atölyelerine de ulaşmanızı kolaylaştırır. Merkez başta olmak üzere Erbaa, Turhal, Niksar ve tüm Tokat ilçelerinden ziyaretçilere hizmet eder.",
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
      "Bu rehber platformu, site ziyaretçilerinin ve müşterilerin ihtiyaç duydukları esnafa kategori, araç tipi ve marka bazlı filtreleme ile hızlıca ulaşmasını sağlamak amacıyla oluşturulmuştur. Tokat Merkez, Erbaa, Turhal, Niksar ve diğer ilçelerden gelen vatandaşlar doğru ustayı kolayca bulabilir.",
      "Amacımız; esnafımızı dijital ortamda görünür kılmak, müşterilerin doğru ustayı kolayca bulmasını sağlamak ve sanayi sitemizin tanıtımına katkıda bulunmaktır.",
    ],
    stats: [
      { label: "İş Yeri", value: "200+" },
      { label: "Sektör", value: "30+" },
      { label: "Marka", value: "50+" },
    ],
  },
  faqs: [
    {
      question: "Tokat Sanayi Sitesi nerede?",
      answer:
        "Tokat Sanayi Sitesi, Yeniyurt Mahallesi’nde, Tokat Merkez’de yer alır. Oto tamir, yedek parça, kaporta, lastik ve mobilya-kereste esnafı bu bölgede toplanmıştır.",
    },
    {
      question: "Tokat’ta sanayi sitesinde hangi hizmetler var?",
      answer:
        "Motor ve mekanik, yedek parça, kaporta-boya, lastik-jant, elektrik, klima, egzoz, çekici ve mobilya-kereste gibi onlarca kategori bulunur. Rehberimizden kategori, araç tipi veya markaya göre arama yapabilirsiniz.",
    },
    {
      question: "Hangi ilçelerden Tokat Sanayi’ye gelinebilir?",
      answer:
        "Rehber; Merkez, Erbaa, Turhal, Niksar, Zile, Almus, Artova, Başçiftlik, Pazar, Reşadiye, Sulusaray ve Yeşilyurt ilçelerinden arama yapan ziyaretçilere hitap eder.",
    },
    {
      question: "Tokat Sanayi Sitesi çalışma saatleri nedir?",
      answer:
        "Genel olarak hafta içi 08:30–18:00, cumartesi 08:00–13:00’tür. Pazar günü çoğu iş yeri kapalıdır; dükkân sayfasındaki saatleri kontrol edin.",
    },
    {
      question: "Google’da tokat sanayi yazınca nasıl dükkân bulurum?",
      answer:
        "Bu site Tokat Sanayi Sitesi dijital rehberidir. Anasayfadaki arama kutusuna ihtiyaç yazın (ör. lastik, motor, kaporta) veya kategori filtreleriyle ustayı seçin; telefon ve WhatsApp ile doğrudan ulaşın.",
    },
    {
      question: "Tokat Sanayi’de acil lastik veya akü bulur muyum?",
      answer:
        "Evet. Rehberde lastik, jant ve elektrik kategorilerindeki dükkânları filtreleyebilir, çalışma saatlerini kontrol edip telefonla stok teyidi alabilirsiniz. Özellikle Merkez ve çevre ilçelerden gelen sürücüler için hızlı iletişim amaçlıdır.",
    },
  ],
} as const;
