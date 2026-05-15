export function ProductsSkeleton() {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-foreground/8 bg-white">
          <div className="aspect-4/5 animate-pulse bg-foreground/6" />
          <div className="space-y-2 p-4">
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-foreground/6" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-foreground/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
