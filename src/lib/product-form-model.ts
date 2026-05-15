import type { ColorVariant, Product, SizeOption } from "@/data/products";

export const DEFAULT_SIZES: SizeOption[] = [
  { label: "XS", inStock: true },
  { label: "S", inStock: true },
  { label: "M", inStock: true },
  { label: "L", inStock: true },
  { label: "XL", inStock: true },
  { label: "XXL", inStock: true },
];

const SHOE_SIZES: SizeOption[] = [
  { label: "39", inStock: true },
  { label: "40", inStock: true },
  { label: "41", inStock: true },
  { label: "42", inStock: true },
  { label: "43", inStock: true },
  { label: "44", inStock: true },
  { label: "45", inStock: true },
  { label: "46", inStock: true },
];

const WAIST_SIZES: SizeOption[] = [
  { label: "30", inStock: true },
  { label: "31", inStock: true },
  { label: "32", inStock: true },
  { label: "33", inStock: true },
  { label: "34", inStock: true },
  { label: "36", inStock: true },
  { label: "38", inStock: true },
];

export const ACCESSORY_SIZES: SizeOption[] = [
  { label: "One Size", inStock: true },
];

export const BRANDS = [
  "Loro Piana", "Boss", "Hugo", "Polo", "Zegna",
  "Armani Exchange", "Tommy Hilfiger", "Calvin Klein",
  "Brunello Cucinelli", "Emporio Armani", "Lacoste",
  "Brango", "Tony Montana", "Etro", "Tom Ford",
  "DOLCE & GABBANA", "Zara", "Massimo Dutti", "Vaganza", "Moncler",
];

export const PRODUCT_CATEGORIES = [
  { label: "Tops & Shirts", slug: "tops-shirts" },
  { label: "Knitwear & Layering", slug: "knitwear-layering" },
  { label: "Jackets & Outerwear", slug: "jackets-outerwear" },
  { label: "Pants & Jeans", slug: "pants-jeans" },
  { label: "Shorts", slug: "shorts" },
  { label: "Sets", slug: "sets" },
  { label: "Underwear & Essentials", slug: "underwear-essentials" },
  { label: "Sportswear", slug: "sportswear" },
  { label: "Shoes", slug: "shoes" },
  { label: "Accessories", slug: "accessories" },
];

export type ProductFormColor = ColorVariant & { sizes: SizeOption[] };
export type ProductFormState = Partial<Product> & { colors: ProductFormColor[] };

export function sizesForCategory(category?: string): SizeOption[] {
  if (category === "shoes") return cloneSizes(SHOE_SIZES);
  if (category === "accessories") return cloneSizes(ACCESSORY_SIZES);
  if (category === "pants-jeans" || category === "shorts") return cloneSizes(WAIST_SIZES);
  return cloneSizes(DEFAULT_SIZES);
}

export function categoryLabelForSlug(slug?: string): string {
  return PRODUCT_CATEGORIES.find((category) => category.slug === (slug ?? "tops-shirts"))?.label ?? "";
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function blankColor(category?: string): ProductFormColor {
  return { name: "White", hex: "#FFFFFF", images: [""], sizes: sizesForCategory(category) };
}

export function blankProduct(): ProductFormState {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug: "",
    name: "",
    brand: "",
    category: "tops-shirts",
    description: "",
    price: null,
    image: "",
    isNew: false,
    colors: [blankColor("tops-shirts")],
    sizes: cloneSizes(DEFAULT_SIZES),
    details: [""],
  };
}

function cloneSizes(sizes: SizeOption[]): SizeOption[] {
  return sizes.map((size) => ({ ...size }));
}
