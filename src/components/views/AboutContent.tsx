"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import BlackBtn from "@/components/ui/BlackBtn";
import BrandStrip from "@/components/home/BrandStrip";
import { ease } from "@/lib/animations";
import { useLang } from "@/context/LanguageContext";

export function AboutContent() {
  const { t } = useLang();

  const values = [
    { title: t("about.value1.title"), body: t("about.value1.body") },
    { title: t("about.value2.title"), body: t("about.value2.body") },
    { title: t("about.value3.title"), body: t("about.value3.body") },
  ];

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
            {t("about.heading")}
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
            {t("about.tagline")}
          </p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted">
            {t("about.intro")}
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
              {t("about.howItStarted.label")}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {t("about.howItStarted.p1")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {t("about.howItStarted.p2")}
            </p>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              {t("about.whereWeAre.label")}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {t("about.whereWeAre.p1")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {t("about.whereWeAre.p2")}
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
            {t("about.values.label")}
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
            {t("about.cta.body")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BlackBtn name={t("about.cta.shop")} href="/shop" />
            <BlackBtn name={t("about.cta.contact")} href="/contact" />
          </div>
        </motion.div>

      </Container>
    </main>
  );
}
