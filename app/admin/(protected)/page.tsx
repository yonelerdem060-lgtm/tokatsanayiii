import { getBrands } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import { getUnreadMessageCount } from "@/actions/contact";
import { getNewsPosts } from "@/actions/news";
import { getPromoSlides } from "@/actions/promo-slides";
import { getShops } from "@/actions/shops";
import { getVehicleTypes } from "@/actions/vehicle-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminPath } from "@/lib/admin-path";
import { Car, Megaphone, MessageSquare, Newspaper, Store, Tag, Wrench } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [shopsResult, categoriesResult, vehicleTypesResult, brandsResult, promoResult, newsResult, unreadResult] =
    await Promise.all([
      getShops(),
      getCategories(),
      getVehicleTypes(),
      getBrands(),
      getPromoSlides(),
      getNewsPosts(),
      getUnreadMessageCount(),
    ]);

  const stats = [
    {
      label: "Dükkânlar",
      value: shopsResult.success ? shopsResult.data.total : 0,
      href: adminPath("/shops"),
      icon: Store,
    },
    {
      label: "Reklamlar",
      value: promoResult.success ? promoResult.data.length : 0,
      href: adminPath("/promo-slides"),
      icon: Megaphone,
    },
    {
      label: "Haberler",
      value: newsResult.success ? newsResult.data.length : 0,
      href: adminPath("/news"),
      icon: Newspaper,
    },
    {
      label: "Mesajlar",
      value: unreadResult.success ? unreadResult.data : 0,
      href: adminPath("/messages"),
      icon: MessageSquare,
    },
    {
      label: "Kategoriler",
      value: categoriesResult.success ? categoriesResult.data.length : 0,
      href: adminPath("/categories"),
      icon: Wrench,
    },
    {
      label: "Araç Tipleri",
      value: vehicleTypesResult.success ? vehicleTypesResult.data.length : 0,
      href: adminPath("/vehicle-types"),
      icon: Car,
    },
    {
      label: "Markalar",
      value: brandsResult.success ? brandsResult.data.length : 0,
      href: adminPath("/brands"),
      icon: Tag,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
        <p className="text-muted-foreground">
          Dükkânları ve filtreleme verilerini buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
