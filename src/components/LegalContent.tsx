"use client";

import { motion } from "framer-motion";
import Container from "./layout/Container";

const ease = [0.22, 1, 0.36, 1] as const;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type Props = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalContent({ title, lastUpdated, intro, sections }: Props) {
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
            {title}
          </p>
          <motion.div
            className="mx-auto mt-5 h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          />
          <motion.p
            className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
          >
            Last updated: {lastUpdated}
          </motion.p>
        </motion.div>

        <div className="mx-auto max-w-2xl">

          {/* Intro */}
          <motion.p
            className="mb-12 text-sm leading-relaxed text-muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
          >
            {intro}
          </motion.p>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              >
                <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact note */}
          <motion.div
            className="mt-14 rounded-2xl border border-foreground/8 bg-foreground/2 px-6 py-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
              Questions?
            </p>
            <p className="text-sm leading-relaxed text-muted">
              If you have any questions about this document, please{" "}
              <a href="/contact" className="text-foreground underline underline-offset-2 hover:text-muted transition-colors duration-200">
                contact us
              </a>{" "}
              directly and we will be happy to help.
            </p>
          </motion.div>

        </div>
      </Container>
    </main>
  );
}
