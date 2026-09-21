import { db } from "@/db";
import { customers, sales } from "@/db/schema";
import { Users, Mail, Phone } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const allCustomers = await db.select().from(customers).orderBy(customers.name);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Registered buyers and accounts</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5">
          <Users size={18} /> Back to POS
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCustomers.map(customer => (
          <div key={customer.id} className="rounded-3xl bg-white border border-slate-200/50 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-lg font-extrabold shadow-lg shadow-amber-400/20">
                {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{customer.name}</h3>
                <p className="text-xs text-slate-400 font-medium">Customer #{customer.id}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-600 transition">
                  <Mail size={14} className="text-slate-400" /> {customer.email}
                </a>
              )}
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-600 transition">
                  <Phone size={14} className="text-slate-400" /> {customer.phone}
                </a>
              )}
              {customer.address && (
                <p className="text-sm text-slate-500">{customer.address}</p>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400 font-medium">Total Spent</span>
              <span className="text-xl font-extrabold text-amber-600">${customer.totalSpent}</span>
            </div>
            {customer.notes && (
              <p className="mt-3 text-xs text-slate-400 italic">{customer.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
