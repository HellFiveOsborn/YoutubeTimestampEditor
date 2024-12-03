import React, { useState, useEffect } from 'react';
import { X, Bitcoin, Zap, Copy, Check } from 'lucide-react';

const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedBitcoin, setCopiedBitcoin] = useState(false);
  const [copiedLightning, setCopiedLightning] = useState(false);
  const bitcoinAddress = import.meta.env.VITE_BITCOIN_ADDRESS;
  const lightningAddress = import.meta.env.VITE_LIGHTNING_ADDRESS;

  useEffect(() => {
    const lastShown = localStorage.getItem('welcomeModalLastShown');
    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
    
    if (!lastShown || Date.now() - parseInt(lastShown) > fourDaysInMs) {
      setIsOpen(true);
      localStorage.setItem('welcomeModalLastShown', Date.now().toString());
    }
  }, []);

  const handleCopy = async (text: string, type: 'bitcoin' | 'lightning') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'bitcoin') {
        setCopiedBitcoin(true);
        setTimeout(() => setCopiedBitcoin(false), 2000);
      } else {
        setCopiedLightning(true);
        setTimeout(() => setCopiedLightning(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Welcome to Video Segments!</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This tool helps you create and share custom video segments from YouTube videos. Perfect for:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Skipping unwanted sections</li>
            <li>Creating highlight reels</li>
            <li>Sharing specific parts of videos</li>
            <li>Educational content curation</li>
          </ul>

          <div className="mt-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              If you find this tool useful, consider supporting the development:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <Bitcoin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300 flex-1">
                  {bitcoinAddress}
                </span>
                <button
                  onClick={() => handleCopy(bitcoinAddress, 'bitcoin')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Copy Bitcoin address"
                >
                  {copiedBitcoin ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300 flex-1">
                  {lightningAddress}
                </span>
                <button
                  onClick={() => handleCopy(lightningAddress, 'lightning')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Copy Lightning address"
                >
                  {copiedLightning ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;