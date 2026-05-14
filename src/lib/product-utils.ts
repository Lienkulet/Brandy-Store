import type { Product, SizeOption } from "@/data/products";

export type ProductFilter = "all" | "in-stock" | "out-of-stock" | "on-sale" | "new";

export type ProductStats = {
  total: number;
  inStock: number;
  outOfStock: number;
  onSale: number;
  newArrivals: number;
};

export function isProductInStock(product: Product): boolean {
  return (product.sizes ?? []).some((size) => size.inStock);
}

export function isProductOutOfStock(product: Product): boolean {
  return areAllSizesOutOfStock(product.sizes ?? []);
}

export function areAllSizesOutOfStock(sizes: SizeOption[]): boolean {
  return sizes.length > 0 && sizes.every((size) => !size.inStock);
}

export function isProductOnSale(product: Product): boolean {
  return isPriceOnSale(product.price);
}

export function isPriceOnSale(price?: Product["price"]): boolean {
  return Boolean(price?.original.trim());
}

export function countInStockSizes(product: Product): number {
  return (product.sizes ?? []).filter((size) => size.inStock).length;
}

export function matchesProductFilter(product: Product, filter: ProductFilter): boolean {
  if (filter === "in-stock") return isProductInStock(product);
  if (filter === "out-of-stock") return isProductOutOfStock(product);
  if (filter === "on-sale") return isProductOnSale(product);
  if (filter === "new") return Boolean(product.isNew);
  return true;
}

export function matchesProductSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return [
    product.name,
    product.brand,
    product.category,
    product.slug,
    product.description,
    product.price?.current,
    product.price?.original,
    ...(product.details ?? []),
    ...(product.colors ?? []).flatMap((color) => [
      color.name,
      color.hex,
      ...(color.sizes ?? []).map((size) => size.label),
    ]),
    ...(product.sizes ?? []).map((size) => size.label),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch);
}

export function getProductStats(products: Product[]): ProductStats {
  return {
    total: products.length,
    inStock: products.filter(isProductInStock).length,
    outOfStock: products.filter(isProductOutOfStock).length,
    onSale: products.filter(isProductOnSale).length,
    newArrivals: products.filter((product) => product.isNew).length,
  };
}

export function markProductOutOfStock(product: Product): Product {
  const outOfStockSizes = product.sizes.map((size) => ({ ...size, inStock: false }));

  return {
    ...product,
    sizes: outOfStockSizes,
    colors: product.colors.map((color) => ({
      ...color,
      sizes: (color.sizes ?? product.sizes).map((size) => ({ ...size, inStock: false })),
    })),
  };
}

export function getProductSizesForCard(product: Product, colorFilters: string[]): SizeOption[] {
  const matchingColors = colorFilters.length
    ? product.colors.filter((color) => colorFilters.includes(color.name))
    : product.colors;

  const allSizes = matchingColors.flatMap((color) =>
    color.sizes?.length ? color.sizes : product.sizes
  );

  if (!allSizes.length) return product.sizes;

  const byLabel = new Map<string, boolean>();
  for (const size of allSizes) {
    byLabel.set(size.label, (byLabel.get(size.label) ?? false) || size.inStock);
  }

  return Array.from(byLabel.entries()).map(([label, inStock]) => ({ label, inStock }));
}
