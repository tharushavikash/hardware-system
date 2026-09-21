"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Package, ReceiptText, Users, BarChart3, Wrench, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navItems = [
  { href: "/", label: "Point of Sale", icon: ShoppingCart },
  { href: "/products", label: "Products", icon: Package },
  { href: "/sales", label: "Sales", icon: ReceiptText },
  { href: "/inventory", label: "Inventory", icon: Wrench },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function SidebarLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-slate-900 p-2.5 text-white shadow-xl md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-200 shadow-2xl transition-transform duration-300 ease-out md:translate-x-0 md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-800/60 px-6 py-5">
            <Logo />
            <p className="mt-1 text-xs text-slate-400">Point of Sale System</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-slate-800 hover:text-amber-300 hover:shadow-inner hover:shadow-amber-900/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors group-hover:bg-amber-900/20 group-hover:text-amber-300">
                        <Icon size={18} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-slate-800/60 px-6 py-5">
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-inner">
              <p className="text-xs text-slate-400">Store Status</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-emerald-300">Open & Active</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Last sync: just now</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
