import React from 'react';
import { Timestamp } from '../../types/youtube';
import { formatTime } from '../../utils/youtube';

interface TimelineSegmentProps {
  timestamp: Timestamp;
  duration: number;
  onRemove: (id: string) => void;
  onSeek: (time: number) => void;
}

const TimelineSegment: React.FC<TimelineSegmentProps> = ({
  timestamp,
  duration,
  onRemove,
  onSeek,
}) => {
  const startPercent = (timestamp.start / duration) * 100;
  const endPercent = (timestamp.end / duration) * 100;
  const width = endPercent - startPercent;

  return (
    <div
      className="absolute h-full bg-red-200 dark:bg-red-900 opacity-50 group cursor-pointer"
      style={{ left: `${startPercent}%`, width: `${width}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onSeek(timestamp.start);
      }}
    >
      <div className="hidden group-hover:block absolute bottom-full mb-2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg whitespace-nowrap z-10">
        <p className="text-sm dark:text-white">
          {formatTime(timestamp.start)} - {formatTime(timestamp.end)}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{timestamp.label}</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSeek(timestamp.start);
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Preview
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(timestamp.id);
            }}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineSegment;