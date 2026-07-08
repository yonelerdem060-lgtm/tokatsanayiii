import { getBrands } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import { getVehicleTypes } from "@/actions/vehicle-types";
import { ShopForm } from "@/components/admin/shop-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewShopPage() {
  const [categoriesResult, vehicleTypesResult, brandsResult] = await Promise.all([
    getCategories(),
    getVehicleTypes(),
    getBrands(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const vehicleTypes = vehicleTypesResult.success ? vehicleTypesResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yeni Dükkan Ekle</h1>
        <p className="text-muted-foreground">
          Dükkan bilgilerini ve uzmanlık alanlarını girin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dükkan Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <ShopForm
            categories={categories}
            vehicleTypes={vehicleTypes}
            brands={brands}
          />
        </CardContent>
      </Card>
    </div>
  );
}
