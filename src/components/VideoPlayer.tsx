import React, { useEffect, useRef, useState } from 'react';
import useVideoStore from '../store/videoStore';
import { loadYouTubeAPI, getVideoMetadata } from '../utils/youtube';
import Timeline from './Timeline/Timeline';
import VideoInfo from './VideoInfo';
import { useToastStore } from './Toast';
import { AlertTriangle } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { addToast } = useToastStore();
  const {
    videoId,
    timestamps,
    setDuration,
    addTimestamp,
    removeTimestamp,
    setVideoInfo,
    setVideoStats,
  } = useVideoStore();

  useEffect(() => {
    if (!videoId) return;

    const initializePlayer = async () => {
      try {
        setError(null);
        setPlayerReady(false);
        await loadYouTubeAPI();

        // Get video metadata
        const metadata = await getVideoMetadata(videoId);
        if (!metadata) {
          const error = 'Video not found or is unavailable';
          setError(error);
          addToast(error, 'error');
          return;
        }
        
        setVideoInfo(metadata.title, metadata.thumbnail);
        setVideoStats(metadata.stats);

        if (!playerRef.current) {
          playerRef.current = new window.YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId,
            playerVars: {
              playsinline: 1,
              modestbranding: 1,
              rel: 0,
              origin: window.location.origin,
              enablejsapi: 1,
              controls: 1,
              autoplay: 1,
              fs: 1,
            },
            events: {
              onReady: (event: any) => {
                const duration = event.target.getDuration();
                if (duration < 60) {
                  const error = 'Video must be longer than 1 minute';
                  setError(error);
                  addToast(error, 'warning');
                  return;
                }
                setDuration(duration);
                setPlayerReady(true);
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  startTimeTracking();
                }
              },
              onError: (event: any) => {
                const errorMessages: { [key: number]: string } = {
                  2: 'This video ID is invalid',
                  5: 'There was an error playing the video',
                  100: 'This video was not found',
                  101: 'The video owner does not allow embedding',
                  150: 'The video owner does not allow embedding',
                };
                const error = errorMessages[event.data] || 'Failed to load video. Please check the URL and try again.';
                setError(error);
                addToast(error, 'error');
              },
            },
          });
        } else {
          playerRef.current.loadVideoById(videoId);
        }
      } catch (err) {
        console.error('YouTube player error:', err);
        const error = 'Failed to load video. Please try again.';
        setError(error);
        addToast(error, 'error');
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setPlayerReady(false);
    };
  }, [videoId]);

  const startTimeTracking = () => {
    let intervalId: NodeJS.Timeout;
    
    const checkAndSkip = () => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        
        const activeTimestamp = timestamps.find(
          (t) => time >= t.start && time < t.end
        );
        
        if (activeTimestamp) {
          playerRef.current.seekTo(activeTimestamp.end);
          setCurrentTime(activeTimestamp.end);
        }
      }
    };

    // Check more frequently for better segment detection
    intervalId = setInterval(checkAndSkip, 250);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  };

  const handleSeek = (time: number) => {
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  const handleAddTimestamp = (start: number, end: number) => {
    addTimestamp(start, end, `Segment ${timestamps.length + 1}`);
  };

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!videoId ? (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Enter a YouTube URL to get started</p>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {error ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                <div>
                  <p className="text-red-500 font-medium text-lg">{error}</p>
                  <p className="text-gray-400 mt-2">Please check the video URL and try again</p>
                </div>
              </div>
            ) : (
              <div id="youtube-player" className="w-full h-full" />
            )}
          </div>
          {playerReady && (
            <div className="mt-4">
              <Timeline
                duration={playerRef.current?.getDuration() || 0}
                currentTime={currentTime}
                timestamps={timestamps}
                onAddTimestamp={handleAddTimestamp}
                onRemoveTimestamp={removeTimestamp}
                onSeek={handleSeek}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;