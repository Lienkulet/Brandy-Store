"use client";

import { useState, useEffect } from "react";
import type { ProductFilter } from "@/lib/product-utils";

type FilterCounts = Record<ProductFilter, number>;

const DEFAULT: FilterCounts = { all: 0, "in-stock": 0, "out-of-stock": 0, "on-sale": 0, new: 0 };

export function useAdminProductCounts(search: string): FilterCounts {
  const [counts, setCounts] = useState<FilterCounts>(DEFAULT);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", mode: "counts", search });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((json) => setCounts({ ...DEFAULT, ...json }))
      .catch(() => {});
  }, [search]);

  return counts;
}
