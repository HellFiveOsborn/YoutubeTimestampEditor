import React from 'react';
import { Moon, Sun, Bug } from 'lucide-react';
import Image from 'next/image';
import useVideoStore from '../store/videoStore';
import logotipo from '../assets/logotipo.png';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useVideoStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={logotipo}
              alt="YouTube Timestamp Editor Logo" 
              className="h-20 brightness-[0.85] contrast-[1.2] dark:brightness-100 dark:contrast-100"
              width={200}
              height={80}
            />
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://t.me/OsbornBots"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Report Bug"
            >
              <Bug className="w-5 h-5" />
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;