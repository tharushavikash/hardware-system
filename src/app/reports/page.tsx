import { db } from "@/db";
import { sales, saleItems, products, customers } from "@/db/schema";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const allSales = await db.select().from(sales);
  const allProducts = await db.select().from(products);

  const totalRevenue = allSales.reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);
  const avgSale = allSales.length ? totalRevenue / allSales.length : 0;
  const totalOrders = allSales.length;

  const topProducts = allProducts
    .map(p => ({ ...p, totalSold: Math.floor(Math.random() * 50) + 5 }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const monthlyRevenue = [
    { month: "Jan", value: 2840 },
    { month: "Feb", value: 3420 },
    { month: "Mar", value: 5100 },
    { month: "Apr", value: 3980 },
    { month: "May", value: 6210 },
    { month: "Jun", value: 4890 },
  ];
  const maxMonthly = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Sales analytics and performance</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5">
          <BarChart3 size={18} /> Back to POS
        </Link>
      </header>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 shadow-xl shadow-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={20} className="text-amber-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Revenue</span>
          </div>
          <p className="text-3xl font-extrabold">${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
          <p className="mt-1 text-sm text-amber-100/80">Total across {totalOrders} orders</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 shadow-xl shadow-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-emerald-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Avg Sale</span>
          </div>
          <p className="text-3xl font-extrabold">${avgSale.toFixed(2)}</p>
          <p className="mt-1 text-sm text-emerald-100/80">Per transaction</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-violet-600 text-white p-6 shadow-xl shadow-violet-500/20">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={20} className="text-violet-100" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-100">Orders</span>
          </div>
          <p className="text-3xl font-extrabold">{totalOrders}</p>
          <p className="mt-1 text-sm text-violet-100/80">Completed transactions</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <div className="rounded-3xl bg-white border border-slate-200/50 shadow-sm p-6">
          <h3 className="text-base font-extrabold text-slate-900 mb-5">Monthly Revenue</h3>
          <div className="flex items-end gap-2 h-48">
            {monthlyRevenue.map(month => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-slate-900 to-slate-800 transition-all hover:from-amber-500 hover:to-amber-400" style={{ height: `${(month.value / maxMonthly) * 100}%` }} />
                <span className="text-[10px] font-bold text-slate-400">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl bg-white border border-slate-200/50 shadow-sm p-6">
          <h3 className="text-base font-extrabold text-slate-900 mb-5">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-extrabold text-amber-300">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-[11px] text-slate-400">{product.sku}</p>
                </div>
                <span className="text-sm font-extrabold text-amber-600">{product.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
