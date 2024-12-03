export interface Timestamp {
  id: string;
  start: number;
  end: number;
  label?: string;
}

export interface VideoStats {
  views: string;
  likes: string;
  uploadDate: string;
}

export interface VideoState {
  videoId: string | null;
  videoTitle: string | null;
  videoThumbnail: string | null;
  videoStats: VideoStats | null;
  timestamps: Timestamp[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isDarkMode: boolean;
  isInvalidLink: boolean;
}

export interface VideoActions {
  setVideoId: (id: string) => void;
  setVideoInfo: (title: string, thumbnail: string) => void;
  setVideoStats: (stats: VideoStats) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleDarkMode: () => void;
  setInvalidLink: () => void;
  addTimestamp: (start: number, end: number, label?: string) => void;
  removeTimestamp: (id: string) => void;
  loadFromShareLink: (params: URLSearchParams) => Promise<void>;
}