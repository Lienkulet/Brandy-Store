export type ColorVariant = {
  name: string;
  hex: string;
  images: string[];
};

export type SizeOption = {
  label: string;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: { original: string; current: string } | null;
  image: string;
  colors: ColorVariant[];
  sizes: SizeOption[];
  details: string[];
  isNew?: boolean;
};

export const categories = [
  { label: "All",                    slug: null                   },
  { label: "Tops & Shirts",          slug: "tops-shirts"          },
  { label: "Knitwear & Layering",    slug: "knitwear-layering"    },
  { label: "Jackets & Outerwear",    slug: "jackets-outerwear"    },
  { label: "Pants & Jeans",          slug: "pants-jeans"          },
  { label: "Underwear & Essentials", slug: "underwear-essentials" },
  { label: "Sportswear",             slug: "sportswear"           },
  { label: "Shoes",                  slug: "shoes"                },
];
