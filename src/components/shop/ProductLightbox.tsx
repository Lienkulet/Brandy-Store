"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ease } from "@/lib/animations";

type Props = {
  open:          boolean;
  src:           string;
  alt:           string;
  colorIdx:      number;
  imageIdx:      number;
  totalImages:   number;
  activeFlatIdx: number;
  onClose:       () => void;
  onNavigate:    (dir: 1 | -1) => void;
};

export function ProductLightbox({
  open,
  src,
  alt,
  colorIdx,
  imageIdx,
  totalImages,
  activeFlatIdx,
  onClose,
  onNavigate,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
                className="cursor-pointer absolute left-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowLeftIcon size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
                className="cursor-pointer absolute right-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ArrowRightIcon size={18} />
              </button>
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-white/50">
                {activeFlatIdx + 1} / {totalImages}
              </p>
            </>
          )}

          <motion.div
            key={`${colorIdx}-${imageIdx}`}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl bg-transparent"
              imageClassName="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
