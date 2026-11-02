'use client';

import React from 'react';
import {
  Package,
  Layers,
  Store,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Eye,
  PlusCircle,
  Clock,
} from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardView({
  products = [],
  shops = [],
  sales = [],
  payments = [],
  onSelectShopForStatement,
  onOpenNewSale,
  onOpenRecordPayment,
  onViewInvoice,
  onNavigateToTab,
}) {
  // Calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalShops = shops.length;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  const todaysSales = sales
    .filter((s) => s.date && s.date.slice(0, 10) === todayStr)
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const monthlySales = sales
    .filter((s) => s.date && s.date.slice(0, 7) === currentMonthStr)
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const totalCreditGiven = sales.reduce((sum, s) => sum + (s.remainingCredit || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + (p.collectedAmount || 0), 0);
  const totalOutstanding = shops.reduce((sum, s) => sum + (s.currentOutstanding || 0), 0);

  const shopsByOutstanding = [...shops].sort((a, b) => b.currentOutstanding - a.currentOutstanding);

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6 font-light">
      {/* Welcome Banner with Yellow-Violet Theme and Lazza Official Logo */}
      <div className="bg-gradient-to-r from-[#1c052c] via-[#350f55] to-[#4e167c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-yellow-500/20">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lazza-logo.png"
            alt="Lazza Logo Watermark"
            className="w-56 h-auto filter brightness-200"
          />
        </div>

        <div className="relative z-10 max-w-2xl">

          <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-white">
            Ice Cream Stock & Retailer Credit Management
          </h2>
          <p className="mt-1.5 text-xs text-purple-200/80 font-light max-w-lg leading-relaxed">
            Real-time cold-storage stock monitoring, multi-shop dispatch invoicing, credit ledgers, and cash/UPI collection tracking.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewSale}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-violet-950 shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2]" />
              <span>Create Sale & Dispatch</span>
            </button>
            <button
              onClick={onOpenRecordPayment}
              className="px-4 py-2 rounded-xl text-xs font-light bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-300/30 transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Collect Shop Dues</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Snapshot Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-medium uppercase tracking-widest text-[#3b185f]">
            Business Snapshot
          </h3>
          <span className="text-[11px] text-slate-400 font-light">Updated in Real-Time</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={totalProducts}
            subtitle="Active Lazza SKUs"
            icon={Package}
            variant="purple"
          />
          <StatCard
            title="Total Available Stock"
            value={`${totalStock.toLocaleString()} units`}
            subtitle="In Cold Storage Hub"
            icon={Layers}
            variant="purple"
          />
          <StatCard
            title="Total Shops"
            value={totalShops}
            subtitle="Registered Retailers"
            icon={Store}
            variant="purple"
          />
          <StatCard
            title="Today's Sales"
            value={formatRs(todaysSales)}
            subtitle="Delivered Today"
            icon={Calendar}
            variant="amber"
            trend="+14% vs avg"
          />

          <StatCard
            title="Monthly Sales"
            value={formatRs(monthlySales)}
            subtitle="Current Month Revenue"
            icon={TrendingUp}
            variant="amber"
            trend="Active Cycle"
          />
          <StatCard
            title="Total Credit Amount"
            value={formatRs(totalCreditGiven)}
            subtitle="Lifetime Credit Extended"
            icon={Clock}
            variant="amber"
          />
          <StatCard
            title="Total Amount Collected"
            value={formatRs(totalCollected)}
            subtitle="Cash & Digital Received"
            icon={CheckCircle}
            variant="emerald"
          />
          <StatCard
            title="Total Outstanding"
            value={formatRs(totalOutstanding)}
            subtitle="Pending Retailer Dues"
            icon={AlertCircle}
            variant="rose"
            trend={totalOutstanding > 0 ? 'Requires Collection' : 'All Clear'}
            trendType={totalOutstanding > 0 ? 'down' : 'up'}
          />
        </div>
      </div>

      {/* Grid: Recent Sales & Shop Outstanding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-100/80 p-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-slate-900 text-sm sm:text-base">
                Recent Sales & Dispatches
              </h3>
              <p className="text-[11px] text-slate-400 font-light">
                Latest distribution deliveries to shops
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('sales')}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Paid</th>
                  <th className="pb-3 text-right">Credit</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-purple-50/20 transition">
                    <td className="py-3 font-normal text-violet-950">
                      {sale.invoiceNumber}
                      <div className="text-[10px] text-slate-400 font-light">
                        {new Date(sale.date).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="py-3 font-normal text-slate-800">
                      {sale.shopName}
                      <div className="text-[10px] text-slate-400 font-light">
                        {sale.items?.length || 0} items
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      {formatRs(sale.totalAmount)}
                    </td>
                    <td className="py-3 text-right text-emerald-600 font-normal">
                      {formatRs(sale.paidAmount)}
                    </td>
                    <td className="py-3 text-right text-rose-600 font-normal">
                      {formatRs(sale.remainingCredit)}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          sale.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sale.paymentStatus === 'Partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onViewInvoice(sale)}
                        className="p-1.5 text-slate-400 hover:text-[#3b185f] hover:bg-purple-50 rounded-lg transition"
                        title="View Tax Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shop-wise Outstanding Ranking (1 col) */}
        <div className="bg-white rounded-2xl border border-purple-100/80 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-normal text-slate-900 text-sm sm:text-base">Shop Outstanding</h3>
                <p className="text-[11px] text-slate-400 font-light">Highest unpaid balances</p>
              </div>
              <button
                onClick={() => onNavigateToTab('shops')}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                All Shops
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {shopsByOutstanding.slice(0, 5).map((shop) => (
                <div
                  key={shop.id}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition flex items-center justify-between"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-normal text-xs text-slate-800 truncate">
                      {shop.shopName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-light">
                      {shop.city} • {shop.ownerName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-medium ${
                        shop.currentOutstanding > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatRs(shop.currentOutstanding)}
                    </div>
                    <button
                      onClick={() => onSelectShopForStatement(shop)}
                      className="text-[10px] text-[#3b185f] hover:text-amber-600 hover:underline font-medium"
                    >
                      View Ledger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-normal text-slate-700">
            <span>Total Outstanding:</span>
            <span className="text-rose-600 font-medium">{formatRs(totalOutstanding)}</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Payment Collections & Product Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payment Collections */}
        <div className="bg-white rounded-2xl border border-purple-100/80 p-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-slate-900 text-sm sm:text-base">
                Recent Payment Collections
              </h3>
              <p className="text-[11px] text-slate-400 font-light">
                Recovered amounts from retail accounts
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('payments')}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Receipt</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3 text-right">Collected</th>
                  <th className="pb-3 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-emerald-50/20 transition">
                    <td className="py-2.5 font-normal text-violet-950">
                      {pay.receiptNumber}
                      <div className="text-[10px] text-slate-400 font-light">
                        {new Date(pay.paymentDate).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="py-2.5 font-normal text-slate-800">{pay.shopName}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-emerald-600">
                      +{formatRs(pay.collectedAmount)}
                    </td>
                    <td className="py-2.5 text-right text-slate-600 font-light">
                      {formatRs(pay.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Stock Summary */}
        <div className="bg-white rounded-2xl border border-purple-100/80 p-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-normal text-slate-900 text-sm sm:text-base">Product Stock Summary</h3>
              <p className="text-[11px] text-slate-400 font-light">Live storage quantities & alerts</p>
            </div>
            <button
              onClick={() => onNavigateToTab('products')}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Manage Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 space-y-2.5 font-light">
            {products.slice(0, 6).map((product) => {
              const isLow = product.quantity < 20;
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="overflow-hidden pr-3">
                    <div className="font-normal text-xs text-slate-800 truncate">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-light">
                      {product.category} • Price: ₹{product.price} (MRP)
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isLow
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                          : 'bg-purple-50 text-[#3b185f]'
                      }`}
                    >
                      {product.quantity} {product.unit}
                    </span>
                    {isLow && (
                      <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-tight">
                        Low!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
