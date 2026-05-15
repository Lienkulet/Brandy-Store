"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { PALETTE } from "@/data/colors";
import type { ProductFormColor } from "@/lib/product-form-model";

type Props = {
  color:        ProductFormColor;
  colorIdx:     number;
  category:     string;
  isFirstColor: boolean;
  paletteOpen:  boolean;
  dragging:     boolean;
  onPaletteToggle:      () => void;
  onPickSwatch:         (hex: string, name: string) => void;
  onDragOver:           (e: React.DragEvent) => void;
  onDragLeave:          () => void;
  onDrop:               (e: React.DragEvent) => void;
  onFileChange:         (files: FileList) => void;
  onImageUrlChange:     (imgIdx: number, value: string) => void;
  onImageRemove:        (imgIdx: number) => void;
  onToggleSize:         (label: string) => void;
  onSetAccessoryStock:  (inStock: boolean) => void;
  onApplyCategorySizes: () => void;
};

export function ProductColorEditor({
  color: c,
  colorIdx: ci,
  category,
  isFirstColor,
  paletteOpen,
  dragging,
  onPaletteToggle,
  onPickSwatch,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onImageUrlChange,
  onImageRemove,
  onToggleSize,
  onSetAccessoryStock,
  onApplyCategorySizes,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAccessory = category === "accessories";

  return (
    <div className="rounded-2xl border border-foreground/8 bg-foreground/1.5 p-4 space-y-5">

      {/* Colour name + swatch picker */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onPaletteToggle}
            className="h-8 w-8 cursor-pointer rounded-full border border-foreground/20 shadow-sm transition-transform duration-150 hover:scale-110"
            style={{ backgroundColor: c.hex }}
            title="Pick colour"
          />
          <AnimatePresence>
            {paletteOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease }}
                className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-foreground/8 bg-white p-3 shadow-[0_12px_40px_rgba(95,77,57,0.14)]"
                style={{ minWidth: "11rem" }}
              >
                <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                  Colour palette
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {PALETTE.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      title={p.name}
                      onClick={() => onPickSwatch(p.hex, p.name)}
                      className={`h-7 w-7 rounded-full border transition-transform duration-100 hover:scale-110 ${
                        c.hex === p.hex
                          ? "border-foreground ring-2 ring-foreground ring-offset-1"
                          : "border-black/10"
                      }`}
                      style={{ backgroundColor: p.hex }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-sm font-semibold text-foreground">{c.name}</p>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Images</p>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          className={`cursor-pointer flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-5 transition-colors duration-200 ${
            dragging
              ? "border-foreground/40 bg-foreground/5"
              : "border-foreground/12 hover:border-foreground/25 hover:bg-foreground/3"
          }`}
        >
          <svg className="text-foreground/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-[10px] font-semibold text-foreground/35">Drop or click to upload</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onFileChange(e.target.files)}
        />

        {c.images.some((u) => u.trim()) && (
          <div className="space-y-1.5">
            {c.images.map((url, ii) => (
              <div key={ii} className="flex items-center gap-2">
                <div className={`shrink-0 w-3 ${ii === 0 && isFirstColor ? "text-amber-400" : "text-transparent"}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="h-9 w-7 shrink-0 overflow-hidden rounded-lg bg-[#f7f4f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {url.trim() && <img src={url} alt="" className="h-full w-full object-cover" />}
                </div>
                <input
                  className="input-field flex-1 font-mono text-[10px]"
                  value={url}
                  onChange={(e) => onImageUrlChange(ii, e.target.value)}
                  placeholder="or paste a URL…"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(ii)}
                  className="cursor-pointer shrink-0 text-foreground/25 transition-colors hover:text-red-400"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {isFirstColor && (
          <p className="text-[9px] text-muted">First image of the first colour is used as the product card thumbnail.</p>
        )}
      </div>

      {/* Sizes / stock */}
      {isAccessory ? (
        <div className="space-y-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Stock</p>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(c.sizes?.[0]?.inStock)}
            onClick={() => onSetAccessoryStock(!c.sizes?.[0]?.inStock)}
            className={`relative h-9 rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
              c.sizes?.[0]?.inStock
                ? "bg-foreground text-white"
                : "border border-foreground/15 text-foreground/45"
            }`}
          >
            {c.sizes?.[0]?.inStock ? "In stock" : "Out of stock"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Sizes in stock</p>
            <button
              type="button"
              onClick={onApplyCategorySizes}
              className="cursor-pointer text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/45 underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Use category sizes
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(c.sizes ?? []).map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onToggleSize(s.label)}
                className={`cursor-pointer h-9 min-w-11 rounded-xl border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                  s.inStock
                    ? "border-foreground bg-foreground text-white!"
                    : "border-foreground/15 text-foreground/40 hover:border-foreground/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-muted">Tap a size to toggle stock for this colour.</p>
        </div>
      )}
    </div>
  );
}
