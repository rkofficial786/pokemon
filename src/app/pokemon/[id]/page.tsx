// app/pokemon/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getPokemonById } from "@/lib/features/pokemon";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { ErrorMessage } from "@/components/details/error";
import { PokemonNotFound } from "@/components/details/not-found";
import { typeToColor } from "@/app/constants/colors";
import DetailTabs from "@/components/details/tabs";
import PokemonDetailHeader from "@/components/details/header";

const PokemonDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedPokemon, isLoading, error } = useAppSelector(
    (state) => state.pokemon
  );
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (id) {
      dispatch(getPokemonById(id));
    }
  }, [dispatch, id]);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton variant="detail" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage
          title="Error Loading Pokémon"
          message={error.toString()}
          buttonText="Go Back"
          onButtonClick={handleBack}
        />
      </div>
    );
  }

  if (!selectedPokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PokemonNotFound onBack={handleBack} />
      </div>
    );
  }

  // Get primary type and its color
  const mainType = selectedPokemon.types[0]?.type?.name || "normal";
  const typeColor = typeToColor[mainType] || typeToColor.normal;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Pokédex
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <PokemonDetailHeader
            pokemon={selectedPokemon}
            typeColor={typeColor}
          />

          {/* Tabs Section */}
          <DetailTabs
            pokemon={selectedPokemon}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            typeColor={typeColor}
          />
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
