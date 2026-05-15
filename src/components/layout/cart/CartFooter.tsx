import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BlackBtn from "@/components/ui/BlackBtn";

type Props = { onClose: () => void };

export function CartFooter({ onClose }: Props) {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => {
    const val = parseInt(item.price.replace(/\s/g, "").replace("MDL", ""), 10);
    return sum + (isNaN(val) ? 0 : val * item.quantity);
  }, 0);

  const formatted = subtotal.toLocaleString("ro-MD") + " MDL";

  return (
    <div className="border-t border-foreground/8 px-6 pb-8 pt-5">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">Subtotal</p>
        <p className="font-serif text-lg font-semibold text-foreground">{formatted}</p>
      </div>

      <BlackBtn
        name="Proceed to Checkout"
        className="w-full"
        onClick={() => { onClose(); router.push("/checkout"); }}
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-muted">Taxes and shipping at checkout.</p>
        <button
          onClick={() => { clearCart(); onClose(); }}
          className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/30 underline underline-offset-2 transition-colors duration-200 hover:text-foreground/60"
        >
          Clear bag
        </button>
      </div>
    </div>
  );
}
