"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const tabs = ["Tops & Shirts", "Trousers & Jeans", "Footwear", "Underwear & Socks"] as const;
type Tab = (typeof tabs)[number];

const topsData = [
  { size: "XS",  chest: "84–88",   waist: "72–76",   shoulders: "42–43" },
  { size: "S",   chest: "88–92",   waist: "76–80",   shoulders: "43–44" },
  { size: "M",   chest: "92–96",   waist: "80–84",   shoulders: "44–46" },
  { size: "L",   chest: "96–100",  waist: "84–88",   shoulders: "46–48" },
  { size: "XL",  chest: "100–106", waist: "88–94",   shoulders: "48–50" },
  { size: "XXL", chest: "106–112", waist: "94–100",  shoulders: "50–52" },
  { size: "3XL", chest: "112–120", waist: "100–108", shoulders: "52–54" },
];

const trousersData = [
  { waist: "28", waistCm: "71–73",   l30: "76", l32: "81", l34: "86" },
  { waist: "30", waistCm: "76–78",   l30: "76", l32: "81", l34: "86" },
  { waist: "32", waistCm: "81–83",   l30: "76", l32: "81", l34: "86" },
  { waist: "34", waistCm: "86–88",   l30: "76", l32: "81", l34: "86" },
  { waist: "36", waistCm: "91–93",   l30: "76", l32: "81", l34: "86" },
  { waist: "38", waistCm: "96–98",   l30: "76", l32: "81", l34: "86" },
  { waist: "40", waistCm: "101–103", l30: "76", l32: "81", l34: "86" },
];

const footwearData = [
  { eu: "39", uk: "6",    us: "7",    cm: "25.0" },
  { eu: "40", uk: "6.5",  us: "7.5",  cm: "25.7" },
  { eu: "41", uk: "7",    us: "8",    cm: "26.3" },
  { eu: "42", uk: "8",    us: "9",    cm: "27.0" },
  { eu: "43", uk: "9",    us: "10",   cm: "27.6" },
  { eu: "44", uk: "9.5",  us: "10.5", cm: "28.3" },
  { eu: "45", uk: "10.5", us: "11.5", cm: "28.9" },
  { eu: "46", uk: "11",   us: "12",   cm: "29.6" },
];

const underwearData = [
  { size: "S",  waist: "70–76", hip: "88–94",   socks: "38–40" },
  { size: "M",  waist: "76–82", hip: "94–100",  socks: "40–42" },
  { size: "L",  waist: "82–88", hip: "100–106", socks: "42–44" },
  { size: "XL", waist: "88–96", hip: "106–114", socks: "44–46" },
];

const thClass = "py-3 px-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground/50 border-b border-foreground/8";
const tdClass = "py-3.5 px-4 text-sm text-foreground/80";
const trClass = "border-b border-foreground/6 last:border-0 hover:bg-foreground/2 transition-colors";

export function SizeTabs() {
  const [active, setActive] = useState<Tab>("Tops & Shirts");

  return (
    <div>
      {/* Tab pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative h-9 rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
              active === tab
                ? "bg-foreground text-white"
                : "border border-foreground/15 text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tables */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease }}
        >
          <div className="overflow-x-auto rounded-2xl border border-foreground/8">
            {active === "Tops & Shirts" && (
              <table className="w-full">
                <thead className="bg-foreground/2">
                  <tr>
                    <th className={thClass}>Size</th>
                    <th className={thClass}>Chest (cm)</th>
                    <th className={thClass}>Waist (cm)</th>
                    <th className={thClass}>Shoulders (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {topsData.map((row) => (
                    <tr key={row.size} className={trClass}>
                      <td className={`${tdClass} font-semibold text-foreground`}>{row.size}</td>
                      <td className={tdClass}>{row.chest}</td>
                      <td className={tdClass}>{row.waist}</td>
                      <td className={tdClass}>{row.shoulders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {active === "Trousers & Jeans" && (
              <table className="w-full">
                <thead className="bg-foreground/2">
                  <tr>
                    <th className={thClass}>Waist</th>
                    <th className={thClass}>Waist (cm)</th>
                    <th className={thClass}>Inseam L30 (cm)</th>
                    <th className={thClass}>Inseam L32 (cm)</th>
                    <th className={thClass}>Inseam L34 (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {trousersData.map((row) => (
                    <tr key={row.waist} className={trClass}>
                      <td className={`${tdClass} font-semibold text-foreground`}>{row.waist}</td>
                      <td className={tdClass}>{row.waistCm}</td>
                      <td className={tdClass}>{row.l30}</td>
                      <td className={tdClass}>{row.l32}</td>
                      <td className={tdClass}>{row.l34}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {active === "Footwear" && (
              <table className="w-full">
                <thead className="bg-foreground/2">
                  <tr>
                    <th className={thClass}>EU</th>
                    <th className={thClass}>UK</th>
                    <th className={thClass}>US</th>
                    <th className={thClass}>Foot length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {footwearData.map((row) => (
                    <tr key={row.eu} className={trClass}>
                      <td className={`${tdClass} font-semibold text-foreground`}>{row.eu}</td>
                      <td className={tdClass}>{row.uk}</td>
                      <td className={tdClass}>{row.us}</td>
                      <td className={tdClass}>{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {active === "Underwear & Socks" && (
              <table className="w-full">
                <thead className="bg-foreground/2">
                  <tr>
                    <th className={thClass}>Size</th>
                    <th className={thClass}>Waist (cm)</th>
                    <th className={thClass}>Hip (cm)</th>
                    <th className={thClass}>Sock size (EU)</th>
                  </tr>
                </thead>
                <tbody>
                  {underwearData.map((row) => (
                    <tr key={row.size} className={trClass}>
                      <td className={`${tdClass} font-semibold text-foreground`}>{row.size}</td>
                      <td className={tdClass}>{row.waist}</td>
                      <td className={tdClass}>{row.hip}</td>
                      <td className={tdClass}>{row.socks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
