import type { Product } from "@/data/products";
import { parseMDL } from "@/lib/money";
import { isPriceOnSale } from "@/lib/product-utils";

export type SortKey = "new-in" | "oldest" | "price-asc" | "price-desc";

export type ProductFilters = {
  brands: string[];
  sizes:  string[];
  colors: string[];
  onSale: boolean;
};

export function applySort(list: Product[], sort: SortKey): Product[] {
  return [...list].sort((a, b) => {
    if (sort === "new-in")  return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sort === "oldest")  return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
    const ap = a.price ? parseMDL(a.price.current) : Infinity;
    const bp = b.price ? parseMDL(b.price.current) : Infinity;
    return sort === "price-asc" ? ap - bp : bp - ap;
  });
}

export function applyFilters(list: Product[], filters: ProductFilters): Product[] {
  return list.filter((p) => {
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (filters.sizes.length  && !p.sizes.some((s)  => filters.sizes.includes(s.label)))   return false;
    if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c.name)))   return false;
    if (filters.onSale        && !isPriceOnSale(p.price))                                  return false;
    return true;
  });
}
