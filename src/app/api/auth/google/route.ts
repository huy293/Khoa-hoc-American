import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ⚡ Khởi tạo luồng Đăng nhập với Google OAuth 2.0
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: 'Google Client ID chưa được cấu hình trong biến môi trường.' },
      { status: 500 }
    );
  }

  const host = req.headers.get('host') || 'course.homenest.edu.vn';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/google`;

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const searchParams = new URLSearchParams({
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
  });

  return NextResponse.redirect(`${rootUrl}?${searchParams.toString()}`);
}
