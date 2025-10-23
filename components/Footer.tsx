import React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from './icons';

interface FooterProps {
  onFeedbackClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFeedbackClick }) => {
  return (
    <footer className="bg-transparent mt-4">
      <div className="container mx-auto px-4 md:px-8 py-2 text-center text-gray-300/70 text-xs">
        <p>&copy; {new Date().getFullYear()} Naquify. Powered by Gemini.</p>
        <button
          onClick={onFeedbackClick}
          className="mt-2 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
          Share Feedback
        </button>
      </div>
    </footer>
  );
};