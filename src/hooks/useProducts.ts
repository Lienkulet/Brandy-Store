"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { fetchProducts as fetchProductsFromApi } from "@/lib/product-service";

export function useProducts(filter?: (product: Product) => boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchProductsFromApi();
      setProducts(filter ? list.filter(filter) : list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { products, loading, refetch, setProducts };
}
