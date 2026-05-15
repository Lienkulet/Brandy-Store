import { useRef } from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import StarIcon from "@/components/icons/StarIcon";
import CloseIcon from "@/components/icons/CloseIcon";

type Props = {
  images:           string[];
  isFirstColor:     boolean;
  dragging:         boolean;
  onDragOver:       (e: React.DragEvent) => void;
  onDragLeave:      () => void;
  onDrop:           (e: React.DragEvent) => void;
  onFileChange:     (files: FileList) => void;
  onImageUrlChange: (imgIdx: number, value: string) => void;
  onImageRemove:    (imgIdx: number) => void;
};

export function ColorImageUploader({
  images, isFirstColor, dragging,
  onDragOver, onDragLeave, onDrop, onFileChange, onImageUrlChange, onImageRemove,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Images</p>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        className={`cursor-pointer flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-5 transition-colors duration-200 ${
          dragging
            ? "border-foreground/40 bg-foreground/5"
            : "border-foreground/12 hover:border-foreground/25 hover:bg-foreground/3"
        }`}
      >
        <span className="text-foreground/30"><UploadIcon /></span>
        <p className="text-[10px] font-semibold text-foreground/35">Drop or click to upload</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFileChange(e.target.files)}
      />

      {images.some((u) => u.trim()) && (
        <ul className="space-y-1.5">
          {images.map((url, ii) => (
            <li key={ii} className="flex items-center gap-2">
              <span className={`shrink-0 w-3 ${ii === 0 && isFirstColor ? "text-amber-400" : "text-transparent"}`}>
                <StarIcon />
              </span>
              <div className="h-9 w-7 shrink-0 overflow-hidden rounded-lg bg-[#f7f4f0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {url.trim() && <img src={url} alt="" className="h-full w-full object-cover" />}
              </div>
              <input
                className="input-field flex-1 font-mono text-[10px]"
                value={url}
                onChange={(e) => onImageUrlChange(ii, e.target.value)}
                placeholder="or paste a URL…"
              />
              <button
                type="button"
                onClick={() => onImageRemove(ii)}
                className="cursor-pointer shrink-0 text-foreground/25 transition-colors hover:text-red-400"
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isFirstColor && (
        <p className="text-[9px] text-muted">First image of the first colour is used as the product card thumbnail.</p>
      )}
    </div>
  );
}
