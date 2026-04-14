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
  price: { original: string; current: string } | null; // MDL strings
  image: string; // primary image for listing cards
  colors: ColorVariant[];
  sizes: SizeOption[];
  details: string[];
  isNew?: boolean;
};

// ─── Shared placeholder image sets ───────────────────────────────────
const shirtImgs  = ["/assets/product-shirt.png",  "/assets/product-shirt.png",  "/assets/product-shirt.png"];
const vestImgs   = ["/assets/product-vest.png",   "/assets/product-vest.png",   "/assets/product-vest.png"];
const loaferImgs = ["/assets/product-loafers.png","/assets/product-loafers.png","/assets/product-loafers.png"];

// ─── Products ─────────────────────────────────────────────────────────
export const products: Product[] = [

  // ── Tops & Shirts ──────────────────────────────────────────────────
  {
    id: "1",
    slug: "oxford-button-down-shirt",
    name: "Oxford Button-Down Shirt",
    brand: "Polo Ralph Lauren",
    category: "tops-shirts",
    description: "Classic Oxford weave, slim fit",
    price: { original: "3 500 MDL", current: "2 800 MDL" },
    image: "/assets/product-shirt.png",
    isNew: false,
    colors: [
      { name: "White",      hex: "#f5f2ed", images: shirtImgs },
      { name: "Light Blue", hex: "#b8cfe0", images: shirtImgs },
      { name: "Navy",       hex: "#1e2d40", images: shirtImgs },
    ],
    sizes: [
      { label: "XS",  inStock: true  },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: false },
      { label: "XL",  inStock: true  },
      { label: "XXL", inStock: false },
    ],
    details: [
      "100% combed Oxford cotton",
      "Slim fit with button-down collar",
      "Single chest pocket",
      "Machine washable at 30°C",
    ],
  },
  {
    id: "2",
    slug: "linen-camp-collar-shirt",
    name: "Linen Camp Collar Shirt",
    brand: "Boss",
    category: "tops-shirts",
    description: "Relaxed linen, unlined collar",
    price: null,
    image: "/assets/product-shirt.png",
    isNew: true,
    colors: [
      { name: "Ecru",  hex: "#ede8de", images: shirtImgs },
      { name: "Sage",  hex: "#8fa68a", images: shirtImgs },
      { name: "Stone", hex: "#b5a998", images: shirtImgs },
    ],
    sizes: [
      { label: "XS",  inStock: false },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: false },
      { label: "XXL", inStock: true  },
    ],
    details: [
      "100% European linen",
      "Relaxed fit, camp (revere) collar",
      "Coconut shell buttons",
      "Dry clean or hand wash",
    ],
  },
  {
    id: "3",
    slug: "poplin-spread-collar-shirt",
    name: "Poplin Spread-Collar Shirt",
    brand: "Emporio Armani",
    category: "tops-shirts",
    description: "Crisp poplin, slim Italian cut",
    price: { original: "4 200 MDL", current: "3 300 MDL" },
    image: "/assets/product-shirt.png",
    isNew: false,
    colors: [
      { name: "White",     hex: "#f5f2ed", images: shirtImgs },
      { name: "Sky Blue",  hex: "#9bbfd4", images: shirtImgs },
    ],
    sizes: [
      { label: "XS",  inStock: true  },
      { label: "S",   inStock: false },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: true  },
      { label: "XXL", inStock: false },
    ],
    details: [
      "100% Egyptian cotton poplin",
      "Slim Italian fit",
      "Spread collar, barrel cuffs",
      "Machine washable at 30°C",
    ],
  },

  // ── Knitwear & Layering ────────────────────────────────────────────
  {
    id: "4",
    slug: "v-neck-merino-vest",
    name: "V-Neck Merino Vest",
    brand: "Loro Piana",
    category: "knitwear-layering",
    description: "Extra-fine merino, featherlight",
    price: null,
    image: "/assets/product-vest.png",
    isNew: true,
    colors: [
      { name: "Camel",    hex: "#c4965a", images: vestImgs },
      { name: "Charcoal", hex: "#4a4a4a", images: vestImgs },
      { name: "Navy",     hex: "#1e2d40", images: vestImgs },
    ],
    sizes: [
      { label: "XS",  inStock: true  },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: false },
      { label: "XXL", inStock: false },
    ],
    details: [
      "Extra-fine merino wool, 17.5 micron",
      "Regular fit V-neck",
      "Ribbed neck, armhole and hem",
      "Dry clean only",
    ],
  },
  {
    id: "5",
    slug: "cable-knit-crewneck-sweater",
    name: "Cable-Knit Crewneck Sweater",
    brand: "Brunello Cucinelli",
    category: "knitwear-layering",
    description: "Cotton-linen cable knit",
    price: { original: "13 000 MDL", current: "10 400 MDL" },
    image: "/assets/product-vest.png",
    isNew: false,
    colors: [
      { name: "Oatmeal", hex: "#d6cfc3", images: vestImgs },
      { name: "Navy",    hex: "#1e2d40", images: vestImgs },
    ],
    sizes: [
      { label: "S",   inStock: false },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: true  },
      { label: "XXL", inStock: false },
    ],
    details: [
      "60% cotton, 40% linen blend",
      "Classic cable-knit pattern",
      "Crewneck, drop shoulders",
      "Hand wash or dry clean",
    ],
  },
  {
    id: "6",
    slug: "half-zip-cashmere-pullover",
    name: "Half-Zip Cashmere Pullover",
    brand: "Loro Piana",
    category: "knitwear-layering",
    description: "Pure cashmere, ribbed cuffs",
    price: null,
    image: "/assets/product-vest.png",
    isNew: true,
    colors: [
      { name: "Ivory",    hex: "#f0ead8", images: vestImgs },
      { name: "Camel",    hex: "#c4965a", images: vestImgs },
      { name: "Charcoal", hex: "#4a4a4a", images: vestImgs },
    ],
    sizes: [
      { label: "XS",  inStock: true  },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: false },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: true  },
      { label: "XXL", inStock: true  },
    ],
    details: [
      "100% Grade-A Himalayan cashmere",
      "Half-zip neck, rib-knit cuffs and hem",
      "Loro Piana embossed zipper pull",
      "Dry clean only",
    ],
  },

  // ── Jackets & Outerwear ────────────────────────────────────────────
  {
    id: "7",
    slug: "cashmere-overcoat",
    name: "Cashmere Overcoat",
    brand: "Loro Piana",
    category: "jackets-outerwear",
    description: "Demi-belted, double-faced cashmere",
    price: null,
    image: "/assets/product-vest.png",
    isNew: true,
    colors: [
      { name: "Camel",   hex: "#c4965a", images: vestImgs },
      { name: "Charcoal",hex: "#4a4a4a", images: vestImgs },
    ],
    sizes: [
      { label: "XS",  inStock: false },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: true  },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: false },
    ],
    details: [
      "Double-faced pure cashmere",
      "Demi-belt at back, notch lapels",
      "Two welt pockets, one breast pocket",
      "Dry clean only",
    ],
  },
  {
    id: "8",
    slug: "quilted-field-jacket",
    name: "Quilted Field Jacket",
    brand: "Emporio Armani",
    category: "jackets-outerwear",
    description: "Lightweight down fill, snap collar",
    price: { original: "11 200 MDL", current: "8 000 MDL" },
    image: "/assets/product-shirt.png",
    isNew: false,
    colors: [
      { name: "Olive", hex: "#6b7355", images: shirtImgs },
      { name: "Navy",  hex: "#1e2d40", images: shirtImgs },
      { name: "Black", hex: "#1c1c1c", images: shirtImgs },
    ],
    sizes: [
      { label: "XS",  inStock: true  },
      { label: "S",   inStock: true  },
      { label: "M",   inStock: false },
      { label: "L",   inStock: true  },
      { label: "XL",  inStock: true  },
      { label: "XXL", inStock: true  },
    ],
    details: [
      "90% down, 10% feather fill",
      "Matte shell with diamond quilting",
      "Snap-button funnel collar",
      "Machine washable",
    ],
  },

  // ── Pants & Jeans ──────────────────────────────────────────────────
  {
    id: "9",
    slug: "slim-fit-wool-trousers",
    name: "Slim-Fit Wool Trousers",
    brand: "Brunello Cucinelli",
    category: "pants-jeans",
    description: "Super 110s wool, flat front",
    price: null,
    image: "/assets/product-vest.png",
    isNew: true,
    colors: [
      { name: "Charcoal", hex: "#4a4a4a", images: vestImgs },
      { name: "Navy",     hex: "#1e2d40", images: vestImgs },
      { name: "Taupe",    hex: "#9a8f83", images: vestImgs },
    ],
    sizes: [
      { label: "W28", inStock: true  },
      { label: "W30", inStock: true  },
      { label: "W32", inStock: true  },
      { label: "W34", inStock: false },
      { label: "W36", inStock: true  },
    ],
    details: [
      "Super 110s pure wool",
      "Slim fit, flat front",
      "Side adjusters, no belt loops",
      "Dry clean only",
    ],
  },
  {
    id: "10",
    slug: "straight-five-pocket-jeans",
    name: "Straight Five-Pocket Jeans",
    brand: "Polo Ralph Lauren",
    category: "pants-jeans",
    description: "Rigid selvedge denim, straight leg",
    price: { original: "4 000 MDL", current: "3 100 MDL" },
    image: "/assets/product-shirt.png",
    isNew: false,
    colors: [
      { name: "Indigo",    hex: "#3a4f72", images: shirtImgs },
      { name: "Dark Wash", hex: "#2a3345", images: shirtImgs },
    ],
    sizes: [
      { label: "W28", inStock: false },
      { label: "W30", inStock: true  },
      { label: "W32", inStock: true  },
      { label: "W34", inStock: true  },
      { label: "W36", inStock: false },
    ],
    details: [
      "14oz Japanese selvedge denim",
      "Straight leg, mid-rise",
      "Leather patch at back waist",
      "Machine washable — wash inside out",
    ],
  },

  // ── Underwear & Essentials ─────────────────────────────────────────
  {
    id: "11",
    slug: "stretch-cotton-boxer-briefs",
    name: "Stretch-Cotton Boxer Briefs",
    brand: "Boss",
    category: "underwear-essentials",
    description: "Moisture-wicking stretch cotton",
    price: { original: "1 050 MDL", current: "780 MDL" },
    image: "/assets/product-shirt.png",
    isNew: false,
    colors: [
      { name: "Black", hex: "#1c1c1c", images: shirtImgs },
      { name: "White", hex: "#f5f2ed", images: shirtImgs },
      { name: "Navy",  hex: "#1e2d40", images: shirtImgs },
    ],
    sizes: [
      { label: "S",  inStock: true  },
      { label: "M",  inStock: true  },
      { label: "L",  inStock: true  },
      { label: "XL", inStock: false },
    ],
    details: [
      "95% cotton, 5% elastane",
      "Moisture-wicking finish",
      "Contoured pouch, flat seams",
      "Machine washable at 40°C",
    ],
  },
  {
    id: "12",
    slug: "ribbed-tank-top",
    name: "Ribbed Crew-Neck Tank",
    brand: "Emporio Armani",
    category: "underwear-essentials",
    description: "Supima cotton rib, slim fit",
    price: null,
    image: "/assets/product-vest.png",
    isNew: true,
    colors: [
      { name: "White", hex: "#f5f2ed", images: vestImgs },
      { name: "Black", hex: "#1c1c1c", images: vestImgs },
    ],
    sizes: [
      { label: "S",  inStock: true  },
      { label: "M",  inStock: true  },
      { label: "L",  inStock: false },
      { label: "XL", inStock: true  },
    ],
    details: [
      "100% Supima cotton, 1x1 rib",
      "Slim fit crew neck",
      "Reinforced shoulder seams",
      "Machine washable at 30°C",
    ],
  },

  // ── Sportswear & Shoes ─────────────────────────────────────────────
  {
    id: "13",
    slug: "leather-penny-loafers",
    name: "Leather Penny Loafers",
    brand: "Polo Ralph Lauren",
    category: "sportswear-shoes",
    description: "Burnished calfskin, leather sole",
    price: { original: "7 200 MDL", current: "5 500 MDL" },
    image: "/assets/product-loafers.png",
    isNew: false,
    colors: [
      { name: "Tan",   hex: "#b08060", images: loaferImgs },
      { name: "Brown", hex: "#6b4226", images: loaferImgs },
      { name: "Black", hex: "#1c1c1c", images: loaferImgs },
    ],
    sizes: [
      { label: "EU 39", inStock: true  },
      { label: "EU 40", inStock: true  },
      { label: "EU 41", inStock: false },
      { label: "EU 42", inStock: true  },
      { label: "EU 43", inStock: true  },
      { label: "EU 44", inStock: false },
      { label: "EU 45", inStock: true  },
      { label: "EU 46", inStock: true  },
    ],
    details: [
      "Full-grain burnished calfskin upper",
      "Leather-lined, leather sole",
      "Penny strap with slot",
      "Resoleable — recommended every 2–3 years",
    ],
  },
  {
    id: "14",
    slug: "suede-runner-sneakers",
    name: "Suede Runner Sneakers",
    brand: "Emporio Armani",
    category: "sportswear-shoes",
    description: "Split suede upper, cupsole",
    price: null,
    image: "/assets/product-loafers.png",
    isNew: true,
    colors: [
      { name: "Grey",  hex: "#a0a0a0", images: loaferImgs },
      { name: "Beige", hex: "#c8b89a", images: loaferImgs },
    ],
    sizes: [
      { label: "EU 39", inStock: false },
      { label: "EU 40", inStock: true  },
      { label: "EU 41", inStock: true  },
      { label: "EU 42", inStock: true  },
      { label: "EU 43", inStock: false },
      { label: "EU 44", inStock: true  },
      { label: "EU 45", inStock: true  },
      { label: "EU 46", inStock: false },
    ],
    details: [
      "Split suede and mesh upper",
      "EVA midsole, rubber cupsole",
      "Padded tongue and collar",
      "Removable EVA insole",
    ],
  },
];

export const categories = [
  { label: "All",                    slug: null                   },
  { label: "Tops & Shirts",          slug: "tops-shirts"          },
  { label: "Knitwear & Layering",    slug: "knitwear-layering"    },
  { label: "Jackets & Outerwear",    slug: "jackets-outerwear"    },
  { label: "Pants & Jeans",          slug: "pants-jeans"          },
  { label: "Underwear & Essentials", slug: "underwear-essentials" },
  { label: "Sportswear & Shoes",     slug: "sportswear-shoes"     },
];
