"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection";
import Link from "next/link";

const Hero = () => {
  const [isVisible, ref] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="relative h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900" />

      <div className="absolute bottom-0 right-0 opacity-20">
        <img
          src="/images/pokemon.png"
          alt="Pokemon silhouettes"
          width={600}
          height={400}
        />
      </div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div
          ref={ref}
          className={`max-w-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500">
            Pokémon Explorer
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover and explore the vast world of Pokémon with our interactive
            Pokédex. Search, filter, and learn about all your favorite Pokémon.
          </p>
          <div className="flex gap-4">
            <Link href={"#explore"}>
              <button className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
                Explore Now
              </button>
            </Link>

            <Link href={"#featured"}>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors border border-gray-700">
                Featured Pokémon
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
