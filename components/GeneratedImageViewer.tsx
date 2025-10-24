
import React from 'react';
import { ImageIcon } from './icons/Icons';

interface GeneratedImageViewerProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ imageUrl, isLoading, error }) => {
  return (
    <div className="w-full h-64 sm:h-80 flex-grow bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
      {isLoading ? (
        <div className="flex flex-col items-center text-gray-400">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold text-lg">Conjuring your adventure...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 p-4">
          <p className="font-bold">Generation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Generated adventure" className="w-full h-full object-contain" />
      ) : (
        <div className="text-center text-gray-500">
          <ImageIcon />
          <p className="mt-2 font-semibold">Your adventure awaits...</p>
          <p className="text-sm">The generated image will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedImageViewer;
