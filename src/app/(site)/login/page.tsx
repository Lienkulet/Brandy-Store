import type { Metadata } from "next";
import { LoginContent } from "@/components/views/LoginContent";

export const metadata: Metadata = {
  title: "Sign In — Brandy Store",
};

export default function LoginPage() {
  return <LoginContent />;
}
