"use client";

import { useState, useTransition } from "react";
import { ProductFormPanel } from "@/components/admin/ProductFormPanel";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ProductAdminCard } from "@/components/admin/ProductAdminCard";
import { ProductsToolbar } from "@/components/admin/ProductsToolbar";
import { ProductsSkeleton } from "@/components/admin/products/ProductsSkeleton";
import { EmptyState } from "@/components/admin/AdminPrimitives";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAdminProductCounts } from "@/hooks/useAdminProductCounts";
import { useDebounce } from "@/hooks/useDebounce";
import { markProductOutOfStock, type ProductFilter } from "@/lib/product-utils";
import { deleteProduct, saveProduct, updateProduct } from "@/lib/product-service";
import { SearchIcon } from "@/components/icons/SearchIcon";
import ChevronIcon from "@/components/icons/ChevronIcon";
import type { Product } from "@/data/products";

export function ProductsContent() {
  const [search, setSearch]         = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [page, setPage]             = useState(1);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [editing, setEditing]       = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [markingOutStockId, setMarkingOutStockId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, 300);

  const filterCounts = useAdminProductCounts(debouncedSearch);

  const { products, total, loading, refetch } = useAdminProducts({
    page,
    search: debouncedSearch,
    filter: activeFilter,
  });

  const pageSize   = 20;
  const totalPages = Math.ceil(total / pageSize);
  const isBusy     = loading || isPending;

  function handleFilterChange(f: ProductFilter) {
    startTransition(() => { setActiveFilter(f); setPage(1); });
  }

  function handleSearchChange(v: string) {
    setSearch(v);
    startTransition(() => setPage(1));
  }

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
        loading={isBusy}
        total={total}
        filterCounts={filterCounts}
        search={search}
        activeFilter={activeFilter}
        onSearch={handleSearchChange}
        onClearSearch={() => handleSearchChange("")}
        onFilterChange={handleFilterChange}
        onCreate={openCreate}
      />

      {isBusy && <ProductsSkeleton />}

      {!isBusy && products.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
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

      {!isBusy && products.length === 0 && (
        <div className="mt-5 rounded-2xl border border-foreground/8 bg-white">
          <EmptyState
            icon={<SearchIcon />}
            message="No products found"
            sub={search ? `No results for "${search}"` : "Try adjusting your filters or explore other categories."}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[11px] text-foreground/40">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 transition-colors hover:border-foreground/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="rotate-90"><ChevronIcon size={10} /></span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-[11px] text-foreground/30">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`cursor-pointer h-8 w-8 rounded-lg border text-[11px] font-semibold transition-colors ${
                      page === p
                        ? "border-foreground bg-foreground text-white"
                        : "border-foreground/10 text-foreground/50 hover:border-foreground/25 hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 transition-colors hover:border-foreground/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="-rotate-90"><ChevronIcon size={10} /></span>
            </button>
          </div>
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
