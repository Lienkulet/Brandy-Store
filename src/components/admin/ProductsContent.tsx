"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "./OverviewContent";
import { ProductFormPanel } from "./ProductFormPanel";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { Product } from "@/data/products";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductsContent() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  const [panelOpen, setPanelOpen]   = useState(false);
  const [editing, setEditing]       = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // Fetch products
  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
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

  // Create or update
  async function handleSave(product: Product) {
    const isEdit = products.some((p) => p.id === product.id);
    const res = await fetch(
      isEdit ? `/api/products/${product.id}` : "/api/products",
      {
        method:  isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(product),
      }
    );
    if (!res.ok) throw new Error("Save failed");
    await fetchProducts();
    setPanelOpen(false);
    setEditing(null);
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
    await fetchProducts();
    setDeleteTarget(null);
    setDeleting(false);
  }

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setPanelOpen(true);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Products"
          subtitle={loading ? "Loading…" : `${products.length} products · ${totalInStock} in stock · ${totalOutStock} fully out`}
        />
        <button
          onClick={openCreate}
          className="cursor-pointer flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white! transition-colors hover:bg-foreground/85"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

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
          {visible.map((product, i) => {
            const allOut     = product.sizes.every((s) => !s.inStock);
            const stockCount = product.sizes.filter((s) => s.inStock).length;

            return (
              <motion.div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-foreground/8 bg-white"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: i * 0.03 }}
              >
                {/* Image */}
                <div className="relative aspect-4/5 bg-[#f7f4f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />

                  {/* Stock badge */}
                  <div className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
                    allOut ? "border-red-200 bg-red-50 text-red-500" : "border-green-200 bg-green-50 text-green-700"
                  }`}>
                    {allOut ? "Out of stock" : `${stockCount} size${stockCount > 1 ? "s" : ""}`}
                  </div>
                  {product.isNew && (
                    <div className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                      New
                    </div>
                  )}

                  {/* Edit / delete overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(product)}
                      className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground transition-colors hover:bg-foreground hover:text-white!"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 transition-colors hover:bg-red-500 hover:text-white!"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">{product.brand}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{product.name}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.sizes.map((s) => (
                      <span key={s.label} className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
                        s.inStock ? "border-foreground/15 text-foreground/60" : "border-foreground/8 text-foreground/25 line-through"
                      }`}>
                        {s.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {product.price ? product.price.current : "On request"}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/35 transition-colors hover:text-foreground"
                    >
                      View
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form panel */}
      <ProductFormPanel
        open={panelOpen}
        product={editing}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
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
