import React, { useState } from 'react';
import { Share2, Check, Copy, Loader2 } from 'lucide-react';
import useVideoStore from '../store/videoStore';
import { createShortLink } from '../utils/shareLinks';

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExistingLink, setIsExistingLink] = useState(false);
  const { videoId, timestamps } = useVideoStore();

  const handleShare = async () => {
    if (!videoId || timestamps.length === 0) return;

    setLoading(true);
    setError(null);
    setIsExistingLink(false);
    
    try {
      const currentUrl = new URL(window.location.href);
      const currentRef = currentUrl.searchParams.get('ref');
      
      const shareLink = await createShortLink(videoId, timestamps);
      const newRef = new URL(shareLink).searchParams.get('ref');
      
      // If the new ref matches the current ref, it means we're reusing the link
      setIsExistingLink(currentRef === newRef);
      
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsExistingLink(false);
      }, 2000);
    } catch (err) {
      console.error('Error sharing:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create share link. Please try again later.');
      }
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!videoId || timestamps.length === 0) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed opacity-50"
      >
        <Share2 className="w-4 h-4" />
        Add timestamps to share
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating link...
          </>
        ) : copied ? (
          <>
            <Check className="w-4 h-4" />
            {isExistingLink ? 'Link copied!' : 'New link copied!'}
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Share
          </>
        )}
      </button>
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 p-2 bg-red-100 text-red-700 text-sm rounded-md whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default ShareButton;