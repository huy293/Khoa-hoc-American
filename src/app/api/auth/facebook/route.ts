import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ⚡ Khởi tạo luồng Đăng nhập với Facebook Login
 */
export async function GET(req: NextRequest) {
  const appId = process.env.FACEBOOK_CLIENT_ID;

  if (!appId) {
    return NextResponse.json(
      { success: false, message: 'Facebook App ID chưa được cấu hình trong biến môi trường.' },
      { status: 500 }
    );
  }

  const host = req.headers.get('host') || 'course.homenest.edu.vn';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/facebook`;

  const rootUrl = 'https://www.facebook.com/v19.0/dialog/oauth';
  const searchParams = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state: 'facebook_oauth_state',
    scope: 'email,public_profile',
    response_type: 'code',
  });

  return NextResponse.redirect(`${rootUrl}?${searchParams.toString()}`);
}
