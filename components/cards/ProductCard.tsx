import Image from "next/image";

type ProductPrice = {
  original: string;
  current: string;
};

type ProductCardProps = {
  name: string;
  description: string;
  image: string;
  price: ProductPrice | null;
};

function ProductCard({ name, description, image, price }: ProductCardProps) {
  return (
    <article className="soft-card overflow-hidden rounded-[24px] p-4 sm:p-5">
      <div className="overflow-hidden rounded-[18px] bg-[#f7f4f0]">
        <Image
          src={image}
          alt={name}
          width={214}
          height={260}
          className="h-[260px] w-full object-cover"
        />
      </div>

      <div className="px-1 pb-1 pt-5">
        <h2 className="font-serif text-[1.35rem] font-semibold leading-tight text-foreground">
          {name}
        </h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
        {price ? (
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-foreground sm:text-base">
            <span className="text-foreground/55 line-through">
              {price.original}
            </span>
            <span>{price.current}</span>
          </p>
        ) : (
          <div className="mt-4 h-6" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}

export default ProductCard;
