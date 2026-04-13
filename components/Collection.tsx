import ProductCard from "./cards/ProductCard";

const collectionItems = [
  {
    name: "Leather Penny Loafers",
    description: "Built for every setting",
    image: "/assets/product-loafers.png",
    price: null,
  },
  {
    name: "V-Neck Sleeveless Sweater Polo",
    description: "Built for every setting",
    image: "/assets/product-vest.png",
    price: { original: "KSh 4,000.00", current: "KSh 3,600.00" },
  },
  {
    name: "Crochet Polo Shirt",
    description: "Built for every setting",
    image: "/assets/product-shirt.png",
    price: { original: "KSh 3,500.00", current: "KSh 3,000.00" },
  },
] as const;

function Collection() {
  return (
    <section
      id="collection"
      className="mx-auto mt-14 flex w-full max-w-280 flex-col"
    >
      <div className="mb-8 text-center sm:mb-10">
        <p className="font-serif text-2xl font-semibold uppercase tracking-[0.24em] text-foreground sm:text-3xl">
          New Collection
        </p>
        <p className="mx-auto mt-3 max-w-170 text-sm text-muted sm:text-base">
          Our latest collection, where classic and contemporary styles converge
          in perfect harmony.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {collectionItems.map((item) => (
          <ProductCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}

export default Collection;
