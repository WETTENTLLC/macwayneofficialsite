import { handleUpload, type HandleUploadBody } from '@vercel/blob/server'; // Use @vercel/blob/server for handleUpload

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav'],
          tokenPayload: JSON.stringify({
            userId: 'user-id-placeholder',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return new Response(JSON.stringify(jsonResponse), { status: 200 });
  } catch (error) {
    console.error("Error in blob upload handler:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
