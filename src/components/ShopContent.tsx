"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./layout/Container";
import ProductCard from "./cards/ProductCard";
import { products, categories, type Product } from "../data/products";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "new-in" | "oldest" | "price-asc" | "price-desc";

type Filters = {
  brands: string[];
  sizes:  string[];
  colors: string[];
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "new-in",      label: "New In"              },
  { key: "oldest",      label: "Oldest First"        },
  { key: "price-asc",   label: "Price: Low to High"  },
  { key: "price-desc",  label: "Price: High to Low"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMDL(str: string): number {
  return parseInt(str.replace(/\s/g, "").replace("MDL", ""), 10);
}

function applySort(list: Product[], sort: SortKey): Product[] {
  return [...list].sort((a, b) => {
    if (sort === "new-in")    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sort === "oldest")    return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
    const ap = a.price ? parseMDL(a.price.current) : Infinity;
    const bp = b.price ? parseMDL(b.price.current) : Infinity;
    return sort === "price-asc" ? ap - bp : bp - ap;
  });
}

function applyFilters(list: Product[], filters: Filters): Product[] {
  return list.filter((p) => {
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (filters.sizes.length  && !p.sizes.some((s)  => filters.sizes.includes(s.label)))   return false;
    if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c.name)))   return false;
    return true;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ShopContent({ initialCategory }: { initialCategory?: string }) {
  const [category, setCategory]       = useState<string | null>(initialCategory ?? null);
  const [filters, setFilters]         = useState<Filters>({ brands: [], sizes: [], colors: [] });
  const [sort, setSort]               = useState<SortKey>("new-in");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  // Scroll active category pill into view on mobile
  useEffect(() => {
    const el = pillsRef.current?.querySelector<HTMLElement>("[data-active='true']");
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [category]);

  // Lock body scroll when mobile panel is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Reset sub-filters when category changes
  useEffect(() => {
    setFilters({ brands: [], sizes: [], colors: [] });
  }, [category]);

  // Derive available options from category-filtered products (before sub-filters)
  const categoryProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  const availableBrands = [...new Set(categoryProducts.map((p) => p.brand))].sort();
  const availableSizes  = [...new Set(categoryProducts.flatMap((p) => p.sizes.map((s) => s.label)))];
  const COLOR_PRIORITY: Record<string, number> = { White: 0, Black: 1 };
  const availableColors = [
    ...new Map(
      categoryProducts.flatMap((p) => p.colors.map((c) => [c.name, c.hex] as [string, string]))
    ).entries(),
  ]
    .map(([name, hex]) => ({ name, hex }))
    .sort((a, b) => {
      const ap = COLOR_PRIORITY[a.name] ?? 2;
      const bp = COLOR_PRIORITY[b.name] ?? 2;
      return ap !== bp ? ap - bp : a.name.localeCompare(b.name);
    });

  // Final filtered + sorted list
  const visible = applySort(applyFilters(categoryProducts, filters), sort);

  const activeFilterCount = filters.brands.length + filters.sizes.length + filters.colors.length;
  const categoryLabel     = categories.find((c) => c.slug === category)?.label ?? "All";

  function toggleFilter(key: keyof Filters, value: string) {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  function clearFilters() {
    setFilters({ brands: [], sizes: [], colors: [] });
    setSort("new-in");
  }

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <main className="bg-background pb-24 pt-36 text-foreground">
      <Container>

        {/* Page header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-serif text-4xl font-semibold uppercase tracking-[0.06em] sm:text-5xl">
            Shop
          </p>
          <motion.div
            className="mx-auto mt-5 h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          />
          <motion.p
            className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
          >
            Carefully selected menswear from the world&apos;s finest houses.
          </motion.p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.45 }}
        >
          <div
            ref={pillsRef}
            className="mb-4 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <button
                  key={cat.label}
                  data-active={isActive}
                  onClick={() => setCategory(cat.slug)}
                  className={`cursor-pointer shrink-0 h-9 rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                    isActive
                      ? "bg-foreground text-white"
                      : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Filter bar (desktop) + count row */}
          <div className="border-t border-foreground/8 pt-4">

            {/* Desktop filters row */}
            <div className="mb-4 hidden items-center justify-between md:flex">
              <div className="flex items-center gap-2">
                <FilterDropdown
                  label="Brand"
                  options={availableBrands.map((b) => ({ value: b, label: b }))}
                  selected={filters.brands}
                  onToggle={(v) => toggleFilter("brands", v)}
                  open={openDropdown === "brand"}
                  onOpen={() => setOpenDropdown(openDropdown === "brand" ? null : "brand")}
                />
                <FilterDropdown
                  label="Size"
                  options={availableSizes.map((s) => ({ value: s, label: s }))}
                  selected={filters.sizes}
                  onToggle={(v) => toggleFilter("sizes", v)}
                  open={openDropdown === "size"}
                  onOpen={() => setOpenDropdown(openDropdown === "size" ? null : "size")}
                />
                <ColorFilterDropdown
                  options={availableColors}
                  selected={filters.colors}
                  onToggle={(v) => toggleFilter("colors", v)}
                  open={openDropdown === "color"}
                  onOpen={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
                />
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="cursor-pointer ml-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 underline underline-offset-2 hover:text-foreground transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              <SortDropdown
                value={sort}
                onChange={(v) => { setSort(v); setOpenDropdown(null); }}
                open={openDropdown === "sort"}
                onOpen={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              />
            </div>

            {/* Count row + mobile filter button */}
            <div className="flex items-center justify-between pb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                {categoryLabel}
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-foreground/60">· {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}</span>
                )}
              </p>

              <div className="flex items-center gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  {visible.length} {visible.length === 1 ? "piece" : "pieces"}
                </p>
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="cursor-pointer flex items-center gap-1.5 md:hidden rounded-full border border-foreground/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                  </svg>
                  Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Backdrop for desktop dropdowns */}
        {openDropdown && (
          <div className="fixed inset-0 z-40" onClick={closeDropdown} />
        )}

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${JSON.stringify(filters)}-${sort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            {visible.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                  >
                    <ProductCard
                      name={product.name}
                      brand={product.brand}
                      description={product.description}
                      image={product.image}
                      price={product.price}
                      href={`/product/${product.slug}`}
                      isNew={product.isNew}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">No results.</p>
                <p className="mt-3 text-sm text-muted">Try adjusting your filters.</p>
                <button
                  onClick={clearFilters}
                  className="cursor-pointer mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground underline underline-offset-4 hover:text-muted transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </Container>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileFilterPanel
            filters={filters}
            sort={sort}
            resultCount={visible.length}
            availableBrands={availableBrands}
            availableSizes={availableSizes}
            availableColors={availableColors}
            onToggle={toggleFilter}
            onSort={setSort}
            onClear={clearFilters}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── FilterDropdown ───────────────────────────────────────────────────────────

function FilterDropdown({
  label, options, selected, onToggle, open, onOpen,
}: {
  label:    string;
  options:  { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  open:     boolean;
  onOpen:   () => void;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const count = selected.length;

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className={`cursor-pointer flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
          count > 0 || open
            ? "border-foreground bg-foreground text-white"
            : "border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        {label}{count > 0 && ` (${count})`}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease }}
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-20 mt-2 min-w-40 overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map(({ value, label: optLabel }) => {
                const checked = selected.includes(value);
                return (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4"
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                      checked ? "border-foreground bg-foreground" : "border-foreground/25"
                    }`}>
                      {checked && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggle(value)}
                    />
                    <span className="text-[11px] font-medium text-foreground/80">{optLabel}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ColorFilterDropdown ──────────────────────────────────────────────────────

function ColorFilterDropdown({
  options, selected, onToggle, open, onOpen,
}: {
  options:  { name: string; hex: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  open:     boolean;
  onOpen:   () => void;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const count = selected.length;

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className={`cursor-pointer flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
          count > 0 || open
            ? "border-foreground bg-foreground text-white"
            : "border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        Colour{count > 0 && ` (${count})`}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease }}
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-20 mt-2 min-w-45 overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map(({ name, hex }) => {
                const checked = selected.includes(name);
                return (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4"
                  >
                    <span
                      className={`relative h-5 w-5 shrink-0 rounded-full transition-all duration-150 ${
                        checked ? "ring-2 ring-foreground ring-offset-1" : ""
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      <span className="absolute inset-0 rounded-full border border-black/10" />
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggle(name)}
                    />
                    <span className="text-[11px] font-medium text-foreground/80">{name}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SortDropdown ─────────────────────────────────────────────────────────────

function SortDropdown({
  value, onChange, open, onOpen,
}: {
  value:    SortKey;
  onChange: (v: SortKey) => void;
  open:     boolean;
  onOpen:   () => void;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const label = SORT_OPTIONS.find((s) => s.key === value)!.label;

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className="cursor-pointer flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/50 hover:text-foreground transition-colors duration-200"
      >
        {label}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease }}
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-20 mt-2 min-w-45 overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="p-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange(opt.key)}
                  className={`cursor-pointer flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-medium transition-colors duration-150 hover:bg-foreground/4 ${
                    value === opt.key ? "text-foreground" : "text-foreground/55"
                  }`}
                >
                  {opt.label}
                  {value === opt.key && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MobileFilterPanel ────────────────────────────────────────────────────────

function MobileFilterPanel({
  filters, sort, resultCount, availableBrands, availableSizes, availableColors,
  onToggle, onSort, onClear, onClose,
}: {
  filters:         Filters;
  sort:            SortKey;
  resultCount:     number;
  availableBrands: string[];
  availableSizes:  string[];
  availableColors: { name: string; hex: string }[];
  onToggle:        (key: keyof Filters, value: string) => void;
  onSort:          (v: SortKey) => void;
  onClear:         () => void;
  onClose:         () => void;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const activeFilterCount = filters.brands.length + filters.sizes.length + filters.colors.length;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4, ease }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/8 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
          Filter & Sort
        </p>
        <div className="flex items-center gap-4">
          {activeFilterCount > 0 && (
            <button
              onClick={onClear}
              className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 underline underline-offset-2"
            >
              Clear all
            </button>
          )}
          <button onClick={onClose} className="cursor-pointer text-foreground/50 hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

        {/* Sort */}
        <MobileSection title="Sort">
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => onSort(opt.key)}
                className={`cursor-pointer h-9 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                  sort === opt.key
                    ? "bg-foreground text-white"
                    : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </MobileSection>

        {/* Brand */}
        {availableBrands.length > 0 && (
          <MobileSection title="Brand">
            <div className="flex flex-wrap gap-2">
              {availableBrands.map((b) => {
                const checked = filters.brands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => onToggle("brands", b)}
                    className={`cursor-pointer h-9 rounded-full px-4 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-200 ${
                      checked
                        ? "bg-foreground text-white"
                        : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </MobileSection>
        )}

        {/* Size */}
        {availableSizes.length > 0 && (
          <MobileSection title="Size">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((s) => {
                const checked = filters.sizes.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => onToggle("sizes", s)}
                    className={`cursor-pointer h-10 min-w-12 rounded-xl px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                      checked
                        ? "border border-foreground bg-foreground text-white"
                        : "border border-foreground/20 text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </MobileSection>
        )}

        {/* Colour */}
        {availableColors.length > 0 && (
          <MobileSection title="Colour">
            <div className="flex flex-wrap gap-3">
              {availableColors.map(({ name, hex }) => {
                const checked = filters.colors.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => onToggle("colors", name)}
                    title={name}
                    className={`cursor-pointer flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-[11px] font-medium transition-all duration-200 ${
                      checked
                        ? "border-foreground text-foreground"
                        : "border-foreground/15 text-muted hover:border-foreground/30"
                    }`}
                  >
                    <span
                      className={`relative h-5 w-5 shrink-0 rounded-full ${checked ? "ring-2 ring-foreground ring-offset-1" : ""}`}
                      style={{ backgroundColor: hex }}
                    >
                      <span className="absolute inset-0 rounded-full border border-black/10" />
                    </span>
                    {name}
                  </button>
                );
              })}
            </div>
          </MobileSection>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-foreground/8 px-5 py-4">
        <button
          onClick={onClose}
          className="cursor-pointer w-full rounded-full bg-foreground py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-foreground/90"
        >
          Show {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </button>
      </div>
    </motion.div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
        {title}
      </p>
      {children}
    </div>
  );
}
