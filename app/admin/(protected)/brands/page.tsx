import { getBrands } from "@/actions/brands";
import { BrandsManager } from "@/components/admin/brands-manager";

export default async function AdminBrandsPage() {
  const result = await getBrands();
  const items = result.success ? result.data : [];

  return <BrandsManager items={items} />;
}
