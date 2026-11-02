'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Calendar,
  CheckCircle,
  FileDown,
  Clock,
  ArrowDownLeft,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function PaymentsView({
  payments = [],
  shops = [],
  onOpenRecordPayment,
}) {
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedShopId, setSelectedShopId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations for Today, Weekly, Monthly
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  // Approximate 7 days for weekly
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const todaysCollections = payments
    .filter((p) => p.paymentDate && p.paymentDate.slice(0, 10) === todayStr)
    .reduce((sum, p) => sum + (p.collectedAmount || 0), 0);

  const weeklyCollections = payments
    .filter((p) => new Date(p.paymentDate) >= sevenDaysAgo)
    .reduce((sum, p) => sum + (p.collectedAmount || 0), 0);

  const monthlyCollections = payments
    .filter((p) => p.paymentDate && p.paymentDate.slice(0, 7) === currentMonthStr)
    .reduce((sum, p) => sum + (p.collectedAmount || 0), 0);

  const totalOutstanding = shops.reduce((sum, s) => sum + (s.currentOutstanding || 0), 0);

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const filteredPayments = payments.filter((pay) => {
    const matchesMethod =
      selectedMethod === 'All' || pay.paymentMethod === selectedMethod;
    const matchesShop =
      selectedShopId === 'All' || pay.shopId === selectedShopId;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      pay.receiptNumber.toLowerCase().includes(query) ||
      pay.shopName.toLowerCase().includes(query) ||
      (pay.referenceNumber && pay.referenceNumber.toLowerCase().includes(query));

    return matchesMethod && matchesShop && matchesSearch;
  });

  const handleExportExcel = () => {
    const data = filteredPayments.map((p) => ({
      Receipt_No: p.receiptNumber,
      Date: new Date(p.paymentDate).toLocaleDateString('en-GB'),
      Shop_Name: p.shopName,
      Amount_Collected: p.collectedAmount,
      Method: p.paymentMethod,
      Reference: p.referenceNumber || '-',
      Previous_Balance: p.previousBalance || 0,
      Remaining_Balance: p.remainingBalance || 0,
      Notes: p.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Collections');
    XLSX.writeFile(
      workbook,
      `Lazza_Collections_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Payment Collection Desk</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {payments.length} Collections
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily, weekly, and monthly retailer dues collected via UPI, Cash, and Bank Transfer.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 4 Collection Metrics specified in requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Today&apos;s Collections
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatRs(todaysCollections)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Cleared Today</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Weekly Collections
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatRs(weeklyCollections)}
          </div>
          <span className="text-[11px] text-slate-500">Past 7 days volume</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Monthly Collections
          </span>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {formatRs(monthlyCollections)}
          </div>
          <span className="text-[11px] text-slate-500">Active Month Total</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-card">
          <span className="text-[10px] font-bold uppercase text-rose-700 block">
            Pending Outstanding
          </span>
          <div className="text-xl font-black text-rose-600 mt-1">
            {formatRs(totalOutstanding)}
          </div>
          <span className="text-[11px] text-rose-600 font-medium">To be collected</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search receipt #, shop, or ref ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <select
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none max-w-xs"
          >
            <option value="All">All Shops</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shopName}
              </option>
            ))}
          </select>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI / GPay / PhonePe</option>
            <option value="Cash">Cash Handover</option>
            <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
            <option value="Other">Other Mode</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Retailer Shop</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Reference No.</th>
                <th className="py-3.5 px-4 text-right">Amount Collected</th>
                <th className="py-3.5 px-4 text-right">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No payment collection records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-emerald-50/20 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {pay.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(pay.paymentDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {pay.shopName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {pay.referenceNumber || 'Cash Counter'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                      +{formatRs(pay.collectedAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      {formatRs(pay.remainingBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
