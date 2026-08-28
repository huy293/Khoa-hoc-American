import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 * Preview / Draft Mode Route Handler cho WordPress Headless
 * Cho phép xem trước bài viết / khóa học ở trạng thái bản nháp (Draft) trực tiếp từ WP Admin
 * 
 * URL gọi từ WP: https://domain.com/api/draft?secret=HN_API_SECRET&slug=bai-viet-mau&type=post
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') || 'courses';

  const expectedSecret = process.env.HN_API_SECRET || '';

  if (!expectedSecret || secret !== expectedSecret) {
    return new Response('Invalid secret token', { status: 401 });
  }

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  // Bật Draft Mode trong Next.js
  const draft = await draftMode();
  draft.enable();

  // Chuyển hướng tới trang cần xem trước
  let destination = `/${slug}`;
  if (type === 'course' || type === 'courses') {
    destination = `/courses/${slug}`;
  } else if (type === 'post' || type === 'posts' || type === 'blog') {
    destination = `/blog/${slug}`;
  } else if (type === 'shop' || type === 'product' || type === 'products') {
    destination = `/shop/${slug}`;
  }

  redirect(destination);
}
