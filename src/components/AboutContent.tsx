"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "./layout/Container";
import BlackBtn from "./ui/BlackBtn";
import BrandStrip from "./BrandStrip";

const ease = [0.22, 1, 0.36, 1] as const;

const values = [
  {
    title: "Curation over quantity",
    body: "We don't carry everything — we carry the right things. Every piece is selected for its construction, fabric, and staying power.",
  },
  {
    title: "Fit is everything",
    body: "A garment is only as good as how it fits. Our size guide and in-store advice exist so you always leave confident.",
  },
  {
    title: "Built to last",
    body: "We believe in buying less and wearing more. The brands we carry are chosen because their clothes age well and hold their value.",
  },
];

const brands = ["Loro Piana", "Brunello Cucinelli", "Polo Ralph Lauren", "Emporio Armani", "Boss"];

export function AboutContent() {
  return (
    <main className="bg-background pb-24 pt-36 text-foreground">
      <Container>

        {/* Page header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-serif text-4xl font-semibold uppercase tracking-[0.06em] text-foreground sm:text-5xl">
            The Story
          </p>
          <motion.div
            className="mx-auto mt-5 h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          />
        </motion.div>

        {/* Opening statement */}
        <motion.div
          className="mx-auto mb-20 max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
        >
          <p className="font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            &ldquo;Dressed for every room.&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted">
            Brandy Store opened in Chișinău in 2023 with a single idea — that men in
            Moldova deserve access to the same quality and craft that fills the wardrobes
            of the world&apos;s best-dressed cities.
          </p>
        </motion.div>

        {/* Story section */}
        <motion.div
          className="mx-auto mb-20 grid max-w-4xl gap-12 md:grid-cols-2 md:gap-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
        >
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              How it started
            </p>
            <p className="text-sm leading-relaxed text-muted">
              We started as a small, carefully assembled selection of menswear —
              pieces we believed in, from houses with long track records of making
              things properly. No fast fashion. No compromise on material.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              From the beginning, the goal was simple: bring world-class menswear
              closer to home, and make it accessible without making it feel ordinary.
            </p>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              Where we are now
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Two years in, we carry a focused roster of brands known for
              quality over hype — from the Italian ateliers of Loro Piana and
              Brunello Cucinelli to the refined casualwear of Polo Ralph Lauren
              and the sharp suiting of Emporio Armani and Boss.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We are based in Chișinău and deliver across Moldova, with in-store
              pickup available for those who prefer to see the garment before taking it home.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <motion.p
            className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease }}
          >
            What we stand for
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="soft-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.12 }}
              >
                <p className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {v.title}
                </p>
                <p className="text-sm leading-relaxed text-muted">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brands we carry */}
        {/* <motion.div
          className="mb-20 rounded-2xl border border-foreground/8 bg-foreground/2 px-8 py-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            Brands we carry
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {brands.map((brand, i) => (
              <motion.p
                key={brand}
                className="font-serif text-lg font-semibold text-foreground/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                {brand}
              </motion.p>
            ))}
          </div>
        </motion.div> */}
        <BrandStrip />

        {/* CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mx-auto mb-7 max-w-sm text-sm leading-relaxed text-muted">
            Come see it for yourself — in store in Chișinău, or browse the full
            collection online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BlackBtn name="Shop Now" href="/shop" />
            <BlackBtn name="Get in Touch" href="/contact" />
          </div>
        </motion.div>

      </Container>
    </main>
  );
}
