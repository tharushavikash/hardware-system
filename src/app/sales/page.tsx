import { db } from "@/db";
import { sales, saleItems, products, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ReceiptText, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const allSales = await db.select().from(sales).orderBy(desc(sales.saleDate)).limit(50);
  const allCustomers = await db.select().from(customers);
  const allProducts = await db.select().from(products);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sales History</h1>
          <p className="mt-1 text-sm text-slate-500">Recent transactions and receipts</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5">
          <ReceiptText size={18} /> Back to POS
        </Link>
      </header>

      <div className="rounded-3xl bg-white shadow-sm border border-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">ID</th>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">Date</th>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">Customer</th>
                <th className="text-left px-6 py-4 font-extrabold text-slate-700">Employee</th>
                <th className="text-right px-6 py-4 font-extrabold text-slate-700">Total</th>
                <th className="text-right px-6 py-4 font-extrabold text-slate-700">Payment</th>
                <th className="text-center px-6 py-4 font-extrabold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allSales.map(sale => {
                const customer = allCustomers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="hover:bg-amber-50/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{sale.id}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">{new Date(sale.saleDate).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{customer?.name || "Walk-in"}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{sale.employeeName}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900">${sale.totalAmount}</td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-slate-600 capitalize">{sale.paymentMethod}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600">{sale.status}</span>
                    </td>
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
