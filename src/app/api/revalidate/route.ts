import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Webhook Revalidation ISR cho WordPress Headless (chuẩn HomeNest)
 * Khi quản trị viên WordPress sửa bài/khóa học/sản phẩm và bấm Update,
 * WordPress sẽ gửi webhook sang endpoint này để Next.js làm mới cache ngay lập tức.
 * 
 * Ví dụ gọi webhook từ WP:
 * POST https://your-domain.com/api/revalidate?secret=YOUR_HN_API_SECRET&path=/courses/hydra-facial
 * hoặc kèm body JSON: { "secret": "...", "path": "...", "tag": "..." }
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');
    const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const headerSecret =
      req.headers.get('x-api-key') ||
      req.headers.get('x-graphql-secret') ||
      req.headers.get('x-secret-key') ||
      authHeader;

    let bodySecret = '';
    let path = url.searchParams.get('path');
    let tag = url.searchParams.get('tag');

    // Đọc body nếu có
    try {
      const body = await req.json();
      if (body) {
        bodySecret = body.secret || '';
        path = path || body.path;
        tag = tag || body.tag;
      }
    } catch {
      // Body không phải JSON hoặc rỗng, tiếp tục dùng query params
    }

    const expectedSecret = process.env.HN_API_SECRET || '';
    const incomingSecret = querySecret || headerSecret || bodySecret;

    // Kiểm tra Secret Key
    if (!expectedSecret || incomingSecret !== expectedSecret) {
      return NextResponse.json(
        {
          revalidated: false,
          message: 'Unauthorized.',
        },
        { status: 401 }
      );
    }

    // Revalidate theo path cụ thể (ví dụ: /courses, /courses/hydra-facial, /shop)
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        path,
        now: Date.now(),
      });
    }

    // Revalidate theo cache tag (ví dụ: courses, posts, products)
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        tag,
        now: Date.now(),
      });
    }

    // Nếu không truyền path hoặc tag, revalidate toàn bộ trang chủ /
    revalidatePath('/');
    return NextResponse.json({
      revalidated: true,
      type: 'default',
      path: '/',
      now: Date.now(),
    });
  } catch {
    return NextResponse.json(
      {
        revalidated: false,
        message: 'Error while revalidating cache.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
