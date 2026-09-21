import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SidebarLayout from "@/components/SidebarLayout";

export const metadata: Metadata = {
  title: "Hardware POS",
  description: "Point of Sale System for Hardware Stores",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 text-slate-900 antialiased">
        <div className="flex min-h-screen">
          <SidebarLayout />
          <main className="min-h-screen flex-1 md:ml-72">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
