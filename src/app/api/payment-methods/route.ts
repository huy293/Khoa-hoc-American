import { NextResponse } from 'next/server';
import { getWpPaymentMethods } from '@/lib/wordpress-queries';

export async function GET() {
  try {
    const methods = await getWpPaymentMethods();
    return NextResponse.json({ success: true, methods });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Không thể lấy phương thức thanh toán' },
      { status: 500 }
    );
  }
}
