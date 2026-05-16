"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, type CartItem } from "@/context/CartContext";
import Container from "@/components/layout/Container";
import BlackBtn from "@/components/ui/BlackBtn";
import { formatMDL, parseMDL } from "@/lib/money";
import { ease } from "@/lib/animations";
import CheckIcon from "@/components/icons/CheckIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import SpinnerIcon from "@/components/icons/SpinnerIcon";

type DeliveryMethod = "pickup" | "courier" | "nationwide";

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; sublabel: string }[] = [
  { value: "pickup",     label: "Pickup in store",       sublabel: "Str. Mihai Eminescu 47, Chișinău" },
  { value: "courier",    label: "Courier — Chișinău",    sublabel: "Same-day or next-day delivery"     },
  { value: "nationwide", label: "Nationwide delivery",   sublabel: "2–4 business days"                 },
];

type FieldKey = "name" | "phone" | "address";

function sanitizeName(value: string) {
  // Letters (including Romanian diacritics), spaces and hyphens only
  return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, "");
}

function sanitizePhone(value: string) {
  // Digits only, max 9 characters
  return value.replace(/\D/g, "").slice(0, 9);
}

function validateFields(
  name: string, phone: string, address: string, delivery: DeliveryMethod
): Partial<Record<FieldKey, string>> {
  const errs: Partial<Record<FieldKey, string>> = {};

  if (!name.trim()) {
    errs.name = "Full name is required.";
  } else if (name.trim().length < 2) {
    errs.name = "Please enter your full name.";
  }

  if (!phone) {
    errs.phone = "Phone number is required.";
  } else if (!phone.startsWith("0")) {
    errs.phone = "Phone number must start with 0.";
  } else if (phone.length < 9) {
    errs.phone = "Phone number must be 9 digits.";
  }

  if (delivery !== "pickup") {
    if (!address.trim()) {
      errs.address = "Delivery address is required.";
    } else if (address.trim().length < 5) {
      errs.address = "Please enter a complete address.";
    }
  }

  return errs;
}

export function CheckoutContent() {
  const { items, itemCount, isHydrated, clearCart } = useCart();
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [loading,  setLoading]  = useState(false);
  const [serverError, setServerError] = useState("");
  const [success,  setSuccess]  = useState(false);

  const [errors,  setErrors]  = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  // Redirect to shop if cart is empty (after hydration)
  useEffect(() => {
    if (isHydrated && itemCount === 0 && !success) {
      router.replace("/shop");
    }
  }, [isHydrated, itemCount, router, success]);

  const subtotal  = items.reduce((sum, i) => sum + parseMDL(i.price) * i.quantity, 0);
  const formatted = formatMDL(subtotal);

  function touchField(key: FieldKey) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateFields(name, phone, address, delivery);
    setErrors(errs);
  }

  function handleChange(key: FieldKey, value: string) {
    const sanitized = key === "name" ? sanitizeName(value) : key === "phone" ? sanitizePhone(value) : value;
    if (key === "name")    setName(sanitized);
    if (key === "phone")   setPhone(sanitized);
    if (key === "address") setAddress(sanitized);
    if (touched[key]) {
      const updatedName    = key === "name"    ? sanitized : name;
      const updatedPhone   = key === "phone"   ? sanitized : phone;
      const updatedAddress = key === "address" ? sanitized : address;
      setErrors(validateFields(updatedName, updatedPhone, updatedAddress, delivery));
    }
  }

  async function handlePlaceOrder() {
    const allTouched: Record<FieldKey, boolean> = { name: true, phone: true, address: true };
    setTouched(allTouched);
    const errs = validateFields(name, phone, address, delivery);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: delivery !== "pickup" ? address.trim() : undefined,
          delivery,
          items: items.map((i) => ({
            productId: i.productId, slug: i.slug, name: i.name, brand: i.brand, size: i.size,
            color: i.color, price: i.price, quantity: i.quantity, image: i.image,
          })),
          subtotal: formatted,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong.");
      }
      clearCart();
      setSuccess(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  if (!isHydrated || (itemCount === 0 && !success)) return null;

  if (success) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/6">
            <CheckIcon size={28} />
          </div>
          <h1 className="mb-3 font-serif text-3xl font-semibold">Order received</h1>
          <p className="mb-8 text-sm leading-relaxed text-muted">
            Thank you! Our team will call you shortly to confirm the details and arrange payment.
          </p>
          <BlackBtn href="/shop" name="Continue Shopping" />
        </motion.div>
      </main>
    );
  }

  const showErr = (key: FieldKey) => touched[key] ? errors[key] : undefined;
  const inputCls = (key: FieldKey) =>
    `input-field ${showErr(key) ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`;

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
                <Field label="Full name" required error={showErr("name")}>
                  <input
                    type="text"
                    placeholder="Ion Popescu"
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => touchField("name")}
                    className={inputCls("name")}
                  />
                </Field>
                <Field label="Phone number" required error={showErr("phone")}>
                  <input
                    type="tel"
                    placeholder="0XX XXX XXX"
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => touchField("phone")}
                    className={inputCls("phone")}
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
                      onClick={() => { setDelivery(opt.value); setErrors(validateFields(name, phone, address, opt.value)); }}
                      className={`cursor-pointer flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? "border-foreground bg-foreground/4"
                          : "border-foreground/12 hover:border-foreground/30"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                        active ? "border-foreground" : "border-foreground/25"
                      }`}>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-foreground" />}
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
                  <Field label="Address" required error={showErr("address")}>
                    <input
                      type="text"
                      placeholder="Str. Mihai Eminescu 47, ap. 12, Chișinău"
                      value={address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      onBlur={() => touchField("address")}
                      className={inputCls("address")}
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">Subtotal</p>
              <p className="font-serif text-xl font-semibold text-foreground">{formatted}</p>
            </div>

            {/* Operator note */}
            <div className="mt-4 flex gap-3 rounded-2xl bg-foreground/4 px-5 py-4">
              <span className="mt-0.5 shrink-0 text-foreground/40"><InfoIcon /></span>
              <p className="text-[11px] leading-relaxed text-foreground/55">
                After placing your order, one of our team members will call you to confirm the details and arrange payment.
              </p>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[11px] text-red-600"
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Place order button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="group cursor-pointer relative mt-4 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-foreground py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              <span className="relative z-10 flex items-center gap-2.5 text-white">
                {loading && <SpinnerIcon size={14} />}
                {loading ? "Placing order…" : "Place Order"}
              </span>
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">{item.brand}</p>
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-[11px] text-muted">
            {item.size === "One Size" ? item.color : `${item.color} · ${item.size}`}
          </p>
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
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
        {label}{required && <span className="ml-0.5 text-foreground/40">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider() {
  return <div className="my-7 h-px bg-foreground/8" />;
}
