"use client";

import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  open:        boolean;
  productName: string;
  onConfirm:   () => void;
  onCancel:    () => void;
  loading?:    boolean;
};

export function DeleteConfirmModal({ open, productName, onConfirm, onCancel, loading }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(95,77,57,0.15)]"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease }}
            >
              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>

              <p className="text-base font-semibold text-foreground">Delete product?</p>
              <p className="mt-1.5 text-sm text-muted">
                <span className="font-semibold text-foreground">{productName}</span> will be permanently removed from your catalog.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="cursor-pointer flex-1 rounded-full border border-foreground/15 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/60 transition-colors duration-200 hover:border-foreground/30 hover:text-foreground disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="cursor-pointer flex-1 rounded-full bg-red-500 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-red-600 disabled:opacity-60"
                >
                  {loading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
