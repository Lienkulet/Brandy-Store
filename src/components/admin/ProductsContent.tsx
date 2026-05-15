"use client";

import { useMemo, useState } from "react";
import { ProductFormPanel } from "@/components/admin/ProductFormPanel";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ProductAdminCard } from "@/components/admin/ProductAdminCard";
import { ProductsToolbar } from "@/components/admin/ProductsToolbar";
import { ProductsSkeleton } from "@/components/admin/products/ProductsSkeleton";
import { EmptyState } from "@/components/admin/AdminPrimitives";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import {
  getProductStats,
  markProductOutOfStock,
  matchesProductFilter,
  matchesProductSearch,
  getProductEmptyStateMessage,
  type ProductFilter,
} from "@/lib/product-utils";
import { deleteProduct, saveProduct, updateProduct } from "@/lib/product-service";
import { SearchIcon } from "@/components/icons/SearchIcon";

export function ProductsContent() {
  const { products, loading, refetch } = useProducts();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [panelOpen, setPanelOpen]     = useState(false);
  const [editing, setEditing]         = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [markingOutStockId, setMarkingOutStockId] = useState<string | null>(null);

  const visible = useMemo(
    () => products.filter((p) => matchesProductFilter(p, activeFilter) && matchesProductSearch(p, search)),
    [activeFilter, products, search],
  );
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
    <main>
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

      {loading && <ProductsSkeleton />}

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
            icon={<SearchIcon />}
            message="No products found"
            sub={getProductEmptyStateMessage(search, activeFilter)}
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
    </main>
  );
}
