import React, { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term: string) => void;
  isSearching: boolean;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  isSearching,
}: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="w-full md:w-auto flex-grow md:flex-grow-0">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-grow md:flex-grow-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter Pokemon's full name"
            className="w-full bg-gray-800 border border-gray-700 rounded-l-lg py-2 pl-10 pr-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors disabled:bg-red-800 disabled:opacity-70"
          disabled={isSearching || !value.trim()}
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Search"
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
