import React, { useState, useCallback } from 'react';
import { ImageDisplay } from '../ImageDisplay';
import { EditorToolbar } from './EditorToolbar';
import { SubPanel } from './SubPanel';
import { editImage } from '../../services/geminiService';
import { Adjustments, EditorTool, Filter, Resolution } from '../../types';
import { resizeImage, downloadEditedImage } from '../../utils/imageUtils';

const RESOLUTIONS: Resolution[] = [
    { label: "Original", description: "Keep original size" },
    { label: "4K UHD", description: "3840px", width: 3840 },
    { label: "2K QHD", description: "2560px", width: 2560 },
    { label: "1080p FHD", description: "1920px", width: 1920 },
    { label: "720p HD", description: "1280px", width: 1280 },
];


interface EditorScreenProps {
  initialImage: string;
  onExit: () => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ initialImage, onExit }) => {
  const [originalImage, setOriginalImage] = useState<string>(initialImage);
  const [editedImage, setEditedImage] = useState<string>(initialImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>({ brightness: 100, contrast: 100, saturation: 100 });
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const { dataUrl } = await resizeImage(file);
      setOriginalImage(dataUrl);
      setEditedImage(dataUrl);
      // Reset all edits
      setLastPrompt(null);
      setAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
      setActiveFilter(null);
      setRotation(0);
      setActiveTool(null);
    } catch (e) {
      setError("Failed to process image.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApplyPrompt = useCallback(async (prompt: string, isAuto: boolean = false) => {
    if (!editedImage) {
      setError("An image must be loaded to apply AI effects.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a description of the edit you'd like to make.");
      return;
    }

    setIsLoading(true);
    setError(null);
    if (!isAuto) {
      setLastPrompt(prompt);
    }

    try {
      const base64Data = editedImage.split(',')[1];
      const mimeType = editedImage.substring(5, editedImage.indexOf(';'));
      const result = await editImage(base64Data, mimeType, prompt);
      setEditedImage(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to apply edit: ${errorMessage}`);
      console.error(e);
      if (!isAuto) setLastPrompt(null);
    } finally {
      setIsLoading(false);
    }
  }, [editedImage]);
  
  const handleRotate = () => {
      setRotation(current => (current - 90 + 360) % 360);
  }

  const handleDownload = (resolution: Resolution) => {
    downloadEditedImage(editedImage, resolution, adjustments, activeFilter, rotation, lastPrompt);
  };


  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-4">
      <ImageDisplay
        originalImage={originalImage}
        editedImage={editedImage}
        isLoading={isLoading}
        error={error}
        lastPrompt={lastPrompt}
        onDownload={handleDownload}
        adjustments={adjustments}
        filterClassName={activeFilter?.style || ''}
        rotation={rotation}
        resolutions={RESOLUTIONS}
      />
      <div className="w-full max-w-5xl flex flex-col gap-2">
        {activeTool && (
            <SubPanel
                activeTool={activeTool}
                onClose={() => setActiveTool(null)}
                adjustments={adjustments}
                onAdjustmentsChange={setAdjustments}
                onFilterSelect={setActiveFilter}
                activeFilter={activeFilter}
                onApplyPrompt={handleApplyPrompt}
                isLoading={isLoading}
                onRotate={handleRotate}
            />
        )}
        <EditorToolbar
            activeTool={activeTool}
            onToolSelect={setActiveTool}
            onImageUpload={handleImageUpload}
            onExit={onExit}
        />
      </div>
    </div>
  );
};