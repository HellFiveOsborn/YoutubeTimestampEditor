import React from 'react';

interface TimelineMarkerProps {
  position: number;
  type: 'start' | 'end';
  onDrag: (position: number) => void;
}

const TimelineMarker: React.FC<TimelineMarkerProps> = ({ position, type, onDrag }) => {
  const handleDrag = (e: React.DragEvent) => {
    const timeline = e.currentTarget.parentElement;
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newPosition = (x / rect.width) * 100;
      onDrag(Math.max(0, Math.min(100, newPosition)));
    }
  };

  return (
    <div
      draggable
      onDrag={handleDrag}
      className={`absolute top-0 h-full w-2 cursor-ew-resize ${
        type === 'start' ? 'bg-blue-500' : 'bg-red-500'
      }`}
      style={{ left: `${position}%` }}
    />
  );
};

export default TimelineMarker;