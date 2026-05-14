"use client";

import { PageHeader } from "./OverviewContent";
import { SearchIcon } from "../icons/SearchIcon";

type Props = {
  loading:        boolean;
  total:          number;
  totalInStock:   number;
  totalOutStock:  number;
  search:         string;
  onSearch:       (v: string) => void;
  onCreate:       () => void;
};

export function ProductsToolbar({ loading, total, totalInStock, totalOutStock, search, onSearch, onCreate }: Props) {
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

      <div className="relative mt-6 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search by name or brand…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>
    </>
  );
}
