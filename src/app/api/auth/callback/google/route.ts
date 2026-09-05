import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ⚡ Callback tiếp nhận phản hồi từ Google sau khi người dùng đồng ý đăng nhập
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = req.headers.get('host') || 'course.homenest.edu.vn';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/google`;

  if (error || !code) {
    console.error('Google OAuth error or code missing:', error);
    return NextResponse.redirect(new URL('/login?error=google_failed', siteUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Google OAuth credentials missing on server.');
    return NextResponse.redirect(new URL('/login?error=config_missing', siteUrl));
  }

  try {
    // 1. Đổi authorization code lấy Access Token & ID Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Failed to get Google tokens:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', siteUrl));
    }

    // 2. Lấy thông tin hồ sơ người dùng từ Google UserInfo API
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!userRes.ok || !googleUser.email) {
      console.error('Failed to get Google user info:', googleUser);
      return NextResponse.redirect(new URL('/login?error=userinfo_failed', siteUrl));
    }

    // 3. Chuẩn hóa đối tượng người dùng
    const user = {
      username: googleUser.email.split('@')[0] || googleUser.id,
      email: googleUser.email,
      displayName: googleUser.name || googleUser.email.split('@')[0],
      avatar: googleUser.picture || '/images/kathleen.png',
      role: 'student',
      provider: 'google',
    };

    // 4. Đồng bộ hoặc tạo User trên WordPress (nếu có endpoint)
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://course-amc.homenest.edu.vn';
    const secret = process.env.HN_API_SECRET || '';

    try {
      await fetch(`${wpUrl}/wp-json/homenest/v1/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secret,
        },
        body: JSON.stringify({
          provider: 'google',
          providerId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
        }),
      });
    } catch (wpErr) {
      console.warn('WordPress Social Sync endpoint optional fallback:', wpErr);
    }

    // 5. Tạo cookie phiên đăng nhập và chuyển hướng vào trang học tập
    const response = NextResponse.redirect(new URL('/student', siteUrl));

    response.cookies.set('hn_user_session', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return response;
  } catch (err) {
    console.error('Exception during Google OAuth process:', err);
    return NextResponse.redirect(new URL('/login?error=internal_error', siteUrl));
  }
}
