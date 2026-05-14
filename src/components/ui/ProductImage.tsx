"use client";

import { useState } from "react";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function ProductImage({
  src,
  alt,
  className = "",
  imageClassName = "h-full w-full object-cover",
}: ProductImageProps) {
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failedSrc, setFailedSrc] = useState("");
  const usableSrc = src?.trim() ?? "";
  const isLoaded = usableSrc !== "" && loadedSrc === usableSrc;
  const showFallback = usableSrc === "" || failedSrc === usableSrc;

  return (
    <div className={`relative overflow-hidden bg-[#f7f4f0] ${className}`}>
      {!isLoaded && !showFallback && (
        <div className="product-image-skeleton absolute inset-0" aria-hidden="true" />
      )}

      {showFallback ? (
        <div className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 px-4 text-center text-foreground/30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
            Image unavailable
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={usableSrc}
          alt={alt}
          className={`${imageClassName} transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          }`}
          onLoad={() => setLoadedSrc(usableSrc)}
          onError={() => setFailedSrc(usableSrc)}
        />
      )}
    </div>
  );
}
