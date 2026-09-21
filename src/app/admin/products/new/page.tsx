import { requireRole } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireRole("super_admin", "admin");
  return <ProductForm />;
}
