import { motion } from "framer-motion";
import { useCart, type CartItem } from "@/context/CartContext";
import { ease } from "@/lib/animations";
import CloseIcon from "@/components/icons/CloseIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";

type Props = { items: CartItem[] };

export function CartItemList({ items }: Props) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <ul className="divide-y divide-foreground/6 px-6">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          layout
          className="flex gap-4 py-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.35, ease, delay: i * 0.05 }}
        >
          <div className="h-24 w-18 shrink-0 overflow-hidden rounded-xl bg-[#f7f4f0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">{item.brand}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {item.size === "One Size" ? item.color : `${item.color} · ${item.size}`}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
                className="cursor-pointer shrink-0 text-foreground/25 transition-colors duration-200 hover:text-foreground/60"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{item.price}</p>
              <div className="flex items-center gap-2 rounded-full border border-foreground/12 px-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="cursor-pointer flex h-7 w-7 items-center justify-center text-foreground/50 transition-colors duration-150 hover:text-foreground"
                >
                  <MinusIcon />
                </button>
                <span className="w-4 text-center text-[11px] font-semibold tabular-nums text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="cursor-pointer flex h-7 w-7 items-center justify-center text-foreground/50 transition-colors duration-150 hover:text-foreground"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
