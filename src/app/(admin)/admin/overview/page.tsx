import { OverviewContent } from "@/components/admin/OverviewContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview — Brandy Admin" };

export default function OverviewPage() {
  return <OverviewContent />;
}
