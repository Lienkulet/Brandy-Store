"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { ContactForm } from "@/components/views/ContactForm";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { ease } from "@/lib/animations";
import { contactChannels } from "@/data/contact-channels";
import { useLang } from "@/context/LanguageContext";
import type { TranslationKey } from "@/data/translations";

const CHANNEL_DESC_KEY: Record<string, TranslationKey> = {
  "Call or WhatsApp us directly": "contact.channel.phone",
  "DM us on Instagram":           "contact.channel.instagram",
  "Message us on Telegram":       "contact.channel.telegram",
  "Follow us on TikTok":          "contact.channel.tiktok",
};

export function ContactContent() {
  const { t } = useLang();

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
            {t("contact.heading")}
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
            {t("contact.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">

          {/* Left — contact channels */}
          <div className="space-y-4">
            <motion.p
              className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease }}
            >
              {t("contact.reachUs")}
            </motion.p>
            <ul className="space-y-4">
            {contactChannels.map((ch, i) => (
              <li key={ch.label}>
              <motion.a
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-foreground/8 bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_24px_rgba(95,77,57,0.08)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-foreground/8 bg-foreground/3 text-foreground/60 transition-colors duration-200 group-hover:border-foreground/15 group-hover:text-foreground">
                  {ch.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                    {ch.label}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    {ch.handle}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {CHANNEL_DESC_KEY[ch.description] ? t(CHANNEL_DESC_KEY[ch.description]) : ch.description}
                  </p>
                </div>
                <span className="-translate-x-1 text-foreground/25 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowRightIcon size={16} />
                </span>
              </motion.a>
              </li>
            ))}
            </ul>
          </div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              {t("contact.sendMessage")}
            </p>
            <ContactForm />
          </motion.div>

        </div>

        {/* Pickup location */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            {t("contact.inStorePickup")}
          </p>
          <p className="mb-6 text-sm text-muted">
            {t("contact.pickupBody")}
          </p>

          <div className="overflow-hidden rounded-2xl border border-foreground/8 shadow-[0_8px_32px_rgba(95,77,57,0.07)]">
            <div className="flex items-center justify-between border-b border-foreground/8 bg-foreground/2 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-foreground/50"><LocationIcon size={16} /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                  Brandy Store — Chișinău, Moldova
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Fourchette+Chisinau"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40 transition-colors hover:text-foreground"
              >
                {t("contact.openInMaps")}
              </a>
            </div>

            <div className="relative h-80 sm:h-96 lg:h-110">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43504.21309474083!2d28.77044060165749!3d47.03996946352848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d948db3e011%3A0x572262bdb19c809a!2sFourchette!5e0!3m2!1sen!2s!4v1776157794039!5m2!1sen!2s"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: "grayscale(0.35) sepia(0.22) saturate(0.72) brightness(1.06) contrast(0.88) hue-rotate(-8deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Brandy Store pickup location"
              />
            </div>
          </div>
        </motion.div>

      </Container>
    </main>
  );
}
