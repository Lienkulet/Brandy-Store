"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

export type QuickAddStep = "idle" | "sizes" | "added";

type QuickAddData = {
  productId: string;
  slug:      string;
  colorName: string;
  price:     string;
};

type UseQuickAddOptions = {
  name:     string;
  brand?:   string;
  image:    string;
  quickAdd: QuickAddData;
  sizeFree: boolean;
  inStockSizes: { label: string; inStock: boolean }[];
};

export function useQuickAdd({
  name,
  brand,
  image,
  quickAdd,
  sizeFree,
  inStockSizes,
}: UseQuickAddOptions) {
  const [step, setStep] = useState<QuickAddStep>("idle");
  const [recentlyAddedSize, setRecentlyAddedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sizeConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (sizeConfirmTimer.current) clearTimeout(sizeConfirmTimer.current);
    };
  }, []);

  function addAndConfirm(sizeLabel: string, keepSizesOpen = false) {
    addItem({
      id:        `${quickAdd.productId}-${quickAdd.colorName}-${sizeLabel}`,
      productId: quickAdd.productId,
      slug:      quickAdd.slug,
      name,
      brand:     brand ?? "",
      size:      sizeLabel,
      color:     quickAdd.colorName,
      price:     quickAdd.price,
      image,
    });

    if (keepSizesOpen) {
      setStep("sizes");
      setRecentlyAddedSize(sizeLabel);
      if (sizeConfirmTimer.current) clearTimeout(sizeConfirmTimer.current);
      sizeConfirmTimer.current = setTimeout(() => setRecentlyAddedSize(null), 950);
      return;
    }

    setStep("added");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStep("idle"), 1800);
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (sizeFree) {
      addAndConfirm("One Size");
    } else if (inStockSizes.length === 1) {
      addAndConfirm(inStockSizes[0].label);
    } else {
      setStep("sizes");
    }
  }

  function handleSizeClick(e: React.MouseEvent, sizeLabel: string) {
    e.preventDefault();
    e.stopPropagation();
    addAndConfirm(sizeLabel, true);
  }

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setStep("idle");
  }

  return { step, recentlyAddedSize, handleQuickAdd, handleSizeClick, handleDismiss };
}
