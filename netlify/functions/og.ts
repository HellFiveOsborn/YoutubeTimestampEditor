import { Handler } from '@netlify/functions';
import { getVideoMetadata } from '../../src/utils/youtube';

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

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${metadata.title} - YouTube Timestamp Editor</title>
          <meta property="og:title" content="${metadata.title} - YouTube Timestamp Editor" />
          <meta property="og:description" content="Watch this video with custom timestamps to skip unwanted segments." />
          <meta property="og:image" content="${metadata.thumbnail}" />
          <meta property="og:url" content="https://ytimestamp-editor.netlify.app/watch?v=${videoId}${ref ? `&ref=${ref}` : ''}" />
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
