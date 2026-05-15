"use client";

import { useState, useEffect } from "react";
import { type Order, type SupabaseOrder, type OrderStatus, toOrder } from "@/lib/order-utils";

export function useOrders() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data: SupabaseOrder[]) => setOrders(Array.isArray(data) ? data.map(toOrder) : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
  }

  return { orders, loading, updateStatus };
}
