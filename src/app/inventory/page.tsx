import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const allProducts = await db.select().from(products).orderBy(products.name);
  const allCategories = await db.select().from(categories);

  const lowStock = allProducts.filter(p => p.stockQuantity <= p.lowStockThreshold);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">Stock levels and low-stock alerts</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5">
          <Wrench size={18} /> Products
        </Link>
      </header>

      {/* Low Stock Alert */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600"><AlertTriangle size={24} /></div>
          <div>
            <h3 className="text-base font-extrabold text-amber-900">Low Stock Alert</h3>
            <p className="text-sm text-amber-700">{lowStock.length} product{lowStock.length !== 1 ? 's' : ''} running low — consider restocking.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allProducts.map(product => {
          const catName = allCategories.find(c => c.id === product.categoryId)?.name || "—";
          const low = product.stockQuantity <= product.lowStockThreshold;
          return (
            <div key={product.id} className={`rounded-3xl bg-white border shadow-sm p-5 transition hover:shadow-md ${low ? "border-amber-300/70 ring-1 ring-amber-200" : "border-slate-200/50"}`}>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{product.name}</h3>
                {low ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-extrabold text-red-600">LOW</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600">OK</span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400 font-medium">{product.sku} · {catName}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Quantity</p>
                  <p className={`text-2xl font-extrabold ${low ? "text-amber-600" : "text-emerald-600"}`}>{product.stockQuantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-medium">Threshold</p>
                  <p className="text-sm font-bold text-slate-500">{product.lowStockThreshold}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
