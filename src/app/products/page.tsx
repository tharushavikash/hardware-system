import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { Package, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products).orderBy(products.name);
  const allCategories = await db.select().from(categories);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Product Catalog</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and browse hardware products</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5">
          <Package size={18} /> Back to POS
        </Link>
      </header>

      <div className="rounded-3xl bg-white shadow-sm border border-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">SKU</th>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">Name</th>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">Category</th>
                <th className="text-right px-6 py-4 font-extrabold text-slate-700">Price</th>
                <th className="text-right px-6 py-4 font-extrabold text-slate-700">Stock</th>
                <th className="text-right px-6 py-4 font-extrabold text-slate-700">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProducts.map(product => {
                const catName = allCategories.find(c => c.id === product.categoryId)?.name || "—";
                const isLow = product.stockQuantity <= product.lowStockThreshold;
                return (
                  <tr key={product.id} className="hover:bg-amber-50/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">{catName}</span></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">${product.price}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${isLow ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">${product.cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
