import { getCategories } from "@/actions/categories";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategoriesPage() {
  const result = await getCategories();
  const items = result.success ? result.data : [];

  return <CategoriesManager items={items} />;
}
