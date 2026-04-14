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
      </Container>
    </main>
  );
}
