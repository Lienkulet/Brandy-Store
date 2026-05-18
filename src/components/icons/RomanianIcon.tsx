const RomanianIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 44"
    width={size}
    height={Math.round(size * 44 / 64)}
    aria-label="Romanian"
  >
    <path fill="#2b3990" d="M10 0C3.373 0 0 4.925 0 11v22c0 6.075 3.373 11 10 11h12V0z" />
    <path fill="#f9cb38" d="M22 0h20v44H22z" />
    <path fill="#ec1c24" d="M54 0H42v44h12c6.627 0 10-4.925 10-11V11C64 4.925 60.627 0 54 0z" />
  </svg>
);

export default RomanianIcon;
