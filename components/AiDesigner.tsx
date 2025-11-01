

import React, { useState } from 'react';
import { generateImageWithGemini } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import AnimateOnScroll from './AnimateOnScroll';
import LazyImage from './LazyImage';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

type PhoneModel = 'iPhone 15 Pro' | 'Galaxy S24' | 'Pixel 8 Pro';
const phoneModels: PhoneModel[] = ['iPhone 15 Pro', 'Galaxy S24', 'Pixel 8 Pro'];

const sampleDesigns = [
  {
    prompt: "A majestic lion wearing sunglasses in a synthwave style",
    imageUrl: "https://images.unsplash.com/photo-1627843563937-2965cb2a15d0?q=80&w=800&auto=format&fit=crop"
  },
  {
    prompt: "Bioluminescent mushrooms in a magical forest at night, glowing neon blue and purple",
    imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=800&auto=format&fit=crop"
  },
  {
    prompt: "A golden retriever wearing a tiny crown, painted in a watercolor style",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
  },
  {
    prompt: "Sleek, minimalist wave pattern in black and white",
    imageUrl: "https://images.unsplash.com/photo-1599238388149-51a4a5892520?q=80&w=800&auto=format&fit=crop"
  }
];

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
  
  const handleSampleClick = (sample: typeof sampleDesigns[0]) => {
    setPrompt(sample.prompt);
    setGeneratedImage(sample.imageUrl);
    setError(null);
    setIsLoading(false);
  };

  const PhoneFrame: React.FC<{ model: PhoneModel; children: React.ReactNode }> = ({ model, children }) => {
    let frameClasses = "relative w-[280px] h-[570px] bg-gray-800 dark:bg-gray-900 shadow-2xl transition-all duration-300 flex items-center justify-center p-2.5";
    let screenClasses = "relative w-full h-full bg-black overflow-hidden flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]";
    let cameraCutout = null;
    let sideButtons = null;

    switch (model) {
      case 'iPhone 15 Pro':
        frameClasses += " rounded-[44px] border-2 border-gray-600 dark:border-gray-700";
        screenClasses += " rounded-[36px]";
        cameraCutout = <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>;
        sideButtons = (
          <>
            <div className="absolute -left-1 top-28 w-1 h-8 bg-gray-700 dark:bg-gray-800 rounded-l-sm"></div>
            <div className="absolute -left-1 top-40 w-1 h-14 bg-gray-700 dark:bg-gray-800 rounded-l-sm"></div>
            <div className="absolute -right-1 top-36 w-1 h-20 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
          </>
        );
        break;
      case 'Galaxy S24':
        frameClasses += " rounded-[38px] border-2 border-gray-500 dark:border-gray-600";
        screenClasses += " rounded-[32px]";
        cameraCutout = <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 border-2 border-gray-800"></div>;
        sideButtons = (
            <>
              <div className="absolute -left-1 top-28 w-1 h-16 bg-gray-600 dark:bg-gray-700 rounded-l-sm"></div>
              <div className="absolute -right-1 top-36 w-1 h-12 bg-gray-600 dark:bg-gray-700 rounded-r-sm"></div>
            </>
          );
        break;
      case 'Pixel 8 Pro':
        frameClasses += " rounded-[36px] border-2 border-gray-600 dark:border-gray-700";
        screenClasses += " rounded-[28px]";
        cameraCutout = <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 border-2 border-gray-800"></div>;
        sideButtons = (
            <>
              <div className="absolute -right-1 top-40 w-1 h-16 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
              <div className="absolute -right-1 top-28 w-1 h-10 bg-gray-700 dark:bg-gray-800 rounded-r-sm"></div>
            </>
          );
        break;
    }
    
    return (
      <div className="scale-75 sm:scale-90 lg:scale-100">
        <div className={frameClasses}>
          {sideButtons}
          <div className={screenClasses}>
              {cameraCutout}
              <div className="absolute inset-0 z-10">
                  {children}
              </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="ai-designer" className="py-24 bg-[--color-bg-primary]">
      <div className="container mx-auto px-6">
        <AnimateOnScroll className="fade-in-up">
          <h2 className="text-4xl font-bold text-center mb-4 text-[--color-text-primary] tracking-tight">Design with AI</h2>
          <p className="text-center text-[--color-text-secondary] mb-12 max-w-2xl mx-auto">
            Unleash your creativity! Describe any design you can imagine, and our AI will bring it to life on a phone case.
          </p>

          <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
            {/* Controls */}
            <div className="w-full lg:w-1/2 xl:w-5/12">
              <div className="bg-[--color-bg-primary] p-8 rounded-2xl shadow-[var(--shadow-elevation-medium)] border border-[--color-border]">
                <label htmlFor="ai-prompt" className="block text-lg font-semibold mb-2 text-[--color-text-primary]">
                  1. Describe Your Vision
                </label>
                <textarea
                  id="ai-prompt"
                  rows={4}
                  className="input-style"
                  placeholder="e.g., A majestic lion wearing sunglasses in a synthwave style"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  aria-label="Enter your design idea for AI generation"
                />
                 <div className="mt-4">
                  <p className="text-sm font-semibold text-[--color-text-secondary] mb-2">Not sure? Try a sample:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sampleDesigns.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleClick(sample)}
                        className="rounded-lg overflow-hidden border-2 border-transparent hover:border-[--color-primary] focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary] transition aspect-square"
                        title={sample.prompt}
                        aria-label={`Select sample design: ${sample.prompt}`}
                      >
                        <LazyImage src={sample.imageUrl} alt={sample.prompt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                    <label className="block text-lg font-semibold mb-3 text-[--color-text-primary]">
                        2. Choose a Phone Model
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {phoneModels.map(model => (
                            <button
                                key={model}
                                onClick={() => setSelectedModel(model)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                                    selectedModel === model
                                    ? 'bg-[--color-primary] text-[--color-primary-text] shadow'
                                    : 'bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:bg-gray-200 dark:hover:bg-[--color-bg-tertiary]'
                                }`}
                                aria-label={`Preview on ${model}`}
                            >
                                {model}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="mt-8 w-full flex items-center justify-center bg-gradient-to-r from-[--color-primary] to-teal-500 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-elevation-medium)] hover:shadow-lg text-lg"
                  aria-label="Generate design with AI"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
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
            <div className="w-full lg:w-1/2 xl:w-1/3 flex justify-center items-center">
                <PhoneFrame model={selectedModel}>
                  {isLoading && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700/50">
                          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[--color-primary] border-t-transparent"></div>
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