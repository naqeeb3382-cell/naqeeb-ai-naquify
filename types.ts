export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface Filter {
  id: string;
  name: string;
  style: string; // CSS filter class name
}

export type EditorTool = 'crop' | 'adjust' | 'filters' | 'ai' | 'text' | 'stickers' | 'layers';

export interface Resolution {
  label: string;
  description: string;
  width?: number;
  height?: number;
}