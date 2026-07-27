import { Suspense } from "react";
import { MobileDock } from "@/components/public/mobile-dock";
import { ScrollToTopOnRoute } from "@/components/public/scroll-to-top-on-route";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getResolvedSiteConfig } from "@/lib/site-settings";
import { getTokatWeather } from "@/lib/weather";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Site config cache'li; weather layout'u bloklamasın diye ayrı Suspense
  const config = await getResolvedSiteConfig();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense fallback={null}>
        <ScrollToTopOnRoute />
      </Suspense>
      <Suspense fallback={<SiteHeader config={config} weather={null} />}>
        <HeaderWithWeather config={config} />
      </Suspense>
      <main className="flex-1 pb-28 md:pb-0">{children}</main>
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
