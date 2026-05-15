export const ORDER_FILTER_TABS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderFilterTab = typeof ORDER_FILTER_TABS[number];
