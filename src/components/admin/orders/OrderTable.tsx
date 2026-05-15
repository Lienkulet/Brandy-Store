import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import { type OrderStatus, STATUS_LABELS } from "@/lib/order-utils";
import { EmptyState } from "@/components/admin/AdminPrimitives";
import OrderIcon from "@/components/icons/OrderIcon";
import type { FilterTab } from "@/components/admin/orders/FilterTabs";

type Props = {
  loading:  boolean;
  filter:   FilterTab;
  children: React.ReactNode;
};

export function OrderTable({ loading, filter, children }: Props) {
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
        <EmptyState icon={<OrderIcon size={28} />} message={emptyMessage} sub="Orders placed by customers will appear here." />
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

function hasChildren(children: React.ReactNode): boolean {
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(Boolean);
}
