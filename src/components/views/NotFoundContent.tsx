"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import BlackBtn from "@/components/ui/BlackBtn";
import { ease } from "@/lib/animations";
import { useLang } from "@/context/LanguageContext";

const digits = ["4", "0", "4"];

export function NotFoundContent() {
  const { t } = useLang();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background text-foreground">
      <Container>
        <div className="flex flex-col items-center text-center">

          {/* 404 digits */}
          <div className="flex items-baseline gap-2 sm:gap-4" aria-hidden="true">
            {digits.map((digit, i) => (
              <motion.span
                key={i}
                className="font-serif font-semibold leading-none text-foreground/10 select-none"
                style={{ fontSize: "clamp(7rem, 22vw, 18rem)" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.6, ease, delay: 0.45 }}
          />

          <motion.p
            className="mt-6 font-serif text-2xl font-semibold sm:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
          >
            {t("notFound.heading")}
          </motion.p>

          <motion.p
            className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.65 }}
          >
            {t("notFound.body")}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.75 }}
          >
            <BlackBtn name={t("notFound.home")} href="/" />
            <BlackBtn name={t("notFound.shop")} href="/shop" />
          </motion.div>

          <motion.p
            className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.9 }}
          >
            {t("notFound.needHelp")}{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-foreground/60 transition-colors duration-200">
              {t("notFound.contactUs")}
            </Link>
          </motion.p>

        </div>
      </Container>
    </main>
  );
}
