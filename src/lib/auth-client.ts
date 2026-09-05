'use client';

import { useState, useEffect, useCallback } from 'react';
import { WPAuthUser } from '@/types/wordpress';

/**
 * Sinh URL avatar mặc định theo tên với bảng màu vàng đồng thương hiệu Couture (#AF8861)
 */
export function generateUserAvatar(name?: string): string {
  const cleanName = (name || 'User').trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=AF8861&color=ffffff&size=150&bold=true`;
}

/**
 * Đọc an toàn thông tin phiên đăng nhập từ cookie 'hn_user_session'
 */
export function getStoredUserSession(): WPAuthUser | null {
  if (typeof document === 'undefined') return null;

  try {
    const match = document.cookie.match(/(?:^|;\s*)hn_user_session=([^;]*)/);
    if (!match || !match[1]) return null;

    const cookieVal = match[1];
    let parsed: WPAuthUser | null = null;

    try {
      parsed = JSON.parse(decodeURIComponent(cookieVal));
    } catch {
      parsed = JSON.parse(cookieVal);
    }

    // Đảm bảo nếu user chưa có avatar thì cấp ngay avatar dựa trên tên
    if (parsed) {
      const name = parsed.displayName || parsed.name || parsed.username || 'Học viên';
      if (!parsed.avatar || parsed.avatar.trim() === '' || parsed.avatar.includes('kathleen')) {
        parsed.avatar = generateUserAvatar(name);
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Hook truy xuất thông tin người dùng đã đăng nhập trong WordPress Headless
 */
export function useAuthUser() {
  const [user, setUser] = useState<WPAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // 1. Đọc ngay từ cookie để UI có dữ liệu tức thì, không bị nhấp nháy
    const stored = getStoredUserSession();
    if (stored) {
      setUser(stored);
      setIsLoading(false);
    }

    // 2. Đồng bộ ngầm với API để lấy avatar và thông tin mới nhất từ WordPress
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.user) {
          const wpUser = data.user;
          const name = wpUser.displayName || wpUser.name || wpUser.username || 'Học viên';
          if (!wpUser.avatar || wpUser.avatar.trim() === '' || wpUser.avatar.includes('kathleen')) {
            wpUser.avatar = generateUserAvatar(name);
          }
          setUser(wpUser);
        } else if (!stored) {
          setUser(null);
        }
      }
    } catch {
      // Giữ nguyên dữ liệu từ cookie nếu API gặp sự cố mạng
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Lắng nghe sự kiện đăng nhập / đăng xuất hoặc thay đổi profile giữa các tab
    const handleAuthChange = () => {
      refreshUser();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('hn_auth_change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('hn_auth_change', handleAuthChange);
    };
  }, [refreshUser]);

  const isTeacher =
    user?.role === 'teacher' ||
    user?.role === 'instructor' ||
    user?.role === 'administrator';

  const isAdmin = user?.role === 'administrator' || user?.role === 'admin';

  const basePath = isTeacher ? '/teacher' : '/student';

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.username ||
    (isTeacher ? 'Giảng viên' : 'Học viên');

  const roleBadge = isAdmin
    ? 'Admin account'
    : isTeacher
    ? 'Teacher account'
    : 'Student account';

  // Kiểm tra avatar: nếu có custom avatar hợp lệ thì dùng, ngược lại tạo avatar theo tên
  const rawAvatar = user?.avatar;
  const hasValidCustomAvatar = !!rawAvatar && rawAvatar.trim() !== '' && !rawAvatar.includes('kathleen.png');

  const avatar = hasValidCustomAvatar
    ? rawAvatar
    : user
    ? generateUserAvatar(displayName)
    : '/images/kathleen.png';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase() || 'U';

  return {
    user,
    displayName,
    email: user?.email || '',
    avatar,
    initials,
    role: user?.role || 'student',
    roleBadge,
    isTeacher,
    isAdmin,
    basePath,
    isAuthenticated: !!user,
    isLoading,
    refreshUser,
  };
}
