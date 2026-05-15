import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";

export const productLinks = [
  { label: "New Arrivals",       href: "/new-arrivals" },
  { label: "Loro Piana",         href: "/shop"         },
  { label: "Brunello Cucinelli", href: "/shop"         },
  { label: "Polo Ralph Lauren",  href: "/shop"         },
  { label: "Emporio Armani",     href: "/shop"         },
  { label: "Boss",               href: "/shop"         },
];

export const categoryLinks = [
  { label: "Tops & Shirts",          href: "/shop/tops-shirts"          },
  { label: "Knitwear & Layering",    href: "/shop/knitwear-layering"    },
  { label: "Jackets & Outerwear",    href: "/shop/jackets-outerwear"    },
  { label: "Pants & Jeans",          href: "/shop/pants-jeans"          },
  { label: "Underwear & Essentials", href: "/shop/underwear-essentials" },
  { label: "Sportswear & Shoes",     href: "/shop/sportswear-shoes"     },
];

export const infoLinks = [
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact",    href: "/contact"    },
];

export const legalLinks = [
  { label: "Terms & Conditions", href: "/legal/terms"   },
  { label: "Privacy Policy",     href: "/legal/privacy" },
  { label: "Cookie Policy",      href: "/legal/cookies" },
];

export const footerSocialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/brandystoremd", icon: InstagramIcon },
  { label: "Telegram",  href: "https://t.me/brandystoremd",              icon: TelegramIcon  },
  { label: "TikTok",    href: "https://www.tiktok.com/@brandystore11",   icon: TikTokIcon    },
  { label: "Phone",     href: "tel:+373000000000",                       icon: PhoneIcon     },
];

export const footerColumns = [
  { title: "Product",    items: productLinks  },
  { title: "Categories", items: categoryLinks },
];
