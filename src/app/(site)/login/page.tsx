import type { Metadata } from "next";
import { LoginContent } from "../../../components/LoginContent";

export const metadata: Metadata = {
  title: "Sign In — Brandy Store",
};

export default function LoginPage() {
  return <LoginContent />;
}
