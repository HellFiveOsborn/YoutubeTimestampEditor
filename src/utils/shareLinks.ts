import { supabase } from '../lib/supabase';
import { Timestamp } from '../types/youtube';

// Generate a random short reference ID
function generateShortRef(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface ShareData {
  videoId: string;
  timestamps: Timestamp[];
}

interface ShareLink {
  ref: string;
  video_id: string;
  timestamps: Timestamp[];
  created_at: string;
}

// Compare two arrays of timestamps to check if they are equal
function areTimestampsEqual(timestamps1: Timestamp[], timestamps2: Timestamp[]): boolean {
  if (timestamps1.length !== timestamps2.length) return false;
  
  return timestamps1.every((t1, index) => {
    const t2 = timestamps2[index];
    return t1.start === t2.start && t1.end === t2.end && t1.label === t2.label;
  });
}

// Create a fallback share link using URL parameters
function createFallbackLink(videoId: string, timestamps: Timestamp[]): string {
  const baseUrl = window.location.origin;
  const timestampsParam = encodeURIComponent(JSON.stringify(timestamps));
  return `${baseUrl}/watch?v=${videoId}&t=${timestampsParam}`;
}

async function findExistingShareLink(videoId: string, timestamps: Timestamp[]): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('share_links')
      .select('ref, timestamps')
      .eq('video_id', videoId);

    if (error) {
      console.error('Error finding existing share link:', error);
      return null;
    }

    // Find a link with matching timestamps
    const match = data?.find(link => areTimestampsEqual(timestamps, link.timestamps));
    return match ? match.ref : null;
  } catch (error) {
    console.error('Error finding existing share link:', error);
    return null;
  }
}

export async function createShortLink(videoId: string, timestamps: Timestamp[]): Promise<string> {
  try {
    // First, try to find an existing link with the same video and timestamps
    const existingRef = await findExistingShareLink(videoId, timestamps);
    if (existingRef) {
      const baseUrl = window.location.origin;
      return `${baseUrl}/watch?v=${videoId}&ref=${existingRef}`;
    }

    // If no existing link found, create a new one
    const ref = generateShortRef();
    const shareData: Omit<ShareLink, 'created_at'> = {
      ref,
      video_id: videoId,
      timestamps: timestamps,
    };

    const { error, data } = await supabase
      .from('share_links')
      .insert([shareData])
      .select('ref')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // If we get a database error, fall back to URL parameters
      if (error.code === '42P01' || error.code === '23505' || error.message?.includes('quota')) {
        console.log('Using fallback sharing mechanism');
        return createFallbackLink(videoId, timestamps);
      }
      throw new Error(error.message || 'Failed to create share link');
    }

    if (!data) {
      throw new Error('No data returned from Supabase');
    }

    const baseUrl = window.location.origin;
    return `${baseUrl}/watch?v=${videoId}&ref=${ref}`;
  } catch (error) {
    console.error('Error creating short link:', error);
    // If any error occurs, fall back to URL parameters
    return createFallbackLink(videoId, timestamps);
  }
}

export async function getShareData(ref: string): Promise<ShareData | null> {
  try {
    const { data, error } = await supabase
      .from('share_links')
      .select('video_id, timestamps')
      .eq('ref', ref)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to fetch share data');
    }

    if (!data) return null;

    return {
      videoId: data.video_id,
      timestamps: data.timestamps,
    };
  } catch (error) {
    console.error('Error fetching share data:', error);
    throw new Error('Failed to fetch share data. Please try again later.');
  }
}
