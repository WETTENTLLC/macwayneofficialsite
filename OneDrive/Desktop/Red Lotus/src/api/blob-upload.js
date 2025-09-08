// Simple mock API route for file uploads during development
// In production, this would connect to Vercel Blob storage

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock successful response
  return res.status(200).json({ 
    url: 'https://example.com/mock-file-url.mp3',
    success: true
  });
}
