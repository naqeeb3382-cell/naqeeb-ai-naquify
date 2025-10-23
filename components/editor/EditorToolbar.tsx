import React from 'react';
import { CropIcon, AdjustmentsIcon, FunnelIcon, SparklesIcon, TextIcon, StickerIcon, LayersIcon, UploadIcon, XMarkIcon } from '../icons';
import { EditorTool } from '../../types';

interface EditorToolbarProps {
  activeTool: EditorTool | null;
  onToolSelect: (tool: EditorTool | null) => void;
  onImageUpload: (file: File) => void;
  onExit: () => void;
}

const ToolButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, icon, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center gap-1 text-xs w-20 h-16 rounded-xl transition-all duration-200 btn-animated ${
      isActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {icon}
    <span>{label}</span>
     {disabled && <span className="absolute text-[8px] bottom-1 font-bold">SOON</span>}
  </button>
);


export const EditorToolbar: React.FC<EditorToolbarProps> = ({ activeTool, onToolSelect, onImageUpload, onExit }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleToggleTool = (tool: EditorTool) => {
    onToolSelect(activeTool === tool ? null : tool);
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-lg p-2 rounded-2xl shadow-2xl border-t border-gray-700/50 w-full max-w-5xl mx-auto flex items-center justify-between gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div className='flex items-center gap-2'>
        <button onClick={onExit} className="w-14 h-16 flex flex-col items-center justify-center gap-1 text-xs text-gray-300 hover:bg-white/10 rounded-xl transition-colors btn-animated">
          <XMarkIcon className="w-6 h-6" />
          Close
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="w-14 h-16 flex flex-col items-center justify-center gap-1 text-xs text-gray-300 hover:bg-white/10 rounded-xl transition-colors btn-animated">
          <UploadIcon className="w-6 h-6" />
          Change
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
        <ToolButton label="Crop" icon={<CropIcon className="w-6 h-6" />} isActive={activeTool === 'crop'} onClick={() => handleToggleTool('crop')} />
        <ToolButton label="Adjust" icon={<AdjustmentsIcon className="w-6 h-6" />} isActive={activeTool === 'adjust'} onClick={() => handleToggleTool('adjust')} />
        <ToolButton label="Filters" icon={<FunnelIcon className="w-6 h-6" />} isActive={activeTool === 'filters'} onClick={() => handleToggleTool('filters')} />
        <ToolButton label="AI Magic" icon={<SparklesIcon className="w-6 h-6" />} isActive={activeTool === 'ai'} onClick={() => handleToggleTool('ai')} />
        <ToolButton label="Text" icon={<TextIcon className="w-6 h-6" />} isActive={activeTool === 'text'} onClick={() => handleToggleTool('text')} />
        <ToolButton label="Stickers" icon={<StickerIcon className="w-6 h-6" />} isActive={activeTool === 'stickers'} onClick={() => handleToggleTool('stickers')} />
      </div>

      <div className='flex items-center gap-2'>
         <ToolButton label="Layers" icon={<LayersIcon className="w-6 h-6" />} isActive={activeTool === 'layers'} onClick={() => handleToggleTool('layers')} />
      </div>

    </div>
  );
};