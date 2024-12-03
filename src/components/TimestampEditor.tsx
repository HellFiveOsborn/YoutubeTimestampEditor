import React from 'react';
import { Clock } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import { formatTime } from '../utils/youtube';

const TimestampEditor: React.FC = () => {
  const { timestamps, removeTimestamp } = useVideoStore();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Timestamps</h2>
      
      <div className="space-y-2">
        {timestamps.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click and drag on the timeline to create timestamps
          </p>
        ) : (
          timestamps.map((timestamp) => (
            <div
              key={timestamp.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm dark:text-white">
                  {formatTime(timestamp.start)} - {formatTime(timestamp.end)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {timestamp.label}
                </span>
              </div>
              <button
                onClick={() => removeTimestamp(timestamp.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimestampEditor;