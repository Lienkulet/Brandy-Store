import type { Metadata } from "next";
import Container from "../../../components/layout/Container";
import { SizeTabs } from "../../../components/SizeTabs";

export const metadata: Metadata = {
  title: "Size Guide — Brandy Store",
  description: "Find your perfect fit with our complete menswear size guide.",
};

const measurements = [
  {
    label: "Chest",
    instruction:
      "Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight.",
  },
  {
    label: "Waist",
    instruction:
      "Measure around your natural waistline, just above the hip bone. Keep one finger between the tape and your body.",
  },
  {
    label: "Foot length",
    instruction:
      "Stand on a flat surface and measure from the heel to the tip of your longest toe. Use the longer foot if they differ.",
  },
];

export default function SizeGuidePage() {
  return (
    <main className="bg-background pb-24 pt-36 text-foreground">
      <Container>

        {/* Page header */}
        <div className="mb-14 text-center">
          <p className="font-serif text-4xl font-semibold uppercase tracking-[0.06em] text-foreground sm:text-5xl">
            Size Guide
          </p>
          <div className="mx-auto mt-5 h-px w-10 bg-foreground/20" />
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted">
            All measurements are in centimetres unless stated otherwise.
            When between sizes, we recommend sizing up.
          </p>
        </div>

        {/* How to measure */}
        <div className="mb-14">
          <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            How to measure
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {measurements.map((m) => (
              <div
                key={m.label}
                className="soft-card rounded-2xl p-6"
              >
                <p className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {m.label}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {m.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Size tables */}
        <div className="mb-14">
          <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
            Size charts
          </h2>
          <SizeTabs />
        </div>

        {/* Luxury brand note */}
        <div className="rounded-2xl border border-foreground/8 bg-foreground/[0.02] px-6 py-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
            Note on luxury brand sizing
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Brands such as Zegna, Loro Piana, Brunello Cucinelli, and Emporio Armani use
            Italian (IT) sizing for tailored pieces — typically jackets and trousers.
            IT sizing runs approximately 10 sizes higher than standard EU sizing
            (e.g. IT 50 = EU 40 = L). If you are unsure, contact us before ordering
            and we will advise on the best fit.
          </p>
        </div>

      </Container>
    </main>
  );
}
