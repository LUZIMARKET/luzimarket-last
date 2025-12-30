import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/services/order-service";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { orderNumber } = await params;

    // Get order using OrderService
    // If admin, pass undefined for userId to bypass ownership check
    const userIdToCheck = session.user.role === 'admin' ? undefined : session.user.id;

    console.log(`[API] Fetching order ${orderNumber}. User role: ${session.user.role}`);
    const result = await getOrderByNumber(orderNumber, userIdToCheck);

    if (!result.success) {
      console.log(`[API] Order not found or access denied`);
      return NextResponse.json(
        { error: result.error || "Orden no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: result.order,
      relatedOrders: result.relatedOrders || []
    });

  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}