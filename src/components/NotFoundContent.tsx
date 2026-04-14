"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "./layout/Container";
import BlackBtn from "./ui/BlackBtn";

const ease = [0.22, 1, 0.36, 1] as const;

const digits = ["4", "0", "4"];

export function NotFoundContent() {
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

          {/* Divider */}
          <motion.div
            className="h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: "2.5rem" }}
            transition={{ duration: 0.6, ease, delay: 0.45 }}
          />

          {/* Heading */}
          <motion.p
            className="mt-6 font-serif text-2xl font-semibold sm:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
          >
            This page doesn&apos;t exist.
          </motion.p>

          {/* Body */}
          <motion.p
            className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.65 }}
          >
            The piece you&apos;re looking for may have sold out or moved to a
            new address. Head back and keep browsing.
          </motion.p>

          {/* Actions */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.75 }}
          >
            <BlackBtn name="Back to Homepage" href="/" />
            <BlackBtn name="Shop Now" href="/shop" />
          </motion.div>

          {/* Subtle help line */}
          <motion.p
            className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.9 }}
          >
            Need help?{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-foreground/60 transition-colors duration-200">
              Contact us
            </Link>
          </motion.p>

        </div>
      </Container>
    </main>
  );
}
