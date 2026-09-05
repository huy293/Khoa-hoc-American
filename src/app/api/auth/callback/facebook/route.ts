import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ⚡ Callback tiếp nhận phản hồi từ Facebook sau khi người dùng đồng ý đăng nhập
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = req.headers.get('host') || 'course.homenest.edu.vn';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/facebook`;

  if (error || !code) {
    console.error('Facebook OAuth error or code missing:', error);
    return NextResponse.redirect(new URL('/login?error=facebook_failed', siteUrl));
  }

  const appId = process.env.FACEBOOK_CLIENT_ID;
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!appId || !appSecret) {
    console.error('Facebook OAuth credentials missing on server.');
    return NextResponse.redirect(new URL('/login?error=config_missing', siteUrl));
  }

  try {
    // 1. Đổi code lấy User Access Token
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Failed to get Facebook token:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', siteUrl));
    }

    // 2. Lấy thông tin tài khoản Facebook Graph API
    const userRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`
    );
    const fbUser = await userRes.json();

    if (!userRes.ok || !fbUser.id) {
      console.error('Failed to get Facebook user profile:', fbUser);
      return NextResponse.redirect(new URL('/login?error=userinfo_failed', siteUrl));
    }

    const email = fbUser.email || `fb_${fbUser.id}@facebook.user`;
    const user = {
      username: fbUser.email ? fbUser.email.split('@')[0] : `fb_${fbUser.id}`,
      email,
      displayName: fbUser.name || 'Học Viên Facebook',
      avatar: fbUser.picture?.data?.url || '/images/kathleen.png',
      role: 'student',
      provider: 'facebook',
    };

    // 3. Đồng bộ với WordPress (nếu có endpoint)
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
          provider: 'facebook',
          providerId: fbUser.id,
          email,
          name: fbUser.name,
          avatar: fbUser.picture?.data?.url,
        }),
      });
    } catch (wpErr) {
      console.warn('WordPress Social Sync optional fallback:', wpErr);
    }

    // 4. Tạo cookie phiên đăng nhập và chuyển hướng vào trang học tập
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
    console.error('Exception during Facebook OAuth process:', err);
    return NextResponse.redirect(new URL('/login?error=internal_error', siteUrl));
  }
}
