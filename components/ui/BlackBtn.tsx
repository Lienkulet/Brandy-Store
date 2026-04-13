import Link from "next/link";

type BlackBtnProps = {
  name: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  href?: string;
};

function BlackBtn({
  name,
  type = "button",
  className = "",
  href,
}: BlackBtnProps) {
  const styles =
    `group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-[#171717] bg-[#171717] px-6 text-sm font-semibold !text-white transition-[border-color,box-shadow] duration-300 ease-out hover:border-[#171717] ${className}`.trim();

  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-300 delay-180 ease-out group-hover:!text-black">
        {name}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={styles}>
      {content}
    </button>
  );
}

export default BlackBtn;
