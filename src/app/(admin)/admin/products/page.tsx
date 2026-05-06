import { ProductsContent } from "@/components/admin/ProductsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Brandy Admin" };

export default function ProductsPage() {
  return <ProductsContent />;
}
