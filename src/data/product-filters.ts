import type { ProductFilter } from "@/lib/product-utils";

export const PRODUCT_FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all",           label: "All"          },
  { value: "in-stock",      label: "In stock"     },
  { value: "out-of-stock",  label: "Out of stock" },
  { value: "on-sale",       label: "On sale"      },
  { value: "new",           label: "New"          },
];
