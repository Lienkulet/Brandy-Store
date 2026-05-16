"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import {
  type Order,
  type OrderItem,
  type OrderStatus,
  STATUS_STYLES,
  STATUS_LABELS,
  DELIVERY_LABELS,
} from "@/lib/order-utils";

const STATUS_BORDER: Record<OrderStatus, string> = {
  pending:   "border-l-amber-400",
  confirmed: "border-l-blue-500",
  shipped:   "border-l-violet-500",
  delivered: "border-l-green-500",
  cancelled: "border-l-red-400",
};

export function OrderRow({
  order, expanded, onToggle, onStatusChange,
}: {
  order:          Order;
  expanded:       boolean;
  onToggle:       () => void;
  onStatusChange: (s: OrderStatus) => void;
}) {
  return (
    <div className={`border-b border-foreground/6 border-l-[3px] last:border-b-0 ${STATUS_BORDER[order.status]}`}>
      <OrderRowSummary order={order} onToggle={onToggle} />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <OrderDetail order={order} onStatusChange={onStatusChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderRowSummary({ order, onToggle }: { order: Order; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer grid w-full grid-cols-[1fr_auto] gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-foreground/2 sm:grid-cols-[1fr_120px_100px_120px_80px]"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-foreground/35">#{order.orderNumber}</span>
          <p className="text-sm font-semibold text-foreground">{order.customer.name}</p>
        </div>
        <p className="text-[11px] text-muted">{order.customer.phone}</p>
      </div>
      <p className="hidden text-[11px] text-muted sm:block">
        {new Date(order.createdAt).toLocaleDateString("ro-MD")}
      </p>
      <p className="hidden text-sm font-semibold text-foreground sm:block">{order.subtotal}</p>
      <p className="hidden text-[11px] text-muted sm:block">{DELIVERY_LABELS[order.delivery]}</p>
      <div className="flex items-center justify-end sm:justify-center">
        <StatusBadge status={order.status} />
      </div>
    </button>
  );
}

function OrderDetail({
  order, onStatusChange,
}: {
  order:          Order;
  onStatusChange: (s: OrderStatus) => void;
}) {
  return (
    <div className="border-t border-foreground/6 bg-[#faf8f5] px-5 py-5">
      <OrderItemsList items={order.items} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <InfoBlock label="Delivery" value={DELIVERY_LABELS[order.delivery]} />
        {order.customer.address && (
          <InfoBlock label="Address" value={order.customer.address} />
        )}
        <InfoBlock label="Subtotal" value={order.subtotal} />
      </div>

      <StatusChanger current={order.status} onChange={onStatusChange} />
    </div>
  );
}

function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
        Items
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <OrderItemRow key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const detail = item.size === "One Size"
    ? item.color
    : `${item.color} · ${item.size}`;

  return (
    <li className="flex items-center gap-3">
      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-foreground">{item.name}</p>
        <p className="text-[10px] text-muted">{detail} · Qty {item.quantity}</p>
      </div>
      <p className="text-[11px] font-semibold text-foreground">{item.price}</p>
    </li>
  );
}

function StatusChanger({ current, onChange }: { current: OrderStatus; onChange: (s: OrderStatus) => void }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
        Update status
      </p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`cursor-pointer rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-150 ${
              current === s
                ? STATUS_STYLES[s]
                : "border-foreground/12 text-foreground/40 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
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
