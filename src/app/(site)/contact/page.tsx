import type { Metadata } from "next";
import { ContactContent } from "../../../components/ContactContent";

export const metadata: Metadata = {
  title: "Contact — Brandy Store",
  description: "Get in touch with Brandy Store via phone, Instagram, TikTok or Telegram.",
};

export default function ContactPage() {
  return <ContactContent />;
}
