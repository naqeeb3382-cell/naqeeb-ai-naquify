import React from 'react';
import { Filter } from '../../types';

const FILTERS: Filter[] = [
  { id: 'none', name: 'None', style: '' },
  { id: 'sepia', name: 'Sepia', style: 'sepia' },
  { id: 'grayscale', name: 'Grayscale', style: 'grayscale' },
  { id: 'saturate-2', name: 'Vibrant', style: 'saturate-200' },
  { id: 'hue-r-90', name: 'Invert', style: 'invert' },
  { id: 'contrast-150', name: 'Moody', style: 'contrast-150' },
  { id: 'brightness-75', name: 'Dark', style: 'brightness-75' },
];

export const FilterPanel: React.FC<{
  onFilterSelect: (filter: Filter | null) => void;
  activeFilter: Filter | null;
}> = ({ onFilterSelect, activeFilter }) => {
  return (
    <div className='px-4 py-2'>
      <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.id === 'none' ? null : filter)}
            className={`flex flex-col items-center gap-2 flex-shrink-0 btn-animated ${activeFilter?.id === filter.id || (!activeFilter && filter.id === 'none') ? 'text-cyan-400' : 'text-gray-300'}`}
          >
            <div className={`w-20 h-20 bg-gray-500 rounded-lg overflow-hidden border-2 ${activeFilter?.id === filter.id || (!activeFilter && filter.id === 'none') ? 'border-cyan-400' : 'border-transparent'}`}>
               <img src="/placeholder-filter.jpg" alt={filter.name} className={`w-full h-full object-cover ${filter.style}`} />
            </div>
            <span className="text-xs font-semibold">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
