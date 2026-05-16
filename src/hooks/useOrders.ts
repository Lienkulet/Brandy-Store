"use client";

import { useState, useEffect } from "react";
import { type Order, type SupabaseOrder, type OrderStatus, toOrder } from "@/lib/order-utils";

type Params = {
  page:   number;
  search: string;
  status: string;
};

export function useOrders({ page, search, status }: Params) {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page:   String(page),
      search: search.trim().replace(/^#/, ""),
      status,
    });

    fetch(`/api/orders?${params}`)
      .then((r) => r.json())
      .then(({ data, total: t }: { data: SupabaseOrder[]; total: number }) => {
        setOrders(Array.isArray(data) ? data.map(toOrder) : []);
        setTotal(t);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page, search, status]);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
  }

  return { orders, total, loading, updateStatus };
}
