"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import type { SortKey, ProductFilters } from "@/lib/shop-utils";
export type { SortKey, ProductFilters } from "@/lib/shop-utils";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "new-in", label: "New In" },
  { key: "oldest", label: "Oldest First" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

type Option = { value: string; label: string };
type ColorOption = { name: string; hex: string };

export function FilterDropdown({
  label, options, selected, onToggle, open, onOpen,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  open: boolean;
  onOpen: () => void;
}) {
  const count = selected.length;

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className={`cursor-pointer flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
          count > 0 || open
            ? "border-foreground bg-foreground text-white"
            : "border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        {label}{count > 0 && ` (${count})`}
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-20 mt-2 min-w-48 rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="max-h-80 overflow-y-auto rounded-2xl p-2">
              {options.map(({ value, label: optionLabel }) => {
                const checked = selected.includes(value);
                return (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4"
                  >
                    <CheckboxMark checked={checked} />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggle(value)}
                    />
                    <span className="text-[11px] font-medium text-foreground/80">{optionLabel}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ColorFilterDropdown({
  options, selected, onToggle, open, onOpen,
}: {
  options: ColorOption[];
  selected: string[];
  onToggle: (value: string) => void;
  open: boolean;
  onOpen: () => void;
}) {
  const count = selected.length;

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className={`cursor-pointer flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
          count > 0 || open
            ? "border-foreground bg-foreground text-white"
            : "border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        Colour{count > 0 && ` (${count})`}
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-20 mt-2 min-w-45 overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map(({ name, hex }) => {
                const checked = selected.includes(name);
                return (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-foreground/4"
                  >
                    <ColorSwatch hex={hex} active={checked} />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggle(name)}
                    />
                    <span className="text-[11px] font-medium text-foreground/80">{name}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SortDropdown({
  value, onChange, open, onOpen,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
  open: boolean;
  onOpen: () => void;
}) {
  const label = SORT_OPTIONS.find((option) => option.key === value)?.label ?? "Sort";

  return (
    <div className="relative z-20">
      <button
        onClick={onOpen}
        className="cursor-pointer flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/50 hover:text-foreground transition-colors duration-200"
      >
        {label}
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-20 mt-2 min-w-45 overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[0_12px_40px_rgba(95,77,57,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
          >
            <div className="p-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => onChange(option.key)}
                  className={`cursor-pointer flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-medium transition-colors duration-150 hover:bg-foreground/4 ${
                    value === option.key ? "text-foreground" : "text-foreground/55"
                  }`}
                >
                  {option.label}
                  {value === option.key && <CheckIcon />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileFilterPanel({
  filters, sort, resultCount, availableBrands, availableSizes, availableColors,
  onToggle, onSort, onClear, onClose,
}: {
  filters: ProductFilters;
  sort: SortKey;
  resultCount: number;
  availableBrands: string[];
  availableSizes: string[];
  availableColors: ColorOption[];
  onToggle: (key: keyof ProductFilters, value: string) => void;
  onSort: (value: SortKey) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const activeFilterCount = filters.brands.length + filters.sizes.length + filters.colors.length;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="flex items-center justify-between border-b border-foreground/8 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
          Filter & Sort
        </p>
        <div className="flex items-center gap-4">
          {activeFilterCount > 0 && (
            <button
              onClick={onClear}
              className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 underline underline-offset-2"
            >
              Clear all
            </button>
          )}
          <button onClick={onClose} className="cursor-pointer text-foreground/50 hover:text-foreground transition-colors" aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
        <MobileSection title="Sort">
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => onSort(option.key)}
                className={`cursor-pointer h-9 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                  sort === option.key
                    ? "bg-foreground text-white"
                    : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </MobileSection>

        {availableBrands.length > 0 && (
          <MobilePillSection
            title="Brand"
            values={availableBrands}
            selected={filters.brands}
            onToggle={(value) => onToggle("brands", value)}
          />
        )}

        {availableSizes.length > 0 && (
          <MobileSection title="Size">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const checked = filters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => onToggle("sizes", size)}
                    className={`cursor-pointer h-10 min-w-12 rounded-xl px-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                      checked
                        ? "border border-foreground bg-foreground text-white"
                        : "border border-foreground/20 text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </MobileSection>
        )}

        {availableColors.length > 0 && (
          <MobileSection title="Colour">
            <div className="flex flex-wrap gap-3">
              {availableColors.map(({ name, hex }) => {
                const checked = filters.colors.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => onToggle("colors", name)}
                    title={name}
                    className={`cursor-pointer flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-[11px] font-medium transition-all duration-200 ${
                      checked
                        ? "border-foreground text-foreground"
                        : "border-foreground/15 text-muted hover:border-foreground/30"
                    }`}
                  >
                    <ColorSwatch hex={hex} active={checked} />
                    {name}
                  </button>
                );
              })}
            </div>
          </MobileSection>
        )}
      </div>

      <div className="border-t border-foreground/8 px-5 py-4">
        <button
          onClick={onClose}
          className="cursor-pointer w-full rounded-full bg-foreground py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-foreground/90"
        >
          Show {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </button>
      </div>
    </motion.div>
  );
}

function MobilePillSection({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <MobileSection title={title}>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const checked = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`cursor-pointer h-9 rounded-full px-4 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-200 ${
                checked
                  ? "bg-foreground text-white"
                  : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </MobileSection>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
      checked ? "border-foreground bg-foreground" : "border-foreground/25"
    }`}>
      {checked && <CheckIcon className="text-white" />}
    </span>
  );
}

function ColorSwatch({ hex, active }: { hex: string; active: boolean }) {
  return (
    <span
      className={`relative h-5 w-5 shrink-0 rounded-full transition-all duration-150 ${
        active ? "ring-2 ring-foreground ring-offset-1" : ""
      }`}
      style={{ backgroundColor: hex }}
    >
      <span className="absolute inset-0 rounded-full border border-black/10" />
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease }}
      width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
