import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { PALETTE } from "@/data/colors";

type Props = {
  hex:          string;
  name:         string;
  paletteOpen:  boolean;
  onToggle:     () => void;
  onPickSwatch: (hex: string, name: string) => void;
};

export function ColorSwatchPicker({ hex, name, paletteOpen, onToggle, onPickSwatch }: Props) {
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
              style={{ minWidth: "11rem" }}
            >
              <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                Colour palette
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PALETTE.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    title={p.name}
                    onClick={() => onPickSwatch(p.hex, p.name)}
                    className={`h-7 w-7 rounded-full border transition-transform duration-100 hover:scale-110 ${
                      hex === p.hex
                        ? "border-foreground ring-2 ring-foreground ring-offset-1"
                        : "border-black/10"
                    }`}
                    style={{ backgroundColor: p.hex }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm font-semibold text-foreground">{name}</p>
    </div>
  );
}
