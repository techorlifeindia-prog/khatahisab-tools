import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { destinationUrl, type } = await request.json();

    if (!destinationUrl) {
      return NextResponse.json({ error: 'Destination URL is required' }, { status: 400 });
    }

    // Generate a short ID (e.g., 6 characters)
    const shortId = uuidv4().substring(0, 6);

    // Save to Database
    const res = await query(
      `INSERT INTO dynamic_qrs (short_id, destination_url, qr_type) VALUES ($1, $2, $3) RETURNING *`,
      [shortId, destinationUrl, type || 'url']
    );

    const insertedData = res.rows[0];

    // Generate the short URL based on the current origin
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${host}/q/${shortId}`;

    return NextResponse.json({ shortUrl, shortId });
  } catch (err: any) {
    console.error('DB Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
