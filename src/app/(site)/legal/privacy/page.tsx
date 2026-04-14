import type { Metadata } from "next";
import { LegalContent } from "../../../../components/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Brandy Store",
  description: "How Brandy Store collects, uses, and protects your personal data.",
};

const sections = [
  {
    heading: "1. Who We Are",
    paragraphs: [
      "Brandy Store is a menswear retailer based in Chișinău, Moldova. We are committed to protecting your privacy and handling your personal data responsibly and transparently.",
    ],
  },
  {
    heading: "2. Data We Collect",
    paragraphs: [
      "When you place an order or contact us, we may collect: your name, phone number, email address, delivery address, and order details.",
      "We may also collect non-personal data such as browser type, pages visited, and time spent on the site for analytics purposes.",
    ],
  },
  {
    heading: "3. How We Use Your Data",
    paragraphs: [
      "We use your personal data to process and fulfil your orders, communicate about your purchase, and respond to enquiries.",
      "With your consent, we may use your contact details to send newsletters or promotional updates. You can unsubscribe at any time.",
    ],
  },
  {
    heading: "4. Data Sharing",
    paragraphs: [
      "We do not sell or rent your personal data to third parties. We may share data with trusted service providers (e.g. delivery partners) strictly for order fulfilment purposes.",
      "We may disclose data if required by law or to protect our legal rights.",
    ],
  },
  {
    heading: "5. Data Retention",
    paragraphs: [
      "We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. Order records are typically kept for 5 years for accounting and legal purposes.",
    ],
  },
  {
    heading: "6. Your Rights",
    paragraphs: [
      "You have the right to access, correct, or delete the personal data we hold about you. You may also object to certain processing or request a restriction.",
      "To exercise any of these rights, please contact us directly. We will respond within 30 days.",
    ],
  },
  {
    heading: "7. Cookies",
    paragraphs: [
      "We use cookies to improve your browsing experience. For full details, please see our Cookie Policy.",
    ],
  },
  {
    heading: "8. Security",
    paragraphs: [
      "We take appropriate technical and organisational measures to protect your data against unauthorised access, loss, or misuse. However, no internet transmission is 100% secure.",
    ],
  },
  {
    heading: "9. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the effective date shown above.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalContent
      title="Privacy Policy"
      lastUpdated="April 2026"
      intro="Your privacy matters to us. This policy explains what personal data we collect, why we collect it, how we use it, and your rights in relation to it."
      sections={sections}
    />
  );
}
