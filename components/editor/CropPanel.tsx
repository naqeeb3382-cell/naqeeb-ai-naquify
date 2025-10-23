import React from 'react';
import { RotateCcwIcon, CropIcon } from '../icons';

interface CropPanelProps {
    onRotate: () => void;
}

const ActionButton: React.FC<{ label: string, icon: React.ReactNode, onClick: () => void, disabled?: boolean }> = ({ label, icon, onClick, disabled }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center gap-2 p-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {icon}
        <span className="text-xs font-semibold">{label}</span>
    </button>
);


export const CropPanel: React.FC<CropPanelProps> = ({ onRotate }) => {
  return (
    <div className='px-4 py-2'>
        <h3 className="text-lg font-bold text-white mb-4">Crop & Rotate</h3>
        <div className="flex items-center gap-4">
            <ActionButton label="Rotate" icon={<RotateCcwIcon className="w-6 h-6" />} onClick={onRotate} />
            <ActionButton label="Crop" icon={<CropIcon className="w-6 h-6" />} onClick={() => alert('Cropping is coming soon!')} disabled />
            <ActionButton label="Resize" icon={<CropIcon className="w-6 h-6" />} onClick={() => alert('Resizing is coming soon!')} disabled />
        </div>
    </div>
  );
};
