import type { ProductFormColor } from "@/lib/product-form-model";

type Props = {
  color:               ProductFormColor;
  isAccessory:         boolean;
  onToggleSize:        (label: string) => void;
  onSetAccessoryStock: (inStock: boolean) => void;
  onApplyCategorySizes: () => void;
};

export function ColorSizePicker({ color: c, isAccessory, onToggleSize, onSetAccessoryStock, onApplyCategorySizes }: Props) {
  if (isAccessory) {
    return (
      <div className="space-y-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Stock</p>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(c.sizes?.[0]?.inStock)}
          onClick={() => onSetAccessoryStock(!c.sizes?.[0]?.inStock)}
          className={`relative h-9 rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
            c.sizes?.[0]?.inStock
              ? "bg-foreground text-white"
              : "border border-foreground/15 text-foreground/45"
          }`}
        >
          {c.sizes?.[0]?.inStock ? "In stock" : "Out of stock"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Sizes in stock</p>
        <button
          type="button"
          onClick={onApplyCategorySizes}
          className="cursor-pointer text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/45 underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Use category sizes
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(c.sizes ?? []).map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onToggleSize(s.label)}
            className={`cursor-pointer h-9 min-w-11 rounded-xl border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
              s.inStock
                ? "border-foreground bg-foreground text-white!"
                : "border-foreground/15 text-foreground/40 hover:border-foreground/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-[9px] text-muted">Tap a size to toggle stock for this colour.</p>
    </div>
  );
}
