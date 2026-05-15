import type { Product } from "@/data/products";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";

type Props = {
  product:          Product;
  allOut:           boolean;
  markingOutOfStock: boolean;
  onEdit:           (p: Product) => void;
  onDelete:         (p: Product) => void;
  onMarkOutOfStock: (p: Product) => void;
};

export function CardOverlay({ product, allOut, markingOutOfStock, onEdit, onDelete, onMarkOutOfStock }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
      <button
        onClick={() => onMarkOutOfStock(product)}
        disabled={allOut || markingOutOfStock}
        className="cursor-pointer rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-55 hover:bg-foreground hover:text-white!"
      >
        {markingOutOfStock ? "Saving..." : allOut ? "Out of stock" : "Mark out of stock"}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(product)}
          className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground transition-colors hover:bg-foreground hover:text-white!"
          title="Edit"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(product)}
          className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 transition-colors hover:bg-red-500 hover:text-white!"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
