import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, customerId, paymentMethod, employeeName, discountPercent, totalAmount, taxAmount, discountAmount } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create sale
    const [newSale] = await db.insert(sales).values({
      customerId: customerId ? parseInt(customerId) : null,
      totalAmount: totalAmount.toString(),
      taxAmount: taxAmount.toString(),
      discountAmount: discountAmount ? discountAmount.toString() : "0.00",
      paymentMethod: paymentMethod || "cash",
      employeeName: employeeName || "Staff",
      status: "completed",
    }).returning();

    // Create sale items and update stock
    for (const item of cart) {
      await db.insert(saleItems).values({
        saleId: newSale.id,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        subtotal: (item.price * item.quantity).toString(),
      });

      // Update product stock
      await db.update(products)
        .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
        .where(eq(products.id, item.id));
    }

    return NextResponse.json({ success: true, saleId: newSale.id }, { status: 200 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
