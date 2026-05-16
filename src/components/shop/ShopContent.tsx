"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/cards/ProductCard";
import { categories } from "@/data/products";
import { PALETTE } from "@/data/colors";
import { useShopProducts } from "@/hooks/useShopProducts";
import { getProductSizesForCard } from "@/lib/product-utils";
import { type ProductFilters, type SortKey } from "@/lib/shop-utils";
import {
  AvailabilityDropdown,
  ColorFilterDropdown,
  FilterDropdown,
  MobileFilterPanel,
  SortDropdown,
} from "@/components/shop/ShopFilters";
import FilterIcon from "@/components/icons/FilterIcon";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { ease } from "@/lib/animations";


export function ShopContent({ initialCategory, onlyNew }: { initialCategory?: string; onlyNew?: boolean }) {
  const [category, setCategory]         = useState<string | null>(initialCategory ?? null);
  const [filters, setFilters]           = useState<ProductFilters>({ brands: [], sizes: [], colors: [], onSale: false, availability: "" });
  const [sort, setSort]                 = useState<SortKey>("new-in");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  const { products, total, loading, loadingMore, hasMore, loadMore } = useShopProducts({
    category,
    filters,
    sort,
    onlyNew,
  });

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

  const activeFilterCount = filters.brands.length + filters.sizes.length + filters.colors.length + (filters.onSale ? 1 : 0) + (filters.availability ? 1 : 0);
  const categoryLabel     = categories.find((c) => c.slug === category)?.label ?? "All";

  type ArrayFilterKey = "brands" | "sizes" | "colors";

  function toggleFilter(key: ArrayFilterKey, value: string) {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  function clearFilters() {
    setFilters({ brands: [], sizes: [], colors: [], onSale: false, availability: "" });
    setSort("new-in");
  }

  function changeCategory(nextCategory: string | null) {
    setCategory(nextCategory);
    setFilters({ brands: [], sizes: [], colors: [], onSale: false, availability: "" });
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
              : "Carefully selected menswear from the world's finest houses."}
          </motion.p>
        </motion.div>

        {/* Category nav */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.45 }}
        >
          <div className="relative mb-0">
            <div
              ref={pillsRef}
              className="flex gap-7 overflow-x-auto pb-3"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <button
                    key={cat.label}
                    data-active={isActive}
                    onClick={() => changeCategory(cat.slug)}
                    className={`group relative cursor-pointer shrink-0 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                      isActive
                        ? "text-foreground"
                        : "text-foreground/35 hover:text-foreground/65"
                    }`}
                  >
                    {cat.label}
                    {isActive ? (
                      <motion.span
                        layoutId="category-underline"
                        className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                        transition={{ duration: 0.25, ease }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-foreground/30 transition-transform duration-200 group-hover:scale-x-100" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Right-edge fade for overflow hint */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent" />
          </div>

          {/* Filter bar (desktop) + count row */}
          <div className="border-t border-foreground/8 pt-4">

            {/* Desktop filters row */}
            <div className="mb-4 hidden items-center justify-between md:flex">
              <div className="flex items-center gap-6">
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
                <AvailabilityDropdown
                  value={filters.availability}
                  onChange={(v) => setFilters((prev) => ({ ...prev, availability: v }))}
                  open={openDropdown === "availability"}
                  onOpen={() => setOpenDropdown(openDropdown === "availability" ? null : "availability")}
                />
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, onSale: !prev.onSale }))}
                  className={`group relative cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                    filters.onSale ? "text-foreground" : "text-foreground/50 hover:text-foreground/75"
                  }`}
                >
                  On Sale
                  {filters.onSale ? (
                    <motion.span
                      layoutId="sale-underline"
                      className="absolute left-0 right-0 h-px bg-foreground"
                      style={{ top: "calc(100% + 4px)" }}
                      transition={{ duration: 0.25, ease }}
                    />
                  ) : (
                    <span className="absolute left-0 right-0 h-px origin-left scale-x-0 bg-foreground/30 transition-transform duration-200 group-hover:scale-x-100" style={{ top: "calc(100% + 4px)" }} />
                  )}
                </button>
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
                {!loading && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                    {total} {total === 1 ? "piece" : "pieces"}
                  </p>
                )}
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="cursor-pointer flex items-center gap-1.5 md:hidden rounded-full border border-foreground/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  <FilterIcon />
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
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease, delay: Math.min(i, 7) * 0.06 }}
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
                          slug:      product.slug,
                          colorName: product.colors[0].name,
                          sizes:     getProductSizesForCard(product, filters.colors),
                          price:     product.price?.current ?? "Price on request",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="cursor-pointer flex items-center gap-2.5 rounded-full border border-foreground/20 px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    >
                      {loadingMore ? (
                        <>
                          <span className="animate-spin"><SpinnerIcon /></span>
                          Loading…
                        </>
                      ) : (
                        `Load more`
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">No products found</p>
                <p className="mt-3 text-sm text-muted">Try adjusting your filters or explore other categories.</p>
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
            resultCount={total}
            availableBrands={availableBrands}
            availableSizes={availableSizes}
            availableColors={availableColors}
            onToggle={toggleFilter}
            onToggleSale={() => setFilters((prev) => ({ ...prev, onSale: !prev.onSale }))}
            onChangeAvailability={(v) => setFilters((prev) => ({ ...prev, availability: v }))}
            onSort={setSort}
            onClear={clearFilters}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
