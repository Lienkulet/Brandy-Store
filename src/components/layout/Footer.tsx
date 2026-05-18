"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { ease } from "@/lib/animations";
import { footerSocialLinks } from "@/data/footer-links";
import { useLang } from "@/context/LanguageContext";

const productLinks = [
  { labelKey: "footer.link.newArrivals" as const, href: "/new-arrivals" },
  { labelKey: "footer.link.tshirtsPolo" as const, href: "/shop/t-shirts" },
  { labelKey: "footer.link.shirts"      as const, href: "/shop/shirts"   },
  { labelKey: "footer.link.knitwear"    as const, href: "/shop/knitwear-layering" },
  { labelKey: "footer.link.jackets"     as const, href: "/shop/jackets-outerwear" },
  { labelKey: "footer.link.pants"       as const, href: "/shop/pants-jeans"       },
];

const categoryLinks = [
  { labelKey: "footer.link.tshirtsPolo" as const, href: "/shop/t-shirts"              },
  { labelKey: "footer.link.shirts"      as const, href: "/shop/shirts"                },
  { labelKey: "footer.link.knitwear"    as const, href: "/shop/knitwear-layering"      },
  { labelKey: "footer.link.jackets"     as const, href: "/shop/jackets-outerwear"      },
  { labelKey: "footer.link.pants"       as const, href: "/shop/pants-jeans"            },
  { labelKey: "footer.link.underwear"   as const, href: "/shop/underwear-essentials"   },
  { labelKey: "footer.link.sportswear"  as const, href: "/shop/sportswear-shoes"       },
];

const infoLinkKeys = [
  { labelKey: "footer.link.sizeGuide" as const, href: "/size-guide" },
  { labelKey: "footer.link.contact"   as const, href: "/contact"    },
];

const legalLinkKeys = [
  { labelKey: "footer.link.terms"   as const, href: "/legal/terms"   },
  { labelKey: "footer.link.privacy" as const, href: "/legal/privacy" },
  { labelKey: "footer.link.cookies" as const, href: "/legal/cookies" },
];

function Footer() {
  const { t } = useLang();

  const footerColumns = [
    { titleKey: "footer.col.product"    as const, items: productLinks  },
    { titleKey: "footer.col.categories" as const, items: categoryLinks },
  ];

  return (
    <footer className="mt-24">
      <div className="border-t border-foreground/8" />

      <Container>
        <div className="grid gap-12 pb-8 pt-12 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <motion.div
            className="max-w-xs"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
          >
            <Link href="/" aria-label="Home">
              <Image
                src="/logo.png"
                alt="BrandyStore"
                width={180}
                height={72}
                className="h-14 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 font-serif text-sm italic leading-relaxed text-muted">
              {t("footer.tagline")}
            </p>

            <p className="mt-3 text-sm leading-6 text-muted/80">
              {t("footer.newsletter.intro")}
            </p>

            <form className="mt-7">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                {t("footer.newsletter.label")}
              </p>
              <div className="group/form relative flex items-center border-b border-foreground/20 pb-2.5 transition-colors duration-300 focus-within:border-foreground/60">
                <input
                  type="email"
                  placeholder={t("footer.newsletter.placeholder")}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="ml-3 text-base leading-none text-muted/60 transition-all duration-300 hover:translate-x-0.5 hover:text-foreground"
                >
                  →
                </button>
              </div>
            </form>
          </motion.div>

          {/* Link columns */}
          {footerColumns.map((col, i) => (
            <motion.div
              key={col.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.1 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                {t(col.titleKey)}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.items.map(({ labelKey, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group/link relative inline-block text-sm text-muted transition-colors duration-200 hover:text-foreground"
                    >
                      {t(labelKey)}
                      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {t("footer.info")}
            </h3>
            <ul className="mt-5 space-y-3">
              {infoLinkKeys.map(({ labelKey, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group/link relative inline-block text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {t(labelKey)}
                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
          >
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {t("footer.followUs")}
            </h3>
            <ul className="mt-5 space-y-3">
              {footerSocialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group/link flex items-center gap-2.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="text-foreground/40 transition-colors duration-200 group-hover/link:text-foreground">
                      <Icon />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-foreground/8 bg-[#1e1a17]">
        <Container className="flex flex-col gap-4 py-6 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 BrandyStore</p>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {legalLinkKeys.map(({ labelKey, href }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-200 hover:text-white/90"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
