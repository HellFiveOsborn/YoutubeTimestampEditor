import React, { useEffect } from 'react';
import useVideoStore from './store/videoStore';
import Header from './components/Header';
import VideoInput from './components/VideoInput';
import VideoPlayer from './components/VideoPlayer';
import TimestampEditor from './components/TimestampEditor';
import Footer from './components/Footer';
import WelcomeModal from './components/WelcomeModal';
import VideoInfo from './components/VideoInfo';
import { ToastContainer } from './components/Toast';
import NotFound from './components/NotFound';

function App() {
  const { isDarkMode, loadFromShareLink, isInvalidLink } = useVideoStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('v')) {
      loadFromShareLink(params);
    }
  }, []);

  if (isInvalidLink) {
    return <NotFound />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer />
              <VideoInfo />
              <div className="mt-4">
                <TimestampEditor />
              </div>
            </div>
            <div className="lg:col-span-1">
              <VideoInput className="mb-6" />
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 dark:text-white">About This Tool</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Create and share custom video segments by marking timestamps in YouTube videos. Perfect for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Skipping unwanted sections</li>
                  <li>Creating highlight reels</li>
                  <li>Sharing specific parts of videos</li>
                  <li>Educational content curation</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <WelcomeModal />
        <ToastContainer />
        <Footer />
      </div>
    </div>
  );
}

export default App;