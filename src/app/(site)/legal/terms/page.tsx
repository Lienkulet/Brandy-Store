import type { Metadata } from "next";
import { LegalContent } from "../../../../components/LegalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions — Brandy Store",
  description: "Terms and conditions governing your use of Brandy Store.",
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the Brandy Store website and placing an order, you agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our services.",
    ],
  },
  {
    heading: "2. Products & Availability",
    paragraphs: [
      "All products are subject to availability. We reserve the right to discontinue any product at any time. Product images are for illustrative purposes and may differ slightly from the actual item due to photography and screen settings.",
      "We take reasonable care to ensure that all product descriptions and prices are accurate. In the event of an error, we will notify you before processing your order.",
    ],
  },
  {
    heading: "3. Ordering & Payment",
    paragraphs: [
      "Orders are accepted subject to availability and confirmation. Once an order is placed, you will receive a confirmation via the contact details you provided.",
      "We currently operate on a cash-on-delivery basis. Full payment is due at the time of delivery or in-store pickup. We reserve the right to cancel any order at our discretion.",
    ],
  },
  {
    heading: "4. Delivery",
    paragraphs: [
      "We deliver within Moldova. Delivery times are estimates and may vary depending on your location and order volume. We are not liable for delays caused by circumstances beyond our control.",
      "Risk of loss or damage passes to you upon delivery. If an item arrives damaged, please contact us within 24 hours with photographic evidence.",
    ],
  },
  {
    heading: "5. Returns & Exchanges",
    paragraphs: [
      "We want you to be completely satisfied with your purchase. If for any reason you are not, please contact us within 7 days of receiving your order to arrange a return or exchange.",
      "Items must be returned in their original, unworn condition with all tags attached. We reserve the right to refuse a return if these conditions are not met.",
    ],
  },
  {
    heading: "6. Intellectual Property",
    paragraphs: [
      "All content on this website — including images, text, logos, and design — is the property of Brandy Store and may not be reproduced or used without prior written consent.",
    ],
  },
  {
    heading: "7. Limitation of Liability",
    paragraphs: [
      "Brandy Store shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our maximum liability is limited to the value of the order in question.",
    ],
  },
  {
    heading: "8. Governing Law",
    paragraphs: [
      "These Terms & Conditions are governed by the laws of the Republic of Moldova. Any disputes shall be subject to the exclusive jurisdiction of the courts of Chișinău.",
    ],
  },
  {
    heading: "9. Changes to Terms",
    paragraphs: [
      "We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Continued use of our services constitutes acceptance of the revised terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalContent
      title="Terms & Conditions"
      lastUpdated="April 2026"
      intro="Please read these Terms & Conditions carefully before using the Brandy Store website or placing an order. These terms govern your relationship with us and outline your rights and obligations as a customer."
      sections={sections}
    />
  );
}
