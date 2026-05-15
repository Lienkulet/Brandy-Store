"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderRow } from "@/components/admin/OrderRow";
import { PageHeader } from "@/components/admin/AdminPrimitives";
import { FilterTabs, type FilterTab } from "@/components/admin/orders/FilterTabs";
import { OrderTable } from "@/components/admin/orders/OrderTable";

export type { OrderStatus } from "@/lib/order-utils";
export type { Order } from "@/lib/order-utils";

export function OrdersContent() {
  const { orders, loading, updateStatus } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<FilterTab>("all");

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function toggleExpanded(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <main>
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
    </main>
  );
}
