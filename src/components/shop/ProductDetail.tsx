"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";
import Container from "@/components/layout/Container";
import { useCart } from "@/context/CartContext";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const [colorIdx, setColorIdx]     = useState(0);
  const [imageIdx, setImageIdx]     = useState(0);
  const [selectedSize, setSize]     = useState<string | null>(null);
  const [sizeError, setSizeError]   = useState(false);
  const [cartState, setCartState]   = useState<"idle" | "added">("idle");
  const { addItem } = useCart();

  const color  = product.colors[colorIdx];
  const images = color.images;
  const sizes  = color.sizes?.length ? color.sizes : product.sizes;
  const isOnSale = Boolean(product.price?.original.trim());
  const isSizeFree = product.category === "accessories";

  // Flat slider: all colours in fixed order, never reordered
  const sliderImages = product.colors.flatMap((c, ci) =>
    c.images.filter(Boolean).map((src, i) => ({ src, colorIdx: ci, imgIdx: i }))
  );

  const activeFlatIdx = sliderImages.findIndex(
    (s) => s.colorIdx === colorIdx && s.imgIdx === imageIdx
  );

  const stripRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState(false);

  function navigateLightbox(dir: 1 | -1) {
    const next = sliderImages[(activeFlatIdx + dir + sliderImages.length) % sliderImages.length];
    setColorIdx(next.colorIdx);
    setImageIdx(next.imgIdx);
  }

  // Close lightbox on Escape, navigate with arrow keys
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setLightbox(false); return; }
      if (e.key === "ArrowLeft")  navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    }
    if (lightbox) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, activeFlatIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active thumbnail into view when it changes
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeFlatIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, [activeFlatIdx]);

  function handleColorChange(idx: number) {
    setColorIdx(idx);
    setImageIdx(0);
    setSize(null);
  }

  function handleAddToBag() {
    if (!isSizeFree && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    const itemSize = isSizeFree ? "One Size" : selectedSize!;
    addItem({
      id:        `${product.id}-${color.name}-${itemSize}`,
      productId: product.id,
      name:      product.name,
      brand:     product.brand,
      size:      itemSize,
      color:     color.name,
      price:     product.price?.current ?? "Price on request",
      image:     color.images[0],
    });
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2500);
  }

  const allSizesOut = sizes.length > 0 && sizes.every((s) => !s.inStock);

  return (
    <>
    <main className="min-h-dvh bg-background pt-28 pb-24 text-foreground sm:pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:gap-16 xl:grid-cols-[0.75fr_1fr]">

          {/* ── Left: Image Gallery ─────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">

            <div className="flex items-start gap-3">
              {/* Main image */}
              <div
                className="relative min-w-0 flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-[#f7f4f0]"
                onClick={() => setLightbox(true)}
              >
                {product.isNew && (
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-foreground px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                    New In
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${colorIdx}-${imageIdx}`}
                    className="relative w-full rounded-2xl bg-[#f7f4f0]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[imageIdx]}
                      alt={`${product.name} - ${color.name}`}
                      className="h-auto w-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnail strip */}
              {sliderImages.length > 1 && (
                <div
                  ref={stripRef}
                  className="flex max-h-[88vh] w-18 shrink-0 flex-col gap-2 overflow-y-auto px-1 py-1 scrollbar-none"
                >
                  {sliderImages.map((item, fi) => {
                    const isActive = fi === activeFlatIdx;
                    const isSameColor = item.colorIdx === colorIdx;
                    return (
                      <button
                        key={fi}
                        onClick={() => { setColorIdx(item.colorIdx); setImageIdx(item.imgIdx); setSize(null); }}
                        className={`relative cursor-pointer shrink-0 overflow-hidden rounded-xl bg-[#f7f4f0] transition-all duration-200 ${
                          isActive
                            ? "ring-2 ring-foreground ring-offset-2"
                            : isSameColor
                            ? "opacity-70 hover:opacity-100"
                            : "opacity-35 hover:opacity-60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt=""
                          className="h-20 w-16 object-cover"
                        />
                        {/* Color dot for other-colour thumbnails */}
                        {!isSameColor && (
                          <span
                            className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full border border-white/60 shadow-sm"
                            style={{ backgroundColor: product.colors[item.colorIdx].hex }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
                    {product.price.current} MDL
                  </span>
                  {isOnSale && (
                    <span className="text-base text-foreground/40 line-through">
                      {product.price.original} MDL
                    </span>
                  )}
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
            {!isSizeFree && (
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
                {sizes.map((s) => {
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
            )}

            {isSizeFree && allSizesOut && (
              <p className="mb-7 text-xs text-muted">
                This item is currently out of stock.{" "}
                <Link href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors duration-200">
                  Contact us
                </Link>{" "}
                to be notified when it returns.
              </p>
            )}

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
              {/* Hover fill (idle only) */}
              {!allSizesOut && cartState === "idle" && (
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
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
                "text-white"
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={() => setLightbox(false)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="cursor-pointer absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev */}
            {sliderImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                className="cursor-pointer absolute left-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowLeftIcon size={18} />
              </button>
            )}

            {/* Next */}
            {sliderImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                className="cursor-pointer absolute right-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowRightIcon size={18} />
              </button>
            )}

            {/* Counter */}
            {sliderImages.length > 1 && (
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-white/50">
                {activeFlatIdx + 1} / {sliderImages.length}
              </p>
            )}

            <motion.img
              key={`${colorIdx}-${imageIdx}`}
              src={images[imageIdx]}
              alt={`${product.name} — ${color.name}`}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
