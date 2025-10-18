
import React, { useState } from 'react';
import { generateImageWithGemini } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import AnimateOnScroll from './AnimateOnScroll';
import LazyImage from './LazyImage';

type PhoneModel = 'iPhone 15 Pro' | 'Galaxy S24' | 'Pixel 8 Pro' | 'Generic';
const phoneModels: PhoneModel[] = ['iPhone 15 Pro', 'Galaxy S24', 'Pixel 8 Pro', 'Generic'];

const AiDesigner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<PhoneModel>('iPhone 15 Pro');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design idea.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImageWithGemini(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const PhoneFrame: React.FC<{ model: PhoneModel; children: React.ReactNode }> = ({ model, children }) => {
    // Base classes for the phone's outer chassis
    let frameClasses = "relative w-44 h-88 sm:w-48 sm:h-96 bg-gray-800 dark:bg-gray-900 shadow-2xl transition-all duration-300 flex items-center justify-center p-1.5";
    let screenClasses = "relative w-full h-full bg-black overflow-hidden flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]";
    let cameraCutout = null;
    let sideButtons = null;

    switch (model) {
      case 'iPhone 15 Pro':
        frameClasses += " rounded-[3.5rem] border-2 border-gray-600 dark:border-gray-700";
        screenClasses += " rounded-[3.2rem]";
        // Dynamic Island
        cameraCutout = <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>;
        sideButtons = (
          <>
            {/* Volume Rocker */}
            <div className="absolute -left-1 top-24 w-1 h-6 bg-gray-700 dark:bg-gray-800 rounded-l-sm"></div>
            <div className="absolute -left-1 top-32 w-1 h-6 bg-gray-700 dark:bg-gray-800 rounded-l-sm"></div>
            {/* Power Button */}
            <div className="absolute -right-1 top-28 w-1 h-12 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
          </>
        );
        break;
      case 'Galaxy S24':
        frameClasses += " rounded-[2.8rem] border-2 border-gray-500 dark:border-gray-600";
        screenClasses += " rounded-[2.5rem]";
        // Centered hole-punch camera
        cameraCutout = <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 border-2 border-gray-800"></div>;
        sideButtons = (
            <>
              {/* Volume Rocker */}
              <div className="absolute -left-1 top-24 w-1 h-12 bg-gray-600 dark:bg-gray-700 rounded-l-sm"></div>
              {/* Power Button */}
              <div className="absolute -right-1 top-28 w-1 h-10 bg-gray-600 dark:bg-gray-700 rounded-r-sm"></div>
            </>
          );
        break;
      case 'Pixel 8 Pro':
        frameClasses += " rounded-[2.5rem] border-2 border-gray-600 dark:border-gray-700";
        screenClasses += " rounded-[2.2rem]";
        // Centered hole-punch camera
        cameraCutout = <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 border-2 border-gray-800"></div>;
        sideButtons = (
            <>
              {/* Volume Rocker */}
              <div className="absolute -right-1 top-32 w-1 h-12 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
              {/* Power Button */}
              <div className="absolute -right-1 top-20 w-1 h-8 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
            </>
          );
        break;
      default: // Generic
        frameClasses += " rounded-[2.5rem] border-4 border-gray-500";
        screenClasses += " rounded-[2rem]";
        cameraCutout = <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-lg z-20"></div>;
        break;
    }
    
    return (
      <div className={frameClasses}>
        {sideButtons}
        <div className={screenClasses}>
            {cameraCutout}
            {/* The actual design image goes here */}
            <div className="absolute inset-0 z-10">
                {children}
            </div>
        </div>
      </div>
    );
  };

  return (
    <section id="ai-designer" className="py-24 bg-[--color-bg]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
          <h2 className="text-4xl font-bold text-center mb-4 text-[--color-text] tracking-tight">Design with AI</h2>
          <p className="text-center text-[--color-text-muted] mb-12 max-w-2xl mx-auto">
            Unleash your creativity! Describe any design you can imagine, and our AI will bring it to life on a phone case.
          </p>

          <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
            {/* Controls */}
            <div className="w-full lg:w-1/2">
              <div className="bg-[--color-bg] p-8 rounded-xl shadow-[var(--shadow-elevation-medium)] border border-[--color-border]">
                <label htmlFor="ai-prompt" className="block text-lg font-semibold mb-2 text-[--color-text]">
                  What's your vision?
                </label>
                <textarea
                  id="ai-prompt"
                  rows={3}
                  className="w-full p-3 border border-[--color-border] rounded-lg bg-[--color-bg-subtle] focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition"
                  placeholder="e.g., A majestic lion wearing sunglasses in a synthwave style"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <div className="mt-6">
                    <label className="block text-lg font-semibold mb-3 text-[--color-text]">
                        Preview on:
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {phoneModels.map(model => (
                            <button
                                key={model}
                                onClick={() => setSelectedModel(model)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                                    selectedModel === model
                                    ? 'bg-[--color-primary] text-white shadow'
                                    : 'bg-[--color-bg-subtle] dark:bg-gray-700 text-[--color-text-muted] hover:bg-teal-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                {model}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-[--color-primary] to-teal-400 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-lg"
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
                      <SparklesIcon />
                      Generate My Design
                    </>
                  )}
                </button>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
              </div>
            </div>

            {/* Preview */}
            <div className="w-full lg:w-1/3 flex justify-center items-center">
                <PhoneFrame model={selectedModel}>
                  {isLoading && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700/50">
                          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[--color-primary]"></div>
                      </div>
                  )}
                  {generatedImage && (
                      <LazyImage src={generatedImage} alt="AI generated phone case" className="w-full h-full object-cover" />
                  )}
                  {!generatedImage && !isLoading && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gray-900">
                          <SparklesIcon className="w-12 h-12 text-gray-500 mb-2"/>
                          <p className="text-gray-400 text-sm">Your design will appear here</p>
                      </div>
                  )}
                </PhoneFrame>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default AiDesigner;
