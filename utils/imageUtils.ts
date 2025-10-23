import { Adjustments, Filter, Resolution } from "../types";

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const MAX_FILE_SIZE_MB = 3; // Keep it safe, as base64 encoding adds ~33% overhead. 3MB -> ~4MB.

/**
 * Resizes an image file if it's too large, or returns it as a data URL if it's within limits.
 * @param file The image file to process.
 * @returns A promise that resolves to an object with the dataUrl and mimeType.
 */
export function resizeImage(file: File): Promise<{ dataUrl: string, mimeType: string }> {
  return new Promise((resolve, reject) => {
    // If file is small enough, just read it directly without resizing
    if (file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
            resolve({ dataUrl: reader.result as string, mimeType: file.type });
        } else {
            reject(new Error("Failed to read file."));
        }
      };
      reader.onerror = () => reject(new Error("FileReader error."));
      reader.readAsDataURL(file);
      return;
    }

    // If file is too large, create an Image object to get its dimensions and then resize on canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for better compression for photos, with a quality setting.
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.9); // 90% quality
        resolve({ dataUrl, mimeType });
      };
      img.onerror = () => reject(new Error("Image load error. The file might be corrupted."));
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("Failed to read file for resizing."));
      }
    };
    reader.onerror = () => reject(new Error("FileReader error during resize process."));
    reader.readAsDataURL(file);
  });
}

/**
 * Takes an image source and various edits, applies them on a canvas, and triggers a download.
 * @param {string} imageSrc - The data URL of the image to process.
 * @param {Resolution} resolution - The target resolution for the output.
 * @param {Adjustments} adjustments - Brightness, contrast, saturation values.
 * @param {Filter | null} activeFilter - The active CSS filter class.
 * @param {number} rotation - The rotation angle (0, 90, 180, 270).
 * @param {string | null} lastPrompt - The last AI prompt used, for the filename.
 */
export const downloadEditedImage = (
    imageSrc: string,
    resolution: Resolution,
    adjustments: Adjustments,
    activeFilter: Filter | null,
    rotation: number,
    lastPrompt: string | null
) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let targetWidth = img.width;
        let targetHeight = img.height;

        // Calculate new dimensions if a specific resolution is chosen
        if (resolution.width || resolution.height) {
            const aspectRatio = img.width / img.height;
            if (resolution.width) {
                targetWidth = resolution.width;
                targetHeight = targetWidth / aspectRatio;
            } else if (resolution.height) {
                targetHeight = resolution.height;
                targetWidth = targetHeight * aspectRatio;
            }
        }

        // Handle rotation
        const rads = rotation * Math.PI / 180;
        const absCos = Math.abs(Math.cos(rads));
        const absSin = Math.abs(Math.sin(rads));
        
        const rotatedWidth = targetWidth * absCos + targetHeight * absSin;
        const rotatedHeight = targetWidth * absSin + targetHeight * absCos;

        canvas.width = rotatedWidth;
        canvas.height = rotatedHeight;

        ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
        ctx.rotate(rads);
        
        // Apply filters and adjustments
        ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) ${activeFilter?.style || ''}`;
        
        ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
        ctx.filter = 'none'; // reset filter for watermark

        // Reset transform for watermark
        ctx.rotate(-rads);
        ctx.translate(-rotatedWidth / 2, -rotatedHeight / 2);

        // Add watermark
        const watermarkText = 'Naquify';
        const padding = Math.max(20, rotatedWidth * 0.02);
        ctx.font = `bold ${Math.max(24, rotatedWidth / 35)}px 'Helvetica', sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        const promptForFilename = lastPrompt ? lastPrompt.toLowerCase().replace(/\s+/g, '-').substring(0, 20) : 'edited';
        link.download = `naquify-${promptForFilename}-${resolution.label.toLowerCase()}.png`;
        link.click();
    };
    img.src = imageSrc;
};