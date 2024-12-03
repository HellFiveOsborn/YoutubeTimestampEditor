import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Props {
  metadata: {
    title: string;
    description: string;
    thumbnail: string;
    videoId: string;
    ref?: string;
  } | null;
}

export default function Watch({ metadata }: Props) {
  if (!metadata) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ytimestamp-editor.netlify.app';
  const currentUrl = `${baseUrl}/watch?v=${metadata.videoId}${metadata.ref ? `&ref=${metadata.ref}` : ''}`;

  return (
    <>
      <Head>
        <title>{metadata.title} - YouTube Timestamp Editor</title>
        
        {/* Primary Meta Tags */}
        <meta name="title" content={`${metadata.title} - YouTube Timestamp Editor`} />
        <meta name="description" content={metadata.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={`${metadata.title} - YouTube Timestamp Editor`} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.thumbnail} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={`${metadata.title} - YouTube Timestamp Editor`} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.thumbnail} />
      </Head>
      <div>Loading video...</div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const videoId = query.v as string;
  const ref = query.ref as string;

  if (!videoId) {
    return { props: { metadata: null } };
  }

  try {
    const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.items?.[0]) {
      return { props: { metadata: null } };
    }

    const video = data.items[0];
    const metadata = {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.maxresdefault?.url || video.snippet.thumbnails.high.url,
      videoId,
      ref,
    };

    return { props: { metadata } };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return { props: { metadata: null } };
  }
}
