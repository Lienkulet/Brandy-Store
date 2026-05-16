import { useRef, useState } from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import StarIcon from "@/components/icons/StarIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";

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
  onImageReorder:   (from: number, to: number) => void;
  onAddUrl:         (url: string) => void;
};

export function ColorImageUploader({
  images, isFirstColor, dragging,
  onDragOver, onDragLeave, onDrop, onFileChange,
  onImageUrlChange, onImageRemove, onImageReorder, onAddUrl,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput]   = useState("");
  const [dragSrc,  setDragSrc]    = useState<number | null>(null);
  const [dragOver, setDragOver]   = useState<number | null>(null);

  const realImages = images.filter((u) => u.trim());

  function commitUrl() {
    const url = urlInput.trim();
    if (url) { onAddUrl(url); setUrlInput(""); }
  }

  function handleRowDragStart(e: React.DragEvent, ii: number) {
    setDragSrc(ii);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleRowDragOver(e: React.DragEvent, ii: number) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (ii !== dragSrc) setDragOver(ii);
  }

  function handleRowDrop(e: React.DragEvent, ii: number) {
    e.preventDefault();
    e.stopPropagation();
    if (dragSrc !== null && dragSrc !== ii) onImageReorder(dragSrc, ii);
    setDragSrc(null);
    setDragOver(null);
  }

  function handleRowDragEnd() {
    setDragSrc(null);
    setDragOver(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Images</p>

      {/* File drop zone */}
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

      {/* Uploaded / real images — draggable for reordering */}
      {realImages.length > 0 && (
        <ul className="space-y-1.5">
          {realImages.map((url, ii) => (
            <li
              key={url + ii}
              draggable
              onDragStart={(e) => handleRowDragStart(e, ii)}
              onDragOver={(e) => handleRowDragOver(e, ii)}
              onDrop={(e) => handleRowDrop(e, ii)}
              onDragEnd={handleRowDragEnd}
              className={`flex items-center gap-2 rounded-lg transition-colors duration-150 ${
                dragOver === ii && dragSrc !== ii
                  ? "bg-foreground/6 ring-1 ring-foreground/15"
                  : dragSrc === ii
                  ? "opacity-40"
                  : ""
              }`}
            >
              {/* Drag handle */}
              <span className="shrink-0 cursor-grab text-foreground/25 active:cursor-grabbing">
                <DragHandleIcon />
              </span>

              {/* Star badge — first image of first colour is the product thumbnail */}
              <span className={`shrink-0 w-3 ${ii === 0 && isFirstColor ? "text-amber-400" : "text-transparent"}`}>
                <StarIcon />
              </span>

              <div className="h-9 w-7 shrink-0 overflow-hidden rounded-lg bg-[#f7f4f0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>

              <input
                className="input-field flex-1 font-mono text-[10px]"
                value={url}
                onChange={(e) => onImageUrlChange(ii, e.target.value)}
                placeholder="image URL"
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

      {/* Add by URL */}
      <input
        className="input-field w-full font-mono text-[10px]"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onBlur={commitUrl}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitUrl(); } }}
        placeholder="or paste a URL and press Enter…"
      />

      {isFirstColor && (
        <p className="text-[9px] text-muted">First image of the first colour is used as the product card thumbnail.</p>
      )}
    </div>
  );
}
