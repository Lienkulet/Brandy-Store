"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { ease } from "@/lib/animations";
import CloseIcon from "@/components/icons/CloseIcon";
import { EmptyCart } from "@/components/layout/cart/EmptyCart";
import { CartItemList } from "@/components/layout/cart/CartItemList";
import { CartFooter } from "@/components/layout/cart/CartFooter";

type CartDrawerProps = {
  open:    boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, isHydrated } = useCart();
  const { t } = useLang();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-59 bg-foreground/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-60 flex h-dvh w-full flex-col bg-background shadow-[-4px_0_40px_rgba(95,77,57,0.1)] md:w-105"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/8 px-6 py-5">
              <div className="flex items-baseline gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                  {t("cart.title")}
                </p>
                {isHydrated && items.length > 0 && (
                  <span className="text-[10px] font-semibold text-foreground/40">
                    {items.length} {items.length === 1 ? t("cart.item") : t("cart.items")}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors duration-200 hover:bg-foreground/6 hover:text-foreground"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {!isHydrated || items.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <CartItemList items={items} />
              )}
            </div>

            {/* Footer */}
            {isHydrated && items.length > 0 && (
              <CartFooter onClose={onClose} />
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
