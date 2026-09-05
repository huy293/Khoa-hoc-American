'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  databaseId?: number;
  title: string;
  name?: string;
  image: string;
  price: number;
  regularPrice?: number;
  code?: string;
  size?: string;
  quantity: number;
  stock?: number;
  slug?: string;
}

export interface AddToCartOptions {
  quantity?: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  memberDiscount: number;
  total: number;
  addToCart: (product: any, options?: AddToCartOptions) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cba_shopping_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Khôi phục giỏ hàng từ localStorage khi component mount (khởi tạo mảng rỗng nếu chưa có)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event('cba_cart_updated'));
      } catch (err) {
        console.warn('Could not save cart to localStorage:', err);
      }
    }
  }, [items, isHydrated]);

  // 3. Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((product: any, options: AddToCartOptions = {}) => {
    if (!product) return;

    const qtyToAdd = Math.max(1, options.quantity || 1);
    const id = String(product.id || product.databaseId || product.slug || Date.now());
    const rawPrice = product.price || product.salePrice || product.regularPrice || 0;
    
    // Parse giá tiền dạng '$ 65.00' hoặc số 65
    let numPrice = typeof rawPrice === 'number' ? rawPrice : 0;
    if (typeof rawPrice === 'string') {
      const cleanNum = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(cleanNum)) numPrice = cleanNum;
    }

    const title = product.name || product.title || 'Product';
    const image = product.image?.sourceUrl || product.image?.src || (typeof product.image === 'string' ? product.image : '/images/anh-san-pham.png');
    const size = options.size || product.size || '170ml (4oz)';
    const code = product.code || product.sku || `SKU-${String(product.id || '999').padStart(6, '0')}`;
    const stock = typeof product.stock === 'number' ? product.stock : 25;

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qtyToAdd,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id,
          databaseId: Number(product.databaseId || product.id || 0),
          title,
          name: title,
          image,
          price: numPrice > 0 ? numPrice : 65.0,
          code,
          size,
          quantity: qtyToAdd,
          stock,
          slug: product.slug,
        },
      ];
    });
  }, []);

  // 4. Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 5. Cập nhật số lượng theo delta (+1 / -1)
  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  // 6. Đặt trực tiếp số lượng
  const setQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  }, [removeFromCart]);

  // 7. Xóa sạch giỏ hàng khi đặt hàng thành công
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Các con số tổng kết
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = items.length > 0 ? 45.0 : 0;
  // Ưu đãi thành viên (Member Discount): Giảm $95 nếu đơn hàng từ $150 trở lên
  const memberDiscount = subtotal >= 150 ? 95.0 : (subtotal > 0 ? 25.0 : 0);
  const total = Math.max(0, subtotal + shippingFee - memberDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        shippingFee,
        memberDiscount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
