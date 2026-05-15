import type { ReactNode } from "react";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export type ContactChannel = {
  label:       string;
  handle:      string;
  description: string;
  href:        string;
  icon:        ReactNode;
};

export const contactChannels: ContactChannel[] = [
  {
    label:       "Phone",
    handle:      "+373 XXX XXX XXX",
    description: "Call or WhatsApp us directly",
    href:        "tel:+373000000000",
    icon:        <PhoneIcon />,
  },
  {
    label:       "Instagram",
    handle:      "@brandystoremd",
    description: "DM us on Instagram",
    href:        "https://www.instagram.com/brandystoremd",
    icon:        <InstagramIcon />,
  },
  {
    label:       "Telegram",
    handle:      "@brandystoremd",
    description: "Message us on Telegram",
    href:        "https://t.me/brandystoremd",
    icon:        <TelegramIcon />,
  },
  {
    label:       "TikTok",
    handle:      "@brandystore11",
    description: "Follow us on TikTok",
    href:        "https://www.tiktok.com/@brandystore11",
    icon:        <TikTokIcon />,
  },
];
