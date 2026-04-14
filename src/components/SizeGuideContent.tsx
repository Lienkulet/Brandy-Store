"use client";

import { motion } from "framer-motion";
import Container from "./layout/Container";
import { SizeTabs } from "./SizeTabs";

const ease = [0.22, 1, 0.36, 1] as const;

const measurements = [
  {
    label: "Chest",
    instruction:
      "Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight.",
  },
  {
    label: "Waist",
    instruction:
      "Measure around your natural waistline, just above the hip bone. Keep one finger between the tape and your body.",
  },
  {
    label: "Foot length",
    instruction:
      "Stand on a flat surface and measure from the heel to the tip of your longest toe. Use the longer foot if they differ.",
  },
];

export function SizeGuideContent() {
  return (
    <main className="bg-background pb-24 pt-36 text-foreground">
      <Container>

        {/* Page header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-serif text-4xl font-semibold uppercase tracking-[0.06em] text-foreground sm:text-5xl">
            Size Guide
          </p>
          <motion.div
            className="mx-auto mt-5 h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          />
          <motion.p
            className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
          >
            All measurements are in centimetres unless stated otherwise.
            When between sizes, we recommend sizing up.
          </motion.p>
        </motion.div>

        {/* How to measure */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            How to measure
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {measurements.map((m, i) => (
              <motion.div
                key={m.label}
                className="soft-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.12 }}
              >
                <p className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {m.label}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {m.instruction}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Size tables */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            Size charts
          </p>
          <SizeTabs />
        </motion.div>

        {/* Luxury brand note */}
        <motion.div
          className="rounded-2xl border border-foreground/8 bg-foreground/2 px-6 py-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
            Note on luxury brand sizing
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Brands such as Zegna, Loro Piana, Brunello Cucinelli, and Emporio Armani use
            Italian (IT) sizing for tailored pieces — typically jackets and trousers.
            IT sizing runs approximately 10 sizes higher than standard EU sizing
            (e.g. IT 50 = EU 40 = L). If you are unsure, contact us before ordering
            and we will advise on the best fit.
          </p>
        </motion.div>

      </Container>
    </main>
  );
}
