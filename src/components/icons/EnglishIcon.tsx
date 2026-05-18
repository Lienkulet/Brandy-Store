const EnglishIcon = ({ size = 24 }: { size?: number }) => {
  // Canton: 14.4 wide × 12.923 tall (covers 7 of 13 stripes)
  // 9 star rows: alternating 6 and 5 stars = 50 total
  const cantonW = 14.4;
  const cantonH = 12.923;
  const rowYs = Array.from({ length: 9 }, (_, i) => ((i + 0.5) * cantonH) / 9);
  const xSix  = Array.from({ length: 6 }, (_, i) => ((i + 0.5) * cantonW) / 6);
  const xFive = Array.from({ length: 5 }, (_, i) => ((i + 1) * cantonW) / 6);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 24"
      width={size}
      height={Math.round(size * 24 / 36)}
      aria-label="English (US)"
    >
      {/* Stripes — 7 red, 6 white */}
      <rect width="36" height="24" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((n) => (
        <rect key={n} y={(n * 24) / 13} width="36" height={24 / 13} fill="#fff" />
      ))}
      {/* Blue canton */}
      <rect width={cantonW} height={cantonH} fill="#3C3B6E" />
      {/* 50 stars */}
      {rowYs.map((y, row) => {
        const xs = row % 2 === 0 ? xSix : xFive;
        return xs.map((x, col) => (
          <circle key={`${row}-${col}`} cx={x} cy={y} r="0.5" fill="#fff" />
        ));
      })}
    </svg>
  );
};

export default EnglishIcon;
