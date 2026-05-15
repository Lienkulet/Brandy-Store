import { type OrderStatus, STATUS_LABELS } from "@/lib/order-utils";
import { ORDER_FILTER_TABS, type OrderFilterTab } from "@/data/order-filters";

export type FilterTab = OrderFilterTab;

type Props = {
  filter:   FilterTab;
  orders:   { status: OrderStatus }[];
  onSelect: (f: FilterTab) => void;
};

export function FilterTabs({ filter, orders, onSelect }: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {ORDER_FILTER_TABS.map((tab) => {
        const count = tab === "all"
          ? orders.length
          : orders.filter((o) => o.status === tab).length;

        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`cursor-pointer h-8 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              filter === tab
                ? "border-foreground bg-foreground text-white"
                : "border-foreground/12 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {tab === "all" ? "All" : STATUS_LABELS[tab]}
            {count > 0 && <span className="ml-1.5 opacity-60">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
