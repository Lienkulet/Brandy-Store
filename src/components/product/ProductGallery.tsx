"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "@/components/ui/ProductImage";
import { ease } from "@/lib/animations";
import type { Product } from "@/data/products";
import type { SliderImage } from "@/hooks/useGallery";

type Props = {
  product:       Product;
  colorIdx:      number;
  imageIdx:      number;
  activeFlatIdx: number;
  sliderImages:  SliderImage[];
  stripRef:      React.RefObject<HTMLDivElement | null>;
  onOpenLightbox: () => void;
  onSelectImage:  (colorIdx: number, imageIdx: number) => void;
};

export function ProductGallery({
  product,
  colorIdx,
  imageIdx,
  activeFlatIdx,
  sliderImages,
  stripRef,
  onOpenLightbox,
  onSelectImage,
}: Props) {
  const color      = product.colors[colorIdx];
  const images     = color.images?.filter(Boolean) ?? [];
  const hasImages  = images.length > 0;
  const displaySrc = hasImages ? images[imageIdx] : product.image;

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="flex items-start gap-3">

        {/* Main image */}
        <button
          type="button"
          aria-label="Open image lightbox"
          className="relative min-w-0 flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-[#f7f4f0] text-left"
          onClick={onOpenLightbox}
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
              <ProductImage
                src={displaySrc}
                alt={`${product.name} - ${color.name}`}
                className="min-h-80 w-full rounded-2xl"
                imageClassName="h-auto w-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Thumbnail strip */}
        {sliderImages.length > 1 && (
          <div
            ref={stripRef}
            className="flex max-h-[88vh] w-18 shrink-0 flex-col gap-2 overflow-y-auto px-1 py-1 scrollbar-none"
          >
            {sliderImages.map((item, fi) => {
              const isActive    = fi === activeFlatIdx;
              const isSameColor = item.colorIdx === colorIdx;
              return (
                <button
                  key={fi}
                  onClick={() => onSelectImage(item.colorIdx, item.imgIdx)}
                  className={`relative cursor-pointer shrink-0 overflow-hidden rounded-xl bg-[#f7f4f0] transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-foreground ring-offset-2"
                      : isSameColor
                      ? "opacity-70 hover:opacity-100"
                      : "opacity-35 hover:opacity-60"
                  }`}
                >
                  <ProductImage
                    src={item.src}
                    alt=""
                    className="h-20 w-16"
                    imageClassName="h-full w-full object-cover"
                  />
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
  );
}
