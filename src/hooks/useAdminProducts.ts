"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/data/products";
import type { ProductFilter } from "@/lib/product-utils";

type Params = {
  page:   number;
  search: string;
  filter: ProductFilter;
};

export function useAdminProducts({ page, search, filter }: Params) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search, filter });
    try {
      const res  = await fetch(`/api/products?${params}`);
      const json = await res.json();
      setProducts(Array.isArray(json.data) ? json.data : []);
      setTotal(json.total ?? 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { void fetchProducts(); }, [fetchProducts]);

  return { products, total, loading, refetch: fetchProducts };
}
