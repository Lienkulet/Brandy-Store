"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductFormPanel } from "./ProductFormPanel";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ProductAdminCard } from "./ProductAdminCard";
import { ProductsToolbar, type ProductFilter } from "./ProductsToolbar";
import { EmptyState } from "./OverviewContent";
import type { Product } from "@/data/products";

function isProductInStock(product: Product) {
  return (product.sizes ?? []).some((size) => size.inStock);
}

function isProductOutOfStock(product: Product) {
  const sizes = product.sizes ?? [];
  return sizes.length > 0 && sizes.every((size) => !size.inStock);
}

function isProductOnSale(product: Product) {
  return Boolean(product.price?.original.trim());
}

function matchesFilter(product: Product, filter: ProductFilter) {
  if (filter === "in-stock") return isProductInStock(product);
  if (filter === "out-of-stock") return isProductOutOfStock(product);
  if (filter === "on-sale") return isProductOnSale(product);
  if (filter === "new") return Boolean(product.isNew);
  return true;
}

export function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [markingOutStockId, setMarkingOutStockId] = useState<string | null>(null);

  async function fetchProducts() {
    setLoading(true);
    const res  = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const visible = useMemo(() => {
    return products.filter((product) => {
      if (!matchesFilter(product, activeFilter)) return false;
      if (!normalizedSearch) return true;

      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.slug,
        product.description,
        product.price?.current,
        product.price?.original,
        ...(product.details ?? []),
        ...(product.colors ?? []).flatMap((color) => [
          color.name,
          color.hex,
          ...(color.sizes ?? []).map((size) => size.label),
        ]),
        ...(product.sizes ?? []).map((size) => size.label),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [activeFilter, normalizedSearch, products]);

  const totalInStock  = products.filter(isProductInStock).length;
  const totalOutStock = products.filter(isProductOutOfStock).length;
  const totalOnSale   = products.filter(isProductOnSale).length;
  const totalNew      = products.filter((p) => p.isNew).length;

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

  async function handleMarkOutOfStock(product: Product) {
    setMarkingOutStockId(product.id);
    const outOfStockSizes = product.sizes.map((size) => ({ ...size, inStock: false }));
    const updated: Product = {
      ...product,
      sizes: outOfStockSizes,
      colors: product.colors.map((color) => ({
        ...color,
        sizes: (color.sizes ?? product.sizes).map((size) => ({ ...size, inStock: false })),
      })),
    };

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(updated),
      });
      if (res.ok) await fetchProducts();
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
        total={products.length}
        totalInStock={totalInStock}
        totalOutStock={totalOutStock}
        totalOnSale={totalOnSale}
        totalNew={totalNew}
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
