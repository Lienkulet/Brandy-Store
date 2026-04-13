import Image from "next/image";
import GreyBtn from "./ui/GreyBtn";

function Hero() {
  return (
    <section className="soft-card relative overflow-hidden rounded-[28px]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,33,22,0.34)_0%,rgba(45,33,22,0.14)_33%,rgba(45,33,22,0.05)_62%,rgba(45,33,22,0.03)_100%)]" />
      <Image
        src="/assets/hero-bg.png"
        alt="Three models in neutral knitwear"
        width={1372}
        height={768}
        priority
        className="h-85 w-full object-cover object-bottom sm:h-105 lg:h-137.5"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-110 text-white">
          <p className="font-serif text-[2rem] font-semibold leading-[0.95] tracking-[0.02em] drop-shadow-[0_10px_25px_rgba(0,0,0,0.18)] sm:text-[3rem] lg:text-[4.1rem]">
            FOR THE GENTLEMAN IN EVERY ROOM.
          </p>
          <p className="mt-3 max-w-90 text-sm leading-6 text-white/88 sm:text-base">
            Timeless silhouettes and sweaters crafted for moments that matter.
          </p>
          <div className="mt-5">
            <GreyBtn name="Buy Now" href="#collection" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
