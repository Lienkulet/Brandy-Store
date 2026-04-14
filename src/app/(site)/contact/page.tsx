import type { Metadata } from "next";
import Container from "../../../components/layout/Container";
import { ContactForm } from "../../../components/ContactForm";
import { PhoneIcon } from "../../../components/icons/PhoneIcon";
import { InstagramIcon } from "../../../components/icons/InstagramIcon";
import { TelegramIcon } from "../../../components/icons/TelegramIcon";
import { TikTokIcon } from "../../../components/icons/TikTokIcon";

export const metadata: Metadata = {
  title: "Contact — Brandy Store",
  description: "Get in touch with Brandy Store via phone, Instagram, TikTok or Telegram.",
};

const channels = [
  {
    label: "Phone",
    handle: "+373 XXX XXX XXX",
    description: "Call or WhatsApp us directly",
    href: "tel:+373000000000",
    icon: <PhoneIcon />,
  },
  {
    label: "Instagram",
    handle: "@brandystoremd",
    description: "DM us on Instagram",
    href: "https://www.instagram.com/brandystoremd",
    icon: <InstagramIcon />,
  },
  {
    label: "Telegram",
    handle: "@brandystoremd",
    description: "Message us on Telegram",
    href: "https://t.me/brandystoremd",
    icon: <TelegramIcon />,
  },
  {
    label: "TikTok",
    handle: "@brandystore11",
    description: "Follow us on TikTok",
    href: "https://www.tiktok.com/@brandystore11",
    icon: <TikTokIcon />,
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background pb-24 pt-36 text-foreground">
      <Container>

        {/* Page header */}
        <div className="mb-14 text-center">
          <p className="font-serif text-4xl font-semibold uppercase tracking-[0.06em] text-foreground sm:text-5xl">
            Contact
          </p>
          <div className="mx-auto mt-5 h-px w-10 bg-foreground/20" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
            We typically respond within a few hours. Reach us on any platform below
            or send a message directly.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">

          {/* Left — contact channels */}
          <div className="space-y-4">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              Reach us on
            </p>
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-foreground/8 bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_24px_rgba(95,77,57,0.08)]"
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
                  <p className="mt-0.5 text-xs text-muted">{ch.description}</p>
                </div>
                <svg
                  className="-translate-x-1 text-foreground/25 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>

          {/* Right — contact form */}
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
              Send a message
            </p>
            <ContactForm />
          </div>

        </div>

        {/* Pickup location */}
        <div className="mt-16">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            In-store pickup
          </p>
          <p className="mb-6 text-sm text-muted">
            Prefer to pick up in person? Visit us at our location in Chișinău.
            Contact us first to confirm availability.
          </p>

          <div className="overflow-hidden rounded-2xl border border-foreground/8 shadow-[0_8px_32px_rgba(95,77,57,0.07)]">
            {/* Map label bar */}
            <div className="flex items-center justify-between border-b border-foreground/8 bg-foreground/2 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
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
                Open in Maps →
              </a>
            </div>

            {/* Map iframe */}
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
        </div>

      </Container>
    </main>
  );
}
