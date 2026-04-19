"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useCart, type CartItem } from "../context/CartContext";

const ease = [0.22, 1, 0.36, 1] as const;

type CartDrawerProps = {
  open:    boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, isHydrated } = useCart();

  // Lock body scroll when open
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
          <motion.div
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
                  Your Bag
                </p>
                {isHydrated && items.length > 0 && (
                  <span className="text-[10px] font-semibold text-foreground/40">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors duration-200 hover:bg-foreground/6 hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Empty state ───────────────────────────────────────────────────── */

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center px-8 py-24 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.15 }}
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
        <svg
          width="32" height="32" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"
          className="text-foreground/35"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>

      <p className="font-serif text-2xl font-semibold text-foreground">
        Your bag is empty
      </p>
      <p className="mt-3 max-w-56 text-sm leading-relaxed text-muted">
        Add pieces you love and they will appear here.
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        className="mt-10 inline-block rounded-full border border-foreground px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:bg-foreground hover:text-white"
      >
        Explore the Shop
      </Link>
    </motion.div>
  );
}

/* ─── Cart item list ────────────────────────────────────────────────── */

function CartItemList({ items }: { items: CartItem[] }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <ul className="divide-y divide-foreground/6 px-6">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          layout
          className="flex gap-4 py-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.35, ease, delay: i * 0.05 }}
        >
          {/* Image */}
          <div className="h-24 w-18 shrink-0 overflow-hidden rounded-xl bg-[#f7f4f0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                  {item.brand}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                  {item.name}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {item.color} · {item.size}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
                className="cursor-pointer shrink-0 text-foreground/25 transition-colors duration-200 hover:text-foreground/60"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Price + Quantity */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{item.price}</p>

              {/* Qty stepper */}
              <div className="flex items-center gap-2 rounded-full border border-foreground/12 px-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="cursor-pointer flex h-7 w-7 items-center justify-center text-foreground/50 transition-colors duration-150 hover:text-foreground"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="w-4 text-center text-[11px] font-semibold tabular-nums text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="cursor-pointer flex h-7 w-7 items-center justify-center text-foreground/50 transition-colors duration-150 hover:text-foreground"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

/* ─── Cart footer ───────────────────────────────────────────────────── */

function CartFooter({ onClose }: { onClose: () => void }) {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => {
    const val = parseInt(item.price.replace(/\s/g, "").replace("MDL", ""), 10);
    return sum + (isNaN(val) ? 0 : val * item.quantity);
  }, 0);

  const formatted = subtotal.toLocaleString("ro-MD") + " MDL";

  return (
    <div className="border-t border-foreground/8 px-6 pb-8 pt-5">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
          Subtotal
        </p>
        <p className="font-serif text-lg font-semibold text-foreground">{formatted}</p>
      </div>

      <button
        onClick={() => { onClose(); router.push("/checkout"); }}
        className="cursor-pointer w-full rounded-full bg-foreground py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-foreground/85"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-muted">Taxes and shipping at checkout.</p>
        <button
          onClick={() => { clearCart(); onClose(); }}
          className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/30 underline underline-offset-2 transition-colors duration-200 hover:text-foreground/60"
        >
          Clear bag
        </button>
      </div>
    </div>
  );
}
