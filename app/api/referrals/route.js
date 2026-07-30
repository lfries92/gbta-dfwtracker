import { put, list } from '@vercel/blob';

const FILENAME = 'referrals.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: FILENAME });
    const match = blobs.find((b) => b.pathname === FILENAME);
    if (!match) {
      return Response.json({ referrals: [] });
    }
    const fileRes = await fetch(match.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!fileRes.ok) {
      return Response.json({ referrals: [] });
    }
    const referrals = await fileRes.json();
    return Response.json({ referrals });
  } catch (error) {
    console.error('Failed to load referrals:', error);
    return Response.json({ referrals: [] });
  }
}

export async function POST(request) {
  try {
    const referrals = await request.json();
    await put(FILENAME, JSON.stringify(referrals), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to save referrals:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
