"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { parseMDL } from "@/lib/money";
import { getProductStats } from "@/lib/product-utils";

type OverviewOrder = {
  id:            string;
  subtotal:      string;
  status:        string;
  created_at:    string;
  customer_name: string;
  customer_phone: string;
};

export type { OverviewOrder };

export function useOverview() {
  const [orders, setOrders]           = useState<OverviewOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const { products } = useProducts();

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoaded(true));
  }, []);

  const productStats = getProductStats(products);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseMDL(o.subtotal), 0);

  return {
    orders,
    ordersLoaded,
    pendingCount:    orders.filter((o) => o.status === "pending").length,
    revenue,
    productStats,
    recentOrders:   orders.slice(0, 5),
  };
}
