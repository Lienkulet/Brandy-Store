"use client";

import { useEffect, useState } from "react";
import { ProductFormPanel } from "./ProductFormPanel";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ProductAdminCard } from "./ProductAdminCard";
import { ProductsToolbar } from "./ProductsToolbar";
import type { Product } from "@/data/products";

export function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]         = useState(false);

  async function fetchProducts() {
    setLoading(true);
    const res  = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  const visible = products.filter((p) =>
    search.trim() === "" ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalInStock  = products.filter((p) => p.sizes.some((s) => s.inStock)).length;
  const totalOutStock = products.filter((p) => p.sizes.every((s) => !s.inStock)).length;

  async function handleSave(product: Product) {
    const isEdit = products.some((p) => p.id === product.id);
    const res = await fetch(
      isEdit ? `/api/products/${product.id}` : "/api/products",
      { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) }
    );
    if (!res.ok) throw new Error("Save failed");
    await fetchProducts();
    setPanelOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
    await fetchProducts();
    setDeleteTarget(null);
    setDeleting(false);
  }

  function openCreate() { setEditing(null); setPanelOpen(true); }
  function openEdit(p: Product) { setEditing(p); setPanelOpen(true); }

  return (
    <div>
      <ProductsToolbar
        loading={loading}
        total={products.length}
        totalInStock={totalInStock}
        totalOutStock={totalOutStock}
        search={search}
        onSearch={setSearch}
        onCreate={openCreate}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-foreground/8 bg-white">
              <div className="aspect-4/5 animate-pulse bg-foreground/6" />
              <div className="space-y-2 p-4">
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-foreground/6" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-foreground/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {!loading && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, i) => (
            <ProductAdminCard
              key={product.id}
              product={product}
              index={i}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ProductFormPanel
        open={panelOpen}
        product={editing}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        productName={deleteTarget?.name ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
