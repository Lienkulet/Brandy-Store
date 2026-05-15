"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import { type OrderStatus, STATUS_LABELS } from "@/lib/order-utils";
import { useOrders } from "@/hooks/useOrders";
import { OrderRow } from "./OrderRow";
import { PageHeader, EmptyState } from "./OverviewContent";

export type { OrderStatus } from "@/lib/order-utils";
export type { Order } from "@/lib/order-utils";

const FILTER_TABS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type FilterTab = typeof FILTER_TABS[number];

export function OrdersContent() {
  const { orders, loading, updateStatus } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<FilterTab>("all");

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function toggleExpanded(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Orders" subtitle="Manage and track customer orders." />
        <p className="text-[11px] font-semibold text-foreground/40">
          {loading ? "Loading…" : `${orders.length} total`}
        </p>
      </div>

      <FilterTabs filter={filter} orders={orders} onSelect={setFilter} />

      <OrderTable loading={loading} filter={filter}>
        {visible.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            expanded={expanded === order.id}
            onToggle={() => toggleExpanded(order.id)}
            onStatusChange={(s) => updateStatus(order.id, s)}
          />
        ))}
      </OrderTable>
    </div>
  );
}

function FilterTabs({
  filter, orders, onSelect,
}: {
  filter:   FilterTab;
  orders:   { status: OrderStatus }[];
  onSelect: (f: FilterTab) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {FILTER_TABS.map((tab) => {
        const count = tab === "all"
          ? orders.length
          : orders.filter((o) => o.status === tab).length;

        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`cursor-pointer h-8 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              filter === tab
                ? "border-foreground bg-foreground text-white"
                : "border-foreground/12 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {tab === "all" ? "All" : STATUS_LABELS[tab]}
            {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function OrderTable({
  loading, filter, children,
}: {
  loading:  boolean;
  filter:   FilterTab;
  children: React.ReactNode;
}) {
  const emptyMessage = filter === "all"
    ? "No orders yet"
    : `No ${STATUS_LABELS[filter as OrderStatus].toLowerCase()} orders`;

  return (
    <motion.div
      className="mt-4 overflow-hidden rounded-2xl border border-foreground/8 bg-white"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {loading ? (
        <OrdersSkeleton />
      ) : !hasChildren(children) ? (
        <EmptyState icon={<OrdersIcon />} message={emptyMessage} sub="Orders placed by customers will appear here." />
      ) : (
        <>
          <OrdersTableHeader />
          {children}
        </>
      )}
    </motion.div>
  );
}

function OrdersTableHeader() {
  return (
    <div className="hidden grid-cols-[1fr_120px_100px_120px_80px] gap-4 border-b border-foreground/8 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35 sm:grid">
      <span>Customer</span>
      <span>Date</span>
      <span>Total</span>
      <span>Delivery</span>
      <span>Status</span>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="divide-y divide-foreground/6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-foreground/8" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-foreground/6" />
          </div>
          <div className="hidden h-2.5 w-20 animate-pulse rounded bg-foreground/6 sm:block" />
          <div className="hidden h-2.5 w-16 animate-pulse rounded bg-foreground/6 sm:block" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-foreground/8" />
        </div>
      ))}
    </div>
  );
}

function OrdersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function hasChildren(children: React.ReactNode): boolean {
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(Boolean);
}
