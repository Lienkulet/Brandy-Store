import Image from "next/image";
import Link from "next/link";
import Container from "./layout/Container";
import BlackBtn from "./ui/BlackBtn";

function Season() {
  return (
    <Container className="mt-16">
      <section className="soft-card overflow-hidden rounded-[28px]">
        <Image
          src="/assets/banner.png"
          alt="Couple wearing new season arrivals outdoors"
          width={1913}
          height={560}
          className="h-55 w-full object-cover sm:h-70 lg:h-85"
        />

        <div className="px-6 py-6 text-center sm:px-8 sm:py-8">
          <h2 className="font-serif text-3xl font-semibold uppercase tracking-[0.05em] text-foreground sm:text-4xl">
            The New Season Edit
          </h2>
          <p className="mx-auto mt-3 max-w-170 text-sm text-muted sm:text-base">
            Fresh knits and quarter zips, tailored comfort for every room you
            walk into.
          </p>
          <BlackBtn href="#" name="Shop New Arrivals" className="mt-6" />
        </div>
      </section>
    </Container>
  );
}

export default Season;
