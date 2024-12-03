import React from 'react';
import { ThumbsUp, Eye, Share2, Clock, Calendar } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import ShareButton from './ShareButton';
import { formatCompactNumber } from '../utils/format';

const VideoInfo: React.FC = () => {
  const { videoTitle, videoThumbnail, videoStats, timestamps } = useVideoStore();

  if (!videoTitle || !videoStats) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold dark:text-white line-clamp-2">{videoTitle}</h1>
        
        <div className="flex flex-wrap items-center gap-6 pb-4 border-b dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {videoStats.views} views
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {videoStats.likes}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {videoStats.uploadDate}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {timestamps.length} segments
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <ShareButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;