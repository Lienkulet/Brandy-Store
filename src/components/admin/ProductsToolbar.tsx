"use client";

import { PageHeader } from "./OverviewContent";
import { SearchIcon } from "../icons/SearchIcon";

export type ProductFilter = "all" | "in-stock" | "out-of-stock" | "on-sale" | "new";

type Props = {
  loading:        boolean;
  total:          number;
  totalInStock:   number;
  totalOutStock:  number;
  totalOnSale:    number;
  totalNew:       number;
  search:         string;
  activeFilter:   ProductFilter;
  onSearch:       (v: string) => void;
  onClearSearch:  () => void;
  onFilterChange: (filter: ProductFilter) => void;
  onCreate:       () => void;
};

const FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In stock" },
  { value: "out-of-stock", label: "Out of stock" },
  { value: "on-sale", label: "On sale" },
  { value: "new", label: "New" },
];

export function ProductsToolbar({
  loading,
  total,
  totalInStock,
  totalOutStock,
  totalOnSale,
  totalNew,
  search,
  activeFilter,
  onSearch,
  onClearSearch,
  onFilterChange,
  onCreate,
}: Props) {
  const counts: Record<ProductFilter, number> = {
    all: total,
    "in-stock": totalInStock,
    "out-of-stock": totalOutStock,
    "on-sale": totalOnSale,
    new: totalNew,
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Products"
          subtitle={loading ? "Loading…" : `${total} products · ${totalInStock} in stock · ${totalOutStock} fully out`}
        />
        <button
          onClick={onCreate}
          className="cursor-pointer flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white! transition-colors hover:bg-foreground/85"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Product
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute left-2 top-1/2 flex h-6 w-8 -translate-y-1/2 items-center justify-center text-foreground/50"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="input-field search-input-field"
          />
          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="cursor-pointer absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-foreground/35 transition-colors hover:bg-foreground/6 hover:text-foreground"
              aria-label="Clear product search"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={`h-10 rounded-full border px-3.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                activeFilter === filter.value
                  ? "border-foreground bg-foreground text-white"
                  : "border-foreground/12 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {filter.label}
              <span className="ml-1.5 opacity-60">{counts[filter.value]}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
