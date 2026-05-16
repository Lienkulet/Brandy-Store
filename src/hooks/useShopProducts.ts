"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Product } from "@/data/products";
import type { ProductFilters, SortKey } from "@/lib/shop-utils";

type Params = {
  category: string | null;
  filters:  ProductFilters;
  sort:     SortKey;
  onlyNew?: boolean;
};

function buildParams(page: number, { category, filters, sort, onlyNew }: Params) {
  const params = new URLSearchParams({ page: String(page), mode: "shop", sort });
  if (category)              params.set("category", category);
  if (filters.onSale)        params.set("onSale", "true");
  if (onlyNew)               params.set("onlyNew", "true");
  if (filters.availability)  params.set("availability", filters.availability);
  filters.brands.forEach((b) => params.append("brand", b));
  filters.sizes.forEach((s)  => params.append("size", s));
  filters.colors.forEach((c) => params.append("color", c));
  return params;
}

export function useShopProducts(params: Params) {
  const [products, setProducts]     = useState<Product[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]             = useState(1);

  const paramsKey = JSON.stringify(params);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);

    fetch(`/api/products?${buildParams(1, paramsRef.current)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setProducts(json.data ?? []);
        setTotal(json.total ?? 0);
      })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const hasMore = products.length < total;

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res  = await fetch(`/api/products?${buildParams(nextPage, paramsRef.current)}`);
      const json = await res.json();
      setProducts((prev) => [...prev, ...(json.data ?? [])]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore]);

  return { products, total, loading, loadingMore, hasMore, loadMore };
}
