import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { resizeImage } from './utils/imageUtils';
import { processVideoFile } from './utils/videoUtils';
import { HomeScreen } from './components/HomeScreen';
import { Feedback } from './components/Feedback';
import { EditorScreen } from './components/editor/EditorScreen';
import { VideoEditorScreen } from './components/editor/VideoEditorScreen';
import { AiMagicScreen } from './components/editor/AiMagicScreen';

type View = 'home' | 'editor' | 'videoEditor' | 'aiMagicEditor';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [imageForEditor, setImageForEditor] = useState<string | null>(null);
  const [videoForEditor, setVideoForEditor] = useState<{ videoUrl: string, firstFrameUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  const handleImageUpload = useCallback(async (file: File, targetView: 'editor' | 'aiMagicEditor') => {
    setIsLoading(true);
    try {
      const { dataUrl } = await resizeImage(file);
      setImageForEditor(dataUrl);
      setView(targetView);
    } catch (e) {
      alert("Failed to process image. It might be corrupted or in an unsupported format.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVideoUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const { videoUrl, firstFrameUrl } = await processVideoFile(file);
      setVideoForEditor({ videoUrl, firstFrameUrl });
      setView('videoEditor');
    } catch (e) {
      alert("Failed to process video. It might be corrupted or in an unsupported format.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleClear = () => {
    setImageForEditor(null);
    setVideoForEditor(null);
    setView('home');
  }

  const handleGoHome = () => {
    handleClear();
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <HomeScreen onImageUpload={handleImageUpload} onVideoUpload={handleVideoUpload} isLoading={isLoading} />;
      case 'editor':
        if (imageForEditor) {
          return <EditorScreen initialImage={imageForEditor} onExit={handleGoHome} />;
        }
        handleGoHome();
        return null;
       case 'aiMagicEditor':
        if (imageForEditor) {
          return <AiMagicScreen initialImage={imageForEditor} onExit={handleGoHome} />;
        }
        handleGoHome();
        return null;
      case 'videoEditor':
        if (videoForEditor) {
          return <VideoEditorScreen 
            initialVideoUrl={videoForEditor.videoUrl} 
            initialFirstFrameUrl={videoForEditor.firstFrameUrl}
            onExit={handleGoHome} 
          />;
        }
        handleGoHome();
        return null;
      default:
        return <HomeScreen onImageUpload={handleImageUpload} onVideoUpload={handleVideoUpload} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans">
      <Header onGoHome={view !== 'home' ? handleGoHome : undefined} />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center gap-4">
        {renderContent()}
      </main>
      <Footer onFeedbackClick={() => setIsFeedbackOpen(true)} />
      {isFeedbackOpen && <Feedback onClose={() => setIsFeedbackOpen(false)} />}
    </div>
  );
};

export default App;