'use client';

import React, { useState } from 'react';
import {
  PlusCircle,
  CreditCard,
  Package,
  Bell,
  AlertTriangle,
  User,
} from 'lucide-react';

export default function Header({
  activeTab,
  onOpenNewSale,
  onOpenRecordPayment,
  onOpenAddProduct,
  products = [],
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles = {
    dashboard: 'Distributor Dashboard & Overview',
    products: 'Product Inventory & Cold Storage Stock',
    shops: 'Retailer Shops & GPS Location CRM',
    sales: 'Sales Distribution & Invoicing',
    payments: 'Payment Collection & Settlement Desk',
    reports: 'Business Reports & Financial Exports',
  };

  const lowStockItems = products.filter((p) => p.quantity < 20);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-purple-100/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs no-print">
      {/* Title & Path */}
      <div className="flex items-center space-x-3">
        <h1 className="text-base sm:text-lg font-normal text-[#3b185f] tracking-tight">
          {tabTitles[activeTab] || 'Distributor Management'}
        </h1>
      </div>

      {/* Quick Actions & Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Quick New Sale in Lazza Yellow */}
        <button
          onClick={onOpenNewSale}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-violet-950 shadow-sm hover:shadow transition"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2]" />
          <span className="hidden sm:inline">New Sale / Dispatch</span>
          <span className="sm:hidden">Sale</span>
        </button>

        {/* Quick Collect Payment in Violet */}
        <button
          onClick={onOpenRecordPayment}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#3b185f] hover:bg-[#280a42] text-amber-300 shadow-sm transition border border-purple-900/20"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
          <span>Collect Payment</span>
        </button>

        {/* Quick Add Product */}
        <button
          onClick={onOpenAddProduct}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-light bg-purple-50 hover:bg-purple-100 text-[#3b185f] border border-purple-200/60 transition"
        >
          <Package className="w-3.5 h-3.5 text-[#3b185f]" />
          <span>Add Product</span>
        </button>

        {/* Low Stock Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-[#3b185f] hover:bg-purple-50/60 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.5]" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
            {lowStockItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Stock Alerts
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {lowStockItems.length} Low Stock
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto font-light">
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    All products have healthy storage stock levels.
                  </p>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-amber-800">
                          Only <strong className="font-semibold">{item.quantity} {item.unit}</strong> left in cold storage.
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-purple-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border border-amber-400/50 flex items-center justify-center text-violet-950 font-bold text-xs shadow-xs">
            LZ
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-normal text-slate-800 leading-tight">Lazza Master Admin</div>
            <div className="text-[10px] text-slate-400 font-light">Central Kerala Depot</div>
          </div>
        </div>
      </div>
    </header>
  );
}
