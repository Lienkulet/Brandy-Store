"use client";

import { formatMDL } from "@/lib/money";
import { useOverview } from "@/hooks/useOverview";
import { PageHeader } from "@/components/admin/AdminPrimitives";
import { StatCard } from "@/components/admin/overview/StatCard";
import { RecentOrders } from "@/components/admin/overview/RecentOrders";
import { LowStockAlert } from "@/components/admin/overview/LowStockAlert";
import OrderIcon from "@/components/icons/OrderIcon";
import RevenueIcon from "@/components/icons/RevenueIcon";
import ProductsIcon from "@/components/icons/ProductsIcon";
import StarIcon from "@/components/icons/StarIcon";

export { PageHeader, EmptyState } from "@/components/admin/AdminPrimitives";

export function OverviewContent() {
  const { orders, ordersLoaded, pendingCount, revenue, productStats, recentOrders } = useOverview();

  const stats = [
    {
      label:    "Total Orders",
      value:    ordersLoaded ? String(orders.length) : "—",
      sublabel: orders.length === 0 ? "No orders yet" : `${pendingCount} pending`,
      icon:     <OrderIcon />,
    },
    {
      label:    "Revenue",
      value:    ordersLoaded ? (revenue > 0 ? formatMDL(revenue) : "0 MDL") : "—",
      sublabel: revenue === 0 ? "Awaiting first order" : "Confirmed + shipped",
      icon:     <RevenueIcon />,
    },
    {
      label:    "Products",
      value:    String(productStats.total),
      sublabel: `${productStats.inStock} in stock · ${productStats.outOfStock} out`,
      icon:     <ProductsIcon />,
    },
    {
      label:    "New Arrivals",
      value:    String(productStats.newArrivals),
      sublabel: "Marked as new in store",
      icon:     <StarIcon />,
    },
  ];

  return (
    <main>
      <PageHeader title="Overview" subtitle="Welcome back. Here's what's happening." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <RecentOrders orders={recentOrders} />

      {productStats.outOfStock > 0 && (
        <LowStockAlert count={productStats.outOfStock} />
      )}
    </main>
  );
}
