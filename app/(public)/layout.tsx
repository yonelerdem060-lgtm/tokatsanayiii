import { Suspense } from "react";
import { MobileDock } from "@/components/public/mobile-dock";
import { ScrollToTopOnRoute } from "@/components/public/scroll-to-top-on-route";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SiteJsonLd } from "@/components/seo/json-ld";
import { getResolvedSiteConfig } from "@/lib/site-settings";
import { getTokatWeather } from "@/lib/weather";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getResolvedSiteConfig();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        İçeriğe atla
      </a>
      <SiteJsonLd />
      <Suspense fallback={null}>
        <ScrollToTopOnRoute />
      </Suspense>
      <Suspense fallback={<SiteHeader config={config} weather={null} />}>
        <HeaderWithWeather config={config} />
      </Suspense>
      <main id="main-content" className="flex-1 pb-28 md:pb-0">
        {children}
      </main>
      <SiteFooter config={config} />
      <MobileDock />
    </div>
  );
}

async function HeaderWithWeather({
  config,
}: {
  config: Awaited<ReturnType<typeof getResolvedSiteConfig>>;
}) {
  const weather = await getTokatWeather();
  return <SiteHeader config={config} weather={weather} />;
}
