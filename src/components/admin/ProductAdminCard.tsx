"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { countInStockSizes, isProductOnSale, isProductOutOfStock } from "@/lib/product-utils";
import { ease } from "@/lib/animations";
import { StockBadge } from "@/components/admin/products/StockBadge";
import { CardBadges } from "@/components/admin/products/CardBadges";
import { CardOverlay } from "@/components/admin/products/CardOverlay";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";

type Props = {
  product:          Product;
  index:            number;
  onEdit:           (p: Product) => void;
  onDelete:         (p: Product) => void;
  onMarkOutOfStock: (p: Product) => void;
  markingOutOfStock?: boolean;
};

export function ProductAdminCard({ product, index, onEdit, onDelete, onMarkOutOfStock, markingOutOfStock = false }: Props) {
  const allOut     = isProductOutOfStock(product);
  const stockCount = countInStockSizes(product);
  const isOnSale   = isProductOnSale(product);
  const isSizeFree = product.category === "accessories";

  return (
    <motion.div
      className="group overflow-hidden rounded-2xl border border-foreground/8 bg-white"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.03 }}
    >
      <div className="relative aspect-4/5 bg-[#f7f4f0]">
        <ProductImage src={product.image} alt={product.name} className="h-full w-full" imageClassName="h-full w-full object-cover" />
        <StockBadge allOut={allOut} isSizeFree={isSizeFree} stockCount={stockCount} />
        <CardBadges isNew={Boolean(product.isNew)} isOnSale={isOnSale} />
        <CardOverlay
          product={product}
          allOut={allOut}
          markingOutOfStock={markingOutOfStock}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkOutOfStock={onMarkOutOfStock}
        />
      </div>

      <CardInfo product={product} isSizeFree={isSizeFree} />
    </motion.div>
  );
}

function CardInfo({ product, isSizeFree }: { product: Product; isSizeFree: boolean }) {
  return (
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
          <ExternalLinkIcon />
        </Link>
      </div>
    </div>
  );
}
