import React from 'react';
import { Bitcoin } from 'lucide-react';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const bitcoinAddress = import.meta.env.VITE_BITCOIN_ADDRESS;
  const lightningAddress = import.meta.env.VITE_LIGHTNING_ADDRESS;

  return (
    <footer className="mt-auto py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            Built with ❤️ by{' '}
            <a
              href="https://github.com/HellFiveOsborn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              HellFiveOsborn
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Bitcoin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="font-mono text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {bitcoinAddress}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="font-mono text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {lightningAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;