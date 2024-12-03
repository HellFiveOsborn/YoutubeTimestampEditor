import React, { useState, useEffect } from 'react';
import { Timestamp } from '../../types/youtube';
import TimelineMarker from './TimelineMarker';
import TimelineSegment from './TimelineSegment';
import { formatTime } from '../../utils/youtube';

interface TimelineProps {
  duration: number;
  currentTime: number;
  timestamps: Timestamp[];
  onAddTimestamp: (start: number, end: number) => void;
  onRemoveTimestamp: (id: string) => void;
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  timestamps,
  onAddTimestamp,
  onRemoveTimestamp,
  onSeek,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startMarker, setStartMarker] = useState<number | null>(null);
  const [endMarker, setEndMarker] = useState<number | null>(null);
  const [previewTime, setPreviewTime] = useState<number | null>(null);

  useEffect(() => {
    if (startMarker !== null) {
      const time = (startMarker / 100) * duration;
      onSeek(time);
    }
  }, [startMarker, duration]);

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = (x / rect.width) * 100;
    
    if (!isDragging) {
      if (startMarker === null) {
        setStartMarker(clickPosition);
      } else if (endMarker === null) {
        const end = Math.max(clickPosition, startMarker);
        const start = Math.min(clickPosition, startMarker);
        setEndMarker(end);
        
        const startTime = (start / 100) * duration;
        const endTime = (end / 100) * duration;
        onAddTimestamp(startTime, endTime);
        
        setStartMarker(null);
        setEndMarker(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    const time = (position / 100) * duration;
    setPreviewTime(time);
  };

  const progressWidth = (currentTime / duration) * 100;

  return (
    <div className="mt-4">
      <div
        className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
        onClick={handleTimelineClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPreviewTime(null)}
      >
        {/* Progress bar */}
        <div
          className="absolute h-full bg-blue-300 dark:bg-blue-800"
          style={{ width: `${progressWidth}%` }}
        />

        {/* Preview time tooltip */}
        {previewTime !== null && (
          <div
            className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs"
            style={{ left: `${(previewTime / duration) * 100}%` }}
          >
            {formatTime(previewTime)}
          </div>
        )}

        {/* Timestamp segments */}
        {timestamps.map((timestamp) => (
          <TimelineSegment
            key={timestamp.id}
            timestamp={timestamp}
            duration={duration}
            onRemove={onRemoveTimestamp}
            onSeek={onSeek}
          />
        ))}

        {/* Markers for new timestamp */}
        {startMarker !== null && (
          <TimelineMarker
            position={startMarker}
            type="start"
            onDrag={(pos) => setStartMarker(pos)}
          />
        )}
        {endMarker !== null && (
          <TimelineMarker
            position={endMarker}
            type="end"
            onDrag={(pos) => setEndMarker(pos)}
          />
        )}
      </div>

      {/* Time indicators */}
      <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Timeline;