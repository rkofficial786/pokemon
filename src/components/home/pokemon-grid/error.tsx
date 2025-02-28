// components/ui/error-message.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function ErrorMessage({ 
  message, 
  buttonText, 
  onButtonClick 
}: ErrorMessageProps) {
  return (
    <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
      <p className="text-red-400">{message}</p>
      <button
        onClick={onButtonClick}
        className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}