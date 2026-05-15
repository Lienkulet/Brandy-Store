import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import { EmptyState } from "@/components/admin/AdminPrimitives";
import BagIcon from "@/components/icons/BagIcon";
import type { OverviewOrder } from "@/hooks/useOverview";

export function RecentOrders({ orders }: { orders: OverviewOrder[] }) {
  return (
    <motion.div
      className="mt-6 rounded-2xl border border-foreground/8 bg-white"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.32 }}
    >
      <div className="border-b border-foreground/8 px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
          Recent Orders
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<BagIcon />}
          message="No orders yet"
          sub="Orders will appear here once customers start checking out."
        />
      ) : (
        <ul className="divide-y divide-foreground/6">
          {orders.map((order) => (
            <RecentOrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function RecentOrderRow({ order }: { order: OverviewOrder }) {
  return (
    <li className="flex items-center justify-between gap-4 px-6 py-3.5">
      <div>
        <p className="text-[12px] font-semibold text-foreground">{order.customer_name}</p>
        <p className="text-[11px] text-muted">{order.customer_phone}</p>
      </div>
      <div className="text-right">
        <p className="text-[12px] font-semibold text-foreground">{order.subtotal}</p>
        <p className="text-[10px] text-muted">
          {new Date(order.created_at).toLocaleDateString("ro-MD")}
        </p>
      </div>
    </li>
  );
}

