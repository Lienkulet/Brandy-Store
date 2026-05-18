"use client";

import { motion } from "framer-motion";
import CategoryCard from "@/components/cards/CategoryCard";
import { ease } from "@/lib/animations";
import { HOME_CATEGORIES } from "@/data/home-categories";
import { useLang } from "@/context/LanguageContext";
import type { TranslationKey } from "@/data/translations";

const CAT_KEY_MAP: Record<string, TranslationKey> = {
  "T-Shirts & Polo":        "cat.tshirtsPolo",
  "Shirts":                 "cat.shirts",
  "Pants & Jeans":          "cat.pants",
  "Knitwear & Layering":    "cat.knitwear",
  "Jackets & Outerwear":    "cat.jackets",
  "Underwear & Essentials": "cat.underwear",
  "Sportswear & Shoes":     "cat.accessories",
};

function Categories() {
  const { t } = useLang();
  return (
    <section className="mt-14">
      {/* Heading block */}
      <motion.div
        className="mb-8 text-center sm:mb-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="font-serif text-2xl font-semibold uppercase tracking-[0.24em] text-foreground sm:text-3xl">
          {t("categories.heading")}
        </p>

        <motion.div
          className="mx-auto mt-4 h-px bg-foreground/20"
          initial={{ width: 0 }}
          whileInView={{ width: "2.5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        />

        <p className="mx-auto mt-4 max-w-170 text-sm text-muted sm:text-base">
          {t("categories.sub")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {HOME_CATEGORIES.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.14 }}
          >
            <CategoryCard
              {...item}
              title={CAT_KEY_MAP[item.title] ? t(CAT_KEY_MAP[item.title]) : item.title}
              cta={t("categories.cta")}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
