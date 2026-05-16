export default function DragHandleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <circle cx="4.5" cy="3"  r="1.1" />
      <circle cx="9.5" cy="3"  r="1.1" />
      <circle cx="4.5" cy="7"  r="1.1" />
      <circle cx="9.5" cy="7"  r="1.1" />
      <circle cx="4.5" cy="11" r="1.1" />
      <circle cx="9.5" cy="11" r="1.1" />
    </svg>
  );
}
