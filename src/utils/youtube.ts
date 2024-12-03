import { VideoMetadata, VideoStats } from '../types/youtube';

export const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT) {
      resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
};

export const formatTime = (seconds: number): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

export const parseTime = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export const getEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

export const getVideoMetadata = async (videoId: string): Promise<VideoMetadata | null> => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    const stats: VideoStats = {
      views: parseInt(video.statistics.viewCount).toLocaleString(),
      likes: parseInt(video.statistics.likeCount).toLocaleString(),
      uploadDate: new Date(video.snippet.publishedAt).toLocaleDateString(),
    };

    return {
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.maxresdefault?.url || video.snippet.thumbnails.high.url,
      stats,
    };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return null;
  }
};

export const generateShareLink = (videoId: string, timestamps: Timestamp[]): string => {
  const baseUrl = window.location.origin;
  const timestampsParam = encodeURIComponent(JSON.stringify(timestamps));
  return `${baseUrl}/watch?v=${videoId}&t=${timestampsParam}`;
};