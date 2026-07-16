import { getBrands } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import { getShopById } from "@/actions/shops";
import { getVehicleTypes } from "@/actions/vehicle-types";
import { ShopForm } from "@/components/admin/shop-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditShopPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShopPage({ params }: EditShopPageProps) {
  const { id } = await params;

  const [shopResult, categoriesResult, vehicleTypesResult, brandsResult] =
    await Promise.all([
      getShopById(id),
      getCategories(),
      getVehicleTypes(),
      getBrands(),
    ]);

  if (!shopResult.success) {
    notFound();
  }

  const shop = shopResult.data;
  const categories = categoriesResult.success ? categoriesResult.data : [];
  const vehicleTypes = vehicleTypesResult.success ? vehicleTypesResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dükkan Düzenle</h1>
        <p className="text-muted-foreground">{shop.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dükkan Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <ShopForm
            initialValues={{
              id: shop.id,
              name: shop.name,
              description: shop.description ?? undefined,
              address: shop.address,
              phone: shop.phone,
              whatsapp: shop.whatsapp,
              workingHours: shop.workingHours,
              mapUrl: shop.mapUrl,
              image: shop.image,
              gallery: shop.gallery,
              categoryIds: shop.categories.map((item) => item.id),
              vehicleTypeIds: shop.vehicleTypes.map((item) => item.id),
              brandIds: shop.brands.map((item) => item.id),
              isFeatured: shop.isFeatured,
              featuredSortOrder: shop.featuredSortOrder,
              isShopOfWeek: shop.isShopOfWeek,
            }}
            categories={categories}
            vehicleTypes={vehicleTypes}
            brands={brands}
          />
        </CardContent>
      </Card>
    </div>
  );
}
