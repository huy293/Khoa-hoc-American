import { FetchOptions, WPGraphQLResponse } from '@/types/wordpress';

/**
 * Cấu hình Endpoint & Secret Key cho WordPress Headless (chuẩn HomeNest)
 */
export const WP_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.WORDPRESS_URL ||
  'https://course-amc.homenest.edu.vn'
).replace(/\/$/, '');
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://course.homenest.edu.vn'
).replace(/\/$/, '');
export const WP_GRAPHQL_ENDPOINT = WP_URL ? `${WP_URL}/graphql` : '';
export const WP_REST_ENDPOINT = WP_URL ? `${WP_URL}/wp-json/wp/v2` : '';
export const WP_SECRET = process.env.HN_API_SECRET || 'khoa-hoc-my-x-homenest-x-nguyen-x-huy';
export const DEFAULT_REVALIDATE = Number(process.env.REVALIDATE_TIME) || 3600;

/**
 * Tạo headers bảo mật cho các request gửi sang WordPress
 * Khớp với hàm hn_check_api_permission() trên backend HomeNest:
 * - Authorization: Bearer <SECRET>
 * - x-api-key: <SECRET>
 * - x-graphql-secret: <SECRET>
 * - x-secret-key: <SECRET>
 */
export function getWpAuthHeaders(customHeaders: HeadersInit = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 NextJS/HomeNest',
  };

  if (WP_SECRET) {
    headers['Authorization'] = `Bearer ${WP_SECRET}`;
    headers['x-api-key'] = WP_SECRET;
    headers['x-graphql-secret'] = WP_SECRET;
    headers['x-secret-key'] = WP_SECRET;
  }

  if (Array.isArray(customHeaders)) {
    customHeaders.forEach(([key, val]) => {
      headers[key] = val;
    });
  } else if (customHeaders instanceof Headers) {
    customHeaders.forEach((val, key) => {
      headers[key] = val;
    });
  } else if (typeof customHeaders === 'object' && customHeaders !== null) {
    Object.assign(headers, customHeaders);
  }

  return headers;
}

/**
 * Thay thế domain WordPress Backend thành domain Frontend trong dữ liệu trả về
 */
export function replaceWordpressURLs<T>(data: T): T {
  if (!data || !WP_URL || !SITE_URL) return data;
  try {
    let stringified = JSON.stringify(data);
    const escapedWpUrl = WP_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Chỉ thay thế URL trang/link, giữ nguyên domain cho hình ảnh & media (/wp-content/, /wp-includes/)
    const regex = new RegExp(`${escapedWpUrl}(?!\\/(wp-content|wp-includes))`, 'g');
    stringified = stringified.replace(regex, SITE_URL);
    return JSON.parse(stringified);
  } catch (error) {
    console.warn('[wordpress] Lỗi thay thế URLs:', error);
    return data;
  }
}

/**
 * ⚡ fetchGraphQL chuẩn HomeNest:
 * - Hỗ trợ timeout & retry 2 lần (exponential backoff)
 * - Tự động giãn cách 150ms khi đang build để tránh nghẽn MySQL
 * - Tự động fallback an toàn trong phase-production-build để không làm chết build
 */
export async function fetchGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {},
  options: FetchOptions = {}
): Promise<T | null> {
  if (!WP_GRAPHQL_ENDPOINT) {
    return null;
  }

  const {
    revalidate = DEFAULT_REVALIDATE,
    tags,
    headers: customHeaders,
    retries = 2,
  } = options;

  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  const timeoutMs = isBuild ? 60000 : 15000;

  // Giãn cách 150ms khi build để MySQL không bị quá tải
  if (isBuild) {
    await new Promise((r) => setTimeout(r, 150));
  }

  const headers = getWpAuthHeaders(customHeaders);
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(timeoutMs),
      };

      if (revalidate === 0) {
        fetchOptions.cache = 'no-store';
      } else {
        fetchOptions.next = {
          revalidate,
          ...(tags && tags.length > 0 ? { tags } : {}),
        };
      }

      const res = await fetch(WP_GRAPHQL_ENDPOINT, fetchOptions);

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('json')) {
        const text = await res.text();
        throw new Error(`[fetchGraphQL] Phản hồi không phải JSON: ${text.slice(0, 300)}`);
      }

      const json: WPGraphQLResponse<T> = await res.json();

      if (json.errors && json.errors.length > 0) {
        const errorMsg = json.errors.map((e) => e.message).join(' | ');
        console.warn(`[fetchGraphQL] GraphQL errors: ${errorMsg}`);
        if (!json.data) {
          throw new Error(`[fetchGraphQL] Không có dữ liệu: ${errorMsg}`);
        }
        return replaceWordpressURLs(json.data);
      }

      return json.data ? replaceWordpressURLs(json.data) : null;
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        const delay = attempt * 1000;
        console.warn(`[fetchGraphQL] Thử lại (${attempt}/${retries}) sau ${delay}ms:`, err.message);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error('[fetchGraphQL] Lỗi kết nối GraphQL:', err.message || err);
      if (isBuild) {
        console.warn('[fetchGraphQL] Trả về null khi build để tránh crash build.');
        return null;
      }
      return null;
    }
  }

  return null;
}

/**
 * ⚡ fetchWpRest chuẩn HomeNest:
 * - Hỗ trợ timeout & retry
 * - Tự động gắn header xác thực
 */
export async function fetchWpRest<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let fullUrl = '';

  if (cleanEndpoint.startsWith('/wp-json/')) {
    fullUrl = `${WP_URL}${cleanEndpoint}`;
  } else {
    fullUrl = `${WP_REST_ENDPOINT}${cleanEndpoint}`;
  }

  if (!WP_URL) {
    return null;
  }

  const {
    method = options.method || 'GET',
    body = options.body,
    revalidate = DEFAULT_REVALIDATE,
    tags,
    headers: customHeaders,
    retries = 2,
  } = options;

  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  const timeoutMs = isBuild ? 60000 : 15000;

  if (isBuild) {
    await new Promise((r) => setTimeout(r, 150));
  }

  const headers = getWpAuthHeaders(customHeaders);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: AbortSignal.timeout(timeoutMs),
        ...(body ? { body } : {}),
      };

      if (method === 'GET') {
        if (revalidate === 0) {
          fetchOptions.cache = 'no-store';
        } else {
          fetchOptions.next = {
            revalidate,
            ...(tags && tags.length > 0 ? { tags } : {}),
          };
        }
      } else {
        fetchOptions.cache = 'no-store';
      }

      const res = await fetch(fullUrl, fetchOptions);

      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        return null;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('json')) {
        return null;
      }

      const data = await res.json();
      return replaceWordpressURLs(data);
    } catch (err: any) {
      if (attempt < retries) {
        const delay = attempt * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return null;
    }
  }

  return null;
}

/**
 * Gửi dữ liệu form sang WordPress (Server-side proxy)
 */
export async function submitWpForm(
  endpoint: string,
  bodyData: Record<string, any>
): Promise<any> {
  const fullUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${WP_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = getWpAuthHeaders();

  const res = await fetch(fullUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyData),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi gửi form sang WordPress (${res.status}): ${errorText.slice(0, 200)}`);
  }

  return await res.json();
}
