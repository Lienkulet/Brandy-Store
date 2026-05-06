import { SettingsContent } from "@/components/admin/SettingsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Brandy Admin" };

export default function SettingsPage() {
  return <SettingsContent />;
}
