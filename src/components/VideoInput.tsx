import React, { useState } from 'react';
import { Video } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import { extractVideoId } from '../utils/youtube';

const VideoInput: React.FC<{ className?: string }> = ({ className }) => {
  const [url, setUrl] = useState('');
  const { setVideoId } = useVideoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className || ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Add Video</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideoInput;