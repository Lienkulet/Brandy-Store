import type { Metadata } from "next";
import { LegalContent } from "../../../../components/LegalContent";

export const metadata: Metadata = {
  title: "Cookie Policy — Brandy Store",
  description: "How Brandy Store uses cookies and similar technologies.",
};

const sections = [
  {
    heading: "1. What Are Cookies",
    paragraphs: [
      "Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and understand how you use it, improving your experience on future visits.",
    ],
  },
  {
    heading: "2. Cookies We Use",
    paragraphs: [
      "Essential cookies — required for the website to function correctly (e.g. session management, cart state). These cannot be disabled.",
      "Analytics cookies — help us understand how visitors interact with the site (pages visited, time spent, referral source). We use this data in aggregate form only.",
      "Preference cookies — remember your settings and choices to personalise your experience.",
    ],
  },
  {
    heading: "3. Third-Party Cookies",
    paragraphs: [
      "We may embed content from third-party services (such as Google Maps) which may set their own cookies. We do not control these cookies and recommend reviewing the respective privacy policies.",
    ],
  },
  {
    heading: "4. Managing Cookies",
    paragraphs: [
      "You can control and delete cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of this website.",
      "Most browsers allow you to refuse cookies, delete existing cookies, or be notified when new cookies are set. Refer to your browser's help documentation for instructions.",
    ],
  },
  {
    heading: "5. Consent",
    paragraphs: [
      "By continuing to use our website, you consent to the use of cookies as described in this policy. You may withdraw consent at any time by adjusting your browser settings.",
    ],
  },
  {
    heading: "6. Updates to This Policy",
    paragraphs: [
      "We may update this Cookie Policy as our practices or applicable laws change. The effective date at the top of this page indicates when it was last revised.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <LegalContent
      title="Cookie Policy"
      lastUpdated="April 2026"
      intro="This policy explains how Brandy Store uses cookies and similar technologies on our website, what data they collect, and how you can manage them."
      sections={sections}
    />
  );
}
