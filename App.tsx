
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DownloadIcon, RedoIcon, ShareIcon, StartOverIcon } from './components/icons';
import { generateHugImage } from './services/geminiService';
import type { ImageFile, HugStyle } from './types';

const App: React.FC = () => {
  const [person1Image, setPerson1Image] = useState<ImageFile | null>(null);
  const [person2Image, setPerson2Image] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hugStyle, setHugStyle] = useState<HugStyle>('realistic');

  const handleGenerate = useCallback(async () => {
    if (!person1Image || !person2Image) {
      setError('Please upload both images before generating.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateHugImage(person1Image, person2Image, hugStyle);
      setGeneratedImage(`data:image/png;base64,${result}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [person1Image, person2Image, hugStyle]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `hugfusion_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], 'hugfusion.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'HugFusion Image',
                text: 'Check out this hug I created with HugFusion!',
                files: [file],
            });
        } else {
            alert('Sharing is not supported on your browser, or you have not enabled it.');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        alert('Could not share the image.');
    }
  };

  const handleStartOver = () => {
    setPerson1Image(null);
    setPerson2Image(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };
  
  const InfoSection = () => (
    <div className="text-center text-gray-500 mt-12 text-sm max-w-2xl mx-auto">
      <h3 className="font-semibold text-gray-600 mb-2">How does HugFusion work?</h3>
      <p>
        HugFusion uses Google's powerful Nano Banana (gemini-2.5-flash-image) model. When you upload two images, the AI analyzes them and generates a brand new image based on a descriptive prompt, creating a beautiful moment of the two individuals hugging.
      </p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-white h-64">
          <LoadingSpinner />
          <p className="mt-4 text-lg animate-pulse">Fusing your images into a hug...</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-white mb-2">Here's your hug!</h2>
          <img src={generatedImage} alt="AI generated hug" className="rounded-2xl shadow-2xl w-full max-w-lg object-contain" />
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                <DownloadIcon /> Download
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                <ShareIcon /> Share
            </button>
            <button onClick={handleGenerate} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                <RedoIcon /> Regenerate
            </button>
            <button onClick={handleStartOver} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                <StartOverIcon /> Start Over
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <ImageUploader label="Person 1" onImageUpload={setPerson1Image} />
          <ImageUploader label="Person 2" onImageUpload={setPerson2Image} />
        </div>

        <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex items-center bg-white/20 p-1 rounded-full backdrop-blur-sm shadow-md">
                <button 
                    onClick={() => setHugStyle('realistic')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${hugStyle === 'realistic' ? 'bg-white text-purple-700 shadow-lg' : 'text-white'}`}>
                    Realistic Hug
                </button>
                <button
                    onClick={() => setHugStyle('cartoon')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${hugStyle === 'cartoon' ? 'bg-white text-purple-700 shadow-lg' : 'text-white'}`}>
                    Cartoon Hug
                </button>
            </div>
          <button
            onClick={handleGenerate}
            disabled={!person1Image || !person2Image || isLoading}
            className="bg-white text-purple-700 font-bold text-lg py-3 px-8 rounded-full shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
          >
            Generate Hug Image
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-400 to-blue-500 p-4 sm:p-8 flex flex-col items-center">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white shadow-text">
          🤗 HugFusion
        </h1>
        <p className="text-white/90 text-lg mt-2">
          Merge Two Smiles into One Hug
        </p>
      </header>
      
      <main className="w-full flex flex-col items-center">
        {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-6 shadow-lg">{error}</div>}
        {renderContent()}
      </main>

      <footer className="mt-auto pt-8">
        <InfoSection />
      </footer>

      <style>{`
        .shadow-text {
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
