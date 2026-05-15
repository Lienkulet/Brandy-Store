type Props = { isNew: boolean; isOnSale: boolean };

export function CardBadges({ isNew, isOnSale }: Props) {
  if (!isNew && !isOnSale) return null;

  return (
    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
      {isNew && (
        <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
          New
        </span>
      )}
      {isOnSale && (
        <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
          Sale
        </span>
      )}
    </div>
  );
}
