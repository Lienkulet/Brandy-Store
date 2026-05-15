type Props = {
  allOut:     boolean;
  isSizeFree: boolean;
  stockCount: number;
};

export function StockBadge({ allOut, isSizeFree, stockCount }: Props) {
  return (
    <div className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
      allOut
        ? "border-red-200 bg-red-50 text-red-500"
        : "border-green-200 bg-green-50 text-green-700"
    }`}>
      {allOut ? "Out of stock" : isSizeFree ? "In stock" : `${stockCount} size${stockCount > 1 ? "s" : ""}`}
    </div>
  );
}
