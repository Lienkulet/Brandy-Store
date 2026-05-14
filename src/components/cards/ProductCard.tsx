"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import BlackBtn from "../ui/BlackBtn";

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

type ProductCardProps = {
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

const ease = [0.22, 1, 0.36, 1] as const;

type Step = "idle" | "sizes" | "added";

function ProductCard({ name, brand, image, price, href, isNew, quickAdd, sizeFree = false }: ProductCardProps) {
  const [step, setStep] = useState<Step>("idle");
  const { addItem } = useCart();

  const inStockSizes = quickAdd?.sizes.filter((s) => s.inStock) ?? [];
  const isOnSale = Boolean(price?.original.trim());
  const isOutOfStock = Boolean(quickAdd && inStockSizes.length === 0);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (sizeFree) {
      addAndConfirm("One Size");
    } else if (inStockSizes.length === 1) {
      addAndConfirm(inStockSizes[0].label);
    } else {
      setStep("sizes");
    }
  }

  function handleSizeClick(e: React.MouseEvent, sizeLabel: string) {
    e.preventDefault();
    e.stopPropagation();
    addAndConfirm(sizeLabel);
  }

  function addAndConfirm(sizeLabel: string) {
    if (!quickAdd) return;
    addItem({
      id:        `${quickAdd.productId}-${quickAdd.colorName}-${sizeLabel}`,
      productId: quickAdd.productId,
      name,
      brand:     brand ?? "",
      size:      sizeLabel,
      color:     quickAdd.colorName,
      price:     quickAdd.price,
      image,
    });
    setStep("added");
    setTimeout(() => setStep("idle"), 1800);
  }

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setStep("idle");
  }

  return (
    <motion.article
      className="soft-card group/card relative flex h-full flex-col overflow-hidden rounded-2xl"
      transition={{ duration: 0.35, ease }}
      style={{ boxShadow: "0 18px 40px rgba(95, 77, 57, 0.08)" }}
    >
      {/* Stretched link overlay */}
      {href && (
        <Link href={href} className="absolute inset-0 z-10" aria-label={name} />
      )}

      {/* Badges */}
      {(isNew || isOnSale || isOutOfStock) && (
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {isNew && (
            <div className="rounded-full bg-foreground px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
              New In
            </div>
          )}
          {isOnSale && (
            <div className="rounded-full bg-red-500 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
              Sale
            </div>
          )}
          {isOutOfStock && (
            <div className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/60 backdrop-blur-sm">
              Out of stock
            </div>
          )}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-4/5 shrink-0 overflow-hidden bg-[#f7f4f0]">
        <motion.div
          className="h-full w-full will-change-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.55, ease }}
        >
          <Image
            src={image}
            alt={name}
            width={214}
            height={260}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Quick-add overlay — sits above stretched link */}
        {quickAdd && inStockSizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-20 p-3">
            <AnimatePresence mode="wait">

              {/* Idle: "Add to Bag" button, only visible on group hover */}
              {step === "idle" && (
                <motion.div
                  key="add"
                  initial={false}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease }}
                >
                  <BlackBtn
                    name="Add to Bag"
                    onClick={handleQuickAdd}
                    className="h-10 w-full translate-y-3 opacity-0 shadow-[0_12px_30px_rgba(30,26,23,0.18)] transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100 group-hover/card:delay-150"
                  />
                </motion.div>
              )}

              {/* Sizes: pill row */}
              {step === "sizes" && (
                <motion.div
                  key="sizes"
                  className="rounded-2xl bg-background/92 p-2 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22, ease }}
                >
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                      Select size
                    </span>
                    <button
                      onClick={handleDismiss}
                      className="cursor-pointer text-foreground/35 hover:text-foreground transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {inStockSizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={(e) => handleSizeClick(e, s.label)}
                        className="cursor-pointer h-8 min-w-10 rounded-lg border border-foreground/15 px-2 text-[10px] font-semibold uppercase tracking-widest text-foreground transition-all duration-150 hover:border-foreground hover:bg-foreground hover:text-white"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Added: confirmation */}
              {step === "added" && (
                <motion.div
                  key="added"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, ease }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Added
                  </span>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
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
