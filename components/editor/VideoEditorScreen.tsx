import React, { useState, useEffect, useCallback, useRef } from 'react';
import { startVideoGenerationFromImage, checkVideoGenerationStatus } from '../../services/geminiService';
import { XMarkIcon, SparklesIcon, FilmIcon, DownloadIcon } from '../icons';

interface VideoEditorScreenProps {
  initialVideoUrl: string;
  initialFirstFrameUrl: string;
  onExit: () => void;
}

const loadingMessages = [
  "Warming up the AI director...",
  "Scouting for digital locations...",
  "Casting virtual actors...",
  "Rendering the first scene...",
  "Applying special effects...",
  "This is taking longer than usual, the AI is working hard...",
  "Finalizing the masterpiece...",
];

export const VideoEditorScreen: React.FC<VideoEditorScreenProps> = ({ initialVideoUrl, initialFirstFrameUrl, onExit }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [operation, setOperation] = useState<any | null>(null);

  const pollingIntervalRef = useRef<number | null>(null);
  const messageIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // This effect now only handles cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, []);

  const pollOperation = useCallback(async (op: any) => {
    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const updatedOp = await checkVideoGenerationStatus(op);
        if (updatedOp.done) {
          setIsLoading(false);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          if (updatedOp.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = updatedOp.response.generatedVideos[0].video.uri;
            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await videoResponse.blob();
            setGeneratedVideoUrl(URL.createObjectURL(blob));
          } else {
            setError("Video generation finished, but no video was returned.");
          }
        }
        setOperation(updatedOp);
      } catch (e) {
        setIsLoading(false);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setError("An error occurred while checking video status.");
        console.error(e);
      }
    }, 10000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMessage(loadingMessages[0]);

    let messageIndex = 0;
    messageIntervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
    }, 7000);

    try {
      const [header, base64Data] = initialFirstFrameUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      
      const op = await startVideoGenerationFromImage(prompt, base64Data, mimeType);
      setOperation(op);
      pollOperation(op);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during video generation.");
      setIsLoading(false);
    } finally {
        if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    }
  };
  
  useEffect(() => {
      if(!isLoading) {
          if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
      }
  }, [isLoading]);

  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    const promptForFilename = prompt ? prompt.toLowerCase().replace(/\s+/g, '-').substring(0, 20) : 'generated';
    link.download = `naquify-video-${promptForFilename}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const VideoDisplay: React.FC<{ isOriginal?: boolean }> = ({ isOriginal = false }) => (
    <div className="w-full bg-black/20 rounded-2xl p-3 flex flex-col relative aspect-video shadow-lg">
      <h3 className={`font-semibold text-center mb-2 h-6 truncate ${!isOriginal ? 'text-cyan-400' : 'text-gray-300'}`}>
        {isOriginal ? "Original" : "Generated"}
      </h3>
      <div className="flex-grow bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
        {isOriginal ? (
          <video src={initialVideoUrl} controls className="w-full h-full object-contain" />
        ) : (
          generatedVideoUrl ? (
             <video src={generatedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
          ) : (
             <div className="text-gray-500 text-center p-4 h-full w-full flex flex-col items-center justify-center">
                <FilmIcon className="w-16 h-16 mb-4" />
                <p>Your AI-generated video will appear here.</p>
             </div>
          )
        )}
      </div>
       {!isOriginal && generatedVideoUrl && (
          <button 
            onClick={handleDownloadVideo}
            className="absolute bottom-3 right-3 z-10 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 btn-animated flex items-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </button>
        )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-4">
      <div className="relative w-full h-full max-h-[65vh] flex items-center justify-center">
        {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-white">{loadingMessage}</p>
            </div>
        )}
         {error && (
            <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-30 p-4">
                <p className="text-white text-center font-semibold">{error}</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
            <VideoDisplay isOriginal />
            <VideoDisplay />
        </div>
      </div>
       <div className="w-full max-w-5xl flex flex-col gap-2 bg-black/40 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border-t border-gray-700/50">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">AI Video Prompt</h3>
            <button onClick={onExit} className="p-1 text-gray-400 hover:text-white transition-colors">
                <XMarkIcon className="w-5 h-5" /> Close
            </button>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder="Describe the video you want to create..."
                className="w-full bg-black/20 text-white placeholder-gray-400 rounded-xl p-3 h-12 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                rows={1}
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
    </div>
  );
};