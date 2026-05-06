import { OrdersContent } from "@/components/admin/OrdersContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Brandy Admin" };

export default function OrdersPage() {
  return <OrdersContent />;
}
