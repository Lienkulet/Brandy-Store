"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { parseMDL, formatMDL } from "@/lib/money";
import { getProductStats } from "@/lib/product-utils";

const ease = [0.22, 1, 0.36, 1] as const;

type SupabaseOrder = { id: string; subtotal: string; status: string; created_at: string; customer_name: string; customer_phone: string };

export function OverviewContent() {
  const [orders, setOrders]           = useState<SupabaseOrder[]>([]);
  const [ordersLoaded, setLoaded]     = useState(false);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoaded(true));
  }, []);

  const productStats = getProductStats(allProducts);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseMDL(o.subtotal), 0);

  const STATS = [
    {
      label:    "Total Orders",
      value:    ordersLoaded ? String(orders.length) : "—",
      sublabel: orders.length === 0 ? "No orders yet" : `${orders.filter((o) => o.status === "pending").length} pending`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      label:    "Revenue",
      value:    ordersLoaded ? (revenue > 0 ? formatMDL(revenue) : "0 MDL") : "—",
      sublabel: revenue === 0 ? "Awaiting first order" : "Confirmed + shipped",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label:    "Products",
      value:    String(productStats.total),
      sublabel: `${productStats.inStock} in stock · ${productStats.outOfStock} out`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label:    "New Arrivals",
      value:    String(productStats.newArrivals),
      sublabel: "Marked as new in store",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <PageHeader title="Overview" subtitle="Welcome back. Here's what's happening." />

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-2xl border border-foreground/8 bg-white p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: i * 0.07 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                {stat.label}
              </p>
              <span className="text-foreground/25">{stat.icon}</span>
            </div>
            <p className="font-serif text-3xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-[11px] text-muted">{stat.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders placeholder */}
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
        {recentOrders.length === 0 ? (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
            message="No orders yet"
            sub="Orders will appear here once customers start checking out."
          />
        ) : (
          <ul className="divide-y divide-foreground/6">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{o.customer_name}</p>
                  <p className="text-[11px] text-muted">{o.customer_phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-semibold text-foreground">{o.subtotal}</p>
                  <p className="text-[10px] text-muted">{new Date(o.created_at).toLocaleDateString("ro-MD")}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Low stock */}
      {productStats.outOfStock > 0 && (
        <motion.div
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.38 }}
        >
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 shrink-0 text-amber-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-[11px] font-semibold text-amber-800">
                {productStats.outOfStock} product{productStats.outOfStock > 1 ? "s" : ""} fully out of stock
              </p>
              <p className="mt-0.5 text-[11px] text-amber-700/70">
                Review your products to update stock availability.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ icon, message, sub }: { icon: React.ReactNode; message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="mb-4 text-foreground/20">{icon}</span>
      <p className="text-sm font-semibold text-foreground/60">{message}</p>
      <p className="mt-1 max-w-xs text-[11px] text-muted">{sub}</p>
    </div>
  );
}
