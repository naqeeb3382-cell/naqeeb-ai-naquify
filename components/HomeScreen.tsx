import React, { useRef, useState } from 'react';
import { SparklesIcon, FilmIcon, CameraIcon, PaintBrushIcon } from './icons';

interface HomeScreenProps {
  onImageUpload: (file: File, targetView: 'editor' | 'aiMagicEditor') => void;
  onVideoUpload: (file: File) => void;
  isLoading: boolean;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative group bg-white/5 backdrop-blur-md p-6 rounded-2xl text-left w-full h-full flex flex-col items-start justify-between transition-all duration-300 hover:bg-white/10 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 btn-animated'}`}
  >
    <div>
      <div className="p-3 bg-gray-900/50 rounded-lg w-fit mb-4 text-cyan-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-1">{description}</p>
    </div>
    {disabled && (
      <span className="absolute top-4 right-4 text-xs font-semibold bg-purple-500 text-white py-1 px-2 rounded-full">
        Coming Soon
      </span>
    )}
  </button>
);


export const HomeScreen: React.FC<HomeScreenProps> = ({ onImageUpload, onVideoUpload, isLoading }) => {
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadTarget, setImageUploadTarget] = useState<'editor' | 'aiMagicEditor'>('editor');

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0], imageUploadTarget);
    }
    if (event.target) {
        event.target.value = "";
    }
  };
  
  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onVideoUpload(event.target.files[0]);
    }
     if (event.target) {
        event.target.value = "";
    }
  };

  const handleCardClick = (target: 'editor' | 'aiMagicEditor') => {
    setImageUploadTarget(target);
    imageFileInputRef.current?.click();
  };
  
  const handleEditVideoClick = () => {
    videoFileInputRef.current?.click();
  };
  
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4">
      <input
        type="file"
        ref={imageFileInputRef}
        onChange={handleImageFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={videoFileInputRef}
        onChange={handleVideoFileChange}
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
      />
      
      <div className="mb-12">
        <CameraIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Welcome to Naquify</h1>
        <p className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto">
          Your AI-powered creative suite. Select a tool to begin.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 text-white">
          <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Processing your file...</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              title="Full Photo Editor"
              description="Crop, adjust, filter, and use targeted AI tools for detailed edits."
              icon={<PaintBrushIcon className="w-8 h-8"/>}
              onClick={() => handleCardClick('editor')}
            />
            <ActionCard 
              title="AI Magic Tool"
              description="Transform your photo instantly with a single text prompt."
              icon={<SparklesIcon className="w-8 h-8" />}
              onClick={() => handleCardClick('aiMagicEditor')}
            />
             <ActionCard 
              title="Create AI Video"
              description="Generate or edit video clips using the power of AI."
              icon={<FilmIcon className="w-8 h-8" />}
              onClick={handleEditVideoClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};