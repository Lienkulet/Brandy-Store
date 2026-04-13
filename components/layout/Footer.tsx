import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const productLinks = [
  "Tshirt",
  "Jacket",
  "Shoes",
  "Pants",
  "Sunglasses",
  "Tuxedo",
];

const categoryLinks = ["Men", "Women", "Kids", "Gift", "New Arrival"];
const socialLinks = ["Instagram", "Facebook", "YouTube", "Twitter"];
const legalLinks = ["Terms & Conditions", "Privacy Policy", "Cookie Policy"];

function Footer() {
  return (
    <footer className="mt-20">
      <Container>
        <div className="grid gap-10 pb-10 pt-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-[320px]">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="BrandyStore"
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
              <span className="text-[1.75rem] font-semibold tracking-[-0.04em] text-[#152238]">
                BrandyStore
              </span>
            </div>

            <p className="mt-6 max-w-[290px] text-lg leading-8 text-muted">
              Get newsletter updates for upcoming products and best discounts.
            </p>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="h-12 rounded-full border border-black/12 bg-white px-5 text-sm text-foreground outline-none placeholder:text-muted/70"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Submit
              </button>
            </form>
          </div>

          <FooterColumn title="Product" items={productLinks} />
          <FooterColumn title="Categories" items={categoryLinks} />
          <FooterColumn title="Our Social Media" items={socialLinks} />
        </div>
      </Container>

      <div className="bg-[#171717] text-white">
        <Container className="flex flex-col gap-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 BrandyStore</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
            {legalLinks.map((item) => (
              <Link key={item} href="#" className="hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  items: string[];
};

function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-serif text-[1.55rem] font-semibold text-foreground">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-lg text-muted">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="transition-colors hover:text-foreground">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
