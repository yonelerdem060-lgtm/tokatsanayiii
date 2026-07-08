import { Suspense } from "react";
import { MobileDock } from "@/components/public/mobile-dock";
import { ScrollToTopOnRoute } from "@/components/public/scroll-to-top-on-route";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getResolvedSiteConfig } from "@/lib/site-settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getResolvedSiteConfig();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense fallback={null}>
        <ScrollToTopOnRoute />
      </Suspense>
      <SiteHeader config={config} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SiteFooter config={config} />
      <MobileDock />
    </div>
  );
}
