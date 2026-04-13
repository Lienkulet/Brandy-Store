"use client";

import { motion } from "framer-motion";

const brands = [
  "Loro Piana",
  "Brunello Cucinelli",
  "Tom Ford",
  "Moncler",
  "Dolce & Gabbana",
  "Zegna",
  "Etro",
  "Emporio Armani",
  "Boss",
  "Hugo",
  "Armani Exchange",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Polo",
  "Lacoste",
  "Massimo Dutti",
  "Zara",
  "Brango",
  "Tony Montana",
  "Vaganza",
];

const ease = [0.22, 1, 0.36, 1] as const;

function BrandStrip() {
  return (
    <motion.section
      className="mt-20 border-y border-foreground/8 py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease }}
    >
      <p className="mb-7 text-center text-[14px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
        Brands We Carry
      </p>

      {/* Marquee track */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="flex items-center">
              <span className="whitespace-nowrap px-8 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/35">
                {brand}
              </span>
              <span aria-hidden className="text-xs text-foreground/20">
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default BrandStrip;
