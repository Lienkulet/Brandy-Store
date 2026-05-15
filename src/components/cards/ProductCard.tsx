"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductImage } from "../ui/ProductImage";
import { isPriceOnSale } from "@/lib/product-utils";
import { ease } from "@/lib/animations";
import { useQuickAdd } from "@/hooks/useQuickAdd";
import { ProductCardBadges } from "./ProductCardBadges";
import { QuickAddOverlay } from "./QuickAddOverlay";

type ProductPrice = {
  original: string;
  current:  string;
};

type QuickAddData = {
  productId: string;
  colorName: string;
  sizes:     { label: string; inStock: boolean }[];
  price:     string;
};

export type ProductCardProps = {
  name:        string;
  brand?:      string;
  description: string;
  image:       string;
  price:       ProductPrice | null;
  href?:       string;
  isNew?:      boolean;
  quickAdd?:   QuickAddData;
  sizeFree?:   boolean;
};

function ProductCard({ name, brand, image, price, href, isNew, quickAdd, sizeFree = false }: ProductCardProps) {
  const inStockSizes = quickAdd?.sizes.filter((s) => s.inStock) ?? [];
  const isOnSale     = isPriceOnSale(price);
  const isOutOfStock = Boolean(quickAdd && inStockSizes.length === 0);

  const { step, recentlyAddedSize, handleQuickAdd, handleSizeClick, handleDismiss } = useQuickAdd({
    name,
    brand,
    image,
    quickAdd: quickAdd ?? { productId: "", colorName: "", price: "" },
    sizeFree,
    inStockSizes,
  });

  return (
    <motion.article
      className="soft-card group/card relative flex h-full flex-col overflow-hidden rounded-2xl"
      transition={{ duration: 0.35, ease }}
      style={{ boxShadow: "0 18px 40px rgba(95, 77, 57, 0.08)" }}
    >
      {href && (
        <Link href={href} className="absolute inset-0 z-10" aria-label={name} />
      )}

      <ProductCardBadges isNew={isNew} isOnSale={isOnSale} isOutOfStock={isOutOfStock} />

      {/* Image */}
      <div className="relative aspect-4/5 shrink-0 overflow-hidden bg-[#f7f4f0]">
        <motion.div
          className="h-full w-full will-change-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.55, ease }}
        >
          <ProductImage
            src={image}
            alt={name}
            className="h-full w-full"
            imageClassName="h-full w-full object-cover"
          />
        </motion.div>

        {quickAdd && (
          <QuickAddOverlay
            step={step}
            inStockSizes={inStockSizes}
            recentlyAddedSize={recentlyAddedSize}
            onQuickAdd={handleQuickAdd}
            onSizeClick={handleSizeClick}
            onDismiss={handleDismiss}
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        {brand && (
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
            {brand}
          </p>
        )}
        <h2 className="truncate font-serif text-xl font-semibold leading-tight text-foreground">
          {name}
        </h2>
        <div className="mt-1.5 flex max-h-6 min-h-6 flex-wrap items-center gap-1 overflow-hidden justify-start">
          {sizeFree && inStockSizes.length > 0 ? null : inStockSizes.length > 0 ? (
            inStockSizes.map((s) => (
              <span
                key={s.label}
                className="rounded-md border border-foreground/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/45"
              >
                {s.label}
              </span>
            ))
          ) : (
            <span className="text-start rounded-md border border-foreground/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/30">
              Out of stock
            </span>
          )}
        </div>

        {price ? (
          <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 text-sm font-semibold text-foreground sm:text-base">
            {isOnSale && (
              <span className="text-foreground/45 line-through">{price.original}MDL</span>
            )}
            <span>{price.current}MDL</span>
          </p>
        ) : (
          <div className="mt-auto h-10" aria-hidden="true" />
        )}
      </div>
    </motion.article>
  );
}

export default ProductCard;
