import React, { useState } from 'react';
import { SparklesIcon, WandIcon, TrashIcon } from '../icons'; // Assuming WandIcon exists

interface AiPanelProps {
  onApplyPrompt: (prompt: string, isAuto?: boolean) => void;
  isLoading: boolean;
}

export const AiPanel: React.FC<AiPanelProps> = ({ onApplyPrompt, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onApplyPrompt(prompt);
    }
  };

  const handleQuickAction = (quickPrompt: string) => {
      onApplyPrompt(quickPrompt, true);
  };

  return (
    <div className='px-4 py-2'>
      <h3 className="text-lg font-bold text-white mb-4">AI Magic</h3>
      <div className="flex flex-col gap-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-300 mr-2">Quick Actions:</span>
            <button 
                onClick={() => handleQuickAction('auto enhance this photo, improve brightness, contrast, colors, and skin tones')}
                disabled={isLoading}
                className="btn-gradient text-white text-xs font-bold py-2 px-3 rounded-lg btn-animated disabled:opacity-50 flex items-center gap-1"
            >
                <WandIcon className="w-4 h-4" /> Auto Enhance
            </button>
             <button 
                onClick={() => handleQuickAction('remove the background, make it transparent')}
                disabled={isLoading}
                className="btn-gradient text-white text-xs font-bold py-2 px-3 rounded-lg btn-animated disabled:opacity-50 flex items-center gap-1"
            >
                <TrashIcon className="w-4 h-4" /> Remove BG
            </button>
        </div>

        {/* Prompt Input */}
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
            disabled={isLoading}
            className="flex-shrink-0 flex items-center justify-center gap-2 btn-gradient text-white font-semibold p-3 rounded-xl h-12 w-12 btn-animated disabled:opacity-50"
            aria-label="Generate AI edit"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
