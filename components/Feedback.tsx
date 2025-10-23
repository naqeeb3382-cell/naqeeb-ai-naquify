import React, { useState, useRef } from 'react';
import { StarIcon, XMarkIcon, UploadIcon } from './icons';

interface FeedbackProps {
  onClose: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [exampleFile, setExampleFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        setExampleFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    console.log({
      rating,
      feedback: feedbackText,
      fileName: exampleFile?.name,
      email,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-black/40 border border-gray-700/50 rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {submitted ? (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Thank you! ❤️</h2>
                <p className="text-gray-300">Your feedback has been received. We appreciate you helping us make Naquify better!</p>
                <button
                    onClick={onClose}
                    className="mt-6 bg-cyan-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                    Close
                </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Share your thoughts with us! ❤️</h2>
                    <p className="text-gray-400 mt-1">Your feedback helps us make Naquify better for everyone!</p>
                </div>
            
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rate your experience</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                                (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-300 mb-2">
                        What could we improve or add?
                    </label>
                    <textarea
                        id="feedback-text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="I'd love to see..."
                        className="w-full bg-black/20 text-white placeholder-gray-400 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Upload an example <span className="text-gray-500">(optional)</span>
                        </label>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="w-full flex items-center justify-center gap-2 bg-gray-600/50 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
                        >
                            <UploadIcon className="w-5 h-5" />
                            <span className="truncate">{exampleFile ? exampleFile.name : 'Choose file'}</span>
                        </button>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="For follow-up questions"
                            className="w-full bg-black/20 text-white placeholder-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Submit Feedback
                </button>
            </form>
        )}
      </div>
       {/* FIX: Removed the non-standard `jsx` prop from the `<style>` tag. The `jsx` prop is a feature of styled-jsx (used in Next.js) and is not valid in a standard React setup, causing a TypeScript error. Using a regular `<style>` tag achieves the same result by injecting the styles into the document. */}
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
