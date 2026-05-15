import type { Product } from "@/data/products";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function saveProduct(product: Product, isEdit: boolean): Promise<void> {
  const response = await fetch(
    isEdit ? `/api/products/${product.id}` : "/api/products",
    {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) throw new Error("Save failed");
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
}

export async function updateProduct(product: Product): Promise<boolean> {
  const response = await fetch(`/api/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return response.ok;
}
