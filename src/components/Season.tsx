"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "./layout/Container";
import BlackBtn from "./ui/BlackBtn";

const ease = [0.22, 1, 0.36, 1] as const;

function Season() {
  return (
    <Container className="mt-16">
      <motion.section
        className="soft-card overflow-hidden rounded-[28px]"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        {/* Banner image — zooms out as card enters view */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease }}
            className="will-change-transform"
          >
            <Image
              src="/assets/banner.png"
              alt="Couple wearing new season arrivals outdoors"
              width={1913}
              height={560}
              className="h-55 w-full object-cover sm:h-70 lg:h-85"
            />
          </motion.div>
        </div>

        {/* Text block — staggered reveal */}
        <div className="px-6 py-6 text-center sm:px-8 sm:py-8">
          <motion.h2
            className="font-serif text-3xl font-semibold uppercase tracking-[0.05em] text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            The New Season Edit
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-170 text-sm text-muted sm:text-base"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
          >
            Fresh knits and quarter zips, tailored comfort for every room you
            walk into.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
          >
            <BlackBtn href="#" name="Shop New Arrivals" className="mt-6" />
          </motion.div>
        </div>
      </motion.section>
    </Container>
  );
}

export default Season;
