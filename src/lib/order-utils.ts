export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  name:     string;
  brand:    string;
  size:     string;
  color:    string;
  price:    string;
  quantity: number;
  image:    string;
};

export type Order = {
  id:        string;
  createdAt: string;
  customer:  { name: string; phone: string; address?: string };
  delivery:  "pickup" | "courier" | "nationwide";
  items:     OrderItem[];
  subtotal:  string;
  status:    OrderStatus;
};

export type SupabaseOrder = {
  id:               string;
  created_at:       string;
  customer_name:    string;
  customer_phone:   string;
  customer_address?: string;
  delivery:         Order["delivery"];
  items:            OrderItem[];
  subtotal:         string;
  status:           OrderStatus;
};

export function toOrder(o: SupabaseOrder): Order {
  return {
    id:        o.id,
    createdAt: o.created_at,
    customer:  { name: o.customer_name, phone: o.customer_phone, address: o.customer_address },
    delivery:  o.delivery,
    items:     o.items,
    subtotal:  o.subtotal,
    status:    o.status,
  };
}

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:   "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const DELIVERY_LABELS: Record<Order["delivery"], string> = {
  pickup:     "Pickup",
  courier:    "Courier — Chișinău",
  nationwide: "Nationwide",
};
