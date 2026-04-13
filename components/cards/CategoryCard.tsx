import Image from "next/image";
import Link from "next/link";
import GreyBtn from "../ui/GreyBtn";

type CategoryCardProps = {
  title: string;
  cta: string;
  image: string;
  href?: string;
};

function CategoryCard({ title, cta, image, href }: CategoryCardProps) {
  return (
    <Link href={href || '/#'} className="group relative overflow-hidden hover:shadow-lg rounded-3xl cursor-pointer">
      <Image
        src={image}
        alt={title}
        width={236}
        height={210}
        className="h-57.5 w-full object-cover transition-transform duration-300 sm:h-62.5 lg:h-72.5"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/5 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 p-4 sm:p-5">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
          {title}
        </span>
        <GreyBtn name={cta} />
      </div>
    </Link>
  );
}

export default CategoryCard;
