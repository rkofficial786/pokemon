// components/ui/search-notification.tsx
import React from 'react';
import { XMarkIcon } from "@heroicons/react/24/solid";

interface SearchNotificationProps {
  searchTerm: string;
  onClear: () => void;
}

export default function SearchNotification({ searchTerm, onClear }: SearchNotificationProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex justify-between items-center">
      <p className="text-gray-300">
        Showing results for "<span className="text-white font-semibold">{searchTerm}</span>"
      </p>
      <button
        onClick={onClear}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}