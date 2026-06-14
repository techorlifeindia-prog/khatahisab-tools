import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const shortId = resolvedParams.id;

  if (!shortId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // 1. Find the destination URL
    const res = await query(
      `SELECT id, destination_url FROM dynamic_qrs WHERE short_id = $1 LIMIT 1`,
      [shortId]
    );

    if (res.rows.length === 0) {
      console.error('QR not found for ID:', shortId);
      return NextResponse.redirect(new URL('/?error=not-found', request.url));
    }

    const data = res.rows[0];

    // 2. Record analytics (Non-blocking)
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referer = request.headers.get('referer') || 'Direct';
    
    // We don't await this to keep the redirect lightning fast
    query(
      `INSERT INTO scan_analytics (qr_id, user_agent, referer) VALUES ($1, $2, $3)`,
      [data.id, userAgent, referer]
    ).catch(err => console.error("Analytics Error:", err));

    // 3. Redirect the user
    return NextResponse.redirect(data.destination_url);

  } catch (err) {
    console.error('Redirect Error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
