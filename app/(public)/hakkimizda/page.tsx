import { getResolvedSiteConfig } from "@/lib/site-settings";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getResolvedSiteConfig();
  return {
    title: `Hakkımızda | ${config.shortName}`,
    description: config.about,
  };
}

export default async function AboutPage() {
  const config = await getResolvedSiteConfig();
  const { aboutPage } = config;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">{aboutPage.title}</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {aboutPage.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-5 text-muted-foreground leading-relaxed">
          {aboutPage.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
