type Props = {
  isNew?:       boolean;
  isOnSale?:    boolean;
  isOutOfStock?: boolean;
};

export function ProductCardBadges({ isNew, isOnSale, isOutOfStock }: Props) {
  if (!isNew && !isOnSale && !isOutOfStock) return null;
  return (
    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
      {isNew && (
        <div className="rounded-full bg-foreground px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
          New In
        </div>
      )}
      {isOnSale && (
        <div className="rounded-full bg-red-500 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
          Sale
        </div>
      )}
      {isOutOfStock && (
        <div className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/60 backdrop-blur-sm">
          Out of stock
        </div>
      )}
    </div>
  );
}
