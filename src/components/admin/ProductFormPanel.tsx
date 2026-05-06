"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ColorVariant, SizeOption } from "@/data/products";

const ease = [0.22, 1, 0.36, 1] as const;

const DEFAULT_SIZES: SizeOption[] = [
  { label: "XS",  inStock: false },
  { label: "S",   inStock: false },
  { label: "M",   inStock: false },
  { label: "L",   inStock: false },
  { label: "XL",  inStock: false },
  { label: "XXL", inStock: false },
];

const CATEGORIES = [
  { label: "Tops & Shirts", slug: "tops-shirts" },
  { label: "Bottoms",       slug: "bottoms"     },
  { label: "Outerwear",     slug: "outerwear"   },
  { label: "Footwear",      slug: "footwear"    },
  { label: "Accessories",   slug: "accessories" },
];

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function blankProduct(): Partial<Product> {
  return {
    id:          `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug:        "",
    name:        "",
    brand:       "",
    category:    "tops-shirts",
    description: "",
    price:       null,
    image:       "",
    isNew:       false,
    colors:      [{ name: "", hex: "#c8b89a", images: [""] }],
    sizes:       DEFAULT_SIZES.map((s) => ({ ...s })),
    details:     [""],
  };
}

type Props = {
  open:     boolean;
  product?: Product | null;  // null = create, Product = edit
  onClose:  () => void;
  onSave:   (p: Product) => Promise<void>;
};

export function ProductFormPanel({ open, product, onClose, onSave }: Props) {
  const isEdit = Boolean(product);
  const [form, setForm]       = useState<Partial<Product>>(blankProduct());
  const [hasPrice, setHasPrice] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  // Seed form when panel opens
  useEffect(() => {
    if (open) {
      if (product) {
        setForm(structuredClone(product));
        setHasPrice(product.price !== null);
        setSlugEdited(true);
      } else {
        setForm(blankProduct());
        setHasPrice(false);
        setSlugEdited(false);
      }
      setError("");
    }
  }, [open, product]);

  // Auto-generate slug from name (unless user edited it)
  useEffect(() => {
    if (!slugEdited && form.name) {
      setForm((f) => ({ ...f, slug: toSlug(f.name ?? "") }));
    }
  }, [form.name, slugEdited]);

  function set<K extends keyof Product>(key: K, val: Product[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // ── Sizes ──────────────────────────────────────────────────────────
  function toggleSize(label: string) {
    setForm((f) => ({
      ...f,
      sizes: (f.sizes ?? []).map((s) =>
        s.label === label ? { ...s, inStock: !s.inStock } : s
      ),
    }));
  }

  // ── Colors ─────────────────────────────────────────────────────────
  function setColor(i: number, key: keyof ColorVariant, val: string) {
    setForm((f) => {
      const colors = [...(f.colors ?? [])];
      if (key === "images") {
        colors[i] = { ...colors[i], images: [val] };
      } else {
        colors[i] = { ...colors[i], [key]: val };
      }
      return { ...f, colors };
    });
  }
  function addColor() {
    setForm((f) => ({
      ...f,
      colors: [...(f.colors ?? []), { name: "", hex: "#c8b89a", images: [""] }],
    }));
  }
  function removeColor(i: number) {
    setForm((f) => ({ ...f, colors: (f.colors ?? []).filter((_, idx) => idx !== i) }));
  }

  // ── Details ────────────────────────────────────────────────────────
  function setDetail(i: number, val: string) {
    setForm((f) => {
      const details = [...(f.details ?? [])];
      details[i] = val;
      return { ...f, details };
    });
  }
  function addDetail() {
    setForm((f) => ({ ...f, details: [...(f.details ?? []), ""] }));
  }
  function removeDetail(i: number) {
    setForm((f) => ({ ...f, details: (f.details ?? []).filter((_, idx) => idx !== i) }));
  }

  // ── Submit ─────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name?.trim())  return setError("Name is required.");
    if (!form.brand?.trim()) return setError("Brand is required.");
    if (!form.slug?.trim())  return setError("Slug is required.");
    if (!form.image?.trim()) return setError("Primary image URL is required.");
    if (!form.colors?.length || !form.colors[0].name.trim())
      return setError("At least one colour is required.");

    const payload: Product = {
      id:          form.id!,
      slug:        form.slug!,
      name:        form.name!,
      brand:       form.brand!,
      category:    form.category!,
      description: form.description ?? "",
      image:       form.image!,
      isNew:       form.isNew ?? false,
      price:       hasPrice ? (form.price ?? null) : null,
      colors:      (form.colors ?? []).map((c) => ({
        ...c,
        images: c.images[0] ? [c.images[0], c.images[0], c.images[0]] : [form.image!],
      })),
      sizes:    form.sizes ?? DEFAULT_SIZES,
      details:  (form.details ?? []).filter((d) => d.trim()),
    };

    setSaving(true);
    try {
      await onSave(payload);
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  }

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
            transition={{ duration: 0.25, ease }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 z-60 flex h-dvh w-full flex-col bg-white shadow-[-4px_0_40px_rgba(95,77,57,0.1)] md:w-[560px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/8 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                {isEdit ? "Edit Product" : "New Product"}
              </p>
              <button
                onClick={onClose}
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 hover:bg-foreground/6 hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

                {/* ── Basic info ─────────────────────────────────── */}
                <FormSection title="Basic info">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Product name" required>
                      <input className="input-field" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Oxford Button-Down Shirt" />
                    </FormField>
                    <FormField label="Brand" required>
                      <input className="input-field" value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} placeholder="Polo Ralph Lauren" />
                    </FormField>
                  </div>

                  <FormField label="Slug" required>
                    <input
                      className="input-field font-mono text-xs"
                      value={form.slug ?? ""}
                      onChange={(e) => { setSlugEdited(true); set("slug", e.target.value); }}
                      placeholder="oxford-button-down-shirt"
                    />
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Category">
                      <select className="input-field" value={form.category ?? "tops-shirts"} onChange={(e) => set("category", e.target.value)}>
                        {CATEGORIES.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.label}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Description">
                      <input className="input-field" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Classic Oxford weave, slim fit" />
                    </FormField>
                  </div>

                  {/* isNew toggle */}
                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.isNew}
                      onClick={() => set("isNew", !form.isNew)}
                      className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${form.isNew ? "bg-foreground" : "bg-foreground/20"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isNew ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
                      Mark as New In
                    </span>
                  </label>
                </FormSection>

                <Divider />

                {/* ── Pricing ────────────────────────────────────── */}
                <FormSection title="Pricing">
                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasPrice}
                      onClick={() => setHasPrice((v) => !v)}
                      className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${hasPrice ? "bg-foreground" : "bg-foreground/20"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${hasPrice ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
                      Has a price
                    </span>
                  </label>

                  {hasPrice && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="Original price (MDL)">
                        <input
                          className="input-field"
                          value={form.price?.original ?? ""}
                          onChange={(e) => set("price", { original: e.target.value, current: form.price?.current ?? "" })}
                          placeholder="3 500 MDL"
                        />
                      </FormField>
                      <FormField label="Current price (MDL)">
                        <input
                          className="input-field"
                          value={form.price?.current ?? ""}
                          onChange={(e) => set("price", { original: form.price?.original ?? "", current: e.target.value })}
                          placeholder="2 800 MDL"
                        />
                      </FormField>
                    </div>
                  )}
                </FormSection>

                <Divider />

                {/* ── Primary image ───────────────────────────────── */}
                <FormSection title="Primary image">
                  <FormField label="Image URL" required>
                    <input className="input-field" value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} placeholder="/assets/product-shirt.png" />
                  </FormField>
                  {form.image && (
                    <div className="h-24 w-18 overflow-hidden rounded-xl bg-[#f7f4f0]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </FormSection>

                <Divider />

                {/* ── Sizes ───────────────────────────────────────── */}
                <FormSection title="Sizes & stock">
                  <div className="flex flex-wrap gap-2">
                    {(form.sizes ?? DEFAULT_SIZES).map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => toggleSize(s.label)}
                        className={`cursor-pointer h-10 min-w-12 rounded-xl border px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                          s.inStock
                            ? "border-foreground bg-foreground text-white!"
                            : "border-foreground/15 text-foreground/40 hover:border-foreground/30"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted">Highlighted sizes are in stock.</p>
                </FormSection>

                <Divider />

                {/* ── Colours ─────────────────────────────────────── */}
                <FormSection title="Colours">
                  <div className="space-y-3">
                    {(form.colors ?? []).map((c, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-foreground/8 p-3">
                        {/* Hex picker */}
                        <div className="relative mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-foreground/15">
                          <span className="absolute inset-0 rounded-full" style={{ backgroundColor: c.hex }} />
                          <input
                            type="color"
                            value={c.hex}
                            onChange={(e) => setColor(i, "hex", e.target.value)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                            title="Pick colour"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="grid gap-2 sm:grid-cols-2">
                            <input
                              className="input-field"
                              value={c.name}
                              onChange={(e) => setColor(i, "name", e.target.value)}
                              placeholder="Colour name (e.g. Navy)"
                            />
                            <input
                              className="input-field"
                              value={c.images[0] ?? ""}
                              onChange={(e) => setColor(i, "images", e.target.value)}
                              placeholder="Image URL for this colour"
                            />
                          </div>
                        </div>

                        {(form.colors ?? []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColor(i)}
                            className="cursor-pointer mt-1 text-foreground/25 transition-colors hover:text-red-400"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    className="cursor-pointer flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 transition-colors hover:text-foreground"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add colour
                  </button>
                </FormSection>

                <Divider />

                {/* ── Product details ─────────────────────────────── */}
                <FormSection title="Product details">
                  <div className="space-y-2">
                    {(form.details ?? []).map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="mt-0.5 h-px w-3 shrink-0 bg-foreground/20" />
                        <input
                          className="input-field flex-1"
                          value={d}
                          onChange={(e) => setDetail(i, e.target.value)}
                          placeholder="e.g. 100% combed Oxford cotton"
                        />
                        <button
                          type="button"
                          onClick={() => removeDetail(i)}
                          className="cursor-pointer shrink-0 text-foreground/25 transition-colors hover:text-red-400"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addDetail}
                    className="cursor-pointer flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 transition-colors hover:text-foreground"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add detail
                  </button>
                </FormSection>

              </div>

              {/* Footer */}
              <div className="border-t border-foreground/8 px-6 py-4">
                {error && (
                  <p className="mb-3 text-[11px] font-semibold text-red-500">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer flex-1 rounded-full border border-foreground/15 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="cursor-pointer flex-1 rounded-full bg-foreground py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white! transition-colors hover:bg-foreground/85 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/40">{title}</p>
      {children}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
        {label}{required && <span className="ml-0.5 text-foreground/35">*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-foreground/6" />;
}
