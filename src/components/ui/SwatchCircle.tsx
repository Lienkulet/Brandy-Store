type Props = {
  hex:       string;
  accents?:  string[];
  size?:     number;
  className?: string;
};

export function SwatchCircle({ hex, accents = [], size = 28, className = "" }: Props) {
  const all = [hex, ...accents].slice(0, 3);

  let background: string;
  if (all.length === 1) {
    background = all[0];
  } else if (all.length === 2) {
    background = `conic-gradient(${all[0]} 0deg 180deg, ${all[1]} 180deg 360deg)`;
  } else {
    background = `conic-gradient(${all[0]} 0deg 120deg, ${all[1]} 120deg 240deg, ${all[2]} 240deg 360deg)`;
  }

  return (
    <span
      className={`block shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size, background }}
    />
  );
}
