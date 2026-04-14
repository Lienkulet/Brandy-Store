"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "./Container";
import { InstagramIcon } from "../icons/InstagramIcon";
import { TelegramIcon } from "../icons/TelegramIcon";
import { TikTokIcon } from "../icons/TikTokIcon";
import { PhoneIcon } from "../icons/PhoneIcon";

const productLinks = [
  { label: "New Arrivals",       href: "/new-arrivals"  },
  { label: "Loro Piana",         href: "/shop"          },
  { label: "Brunello Cucinelli", href: "/shop"          },
  { label: "Polo Ralph Lauren",  href: "/shop"          },
  { label: "Emporio Armani",     href: "/shop"          },
  { label: "Boss",               href: "/shop"          },
];
const categoryLinks = [
  { label: "Tops & Shirts",          href: "/shop/tops-shirts"          },
  { label: "Knitwear & Layering",    href: "/shop/knitwear-layering"    },
  { label: "Jackets & Outerwear",    href: "/shop/jackets-outerwear"    },
  { label: "Pants & Jeans",          href: "/shop/pants-jeans"          },
  { label: "Underwear & Essentials", href: "/shop/underwear-essentials" },
  { label: "Sportswear & Shoes",     href: "/shop/sportswear-shoes"     },
];
const infoLinks = [
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact",    href: "/contact"    },
];
const legalLinks = [
  { label: "Terms & Conditions", href: "/legal/terms"   },
  { label: "Privacy Policy",     href: "/legal/privacy" },
  { label: "Cookie Policy",      href: "/legal/cookies" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/brandystoremd", icon: InstagramIcon },
  { label: "Telegram",  href: "https://t.me/brandystoremd",              icon: TelegramIcon  },
  { label: "TikTok",    href: "https://www.tiktok.com/@brandystore11",   icon: TikTokIcon    },
  { label: "Phone",     href: "tel:+373000000000",                       icon: PhoneIcon     },
];

const ease = [0.22, 1, 0.36, 1] as const;

const columns = [
  { title: "Product",    items: productLinks  },
  { title: "Categories", items: categoryLinks },
];

function Footer() {
  return (
    <footer className="mt-24">
      {/* Top separator */}
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
              Dressed for every room.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted/80">
              Get newsletter updates for upcoming products and the best discounts.
            </p>

            {/* Bottom-border newsletter input */}
            <form className="mt-7">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                Newsletter
              </p>
              <div className="group/form relative flex items-center border-b border-foreground/20 pb-2.5 transition-colors duration-300 focus-within:border-foreground/60">
                <input
                  type="email"
                  placeholder="Your email address"
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
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.1 }}
            >
              <FooterColumn title={col.title} items={col.items} />
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
              Info
            </h3>
            <ul className="mt-5 space-y-3">
              {infoLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group/link relative inline-block text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {label}
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
              Follow Us
            </h3>
            <ul className="mt-5 space-y-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
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
            {legalLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors duration-200 hover:text-white/90"
              >
                {label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

type FooterItem = { label: string; href: string };

type FooterColumnProps = {
  title: string;
  items: FooterItem[];
};

function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="group/link relative inline-block text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
