// Force Vercel to use the latest version - build cache bust
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response('No file found', { status: 400 });
    }
    
    // Get file data
    const buffer = await file.arrayBuffer();
    
    const blob = await put(file.name, buffer, {
      access: 'public',
      contentType: file.type,
    });
    
    return new Response(JSON.stringify({
      url: blob.url,
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json' 
      }
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response('Error uploading file', { status: 500 });
  }
}
