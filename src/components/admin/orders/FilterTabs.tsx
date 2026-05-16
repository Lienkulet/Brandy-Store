import { type OrderStatus, STATUS_LABELS } from "@/lib/order-utils";
import { ORDER_FILTER_TABS, type OrderFilterTab } from "@/data/order-filters";

export type FilterTab = OrderFilterTab;

type Props = {
  filter:   FilterTab;
  orders:   { status: OrderStatus }[];
  onSelect: (f: FilterTab) => void;
};

const STATUS_ACTIVE: Record<OrderStatus, string> = {
  pending:   "bg-amber-50   text-amber-700  border-amber-200",
  confirmed: "bg-blue-50    text-blue-700   border-blue-200",
  shipped:   "bg-violet-50  text-violet-700 border-violet-200",
  delivered: "bg-green-50   text-green-700  border-green-200",
  cancelled: "bg-red-50     text-red-500    border-red-200",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-blue-500",
  shipped:   "bg-violet-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-400",
};

export function FilterTabs({ filter, orders, onSelect }: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {ORDER_FILTER_TABS.map((tab) => {
        const isActive = filter === tab;
        const count = tab === "all"
          ? orders.length
          : orders.filter((o) => o.status === tab).length;

        const activeClass = tab === "all"
          ? "border-foreground bg-foreground text-white"
          : STATUS_ACTIVE[tab];

        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`cursor-pointer flex items-center gap-1.5 h-8 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              isActive
                ? activeClass
                : "border-foreground/12 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {tab !== "all" && (
              <span className={`shrink-0 h-1.5 w-1.5 rounded-full ${STATUS_DOT[tab]}`} />
            )}
            {tab === "all" ? "All" : STATUS_LABELS[tab]}
            {count > 0 && <span className="opacity-60">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
