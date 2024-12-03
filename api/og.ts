import { getVideoMetadata } from '../src/utils/youtube';

export default async function handler(req: any, res: any) {
  const { v: videoId, ref } = req.query;

  try {
    const metadata = await getVideoMetadata(videoId);
    
    if (!metadata) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`
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
    `);
  } catch (error) {
    console.error('Error generating OG tags:', error);
    res.status(500).json({ error: 'Failed to generate OG tags' });
  }
}
