'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  Store,
  ShoppingCart,
  CreditCard,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label: 'Product & Stock',
      icon: Package,
    },
    {
      id: 'shops',
      label: 'Shop Management',
      icon: Store,
    },
    {
      id: 'sales',
      label: 'Sales & Distribution',
      icon: ShoppingCart,
    },
    {
      id: 'payments',
      label: 'Payment Collections',
      icon: CreditCard,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-[#1f0732] text-white flex flex-col shrink-0 min-h-screen border-r border-[#3b185f]/40 select-none no-print shadow-xl rounded-none">
      {/* Brand Header with the Official Lazza Logo Only */}
      <div className="p-4 border-b border-[#3b185f]/50 bg-[#160424] flex items-center justify-center rounded-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lazza-logo.png"
          alt="Lazza Ice Creams"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-light">
        <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-widest text-amber-300/70">
          Navigation Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-400 text-violet-950 font-medium shadow-md shadow-amber-500/20'
                  : 'text-purple-200/80 hover:bg-[#2e0b49] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-violet-950 stroke-[2]' : 'text-amber-400/80 stroke-[1.5]'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-950" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
