// app/page.tsx

import CatchyFeature from "@/components/home/catchy-feature";
import Hero from "@/components/home/hero";
import PokemonGrid from "@/components/home/pokemon-grid";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Hero />
      
      <CatchyFeature />
      <PokemonGrid />
    </main>
  );
}
