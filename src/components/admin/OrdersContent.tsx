"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, EmptyState } from "./OverviewContent";

const ease = [0.22, 1, 0.36, 1] as const;

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id:        string;
  createdAt: string;
  customer:  { name: string; phone: string; address?: string };
  delivery:  "pickup" | "courier" | "nationwide";
  items:     { name: string; brand: string; size: string; color: string; price: string; quantity: number; image: string }[];
  subtotal:  string;
  status:    OrderStatus;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:   "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DELIVERY_LABELS = {
  pickup:     "Pickup",
  courier:    "Courier — Chișinău",
  nationwide: "Nationwide",
};

// Placeholder — replace with real data source when backend is ready
const MOCK_ORDERS: Order[] = [];

export function OrdersContent() {
  const [orders, setOrders]       = useState<Order[]>(MOCK_ORDERS);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filter, setFilter]       = useState<OrderStatus | "all">("all");

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Orders" subtitle="Manage and track customer orders." />
        <p className="text-[11px] font-semibold text-foreground/40">
          {orders.length} total
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => {
          const count = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`cursor-pointer h-8 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                filter === s
                  ? "border-foreground bg-foreground text-white"
                  : "border-foreground/12 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
              {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        className="mt-4 overflow-hidden rounded-2xl border border-foreground/8 bg-white"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
            message={filter === "all" ? "No orders yet" : `No ${STATUS_LABELS[filter as OrderStatus].toLowerCase()} orders`}
            sub="Orders placed by customers will appear here."
          />
        ) : (
          <>
            {/* Header row */}
            <div className="hidden grid-cols-[1fr_120px_100px_120px_80px] gap-4 border-b border-foreground/8 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35 sm:grid">
              <span>Customer</span>
              <span>Date</span>
              <span>Total</span>
              <span>Delivery</span>
              <span>Status</span>
            </div>

            {visible.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                expanded={expanded === order.id}
                onToggle={() => setExpanded((v) => v === order.id ? null : order.id)}
                onStatusChange={(s) => updateStatus(order.id, s)}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}

function OrderRow({
  order, expanded, onToggle, onStatusChange,
}: {
  order:          Order;
  expanded:       boolean;
  onToggle:       () => void;
  onStatusChange: (s: OrderStatus) => void;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="border-b border-foreground/6 last:border-0">
      {/* Main row */}
      <button
        onClick={onToggle}
        className="cursor-pointer grid w-full grid-cols-[1fr_auto] gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-foreground/2 sm:grid-cols-[1fr_120px_100px_120px_80px]"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">{order.customer.name}</p>
          <p className="text-[11px] text-muted">{order.customer.phone}</p>
        </div>
        <p className="hidden text-[11px] text-muted sm:block">
          {new Date(order.createdAt).toLocaleDateString("ro-MD")}
        </p>
        <p className="hidden text-sm font-semibold text-foreground sm:block">{order.subtotal}</p>
        <p className="hidden text-[11px] text-muted sm:block">{DELIVERY_LABELS[order.delivery]}</p>
        <span className={`self-start rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] sm:self-center ${STATUS_STYLES[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="border-t border-foreground/6 bg-[#faf8f5] px-5 py-5">

              {/* Items */}
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                Items
              </p>
              <ul className="mb-5 space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted">{item.color} · {item.size} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-[11px] font-semibold text-foreground">{item.price}</p>
                  </li>
                ))}
              </ul>

              {/* Order info row */}
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <InfoBlock label="Delivery" value={DELIVERY_LABELS[order.delivery]} />
                {order.customer.address && (
                  <InfoBlock label="Address" value={order.customer.address} />
                )}
                <InfoBlock label="Subtotal" value={order.subtotal} />
              </div>

              {/* Status changer */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Update status
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-150 ${
                        order.status === s
                          ? STATUS_STYLES[s]
                          : "border-foreground/12 text-foreground/40 hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/35">{label}</p>
      <p className="mt-0.5 text-[11px] font-medium text-foreground">{value}</p>
    </div>
  );
}
