import React, { useState } from 'react';
import { ImageIcon, SparklesIcon, DownloadIcon } from './icons';
// FIX: The 'Resolution' type was being imported from 'EditorScreen.tsx', which does not export it. This has been corrected to import 'Resolution' directly from its source file, 'types.ts'.
import { Adjustments, Resolution } from '../types';

interface ImageDisplayProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
  lastPrompt?: string | null;
  onDownload: (resolution: Resolution) => void;
  // New props for live preview
  adjustments: Adjustments;
  filterClassName: string;
  rotation: number;
  // FIX: Added 'resolutions' prop to the interface to match its usage in the component.
  resolutions: Resolution[];
}

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-lg text-white">Naquifying your image...</p>
    <p className="text-sm text-gray-300">This may take a moment.</p>
  </div>
);

const ImagePlaceholder: React.FC = () => (
  <div className="w-full max-w-md h-80 flex flex-col items-center justify-center bg-black/20 border-2 border-dashed border-gray-500/50 rounded-2xl text-gray-400">
    <ImageIcon className="w-20 h-20 mb-4" />
    <h3 className="text-xl font-semibold text-gray-300">Image Preview</h3>
    <p className="text-center">Upload a photo to get started.</p>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  originalImage, 
  editedImage, 
  isLoading, 
  error, 
  lastPrompt, 
  onDownload,
  adjustments,
  filterClassName,
  rotation,
  resolutions
}) => {
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const handleDownloadClick = (resolution: Resolution) => {
    onDownload(resolution);
    setIsDownloadMenuOpen(false);
  };

  const ImageCard: React.FC<{ isResult?: boolean }> = ({ isResult = false }) => {
    const effectiveSrc = isResult ? (editedImage || originalImage) : originalImage;
    const title = isResult ? (lastPrompt || "Result") : "Original";

    const imageStyle: React.CSSProperties = isResult ? {
      transform: `rotate(${rotation}deg)`,
      filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`,
    } : {};

    return (
      <div className="w-full bg-black/20 rounded-2xl p-3 flex flex-col relative aspect-square shadow-lg">
        <h3 className={`font-semibold text-center mb-2 h-6 truncate ${isResult ? 'text-cyan-400 flex items-center justify-center gap-2' : 'text-gray-300'}`}>
          {isResult && <SparklesIcon className="w-5 h-5 flex-shrink-0" />}
          <span className="truncate" title={title}>{title}</span>
        </h3>
        <div className={`flex-grow bg-black/30 rounded-lg overflow-hidden flex items-center justify-center ${filterClassName}`}>
          {effectiveSrc ? (
            <img src={effectiveSrc} alt={title} className="object-contain w-full h-full transition-all duration-300" style={imageStyle} />
          ) : (
            <div className="text-gray-500 text-center p-4">Awaiting result...</div>
          )}
        </div>
        {isResult && effectiveSrc && !isLoading && (
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
                {resolutions.map(res => (
                   <button
                    key={res.label}
                    onClick={() => handleDownloadClick(res)}
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

  if (!originalImage) {
    return <ImagePlaceholder />;
  }

  return (
    <div className="relative w-full h-full max-h-[65vh] flex items-center justify-center">
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