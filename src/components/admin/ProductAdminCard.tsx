"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { ProductImage } from "../ui/ProductImage";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  product: Product;
  index:   number;
  onEdit:   (p: Product) => void;
  onDelete: (p: Product) => void;
  onMarkOutOfStock: (p: Product) => void;
  markingOutOfStock?: boolean;
};

export function ProductAdminCard({
  product,
  index,
  onEdit,
  onDelete,
  onMarkOutOfStock,
  markingOutOfStock = false,
}: Props) {
  const allOut     = product.sizes.every((s) => !s.inStock);
  const stockCount = product.sizes.filter((s) => s.inStock).length;
  const isOnSale   = Boolean(product.price?.original.trim());
  const isSizeFree = product.category === "accessories";

  return (
    <motion.div
      className="group overflow-hidden rounded-2xl border border-foreground/8 bg-white"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.03 }}
    >
      {/* Image */}
      <div className="relative aspect-4/5 bg-[#f7f4f0]">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
          imageClassName="h-full w-full object-cover"
        />

        {/* Stock badge */}
        <div className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
          allOut ? "border-red-200 bg-red-50 text-red-500" : "border-green-200 bg-green-50 text-green-700"
        }`}>
          {allOut ? "Out of stock" : isSizeFree ? "In stock" : `${stockCount} size${stockCount > 1 ? "s" : ""}`}
        </div>

        {(product.isNew || isOnSale) && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.isNew && (
              <div className="rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                New
              </div>
            )}
            {isOnSale && (
              <div className="rounded-full bg-red-500 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                Sale
              </div>
            )}
          </div>
        )}

        {/* Edit / delete overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => onMarkOutOfStock(product)}
            disabled={allOut || markingOutOfStock}
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-55 hover:bg-foreground hover:text-white!"
            title="Mark out of stock"
          >
            {markingOutOfStock ? "Saving..." : allOut ? "Out of stock" : "Mark out of stock"}
          </button>
          <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground transition-colors hover:bg-foreground hover:text-white!"
            title="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(product)}
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
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">{product.brand}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{product.name}</p>

        {!isSizeFree && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.map((s) => (
              <span key={s.label} className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
                s.inStock ? "border-foreground/15 text-foreground/60" : "border-foreground/8 text-foreground/25 line-through"
              }`}>
                {s.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {product.price ? `${product.price.current} MDL` : "On request"}
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
}
