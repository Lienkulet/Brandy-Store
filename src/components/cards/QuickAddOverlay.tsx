"use client";

import { motion, AnimatePresence } from "framer-motion";
import BlackBtn from "@/components/ui/BlackBtn";
import { ease } from "@/lib/animations";
import type { QuickAddStep } from "@/hooks/useQuickAdd";
import CloseIcon from "@/components/icons/CloseIcon";
import CheckIcon from "@/components/icons/CheckIcon";

type Props = {
  step:              QuickAddStep;
  inStockSizes:      { label: string; inStock: boolean }[];
  recentlyAddedSize: string | null;
  onQuickAdd:        (e: React.MouseEvent) => void;
  onSizeClick:       (e: React.MouseEvent, label: string) => void;
  onDismiss:         (e: React.MouseEvent) => void;
};

export function QuickAddOverlay({
  step,
  inStockSizes,
  recentlyAddedSize,
  onQuickAdd,
  onSizeClick,
  onDismiss,
}: Props) {
  if (inStockSizes.length === 0) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 p-3">
      <AnimatePresence mode="wait">

        {step === "idle" && (
          <motion.div
            key="add"
            initial={false}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease }}
          >
            <BlackBtn
              name="Add to Bag"
              onClick={onQuickAdd}
              className="h-10 w-full translate-y-3 opacity-0 shadow-[0_12px_30px_rgba(30,26,23,0.18)] transition-all delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100 group-hover/card:delay-150"
            />
          </motion.div>
        )}

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
                onClick={onDismiss}
                className="cursor-pointer text-foreground/35 hover:text-foreground transition-colors"
              >
                <CloseIcon size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inStockSizes.map((s) => (
                <button
                  key={s.label}
                  onClick={(e) => onSizeClick(e, s.label)}
                  className={`cursor-pointer h-8 min-w-10 rounded-lg border px-2 text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                    recentlyAddedSize === s.label
                      ? "border-foreground bg-foreground text-white"
                      : "border-foreground/15 text-foreground hover:border-foreground hover:bg-foreground hover:text-white"
                  }`}
                >
                  <span className="inline-flex min-w-4 items-center justify-center">
                    {recentlyAddedSize === s.label ? (
                      <motion.span
                        className="flex"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.18, ease }}
                      >
                        <CheckIcon size={12} />
                      </motion.span>
                    ) : s.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "added" && (
          <motion.div
            key="added"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease }}
          >
            <CheckIcon size={11} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              Added
            </span>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
