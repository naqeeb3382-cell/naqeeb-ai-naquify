import React from 'react';
import { Adjustments } from '../../types';
import { SunIcon } from '../icons'; // Assuming a contrast and saturation icon exist or can be made

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, min = 0, max = 200 }) => (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-xs font-mono bg-gray-900/50 text-cyan-400 px-2 py-1 rounded-md">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value-min)/(max-min))*100}%, #4b5563 ${((value-min)/(max-min))*100}%, #4b5563 100%)`
      }}
    />
  </div>
);

export const AdjustPanel: React.FC<{
  adjustments: Adjustments;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
}> = ({ adjustments, onAdjustmentsChange }) => {

  const handleChange = (key: keyof Adjustments) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onAdjustmentsChange({ ...adjustments, [key]: parseInt(e.target.value, 10) });
  };
  
  const resetAdjustments = () => {
      onAdjustmentsChange({ brightness: 100, contrast: 100, saturation: 100 });
  }

  return (
    <div className='px-4 py-2'>
        <div className='flex justify-between items-center mb-4'>
            <h3 className="text-lg font-bold text-white">Adjustments</h3>
            <button onClick={resetAdjustments} className='text-xs text-cyan-400 hover:text-cyan-300 font-semibold'>Reset</button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <Slider label="Brightness" value={adjustments.brightness} onChange={handleChange('brightness')} />
            <Slider label="Contrast" value={adjustments.contrast} onChange={handleChange('contrast')} />
            <Slider label="Saturation" value={adjustments.saturation} onChange={handleChange('saturation')} />
        </div>
    </div>
  );
};
