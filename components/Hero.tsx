"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import GreyBtn from "./ui/GreyBtn";

const ease = [0.22, 1, 0.36, 1] as const;
const WORDS = "FOR THE GENTLEMAN IN EVERY ROOM".split(" ");

const wordContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.25 },
  },
};

const wordReveal = {
  hidden: { y: 56, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease },
  },
};

function Hero() {
  const { scrollY } = useScroll();

  // Text drifts up and fades as the user scrolls away from the hero
  const textY       = useTransform(scrollY, [0, 480], [0, -80]);
  const textOpacity = useTransform(scrollY, [0, 360], [1, 0]);

  // Scroll indicator dissolves early
  const indicatorOpacity = useTransform(scrollY, [0, 140], [1, 0]);

  return (
    <section className="relative overflow-hidden">

      {/* Gradient overlay — bottom-heavy so text always reads cleanly */}
      <div className="absolute inset-0 z-1 bg-[linear-gradient(to_top,rgba(18,12,8,0.78)_0%,rgba(18,12,8,0.28)_48%,rgba(18,12,8,0.0)_100%)]" />

      {/* Hero image with ambient Ken Burns loop */}
      <Image
        src="/assets/hero-bg.png"
        alt="Three models in neutral knitwear"
        width={1372}
        height={768}
        priority
        className="hero-zoom-in h-screen w-screen object-cover object-center"
      />

      {/* ── Text block ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-5 sm:px-10 sm:pb-24 lg:px-14 lg:pb-10"
        style={{ y: textY, opacity: textOpacity }}
      >

        {/* Headline — each word rises independently */}
        <motion.div
          className="flex flex-wrap items-end gap-x-3 gap-y-1 overflow-hidden"
          variants={wordContainer}
          initial="hidden"
          animate="visible"
        >
          {WORDS.map((word, i) => (
            <span key={i} className="contents">
              <motion.span
                variants={wordReveal}
                className="inline-block font-serif text-[2rem] font-bold leading-[1.03] -tracking-[1px] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-[3.25rem] lg:text-[4rem]"
              >
                {word}
              </motion.span>
              {word === "IN" && <div className="w-full" />}
            </span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-5 text-sm font-medium tracking-[0.06em] text-white/75 sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.95 }}
        >
          Timeless silhouettes and sweaters crafted for moments that matter.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.2 }}
        >
          <GreyBtn name="Buy Now" href="#collection" />
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease }}
        style={{ opacity: indicatorOpacity }}
      >
          {/* Whole indicator bounces */}
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
          >
            {/* Letter-by-letter reveal */}
            <motion.span
              className="flex text-[9px] font-semibold uppercase tracking-[0.32em] text-white/50"
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
            >
              {"SCROLL".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9 + i * 0.07, duration: 0.45, ease }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>

            {/* Tapered line: full white at top, fades to transparent */}
            <div className="h-14 w-px bg-linear-to-b from-white/50 to-transparent" />
          </motion.div>
      </motion.div>

    </section>
  );
}

export default Hero;
