import { cache } from "react";
import { unstable_cache } from "next/cache";
import { siteConfig as fallbackConfig } from "@/lib/site-config";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type ResolvedSiteConfig = {
  name: string;
  shortName: string;
  phone: string;
  email: string;
  address: string;
  adEmail: string;
  workingHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  about: string;
  aboutPage: {
    title: string;
    paragraphs: string[];
    stats: { label: string; value: string }[];
  };
  mobilyaKereste: typeof fallbackConfig.mobilyaKereste;
};

function parseJsonArray<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function fallbackSiteConfig(): ResolvedSiteConfig {
  return {
    name: fallbackConfig.name,
    shortName: fallbackConfig.shortName,
    phone: fallbackConfig.phone,
    email: fallbackConfig.email,
    address: fallbackConfig.address,
    adEmail: fallbackConfig.adEmail,
    workingHours: { ...fallbackConfig.workingHours },
    about: fallbackConfig.about,
    aboutPage: {
      title: fallbackConfig.aboutPage.title,
      paragraphs: [...fallbackConfig.aboutPage.paragraphs],
      stats: [...fallbackConfig.aboutPage.stats],
    },
    mobilyaKereste: fallbackConfig.mobilyaKereste,
  };
}

const loadSiteConfig = unstable_cache(
  async (): Promise<ResolvedSiteConfig> => {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "default" },
      });
      if (!settings) return fallbackSiteConfig();

      return {
        name: settings.name,
        shortName: settings.shortName,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        adEmail: settings.adEmail,
        workingHours: {
          weekday: settings.weekdayHours,
          saturday: settings.saturdayHours,
          sunday: settings.sundayHours,
        },
        about: settings.about,
        aboutPage: {
          title: "Sitemiz Hakkında",
          paragraphs: parseJsonArray(settings.aboutParagraphs, [
            ...fallbackConfig.aboutPage.paragraphs,
          ]),
          stats: parseJsonArray(settings.aboutStats, [
            ...fallbackConfig.aboutPage.stats,
          ]),
        },
        mobilyaKereste: fallbackConfig.mobilyaKereste,
      };
    } catch {
      return fallbackSiteConfig();
    }
  },
  ["site-config-v1"],
  { revalidate: 300, tags: [CACHE_TAGS.siteConfig] },
);

/** Request içi dedupe + 5 dk Data Cache */
export const getResolvedSiteConfig = cache(() => loadSiteConfig());
