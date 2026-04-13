import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../../components/layout/Navbar";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";

export const metadata: Metadata = {
  title: "Brandy Store",
  description: "Fashion storefront built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="bg-background text-foreground">
        <Container>
          <Navbar />
          {children}
          <Footer />
        </Container>
      </body>
    </html>
  );
}
