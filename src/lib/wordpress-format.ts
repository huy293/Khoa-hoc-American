import { SITE_URL } from './wordpress';

/**
 * Định dạng tiền tệ VND (ví dụ: 15.000.000 đ)
 */
export function formatCurrencyVND(amount?: number | string | null): string {
  if (amount === undefined || amount === null || amount === '') return 'Liên hệ';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(num)) return 'Liên hệ';
  if (num === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
}

/**
 * Định dạng ngày tháng tiếng Việt
 */
export function formatWpDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Trích xuất đoạn trích văn bản thuần túy (Plain text) từ HTML cho thẻ SEO description
 */
export function extractPlainTextExcerpt(html?: string | null, maxLength = 160): string {
  if (!html || typeof html !== 'string') return '';
  const plain = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLength ? plain.substring(0, maxLength) + '...' : plain;
}

/**
 * Thoát và bảo vệ các khối mã nguồn <code>...</code> khỏi script injection
 */
function escapeCodeBlocksAndSanitize(html: string): string {
  if (!html) return '';

  let processedHtml = html;
  const codeBlocks: string[] = [];

  processedHtml = processedHtml.replace(/<code([^>]*)>([\s\S]*?)<\/code>/gi, (match, attrs, codeContent) => {
    const cleanCode = codeContent
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/&#39;/gi, "'");

    const escapedCode = cleanCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const placeholder = `___CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}___`;
    codeBlocks.push(`<code${attrs}>${escapedCode}</code>`);
    return placeholder;
  });

  // Loại bỏ các thẻ script và style nguy hiểm
  processedHtml = processedHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  codeBlocks.forEach((codeBlockHtml, index) => {
    const placeholder = `___CODE_BLOCK_PLACEHOLDER_${index}___`;
    processedHtml = processedHtml.replace(placeholder, () => codeBlockHtml);
  });

  return processedHtml;
}

/**
 * Định dạng link trong nội dung: Tự động thêm target="_blank" cho external links
 */
export function formatContentLinks(html?: string | null): string {
  if (!html) return '';

  const sanitizedHtml = escapeCodeBlocksAndSanitize(html);

  return sanitizedHtml.replace(/<a\s+([^>]+)>/gi, (match, attributes) => {
    if (/target\s*=/i.test(attributes)) {
      return match;
    }
    const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1] && hrefMatch[1].startsWith('#')) {
      return match;
    }
    let newAttributes = attributes + ' target="_blank"';
    if (!/rel\s*=/i.test(attributes)) {
      newAttributes += ' rel="noopener noreferrer"';
    }
    return `<a ${newAttributes}>`;
  });
}

/**
 * Chuyển đổi toàn bộ thẻ H1 trong nội dung thành H2 (Chuẩn SEO HomeNest)
 */
export function replaceH1WithH2(html?: string | null): string {
  if (!html) return '';
  const cleanHtml = html.replace(/<h1([^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  return formatContentLinks(cleanHtml);
}

/**
 * Làm sạch nội dung Gutenberg HTML từ WordPress
 */
export function cleanWpContent(html?: string | null): string {
  return replaceH1WithH2(html);
}

/**
 * Chuyển đổi chuỗi thành slug URL chuẩn (ví dụ: 'Evidence-Based Protocols' -> 'evidence-based-protocols')
 */
export function toSlug(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

