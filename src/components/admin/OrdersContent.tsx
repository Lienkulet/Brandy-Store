"use client";

import { useState, useTransition } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import { OrderRow } from "@/components/admin/OrderRow";
import { PageHeader } from "@/components/admin/AdminPrimitives";
import { FilterTabs, type FilterTab } from "@/components/admin/orders/FilterTabs";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import CloseIcon from "@/components/icons/CloseIcon";
import ChevronIcon from "@/components/icons/ChevronIcon";

export type { OrderStatus } from "@/lib/order-utils";
export type { Order } from "@/lib/order-utils";

export function OrdersContent() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, 300);

  const { orders, total, loading, updateStatus } = useOrders({
    page,
    search: debouncedSearch,
    status: filter,
  });

  const pageSize   = 20;
  const totalPages = Math.ceil(total / pageSize);
  const isBusy     = loading || isPending;

  function handleFilterChange(f: FilterTab) {
    startTransition(() => {
      setFilter(f);
      setPage(1);
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    startTransition(() => setPage(1));
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <main>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Orders" subtitle="Manage and track customer orders." />
        <p className="text-[11px] font-semibold text-foreground/40">
          {loading ? "Loading…" : `${total} total`}
        </p>
      </div>

      <FilterTabs filter={filter} orders={orders} onSelect={handleFilterChange} />

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/2 px-3 py-2 w-64 focus-within:border-foreground/25 transition-colors duration-150">
        <input
          type="text"
          placeholder="Search by name, phone or #…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-[11px] font-medium text-foreground placeholder:text-foreground/30 outline-none"
        />
        {search && (
          <button onClick={() => handleSearchChange("")} className="cursor-pointer text-foreground/30 hover:text-foreground transition-colors">
            <CloseIcon size={10} />
          </button>
        )}
      </div>

      <OrderTable loading={isBusy} filter={filter}>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            expanded={expanded === order.id}
            onToggle={() => toggleExpanded(order.id)}
            onStatusChange={(s) => updateStatus(order.id, s)}
          />
        ))}
      </OrderTable>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[11px] text-foreground/40">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 transition-colors hover:border-foreground/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="rotate-90"><ChevronIcon size={10} /></span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-[11px] text-foreground/30">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`cursor-pointer h-8 w-8 rounded-lg border text-[11px] font-semibold transition-colors ${
                      page === p
                        ? "border-foreground bg-foreground text-white"
                        : "border-foreground/10 text-foreground/50 hover:border-foreground/25 hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/50 transition-colors hover:border-foreground/25 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="-rotate-90"><ChevronIcon size={10} /></span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
