"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../data/products";
import Container from "./layout/Container";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const [colorIdx, setColorIdx]     = useState(0);
  const [imageIdx, setImageIdx]     = useState(0);
  const [selectedSize, setSize]     = useState<string | null>(null);
  const [sizeError, setSizeError]   = useState(false);
  const [cartState, setCartState]   = useState<"idle" | "added">("idle");

  const color  = product.colors[colorIdx];
  const images = color.images;

  function handleColorChange(idx: number) {
    setColorIdx(idx);
    setImageIdx(0);
  }

  function handleAddToBag() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2500);
  }

  const allSizesOut = product.sizes.every((s) => !s.inStock);

  return (
    <main className="min-h-dvh bg-background pt-28 pb-24 text-foreground sm:pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 xl:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left: Image Gallery ─────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">

            {/* Main image */}
            <div className="relative max-h-[65vh] overflow-hidden rounded-2xl bg-[#f7f4f0]">
              {product.isNew && (
                <div className="absolute left-5 top-5 z-10 rounded-full bg-foreground px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                  New In
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${colorIdx}-${imageIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <Image
                    src={images[imageIdx]}
                    alt={`${product.name} — ${color.name}`}
                    width={800}
                    height={400}
                    className="aspect-4/5 w-full object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIdx(i)}
                    className={`cursor-pointer overflow-hidden rounded-xl bg-[#f7f4f0] transition-all duration-200 ${
                      i === imageIdx
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`View ${i + 1}`}
                      width={80}
                      height={100}
                      className="h-20 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35">
              <Link href="/shop" className="hover:text-foreground transition-colors duration-200">
                Shop
              </Link>
              <span>/</span>
              <span className="text-foreground/60">{product.name}</span>
            </div>

            {/* Brand */}
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/45">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4">
              {product.price ? (
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-semibold text-foreground">
                    {product.price.current}
                  </span>
                  <span className="text-base text-foreground/40 line-through">
                    {product.price.original}
                  </span>
                </div>
              ) : (
                <p className="font-serif text-2xl font-semibold text-foreground">
                  Price on request
                </p>
              )}
            </div>

            <div className="my-7 h-px bg-foreground/8" />

            {/* Color selector */}
            <div className="mb-7">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Colour{" "}
                <span className="ml-1 font-normal normal-case tracking-normal text-foreground">
                  {color.name}
                </span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(i)}
                    title={c.name}
                    className={`relative h-7 w-7 cursor-pointer rounded-full transition-all duration-200 ${
                      i === colorIdx
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "hover:ring-2 hover:ring-foreground/30 hover:ring-offset-2"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {/* Border for very light swatches so they're visible */}
                    <span
                      className="absolute inset-0 rounded-full border border-black/10"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-7">
              <div className="mb-3 flex items-baseline justify-between">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  sizeError ? "text-red-500" : "text-foreground/60"
                }`}>
                  {sizeError ? "Please select a size" : "Size"}
                </p>
                <Link
                  href="/size-guide"
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/35 underline underline-offset-2 hover:text-foreground transition-colors duration-200"
                >
                  Size Guide
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s.label;
                  return (
                    <button
                      key={s.label}
                      disabled={!s.inStock}
                      onClick={() => {
                        setSize(s.label);
                        setSizeError(false);
                      }}
                      className={`relative h-10 min-w-12 rounded-xl px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                        !s.inStock
                          ? "cursor-not-allowed border border-foreground/10 text-foreground/25"
                          : isSelected
                          ? "cursor-pointer border border-foreground bg-foreground text-white"
                          : "cursor-pointer border border-foreground/20 text-foreground hover:border-foreground/50"
                      }`}
                    >
                      {/* Diagonal strike for out-of-stock */}
                      {!s.inStock && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 overflow-hidden rounded-xl"
                        >
                          <span className="absolute left-1/2 top-1/2 h-px w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-25 bg-foreground/20" />
                        </span>
                      )}
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Out of stock notice */}
              {allSizesOut && (
                <p className="mt-3 text-xs text-muted">
                  This item is currently out of stock.{" "}
                  <Link href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors duration-200">
                    Contact us
                  </Link>{" "}
                  to be notified when it returns.
                </p>
              )}
            </div>

            {/* Add to bag */}
            <motion.button
              onClick={handleAddToBag}
              disabled={allSizesOut || cartState === "added"}
              className={`relative w-full overflow-hidden rounded-full border py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                allSizesOut
                  ? "cursor-not-allowed border-foreground/15 text-foreground/30"
                  : cartState === "added"
                  ? "cursor-default border-foreground bg-foreground"
                  : "group cursor-pointer border-foreground bg-foreground"
              }`}
              whileTap={allSizesOut ? {} : { scale: 0.985 }}
              transition={{ duration: 0.3, ease }}
            >
              {/* Hover fill sweep (idle only) */}
              {!allSizesOut && cartState === "idle" && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#f0ead8] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
              )}

              {/* "Added" background flood */}
              <AnimatePresence>
                {cartState === "added" && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-foreground"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, ease }}
                  />
                )}
              </AnimatePresence>

              <span className={`relative z-10 transition-colors duration-300 delay-75 ${
                cartState === "added" ? "text-white" : "text-white group-hover:text-foreground"
              }`}>
                <AnimatePresence mode="wait">
                  {cartState === "added" ? (
                    <motion.span
                      key="added"
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease, delay: 0.15 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Bag
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      {allSizesOut ? "Out of Stock" : "Add to Bag"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>

            {/* Contact CTA */}
            <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35">
              Questions about this piece?{" "}
              <Link
                href="/contact"
                className="text-foreground/55 underline underline-offset-2 hover:text-foreground transition-colors duration-200"
              >
                Ask us
              </Link>
            </p>

            <div className="my-7 h-px bg-foreground/8" />

            {/* Product details */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Details
              </p>
              <ul className="space-y-2">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-2 h-px w-3 shrink-0 bg-foreground/25" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        </div>
      </Container>
    </main>
  );
}
