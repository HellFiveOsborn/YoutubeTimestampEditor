import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoState, VideoActions, Timestamp } from '../types/youtube';
import { getShareData } from '../utils/shareLinks';

interface VideoStore extends VideoState, VideoActions {}

const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videoId: null,
      videoTitle: null,
      videoThumbnail: null,
      videoStats: null,
      timestamps: [],
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isDarkMode: true,
      isInvalidLink: false,

      setVideoId: (id) => set({ 
        videoId: id, 
        isInvalidLink: false,
        // Reset video-specific state
        timestamps: [],
        videoTitle: null,
        videoThumbnail: null,
        videoStats: null,
        currentTime: 0,
        duration: 0,
        isPlaying: false
      }),

      setVideoInfo: (title, thumbnail) => set({ videoTitle: title, videoThumbnail: thumbnail }),
      setVideoStats: (stats) => set({ videoStats: stats }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setInvalidLink: () => set({ isInvalidLink: true, videoId: null, timestamps: [] }),

      addTimestamp: (start, end, label = '', id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`) =>
        set((state) => ({
          timestamps: [
            ...state.timestamps,
            {
              id,
              start,
              end,
              label,
            },
          ].sort((a, b) => a.start - b.start), // Sort timestamps by start time
        })),

      removeTimestamp: (id) =>
        set((state) => ({
          timestamps: state.timestamps.filter((t) => t.id !== id),
        })),

      loadFromShareLink: async (params: URLSearchParams) => {
        const videoId = params.get('v');
        const ref = params.get('ref');
        const timestampsParam = params.get('t');

        if (!videoId) {
          set({ isInvalidLink: true });
          return;
        }

        try {
          if (ref) {
            // Try to load from Supabase
            const shareData = await getShareData(ref);
            if (!shareData) {
              set({ isInvalidLink: true });
              return;
            }
            set({
              videoId: shareData.videoId,
              timestamps: shareData.timestamps.map(t => ({
                ...t,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`
              })),
              isInvalidLink: false,
            });
          } else if (timestampsParam) {
            // Try to load from URL parameters
            try {
              const timestamps = JSON.parse(decodeURIComponent(timestampsParam));
              if (!Array.isArray(timestamps) || !timestamps.every(isValidTimestamp)) {
                set({ isInvalidLink: true });
                return;
              }
              set({
                videoId,
                timestamps: timestamps.map(t => ({
                  ...t,
                  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`
                })),
                isInvalidLink: false,
              });
            } catch (e) {
              set({ isInvalidLink: true });
              return;
            }
          } else {
            // Just load the video without timestamps
            set({
              videoId,
              timestamps: [],
              isInvalidLink: false,
            });
          }
        } catch (error) {
          console.error('Error loading share link:', error);
          set({ isInvalidLink: true });
        }
      },
    }),
    {
      name: 'video-store',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

// Helper function to validate timestamp structure
function isValidTimestamp(t: any): t is Timestamp {
  return (
    typeof t === 'object' &&
    t !== null &&
    typeof t.start === 'number' &&
    typeof t.end === 'number' &&
    t.start >= 0 &&
    t.end > t.start &&
    (!t.label || typeof t.label === 'string')
  );
}

export default useVideoStore;