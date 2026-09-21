"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ReceiptText, User, Package, ShoppingCart, ArrowRight, Sparkles } from "lucide-react";

interface CartItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
}

export default function POSPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [employeeName, setEmployeeName] = useState("Alex Rivera");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const [products, setProducts] = useState<{id: number; sku: string; name: string; category: string; price: number; stock: number; imageUrl?: string}[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (data.products) {
          const mapped = data.products.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            category: data.categories?.find((c: any) => c.id === p.categoryId)?.name || "Other",
            price: parseFloat(p.price),
            stock: p.stockQuantity,
            imageUrl: p.imageUrl || "",
          }));
          setProducts(mapped);
          const cats = ["All", ...(Array.from(new Set(mapped.map((p: any) => p.category))) as string[])];
          setCategories(cats);
        }
      })
      .catch(console.error);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const addToCart = useCallback((product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(1, i.quantity + delta);
      return { ...i, quantity: Math.min(newQty, i.stock) };
    }));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const taxRate = 0.08;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customerId: selectedCustomer || null,
          paymentMethod,
          employeeName,
          discountPercent,
          totalAmount: total.toFixed(2),
          taxAmount: tax.toFixed(2),
          discountAmount: discount.toFixed(2),
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      setCheckoutDone(true);
      setTimeout(() => {
        setCart([]);
        setCheckoutDone(false);
        setDiscountPercent(0);
      }, 2500);
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutDone) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-amber-900/5 text-center border border-amber-100">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-400/30">
            <ReceiptText size={36} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sale Complete!</h2>
          <p className="mt-2 text-slate-500">Receipt has been generated.</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-left">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total</span> <span className="font-bold text-slate-900">${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-slate-400 mt-2"><span>Items</span> <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span>Payment</span> <span className="capitalize">{paymentMethod}</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span>Date</span> <span>{new Date().toLocaleString()}</span></div>
          </div>
          <button
            onClick={() => { setCart([]); setCheckoutDone(false); setDiscountPercent(0); }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition"
          >
            New Sale <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Point of Sale</h1>
          <p className="mt-1 text-sm text-slate-500">Quick checkout for hardware items</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm border border-slate-200/60">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Employee</p>
            <select
              value={employeeName}
              onChange={e => setEmployeeName(e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent outline-none"
            >
              <option>Alex Rivera</option>
              <option>Jordan Kim</option>
              <option>Taylor Brooks</option>
            </select>
          </div>
          <Link href="/sales" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition hover:-translate-y-0.5">
            <ReceiptText size={18} /> Sales History
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <section className="lg:col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products, SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-4 py-3 text-sm shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300 transition placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-slate-900/20"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="group relative rounded-2xl bg-white p-4 text-left shadow-sm border border-slate-200/50 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-3 right-3 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-600 uppercase tracking-wide">{product.category}</div>
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 shadow-inner">
                  <Package size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">{product.name}</h3>
                <p className="mt-0.5 text-[11px] text-slate-400 font-medium">{product.sku}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900">${product.price}</span>
                    <span className="ml-1 text-xs text-slate-400">/unit</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Stock: {product.stock}</span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                    <Plus size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded-3xl bg-white/60 border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No products found</p>
              <p className="text-sm">Try adjusting your search or filter.</p>
            </div>
          )}
        </section>

        {/* Cart Section */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-2xl shadow-slate-900/20 overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-500/20 p-2"><ShoppingCart size={20} className="text-amber-300" /></div>
                  <h2 className="text-xl font-extrabold tracking-tight">Active Cart</h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
              </div>

              <div className="max-h-[320px] overflow-y-auto px-6">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Cart is empty</p>
                    <p className="text-xs text-slate-600">Add products to start</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-800/40 space-y-0">
                    {cart.map(item => (
                      <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-300">
                            <Package size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold truncate">{item.name}</h4>
                            <p className="text-[11px] text-slate-400">{item.sku}</p>
                            <div className="mt-1.5 flex items-center gap-3">
                              <div className="flex items-center gap-1 rounded-lg bg-slate-800/60">
                                <button onClick={() => updateQuantity(item.id, -1)} className="px-1.5 py-0.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"><Minus size={12} /></button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="px-1.5 py-0.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition"><Plus size={12} /></button>
                              </div>
                              <span className="text-xs font-bold text-amber-300">${(item.price * item.quantity).toFixed(2)}</span>
                              <button onClick={() => removeFromCart(item.id)} className="ml-auto text-slate-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-slate-800/40 bg-slate-950/50 px-6 py-5 space-y-3">
                {/* Customer */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/30 px-3 py-2">
                    <User size={16} className="text-slate-400" />
                    <select
                      value={selectedCustomer}
                      onChange={e => setSelectedCustomer(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-white outline-none"
                    >
                      <option value="">Walk-in Customer</option>
                      <option value="1">Mike&apos;s Construction</option>
                      <option value="3">Harbor Renovations</option>
                      <option value="2">Sarah Johnson</option>
                    </select>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discount</label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={discountPercent}
                      onChange={e => setDiscountPercent(Math.min(50, Math.max(0, Number(e.target.value))))}
                      className="w-16 rounded-xl border border-slate-700/30 bg-slate-800/50 px-3 py-2 text-sm font-bold text-white outline-none focus:border-amber-300/50 focus:ring-1 focus:ring-amber-300/20"
                    />
                    <span className="text-xs text-slate-400 font-medium">%</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { key: "cash", label: "Cash", icon: Banknote },
                      { key: "credit", label: "Credit", icon: CreditCard },
                      { key: "debit", label: "Debit", icon: CreditCard },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const active = paymentMethod === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setPaymentMethod(opt.key)}
                          className={`rounded-xl border py-2.5 text-[11px] font-bold transition ${
                            active
                              ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/10"
                              : "border-slate-700/40 bg-slate-800/30 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                          }`}
                        >
                          <Icon size={16} className="mx-auto mb-1" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div className="rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-800/30 border border-slate-700/20 p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="font-semibold text-white">${subtotal.toFixed(2)}</span></div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-emerald-400">Discount ({discountPercent}%)</span><span className="font-bold text-emerald-400">-${discount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Tax (8%)</span><span className="font-semibold text-white">${tax.toFixed(2)}</span></div>
                  <div className="border-t border-slate-700/30 pt-2 flex justify-between text-lg"><span className="font-extrabold text-white">Total</span><span className="font-extrabold text-amber-300">${total.toFixed(2)}</span></div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || checkoutLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center gap-2"><Sparkles size={18} className="animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2">Complete Sale <ArrowRight size={18} /></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
