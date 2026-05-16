"use client";

import { PageHeader } from "@/components/admin/AdminPrimitives";
import { SearchIcon } from "@/components/icons/SearchIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import { PRODUCT_FILTERS } from "@/data/product-filters";
import type { ProductFilter } from "@/lib/product-utils";

type Props = {
  loading:        boolean;
  total:          number;
  search:         string;
  activeFilter:   ProductFilter;
  onSearch:       (v: string) => void;
  onClearSearch:  () => void;
  onFilterChange: (filter: ProductFilter) => void;
  onCreate:       () => void;
};

export function ProductsToolbar({
  loading, total, search, activeFilter, onSearch, onClearSearch, onFilterChange, onCreate,
}: Props) {

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Products"
          subtitle={loading ? "Loading…" : `${total} products`}
        />
        <button
          onClick={onCreate}
          className="cursor-pointer flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white! transition-colors hover:bg-foreground/85"
        >
          <PlusIcon />
          New Product
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute left-2 top-1/2 flex h-6 w-8 -translate-y-1/2 items-center justify-center text-foreground/50">
            <SearchIcon />
          </span>
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
              <CloseIcon />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
          {PRODUCT_FILTERS.map((filter) => (
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
              {activeFilter === filter.value && total > 0 && (
                <span className="ml-1.5 opacity-60">{total}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
