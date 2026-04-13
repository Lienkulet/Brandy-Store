import Link from "next/link";

type BlackBtnProps = {
  name: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  href?: string;
};

function BlackBtn({ name, type = "button", className = "", href }: BlackBtnProps) {
  const styles =
    `group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-foreground bg-foreground px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-[border-color] duration-300 hover:border-foreground ${className}`.trim();

  const content = (
    <>
      {/* Warm cream fill bleeds in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#f0ead8] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10 tracking-[0.18em] text-white transition-colors duration-300 delay-75 group-hover:text-foreground">{name}</span>
    </>
  );

  if (href) {
    return <Link href={href} className={styles}>{content}</Link>;
  }

  return <button type={type} className={styles}>{content}</button>;
}

export default BlackBtn;
