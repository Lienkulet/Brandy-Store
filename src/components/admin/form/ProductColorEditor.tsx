"use client";

import type { ProductFormColor } from "@/lib/product-form-model";
import { ColorSwatchPicker } from "@/components/admin/form/ColorSwatchPicker";
import { ColorImageUploader } from "@/components/admin/form/ColorImageUploader";
import { ColorSizePicker } from "@/components/admin/form/ColorSizePicker";

type Props = {
  color:        ProductFormColor;
  category:     string;
  isFirstColor: boolean;
  paletteOpen:  boolean;
  usedHexes:    string[];
  dragging:     boolean;
  onPaletteToggle:      () => void;
  onPickSwatch:         (hex: string, name: string) => void;
  onPickAccent:         (idx: number, hex: string, name: string) => void;
  onRemoveAccent:       (idx: number) => void;
  onDragOver:           (e: React.DragEvent) => void;
  onDragLeave:          () => void;
  onDrop:               (e: React.DragEvent) => void;
  onFileChange:         (files: FileList) => void;
  onImageUrlChange:     (imgIdx: number, value: string) => void;
  onImageRemove:        (imgIdx: number) => void;
  onImageReorder:       (from: number, to: number) => void;
  onAddUrl:             (url: string) => void;
  onToggleSize:         (label: string) => void;
  onSetAccessoryStock:  (inStock: boolean) => void;
  onApplyCategorySizes: () => void;
};

export function ProductColorEditor({
  color: c, category, isFirstColor, paletteOpen, usedHexes, dragging,
  onPaletteToggle, onPickSwatch, onPickAccent, onRemoveAccent, onDragOver, onDragLeave, onDrop,
  onFileChange, onImageUrlChange, onImageRemove, onImageReorder, onAddUrl,
  onToggleSize, onSetAccessoryStock, onApplyCategorySizes,
}: Props) {
  return (
    <div className="rounded-2xl border border-foreground/8 bg-foreground/1.5 p-4 space-y-5">
      <ColorSwatchPicker
        hex={c.hex}
        name={c.name}
        accents={c.accents ?? []}
        paletteOpen={paletteOpen}
        usedHexes={usedHexes}
        onToggle={onPaletteToggle}
        onPickSwatch={onPickSwatch}
        onPickAccent={onPickAccent}
        onRemoveAccent={onRemoveAccent}
      />
      <ColorImageUploader
        images={c.images}
        isFirstColor={isFirstColor}
        dragging={dragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileChange={onFileChange}
        onImageUrlChange={onImageUrlChange}
        onImageRemove={onImageRemove}
        onImageReorder={onImageReorder}
        onAddUrl={onAddUrl}
      />
      <ColorSizePicker
        color={c}
        isAccessory={category === "accessories"}
        onToggleSize={onToggleSize}
        onSetAccessoryStock={onSetAccessoryStock}
        onApplyCategorySizes={onApplyCategorySizes}
      />
    </div>
  );
}
