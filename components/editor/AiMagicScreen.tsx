import React, { useState, useCallback } from 'react';
import { SparklesIcon, XMarkIcon, DownloadIcon, ImageIcon } from '../icons';
import { editImage } from '../../services/geminiService';
import { downloadEditedImage } from '../../utils/imageUtils';
import { Resolution, Adjustments, Filter } from '../../types';

interface AiMagicScreenProps {
  initialImage: string;
  onExit: () => void;
}

const RESOLUTIONS: Resolution[] = [
    { label: "Original", description: "Keep original size" },
    { label: "1080p FHD", description: "1920px", width: 1920 },
    { label: "720p HD", description: "1280px", width: 1280 },
];

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg text-white">Naquifying your image...</p>
    </div>
);

export const AiMagicScreen: React.FC<AiMagicScreenProps> = ({ initialImage, onExit }) => {
  const [originalImage] = useState<string>(initialImage);
  const [editedImage, setEditedImage] = useState<string>(initialImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const handleApplyPrompt = useCallback(async () => {
    if (!editedImage) {
      setError("An image must be loaded to apply AI effects.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a description of the edit you'd like to make.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);

    try {
      const base64Data = editedImage.split(',')[1];
      const mimeType = editedImage.substring(5, editedImage.indexOf(';'));
      const result = await editImage(base64Data, mimeType, prompt);
      setEditedImage(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to apply edit: ${errorMessage}`);
      console.error(e);
      setLastPrompt(null);
    } finally {
      setIsLoading(false);
    }
  }, [editedImage, prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyPrompt();
  };

  const handleDownload = (resolution: Resolution) => {
    const dummyAdjustments: Adjustments = { brightness: 100, contrast: 100, saturation: 100 };
    const dummyFilter: Filter | null = null;
    downloadEditedImage(editedImage, resolution, dummyAdjustments, dummyFilter, 0, lastPrompt);
    setIsDownloadMenuOpen(false);
  };

  const ImageCard: React.FC<{ isResult?: boolean }> = ({ isResult = false }) => {
    const effectiveSrc = isResult ? editedImage : originalImage;
    const title = isResult ? (lastPrompt || "Result") : "Original";

    return (
      <div className="w-full bg-black/20 rounded-2xl p-3 flex flex-col relative aspect-square shadow-lg">
        <h3 className={`font-semibold text-center mb-2 h-6 truncate ${isResult ? 'text-cyan-400 flex items-center justify-center gap-2' : 'text-gray-300'}`}>
          {isResult && <SparklesIcon className="w-5 h-5 flex-shrink-0" />}
          <span className="truncate" title={title}>{title}</span>
        </h3>
        <div className="flex-grow bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
          <img src={effectiveSrc} alt={title} className="object-contain w-full h-full" />
        </div>
        {isResult && (
          <div className="absolute bottom-3 right-3 z-10" onMouseLeave={() => setIsDownloadMenuOpen(false)}>
            <button 
              onMouseEnter={() => setIsDownloadMenuOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 btn-animated flex items-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Download
            </button>
            {isDownloadMenuOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl w-48 animate-pop-up-fast">
                {RESOLUTIONS.map(res => (
                   <button
                    key={res.label}
                    onClick={() => handleDownload(res)}
                    className="w-full text-left text-sm text-gray-200 px-4 py-2 hover:bg-white/10"
                   >
                     {res.label} <span className="text-xs text-gray-400">{res.description}</span>
                   </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-4">
      <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-30 p-4">
            <p className="text-white text-center font-semibold">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
          <ImageCard />
          <ImageCard isResult={true} />
        </div>
      </div>
       <div className="w-full max-w-3xl flex flex-col gap-2 bg-black/40 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border-t border-gray-700/50">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-cyan-400" /> AI Magic Tool</h3>
            <button onClick={onExit} className="p-1 text-gray-400 hover:text-white transition-colors">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder="Describe your edit... e.g., 'make the sky a galaxy'"
                className="w-full bg-black/20 text-white placeholder-gray-400 rounded-xl p-3 h-12 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                rows={1}
                 onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
            />
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="flex-shrink-0 flex items-center justify-center gap-2 btn-gradient text-white font-semibold p-3 rounded-xl h-12 w-28 btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ) : (
                <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate
                </>
                )}
            </button>
        </form>
      </div>
       <style>{`
        @keyframes pop-up-fast {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pop-up-fast {
          animation: pop-up-fast 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};