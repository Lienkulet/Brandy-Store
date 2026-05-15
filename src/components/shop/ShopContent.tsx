"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/cards/ProductCard";
import { categories, type Product } from "@/data/products";
import { PALETTE } from "@/data/colors";
import { useProducts } from "@/hooks/useProducts";
import { getProductSizesForCard } from "@/lib/product-utils";
import { applySort, applyFilters, type ProductFilters, type SortKey } from "@/lib/shop-utils";
import {
  ColorFilterDropdown,
  FilterDropdown,
  MobileFilterPanel,
  SortDropdown,
} from "./ShopFilters";
import { ease } from "@/lib/animations";

export function ShopContent({ initialCategory, onlyNew }: { initialCategory?: string; onlyNew?: boolean }) {
  const filterProducts = useCallback(
    (product: Product) => !onlyNew || Boolean(product.isNew),
    [onlyNew]
  );
  const { products: allProducts, loading } = useProducts(filterProducts);
  const [category, setCategory]       = useState<string | null>(initialCategory ?? null);
  const [filters, setFilters]         = useState<ProductFilters>({ brands: [], sizes: [], colors: [] });
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

  // Derive available options from category-filtered products (before sub-filters)
  const categoryProducts = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts;

  const ALL_BRANDS = [
    "Loro Piana", "Boss", "Hugo", "Polo", "Zegna",
    "Armani Exchange", "Tommy Hilfiger", "Calvin Klein",
    "Brunello Cucinelli", "Emporio Armani", "Lacoste",
    "Brango", "Tony Montana", "Etro", "Tom Ford",
    "DOLCE & GABBANA", "Zara", "Massimo Dutti", "Vaganza", "Moncler",
  ];
  const availableBrands = ALL_BRANDS;
  const availableSizes = category === "accessories"
    ? []
    : category === "shoes"
    ? ["39", "40", "41", "42", "43", "44", "45", "46"]
    : category === "pants-jeans" || category === "shorts"
    ? ["30", "31", "32", "33", "34", "36", "38"]
    : ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = PALETTE;

  // Final filtered + sorted list
  const visible = applySort(applyFilters(categoryProducts, filters), sort);

  const activeFilterCount = filters.brands.length + filters.sizes.length + filters.colors.length;
  const categoryLabel     = categories.find((c) => c.slug === category)?.label ?? "All";

  function toggleFilter(key: keyof ProductFilters, value: string) {
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

  function changeCategory(nextCategory: string | null) {
    setCategory(nextCategory);
    setFilters({ brands: [], sizes: [], colors: [] });
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
            {onlyNew ? "New Arrivals" : "Shop"}
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
            {onlyNew
              ? "The latest additions to our collection."
              : "Carefully selected menswear from the world’s finest houses."}
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
                  onClick={() => changeCategory(cat.slug)}
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
                {availableSizes.length > 0 && (
                  <FilterDropdown
                    label="Size"
                    options={availableSizes.map((s) => ({ value: s, label: s }))}
                    selected={filters.sizes}
                    onToggle={(v) => toggleFilter("sizes", v)}
                    open={openDropdown === "size"}
                    onOpen={() => setOpenDropdown(openDropdown === "size" ? null : "size")}
                  />
                )}
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
          <div className="fixed inset-0 z-10" onClick={closeDropdown} />
        )}

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? "loading" : `${category}-${JSON.stringify(filters)}-${sort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-4/5 animate-pulse rounded-2xl bg-foreground/6" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-foreground/6" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-foreground/5" />
                  </div>
                ))}
              </div>
            ) : visible.length > 0 ? (
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
                      sizeFree={product.category === "accessories"}
                      quickAdd={{
                        productId: product.id,
                        colorName: product.colors[0].name,
                        sizes:     getProductSizesForCard(product, filters.colors),
                        price:     product.price?.current ?? "Price on request",
                      }}
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

