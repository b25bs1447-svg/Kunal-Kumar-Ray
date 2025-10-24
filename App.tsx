
import React, { useState, useCallback } from 'react';
import { generateAdventureImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import ImageUploader from './components/ImageUploader';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import { GenerateIcon, SparklesIcon } from './components/icons/Icons';

function App() {
  const [prompt, setPrompt] = useState<string>('A mystical forest with glowing mushrooms and ancient ruins.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setGeneratedImage(null);
      setError(null);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!selectedFile || !prompt) {
      setError("Please select an image and enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imagePart = await fileToGenerativePart(selectedFile);
      const result = await generateAdventureImage(prompt, imagePart);
      if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
      } else {
        throw new Error("The model did not return an image. Please try a different prompt or image.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, prompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 flex items-center justify-center gap-3">
            <SparklesIcon />
            Adventure Image Converter
          </h1>
          <p className="mt-2 text-lg text-gray-400">Transform your photos into epic scenes.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-teal-400 border-b-2 border-teal-500/30 pb-2">1. Upload Your Image</h2>
            <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreview} />

            <h2 className="text-2xl font-semibold text-teal-400 border-b-2 border-teal-500/30 pb-2">2. Describe the Adventure</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A fantasy landscape with dragons..."
              className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
            />
            
            <button
              onClick={handleGenerateClick}
              disabled={!selectedFile || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <GenerateIcon />
                  Generate Adventure Image
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col">
             <h2 className="text-2xl font-semibold text-blue-400 border-b-2 border-blue-500/30 pb-2 mb-6">3. Your Generated Image</h2>
            <GeneratedImageViewer imageUrl={generatedImage} isLoading={isLoading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
