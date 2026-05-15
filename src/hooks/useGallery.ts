"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

export type SliderImage = { src: string; colorIdx: number; imgIdx: number };

export function useGallery(product: Product) {
  const [colorIdx, setColorIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // Flat list of all images across all colours, in fixed order
  const sliderImages: SliderImage[] = product.colors.flatMap((c, ci) =>
    c.images.filter(Boolean).map((src, i) => ({ src, colorIdx: ci, imgIdx: i }))
  );

  const activeFlatIdx = sliderImages.findIndex(
    (s) => s.colorIdx === colorIdx && s.imgIdx === imageIdx
  );

  function navigateLightbox(dir: 1 | -1) {
    const next = sliderImages[(activeFlatIdx + dir + sliderImages.length) % sliderImages.length];
    setColorIdx(next.colorIdx);
    setImageIdx(next.imgIdx);
  }

  function handleColorChange(idx: number) {
    setColorIdx(idx);
    setImageIdx(0);
  }

  function selectImage(ci: number, ii: number) {
    setColorIdx(ci);
    setImageIdx(ii);
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")      { setLightbox(false); return; }
      if (e.key === "ArrowLeft")   navigateLightbox(-1);
      if (e.key === "ArrowRight")  navigateLightbox(1);
    }
    if (lightbox) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, activeFlatIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeFlatIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, [activeFlatIdx]);

  return {
    colorIdx,
    imageIdx,
    lightbox,
    sliderImages,
    activeFlatIdx,
    stripRef,
    setLightbox,
    navigateLightbox,
    handleColorChange,
    selectImage,
  };
}
