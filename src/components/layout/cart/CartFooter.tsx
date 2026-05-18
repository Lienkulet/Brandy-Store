import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BlackBtn from "@/components/ui/BlackBtn";
import { useLang } from "@/context/LanguageContext";

type Props = { onClose: () => void };

export function CartFooter({ onClose }: Props) {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { t } = useLang();

  const subtotal = items.reduce((sum, item) => {
    const val = parseInt(item.price.replace(/\s/g, "").replace("MDL", ""), 10);
    return sum + (isNaN(val) ? 0 : val * item.quantity);
  }, 0);

  const formatted = subtotal.toLocaleString("ro-MD") + " MDL";

  return (
    <div className="border-t border-foreground/8 px-6 pb-8 pt-5">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">{t("cart.subtotal")}</p>
        <p className="font-serif text-lg font-semibold text-foreground">{formatted}</p>
      </div>

      <BlackBtn
        name={t("cart.checkout")}
        className="w-full"
        onClick={() => { onClose(); router.push("/checkout"); }}
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-muted">{t("cart.taxes")}</p>
        <button
          onClick={() => { clearCart(); onClose(); }}
          className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/30 underline underline-offset-2 transition-colors duration-200 hover:text-foreground/60"
        >
          {t("cart.clear")}
        </button>
      </div>
    </div>
  );
}
