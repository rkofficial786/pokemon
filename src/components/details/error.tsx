import React from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title,
  message, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="max-w-md mx-auto bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-red-400 mb-2">
        {title}
      </h2>
      <p className="text-gray-300 mb-4">{message}</p>
      <button
        onClick={onButtonClick}
        className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};