import { siteConfig, TOKAT_DISTRICTS } from "@/lib/site-config";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function buildOrganizationSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: `${url}/opengraph-image`,
    logo: `${url}/icon`,
    description: siteConfig.about,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: siteConfig.mapUrl,
    openingHoursSpecification: siteConfig.openingHoursSpecification.map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.days,
      opens: item.opens,
      closes: item.closes,
    })),
    areaServed: TOKAT_DISTRICTS.map((name) => ({
      "@type": "AdministrativeArea",
      name: `${name}, Tokat`,
    })),
    priceRange: "$$",
  };
}

export function buildWebSiteSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: siteConfig.name,
    url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildShopLocalBusinessSchema(shop: {
  name: string;
  slug: string;
  description: string | null;
  address: string;
  phone: string;
  image: string | null;
  workingHours: string | null;
}) {
  const url = absoluteUrl(`/dukkan/${shop.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.name,
    description: shop.description ?? undefined,
    url,
    telephone: shop.phone,
    image: shop.image ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: "Merkez",
      addressRegion: "Tokat",
      addressCountry: "TR",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Tokat",
    },
    parentOrganization: {
      "@id": `${getSiteUrl()}/#organization`,
    },
  };
}

export function SiteJsonLd() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
    </>
  );
}
