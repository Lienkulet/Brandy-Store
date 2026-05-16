import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { PALETTE } from "@/data/colors";
import { SwatchCircle } from "@/components/ui/SwatchCircle";
import CloseIcon from "@/components/icons/CloseIcon";
import PlusIcon from "@/components/icons/PlusIcon";

type Props = {
  hex:              string;
  name:             string;
  accents:          string[];
  paletteOpen:      boolean;
  usedCombinations: string[];
  onToggle:         () => void;
  onPickSwatch:     (hex: string, name: string) => void;
  onPickAccent:     (idx: number, hex: string, name: string) => void;
  onRemoveAccent:   (idx: number) => void;
};

export function ColorSwatchPicker({
  hex, name, accents, paletteOpen, usedCombinations,
  onToggle, onPickSwatch, onPickAccent, onRemoveAccent,
}: Props) {
  // "primary" = picking main color, "accent" = picking an accent slot
  const [mode, setMode]           = useState<"primary" | "accent">("primary");
  const [accentSlot, setAccentSlot] = useState<number>(0);

  useEffect(() => {
    if (!paletteOpen) setMode("primary");
  }, [paletteOpen]);

  function handlePrimaryPick(p: { hex: string; name: string }) {
    onPickSwatch(p.hex, p.name);
    setMode("primary");
  }

  function handleAccentPick(p: { hex: string; name: string }) {
    onPickAccent(accentSlot, p.hex, p.name);
    setMode("primary");
  }

  function startAccentPick(idx: number) {
    setAccentSlot(idx);
    setMode("accent");
  }

  // A combination key is "hex.lower|accent1,accent2" — must be unique across tabs
  const usedCombSet = new Set(usedCombinations);
  const currentComboKey = (candidateHex: string) =>
    `${candidateHex.toLowerCase()}|${accents.join(",")}`;

  const blockedForPrimary = { has: (h: string) => usedCombSet.has(currentComboKey(h)) };
  const blockedForAccent  = new Set([hex, ...accents]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        {/* Main trigger — shows split swatch */}
        <button
          type="button"
          onClick={onToggle}
          className="cursor-pointer rounded-full border border-foreground/20 shadow-sm transition-transform duration-150 hover:scale-110"
          style={{ padding: 0, background: "none" }}
          title="Pick colour"
        >
          <SwatchCircle hex={hex} accents={accents} size={32} />
        </button>

        <AnimatePresence>
          {paletteOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease }}
              className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-foreground/8 bg-white p-3 shadow-[0_12px_40px_rgba(95,77,57,0.14)]"
              style={{ minWidth: "17rem" }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Mode header */}
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                  {mode === "accent" ? "Pick accent colour" : "Colour palette"}
                </p>
                {mode === "accent" && (
                  <button
                    type="button"
                    onClick={() => setMode("primary")}
                    className="cursor-pointer text-[9px] font-semibold text-foreground/40 underline underline-offset-2 hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Colour grid */}
              <div className="max-h-64 overflow-y-auto scrollbar-none">
                <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                  {PALETTE.map((p) => {
                    const isActive = mode === "primary"
                      ? hex === p.hex
                      : accents[accentSlot] === p.hex;
                    const isBlocked = mode === "primary"
                      ? blockedForPrimary.has(p.hex.toLowerCase())
                      : blockedForAccent.has(p.hex);

                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          if (isBlocked) return;
                          mode === "accent" ? handleAccentPick(p) : handlePrimaryPick(p);
                        }}
                        disabled={isBlocked}
                        className={`flex flex-col items-center gap-1 rounded-xl p-1 transition-colors duration-100 ${
                          isBlocked
                            ? "cursor-not-allowed opacity-40"
                            : "cursor-pointer hover:bg-foreground/5"
                        }`}
                      >
                        <span
                          className={`relative flex h-7 w-7 shrink-0 rounded-full border ${
                            isActive
                              ? "border-foreground ring-2 ring-foreground ring-offset-1"
                              : "border-black/10"
                          }`}
                          style={{ backgroundColor: p.hex }}
                        >
                          {isBlocked && mode === "primary" && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-full">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
                                <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
                                <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
                                <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
                              </svg>
                            </span>
                          )}
                        </span>
                        <span className="w-full truncate text-center text-[8px] leading-tight text-foreground/60">
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent slots — only shown in primary mode */}
              {mode === "primary" && (
                <div className="mt-3 border-t border-foreground/8 pt-3">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                    Accent colours <span className="normal-case tracking-normal font-normal">(optional, max 2)</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {[0, 1].map((slot) => {
                      const accentHex = accents[slot];
                      return accentHex ? (
                        <div key={slot} className="relative">
                          <button
                            type="button"
                            onClick={() => startAccentPick(slot)}
                            className="cursor-pointer block rounded-full border border-foreground/20 transition-transform hover:scale-110"
                          >
                            <SwatchCircle hex={accentHex} size={24} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveAccent(slot)}
                            className="cursor-pointer absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <CloseIcon size={6} />
                          </button>
                        </div>
                      ) : (
                        // Only show the + for slot 1 if slot 0 is already filled
                        (slot === 0 || accents[0]) ? (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => startAccentPick(slot)}
                            className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-foreground/20 text-foreground/35 transition-colors hover:border-foreground/40 hover:text-foreground/60"
                          >
                            <PlusIcon size={10} />
                          </button>
                        ) : null
                      );
                    })}
                    {accents.length > 0 && (
                      <span className="ml-1 text-[9px] text-foreground/40">
                        {[PALETTE.find(p => p.hex === hex)?.name, ...accents.map(a => PALETTE.find(p => p.hex === a)?.name)].filter(Boolean).join(" / ")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm font-semibold text-foreground">{name}</p>
    </div>
  );
}
