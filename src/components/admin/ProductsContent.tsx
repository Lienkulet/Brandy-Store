"use client";

import { useMemo, useState } from "react";
import { ProductFormPanel } from "@/components/admin/ProductFormPanel";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ProductAdminCard } from "@/components/admin/ProductAdminCard";
import { ProductsToolbar } from "@/components/admin/ProductsToolbar";
import { EmptyState } from "@/components/admin/OverviewContent";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import {
  getProductStats,
  markProductOutOfStock,
  matchesProductFilter,
  matchesProductSearch,
  type ProductFilter,
} from "@/lib/product-utils";
import { deleteProduct, saveProduct, updateProduct } from "@/lib/product-service";

export function ProductsContent() {
  const { products, loading, refetch } = useProducts();
  const [search, setSearch]     = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [markingOutStockId, setMarkingOutStockId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return products.filter((product) =>
      matchesProductFilter(product, activeFilter) && matchesProductSearch(product, search)
    );
  }, [activeFilter, products, search]);
  const productStats = useMemo(() => getProductStats(products), [products]);

  async function handleSave(product: Product) {
    const isEdit = products.some((p) => p.id === product.id);
    await saveProduct(product, isEdit);
    await refetch();
    setPanelOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteProduct(deleteTarget.id);
    await refetch();
    setDeleteTarget(null);
    setDeleting(false);
  }

  async function handleMarkOutOfStock(product: Product) {
    setMarkingOutStockId(product.id);

    try {
      const updated = await updateProduct(markProductOutOfStock(product));
      if (updated) await refetch();
    } finally {
      setMarkingOutStockId(null);
    }
  }

  function openCreate() { setEditing(null); setPanelOpen(true); }
  function openEdit(p: Product) { setEditing(p); setPanelOpen(true); }

  return (
    <div>
      <ProductsToolbar
        loading={loading}
        total={productStats.total}
        totalInStock={productStats.inStock}
        totalOutStock={productStats.outOfStock}
        totalOnSale={productStats.onSale}
        totalNew={productStats.newArrivals}
        search={search}
        activeFilter={activeFilter}
        onSearch={setSearch}
        onClearSearch={() => setSearch("")}
        onFilterChange={setActiveFilter}
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
      {!loading && visible.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, i) => (
            <ProductAdminCard
              key={product.id}
              product={product}
              index={i}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onMarkOutOfStock={handleMarkOutOfStock}
              markingOutOfStock={markingOutStockId === product.id}
            />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && visible.length === 0 && (
        <div className="mt-5 rounded-2xl border border-foreground/8 bg-white">
          <EmptyState
            icon={<SearchEmptyIcon />}
            message="No products found"
            sub={emptyStateMessage(search, activeFilter)}
          />
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

function emptyStateMessage(search: string, activeFilter: ProductFilter) {
  const trimmedSearch = search.trim();
  const filterLabel: Record<ProductFilter, string> = {
    all: "all products",
    "in-stock": "in-stock products",
    "out-of-stock": "out-of-stock products",
    "on-sale": "sale products",
    new: "new products",
  };

  if (!trimmedSearch) return `No ${filterLabel[activeFilter]} match this filter.`;
  return `Nothing matches "${trimmedSearch}" within ${filterLabel[activeFilter]}. Try another product name, brand, category, color, size, or price.`;
}

function SearchEmptyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  );
}
