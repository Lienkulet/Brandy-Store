import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <Navbar />
        {children}
        <Footer />
      </CartProvider>
    </LanguageProvider>
  );
}
