import { NextRequest, NextResponse } from 'next/server';
import { getWpUserOrders } from '@/lib/wordpress-queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const userEmail = searchParams.get('userEmail') || undefined;

    const orders = await getWpUserOrders({ userId, userEmail });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Lỗi lấy lịch sử thanh toán:', error);
    return NextResponse.json(
      {
        success: false,
        orders: [],
        message: error.message || 'Không thể lấy lịch sử thanh toán',
      },
      { status: 500 }
    );
  }
}
