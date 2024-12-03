import { Handler } from '@netlify/functions';

const getVideoMetadata = async (videoId: string) => {
  const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    return {
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.maxresdefault?.url || video.snippet.thumbnails.high.url,
    };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return null;
  }
};

const handler: Handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const videoId = params.get('v');
  const ref = params.get('ref');

  if (!videoId) {
    return {
      statusCode: 404,
      body: 'Video ID not found'
    };
  }

  try {
    const metadata = await getVideoMetadata(videoId);
    
    if (!metadata) {
      return {
        statusCode: 404,
        body: 'Video not found'
      };
    }

    const baseUrl = 'https://ytimestamp-editor.netlify.app';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${metadata.title} - YouTube Timestamp Editor</title>
          <meta property="og:title" content="${metadata.title} - YouTube Timestamp Editor" />
          <meta property="og:description" content="Watch this video with custom timestamps to skip unwanted segments." />
          <meta property="og:image" content="${metadata.thumbnail}" />
          <meta property="og:url" content="${baseUrl}/watch?v=${videoId}${ref ? `&ref=${ref}` : ''}" />
          <meta property="og:type" content="video.other" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metadata.title} - YouTube Timestamp Editor" />
          <meta name="twitter:description" content="Watch this video with custom timestamps to skip unwanted segments." />
          <meta name="twitter:image" content="${metadata.thumbnail}" />
          
          <meta http-equiv="refresh" content="0;url=/watch?v=${videoId}${ref ? `&ref=${ref}` : ''}" />
        </head>
        <body>
          Redirecting...
        </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
      body: html,
    };
  } catch (error) {
    console.error('Error generating OG tags:', error);
    return {
      statusCode: 500,
      body: 'Failed to generate OG tags'
    };
  }
};

export { handler };
