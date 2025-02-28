import Featured from "@/components/home/featured";
import Hero from "@/components/home/hero";
import PokemonExplorer from "@/components/home/pokemon-grid";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Hero />
      <Featured />
      <PokemonExplorer />
    </main>
  );
}
