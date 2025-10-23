export function processVideoFile(file: File): Promise<{ videoUrl: string; firstFrameUrl: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            // Seek to the beginning to ensure the first frame is captured
            video.currentTime = 0;
        };

        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const mimeType = 'image/jpeg';
            const firstFrameUrl = canvas.toDataURL(mimeType, 0.9);
            const videoUrl = URL.createObjectURL(file);

            resolve({ videoUrl, firstFrameUrl, mimeType });

            // Clean up the object URL when it's no longer needed (though it's needed for the session)
            // It will be revoked implicitly when the document is unloaded.
        };

        video.onerror = (e) => {
            reject(new Error('Error loading video file. It might be corrupted or in an unsupported format.'));
        };

        video.src = URL.createObjectURL(file);
    });
}
