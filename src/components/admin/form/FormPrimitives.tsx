import type { ReactNode } from "react";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/40">{title}</p>
      {children}
    </div>
  );
}

export function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
        {label}{required && <span className="ml-0.5 text-foreground/35">*</span>}
      </label>
      {children}
    </div>
  );
}

export function FormDivider() {
  return <div className="h-px bg-foreground/6" />;
}
