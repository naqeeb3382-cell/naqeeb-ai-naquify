import React from 'react';
import { Adjustments, EditorTool, Filter } from '../../types';
import { AdjustPanel } from './AdjustPanel';
import { FilterPanel } from './FilterPanel';
import { AiPanel } from './AiPanel';
import { CropPanel } from './CropPanel';
import { XMarkIcon } from '../icons';

interface SubPanelProps {
  activeTool: EditorTool;
  onClose: () => void;
  adjustments: Adjustments;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
  activeFilter: Filter | null;
  onFilterSelect: (filter: Filter | null) => void;
  onApplyPrompt: (prompt: string, isAuto?: boolean) => void;
  isLoading: boolean;
  onRotate: () => void;
}

export const SubPanel: React.FC<SubPanelProps> = (props) => {
  const renderContent = () => {
    switch (props.activeTool) {
      case 'adjust':
        return <AdjustPanel adjustments={props.adjustments} onAdjustmentsChange={props.onAdjustmentsChange} />;
      case 'filters':
        return <FilterPanel onFilterSelect={props.onFilterSelect} activeFilter={props.activeFilter} />;
      case 'ai':
        return <AiPanel onApplyPrompt={props.onApplyPrompt} isLoading={props.isLoading} />;
      case 'crop':
        return <CropPanel onRotate={props.onRotate} />;
      case 'text':
      case 'stickers':
      case 'layers':
          return <div className="text-center text-gray-400 p-4">This feature is coming soon!</div>
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-black/40 backdrop-blur-lg rounded-xl p-4 relative">
      <button onClick={props.onClose} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors">
        <XMarkIcon className="w-5 h-5" />
      </button>
      {renderContent()}
    </div>
  );
};
