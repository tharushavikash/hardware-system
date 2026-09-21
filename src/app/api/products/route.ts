import { NextResponse } from "next/server";
import { db } from "@/db";
import { products as productsTable, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allProducts = await db.select().from(productsTable).where(eq(productsTable.isActive, true));
    const allCategories = await db.select().from(categories);
    return NextResponse.json({ products: allProducts, categories: allCategories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
