import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { PALETTE } from "@/data/colors";

type Props = {
  hex:          string;
  name:         string;
  paletteOpen:  boolean;
  usedHexes:    string[];
  onToggle:     () => void;
  onPickSwatch: (hex: string, name: string) => void;
};

export function ColorSwatchPicker({ hex, name, paletteOpen, usedHexes, onToggle, onPickSwatch }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className="h-8 w-8 cursor-pointer rounded-full border border-foreground/20 shadow-sm transition-transform duration-150 hover:scale-110"
          style={{ backgroundColor: hex }}
          title="Pick colour"
        />
        <AnimatePresence>
          {paletteOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease }}
              className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-foreground/8 bg-white p-3 shadow-[0_12px_40px_rgba(95,77,57,0.14)]"
              style={{ minWidth: "14rem" }}
            >
              <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                Colour palette
              </p>
              <div className="grid grid-cols-5 gap-2">
                {PALETTE.map((p) => {
                  const isActive = hex === p.hex;
                  const isUsed   = !isActive && usedHexes.includes(p.hex.toLowerCase());
                  return (
                    <div key={p.name} className="group relative">
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[9px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {p.name}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                      </div>
                      <button
                        type="button"
                        onClick={() => !isUsed && onPickSwatch(p.hex, p.name)}
                        disabled={isUsed}
                        className={`relative h-7 w-7 rounded-full border transition-transform duration-100 ${
                          isActive
                            ? "border-foreground ring-2 ring-foreground ring-offset-1"
                            : isUsed
                            ? "cursor-not-allowed border-black/10 opacity-50"
                            : "border-black/10 hover:scale-110"
                        }`}
                        style={{ backgroundColor: p.hex }}
                      >
                        {isUsed && (
                          <span className="absolute inset-0 flex items-center justify-center rounded-full">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              {/* white outline for visibility on dark swatches */}
                              <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
                              <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
                              {/* dark X on top */}
                              <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
                              <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm font-semibold text-foreground">{name}</p>
    </div>
  );
}
