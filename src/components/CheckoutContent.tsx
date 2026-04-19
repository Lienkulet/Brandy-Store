"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart, type CartItem } from "../context/CartContext";
import Container from "./layout/Container";

const ease = [0.22, 1, 0.36, 1] as const;

type DeliveryMethod = "pickup" | "courier" | "nationwide";

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; sublabel: string }[] = [
  { value: "pickup",     label: "Pickup in store",       sublabel: "Str. Mihai Eminescu 47, Chișinău" },
  { value: "courier",    label: "Courier — Chișinău",    sublabel: "Same-day or next-day delivery"     },
  { value: "nationwide", label: "Nationwide delivery",   sublabel: "2–4 business days"                 },
];

function parseMDL(str: string): number {
  const n = parseInt(str.replace(/\s/g, "").replace("MDL", ""), 10);
  return isNaN(n) ? 0 : n;
}

export function CheckoutContent() {
  const { items, itemCount, isHydrated } = useCart();
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");

  // Redirect to shop if cart is empty (after hydration)
  useEffect(() => {
    if (isHydrated && itemCount === 0) {
      router.replace("/shop");
    }
  }, [isHydrated, itemCount, router]);

  const subtotal  = items.reduce((sum, i) => sum + parseMDL(i.price) * i.quantity, 0);
  const formatted = subtotal.toLocaleString("ro-MD") + " MDL";

  if (!isHydrated || itemCount === 0) return null;

  return (
    <main className="min-h-dvh bg-background pb-24 pt-28 text-foreground sm:pt-32">
      <Container>

        {/* Page header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35">
            <Link href="/shop" className="hover:text-foreground transition-colors duration-200">Shop</Link>
            <span>/</span>
            <Link href="#" onClick={(e) => { e.preventDefault(); history.back(); }} className="hover:text-foreground transition-colors duration-200">Bag</Link>
            <span>/</span>
            <span className="text-foreground/60">Checkout</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Complete your order
          </h1>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_460px]">

          {/* ── Left: Form ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >

            {/* Contact details */}
            <Section title="Contact details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    type="text"
                    placeholder="Ion Popescu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </Field>
                <Field label="Phone number" required>
                  <input
                    type="tel"
                    placeholder="+373 XXX XXX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                </Field>
              </div>
            </Section>

            <Divider />

            {/* Delivery method */}
            <Section title="Delivery method">
              <div className="flex flex-col gap-3">
                {DELIVERY_OPTIONS.map((opt) => {
                  const active = delivery === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDelivery(opt.value)}
                      className={`cursor-pointer flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? "border-foreground bg-foreground/4"
                          : "border-foreground/12 hover:border-foreground/30"
                      }`}
                    >
                      {/* Radio dot */}
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                        active ? "border-foreground" : "border-foreground/25"
                      }`}>
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                        )}
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold text-foreground">{opt.label}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{opt.sublabel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Address — only for non-pickup */}
            {delivery !== "pickup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <Divider />
                <Section title="Delivery address">
                  <Field label="Address" required>
                    <input
                      type="text"
                      placeholder="Str. Mihai Eminescu 47, ap. 12, Chișinău"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field"
                    />
                  </Field>
                </Section>
              </motion.div>
            )}

          </motion.div>

          {/* ── Right: Order summary ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              Order summary
            </p>

            {/* Items */}
            <ul className="divide-y divide-foreground/6 rounded-2xl border border-foreground/8 bg-card px-5">
              {items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </ul>

            {/* Subtotal */}
            <div className="mt-4 flex items-baseline justify-between rounded-2xl border border-foreground/8 bg-card px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
                Subtotal
              </p>
              <p className="font-serif text-xl font-semibold text-foreground">{formatted}</p>
            </div>

            {/* Operator note */}
            <div className="mt-4 flex gap-3 rounded-2xl bg-foreground/4 px-5 py-4">
              <svg
                className="mt-0.5 shrink-0 text-foreground/40"
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[11px] leading-relaxed text-foreground/55">
                After placing your order, one of our team members will call you to confirm the details and arrange payment.
              </p>
            </div>

            {/* Place order button */}
            <button
              type="button"
              className="cursor-pointer mt-5 w-full rounded-full bg-foreground py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-foreground/85"
            >
              Place Order
            </button>

            <p className="mt-4 text-center text-[10px] text-muted">
              Questions?{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors duration-200">
                Contact us
              </Link>
            </p>
          </motion.div>

        </div>
      </Container>
    </main>
  );
}

/* ─── Order item row ────────────────────────────────────────────────── */

function OrderItem({ item }: { item: CartItem }) {
  return (
    <li className="flex gap-4 py-4">
      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f7f4f0]">
        <Image
          src={item.image}
          alt={item.name}
          width={48}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">
            {item.brand}
          </p>
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-[11px] text-muted">{item.color} · {item.size}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-[11px] text-muted">Qty {item.quantity}</p>
          <p className="text-sm font-semibold text-foreground">{item.price}</p>
        </div>
      </div>
    </li>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
        {label}{required && <span className="ml-0.5 text-foreground/40">*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-7 h-px bg-foreground/8" />;
}
