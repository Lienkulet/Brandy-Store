"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";
import {
  ACCESSORY_SIZES,
  BRANDS,
  DEFAULT_SIZES,
  PRODUCT_CATEGORIES,
  blankColor,
  blankProduct,
  categoryLabelForSlug,
  sizesForCategory,
  toSlug,
  type ProductFormColor,
} from "./productFormModel";
import { ease } from "@/lib/animations";
import { FormSection, FormField, FormDivider } from "./form/FormPrimitives";
import { ProductColorEditor } from "./form/ProductColorEditor";

type Props = {
  open:     boolean;
  product?: Product | null;
  onClose:  () => void;
  onSave:   (p: Product) => Promise<void>;
};

export function ProductFormPanel({ open, product, onClose, onSave }: Props) {
  const isEdit = Boolean(product);
  const [form, setForm]             = useState<ReturnType<typeof blankProduct>>(blankProduct());
  const [hasPrice, setHasPrice]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState(categoryLabelForSlug("tops-shirts"));

  // Active colour tab
  const [activeColor, setActiveColor] = useState(0);

  // Drag / drop state
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  // objectURL → File, uploaded only on save
  const pendingFiles = useRef<Record<string, File>>({});

  function revokePending() {
    Object.keys(pendingFiles.current).forEach((u) => URL.revokeObjectURL(u));
    pendingFiles.current = {};
  }

  // Dropdowns
  const [brandOpen, setBrandOpen]               = useState(false);
  const [categoryOpen, setCategoryOpen]         = useState(false);
  const [colorPaletteOpen, setColorPaletteOpen] = useState<number | null>(null);
  const brandRef    = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const paletteRef  = useRef<HTMLDivElement>(null);
  const brandSearch = (form.brand ?? "").trim().toLowerCase();
  const filteredBrands = BRANDS.filter((brand) =>
    brand.toLowerCase().includes(brandSearch)
  );
  const categorySearch = categoryQuery.trim().toLowerCase();
  const filteredCategories = PRODUCT_CATEGORIES.filter((category) =>
    category.label.toLowerCase().includes(categorySearch) ||
    category.slug.toLowerCase().includes(categorySearch)
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current    && !brandRef.current.contains(e.target as Node))    setBrandOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (paletteRef.current  && !paletteRef.current.contains(e.target as Node))  setColorPaletteOpen(null);
    }
    if (brandOpen || categoryOpen || colorPaletteOpen !== null)
      document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [brandOpen, categoryOpen, colorPaletteOpen]);

  // Seed form when panel opens
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      if (product) {
        const colors: ProductFormColor[] = product.colors.map((c) => ({
          ...c,
          images: c.images?.length ? c.images : [""],
          sizes:  c.sizes?.length  ? [...c.sizes] : (product.sizes ?? DEFAULT_SIZES).map((s) => ({ ...s })),
        }));
        setForm({ ...structuredClone(product), colors });
        setCategoryQuery(categoryLabelForSlug(product.category));
        setHasPrice(Boolean(product.price?.original?.trim()));
        setSlugEdited(true);
      } else {
        const blank = blankProduct();
        setForm(blank);
        setCategoryQuery(categoryLabelForSlug(blank.category));
        setHasPrice(false);
        setSlugEdited(false);
      }
      setActiveColor(0);
      setError("");
      setSaving(false);
      revokePending();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, product]);

  function set<K extends keyof Product>(key: K, val: Product[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function setName(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugEdited ? f.slug : toSlug(name),
    }));
  }

  function setCategory(category: string) {
    setForm((f) => {
      const next = { ...f, category };
      if (isEdit) return next;

      const preset = sizesForCategory(category);
      return {
        ...next,
        sizes:  preset,
        colors: f.colors.map((c) => ({ ...c, sizes: preset.map((s) => ({ ...s })) })),
      };
    });
  }

  // ── Per-color helpers ──────────────────────────────────────────────
  function setColorImages(ci: number, images: string[]) {
    setForm((f) => {
      const colors = [...f.colors];
      colors[ci] = { ...colors[ci], images };
      return { ...f, colors };
    });
  }

  function toggleColorSize(ci: number, label: string) {
    setForm((f) => {
      const colors = [...f.colors];
      colors[ci] = {
        ...colors[ci],
        sizes: colors[ci].sizes.map((s) =>
          s.label === label ? { ...s, inStock: !s.inStock } : s
        ),
      };
      return { ...f, colors };
    });
  }

  function applyCategorySizes() {
    setForm((f) => {
      const preset = sizesForCategory(f.category);
      return {
        ...f,
        sizes:  preset,
        colors: f.colors.map((c) => ({ ...c, sizes: preset.map((s) => ({ ...s })) })),
      };
    });
  }

  function setAccessoryStock(inStock: boolean) {
    setForm((f) => ({
      ...f,
      sizes:  ACCESSORY_SIZES.map((s) => ({ ...s, inStock })),
      colors: f.colors.map((c) => ({
        ...c,
        sizes: ACCESSORY_SIZES.map((s) => ({ ...s, inStock })),
      })),
    }));
  }

  function addColor() {
    setForm((f) => ({
      ...f,
      colors: [...f.colors, blankColor(f.category)],
    }));
    setActiveColor((prev) => prev + 1);
  }

  function removeColor(i: number) {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) as ProductFormColor[] }));
    setActiveColor((prev) => Math.max(0, prev >= i ? prev - 1 : prev));
  }

  function pickColorSwatch(ci: number, hex: string, name: string) {
    setForm((f) => {
      const colors = [...f.colors];
      colors[ci] = { ...colors[ci], hex, name };
      return { ...f, colors };
    });
    setColorPaletteOpen(null);
  }

  // ── Image drop — store locally, upload on save ────────────────────
  function uploadFiles(ci: number, files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    const objectUrls = arr.map((file) => {
      const url = URL.createObjectURL(file);
      pendingFiles.current[url] = file;
      return url;
    });
    setColorImages(ci, [
      ...form.colors[ci].images.filter((u) => u.trim()),
      ...objectUrls,
      "",
    ]);
  }

  function handleDrop(ci: number, e: React.DragEvent) {
    e.preventDefault();
    setDraggingIdx(null);
    uploadFiles(ci, e.dataTransfer.files);
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
    if (!form.colors?.length || !form.colors[0].name.trim())
      return setError("At least one colour is required.");

    const firstColorImages = form.colors[0].images.map((u) => u.trim()).filter(Boolean);
    const mainImage = firstColorImages[0] ?? "";
    if (!mainImage) return setError("Add at least one image to the first colour.");

    const isAccessory = form.category === "accessories";
    const normalizedColors = form.colors.map((c) => {
      const imgs = c.images.map((u) => u.trim()).filter(Boolean);
      const accessoryInStock = c.sizes?.some((s) => s.inStock) ?? true;
      return {
        name:   c.name,
        hex:    c.hex,
        images: imgs.length ? imgs : [mainImage],
        sizes:  isAccessory
          ? ACCESSORY_SIZES.map((s) => ({ ...s, inStock: accessoryInStock }))
          : c.sizes,
      };
    });

    const payload: Product = {
      id:          form.id!,
      slug:        form.slug!,
      name:        form.name!,
      brand:       form.brand!,
      category:    form.category!,
      description: form.description ?? "",
      image:       mainImage,
      isNew:       form.isNew ?? false,
      price:       form.price?.current?.trim()
        ? { original: hasPrice ? (form.price.original ?? "") : "", current: form.price.current }
        : null,
      colors: normalizedColors,
      sizes:  normalizedColors[0]?.sizes ?? DEFAULT_SIZES,
      details: (form.details ?? []).filter((d) => d.trim()),
    };

    setSaving(true);
    try {
      // Upload any locally-buffered files now
      const resolved: Record<string, string> = {};
      await Promise.all(
        Object.entries(pendingFiles.current).map(async ([objectUrl, file]) => {
          const fd = new FormData();
          fd.append("file", file);
          const res  = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (data.url) resolved[objectUrl] = data.url;
        })
      );

      // Swap object URLs → real URLs in payload
      const resolveUrl = (u: string) => resolved[u] ?? u;
      payload.image  = resolveUrl(payload.image);
      payload.colors = payload.colors.map((c) => ({
        ...c,
        images: c.images.map(resolveUrl),
      }));

      revokePending();
      await onSave(payload);
      setSaving(false);
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
            className="fixed right-0 top-0 z-60 flex h-dvh w-full flex-col bg-white shadow-[-4px_0_40px_rgba(95,77,57,0.1)] md:w-140"
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
                      <input className="input-field" value={form.name ?? ""} onChange={(e) => setName(e.target.value)} placeholder="Oxford Button-Down Shirt" />
                    </FormField>
                    <FormField label="Slug" required>
                      <input
                        className="input-field font-mono text-xs"
                        value={form.slug ?? ""}
                        onChange={(e) => { setSlugEdited(true); set("slug", e.target.value); }}
                        placeholder="oxford-button-down-shirt"
                      />
                    </FormField>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <FormField label="Brand" required>
                        <div className="relative" ref={brandRef}>
                          <input
                            className="input-field pr-9"
                            value={form.brand ?? ""}
                            onFocus={() => setBrandOpen(true)}
                            onChange={(e) => {
                              set("brand", e.target.value);
                              setBrandOpen(true);
                            }}
                            placeholder="Start typing brand..."
                          />
                          <button
                            type="button"
                            onClick={() => setBrandOpen((v) => !v)}
                            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-foreground/40"
                            aria-label="Toggle brand options"
                          >
                            <motion.svg
                              animate={{ rotate: brandOpen ? 180 : 0 }}
                              transition={{ duration: 0.2, ease }}
                              width="12" height="12" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                              className="shrink-0"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </motion.svg>
                          </button>
                          <AnimatePresence>
                            {brandOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.18, ease }}
                                className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-foreground/8 bg-white shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
                              >
                                <div className="max-h-56 overflow-y-auto rounded-2xl p-1.5">
                                  {filteredBrands.length > 0 ? (
                                    filteredBrands.map((b) => (
                                      <button
                                        key={b}
                                        type="button"
                                        onClick={() => { set("brand", b); setBrandOpen(false); }}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] transition-colors duration-150 hover:bg-foreground/4 ${
                                          form.brand === b ? "font-semibold text-foreground" : "text-foreground/70"
                                        }`}
                                      >
                                        {b}
                                        {form.brand === b && (
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </button>
                                    ))
                                  ) : (
                                    <p className="px-3 py-2.5 text-[12px] text-foreground/45">
                                      No matching brands. Keep typing to use a custom brand.
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </FormField>
                    </div>
                    <div className="flex-1 min-w-0">
                      <FormField label="Category">
                        <div className="relative" ref={categoryRef}>
                          <input
                            className="input-field pr-9"
                            value={categoryQuery}
                            onFocus={() => setCategoryOpen(true)}
                            onChange={(e) => {
                              const value = e.target.value;
                              const exact = PRODUCT_CATEGORIES.find((c) =>
                                c.label.toLowerCase() === value.trim().toLowerCase() ||
                                c.slug.toLowerCase() === value.trim().toLowerCase()
                              );
                              setCategoryQuery(value);
                              if (exact) setCategory(exact.slug);
                              setCategoryOpen(true);
                            }}
                            placeholder="Start typing category..."
                          />
                          <button
                            type="button"
                            onClick={() => setCategoryOpen((v) => !v)}
                            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-foreground/40"
                            aria-label="Toggle category options"
                          >
                            <motion.svg
                              animate={{ rotate: categoryOpen ? 180 : 0 }}
                              transition={{ duration: 0.2, ease }}
                              width="12" height="12" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                              className="shrink-0"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </motion.svg>
                          </button>
                          <AnimatePresence>
                            {categoryOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                transition={{ duration: 0.18, ease }}
                                className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-foreground/8 bg-white shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
                              >
                                <div className="rounded-2xl p-1.5">
                                  {filteredCategories.length > 0 ? (
                                    filteredCategories.map((c) => (
                                      <button
                                        key={c.slug}
                                        type="button"
                                        onClick={() => {
                                          setCategory(c.slug);
                                          setCategoryQuery(c.label);
                                          setCategoryOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] transition-colors duration-150 hover:bg-foreground/4 ${
                                          (form.category ?? "tops-shirts") === c.slug ? "font-semibold text-foreground" : "text-foreground/70"
                                        }`}
                                      >
                                        {c.label}
                                        {(form.category ?? "tops-shirts") === c.slug && (
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </button>
                                    ))
                                  ) : (
                                    <p className="px-3 py-2.5 text-[12px] text-foreground/45">
                                      No matching categories. Select one of the available categories.
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </FormField>
                    </div>
                  </div>

                  <FormField label="Description">
                    <input className="input-field" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Classic Oxford weave, slim fit" />
                  </FormField>

                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.isNew}
                      onClick={() => set("isNew", !form.isNew)}
                      className={`relative h-5 w-9 shrink-0 overflow-hidden rounded-full p-0 transition-colors duration-200 ${form.isNew ? "bg-foreground" : "bg-foreground/20"}`}
                    >
                      <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${form.isNew ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
                      Mark as New In
                    </span>
                  </label>
                </FormSection>

                <FormDivider />

                {/* ── Pricing ────────────────────────────────────── */}
                <FormSection title="Pricing">
                  <FormField label="Price (MDL)">
                    <input
                      className="input-field"
                      value={form.price?.current ?? ""}
                      onChange={(e) => set("price", { original: form.price?.original ?? "", current: e.target.value })}
                      placeholder="2 800 MDL"
                    />
                  </FormField>

                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasPrice}
                      onClick={() => {
                        setHasPrice((v) => !v);
                        if (hasPrice) set("price", { original: "", current: form.price?.current ?? "" });
                      }}
                      className={`relative h-5 w-9 shrink-0 overflow-hidden rounded-full p-0 transition-colors duration-200 ${hasPrice ? "bg-foreground" : "bg-foreground/20"}`}
                    >
                      <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${hasPrice ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
                      On Sale
                    </span>
                  </label>

                  <AnimatePresence>
                    {hasPrice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4">
                          <FormField label="Original price (MDL)">
                            <input
                              className="input-field"
                              value={form.price?.original ?? ""}
                              onChange={(e) => set("price", { original: e.target.value, current: form.price?.current ?? "" })}
                              placeholder="3 500 MDL"
                            />
                          </FormField>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormSection>

                <FormDivider />

                {/* ── Colours ─────────────────────────────────────── */}
                <FormSection title="Colours">

                  {/* Swatch tab row */}
                  <div className="flex flex-wrap items-center gap-2" ref={paletteRef}>
                    {form.colors.map((c, ci) => (
                      <div key={ci} className="relative">
                        {/* Active ring + remove badge */}
                        <button
                          type="button"
                          onClick={() => setActiveColor(ci)}
                          title={c.name}
                          className={`relative h-8 w-8 cursor-pointer rounded-full border transition-all duration-200 ${
                            activeColor === ci
                              ? "border-foreground ring-2 ring-foreground ring-offset-2 scale-110"
                              : "border-black/10 opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                        {/* Remove on non-active, only if >1 colour */}
                        {form.colors.length > 1 && activeColor === ci && (
                          <button
                            type="button"
                            onClick={() => removeColor(ci)}
                            className="cursor-pointer absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-opacity hover:bg-red-600"
                            title="Remove colour"
                          >
                            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add colour button */}
                    <button
                      type="button"
                      onClick={addColor}
                      className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-foreground/20 text-foreground/35 transition-colors hover:border-foreground/40 hover:text-foreground/60"
                      title="Add colour"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>

                  {/* Active colour panel */}
                  {form.colors[activeColor] && (
                    <ProductColorEditor
                      color={form.colors[activeColor]}
                      colorIdx={activeColor}
                      category={form.category ?? "tops-shirts"}
                      isFirstColor={activeColor === 0}
                      paletteOpen={colorPaletteOpen === activeColor}
                      dragging={draggingIdx === activeColor}
                      onPaletteToggle={() => setColorPaletteOpen(colorPaletteOpen === activeColor ? null : activeColor)}
                      onPickSwatch={(hex, name) => pickColorSwatch(activeColor, hex, name)}
                      onDragOver={(e) => { e.preventDefault(); setDraggingIdx(activeColor); }}
                      onDragLeave={() => setDraggingIdx(null)}
                      onDrop={(e) => handleDrop(activeColor, e)}
                      onFileChange={(files) => uploadFiles(activeColor, files)}
                      onImageUrlChange={(ii, value) => {
                        const imgs = [...form.colors[activeColor].images];
                        imgs[ii] = value;
                        setColorImages(activeColor, imgs);
                      }}
                      onImageRemove={(ii) => {
                        const imgs = form.colors[activeColor].images.filter((_, idx) => idx !== ii);
                        setColorImages(activeColor, imgs.length ? imgs : [""]);
                      }}
                      onToggleSize={(label) => toggleColorSize(activeColor, label)}
                      onSetAccessoryStock={setAccessoryStock}
                      onApplyCategorySizes={applyCategorySizes}
                    />
                  )}
                </FormSection>

                <FormDivider />

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

