import React from 'react';
import { CameraIcon, HomeIcon } from './icons';

interface HeaderProps {
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Go to home"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 text-white">
          <CameraIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            Naquify
          </h1>
        </div>
        <div className="flex-1"></div>
      </div>
    </header>
  );
};