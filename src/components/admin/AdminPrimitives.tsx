export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ icon, message, sub }: { icon: React.ReactNode; message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="mb-4 text-foreground/20">{icon}</span>
      <p className="text-sm font-semibold text-foreground/60">{message}</p>
      <p className="mt-1 max-w-xs text-[11px] text-muted">{sub}</p>
    </div>
  );
}
