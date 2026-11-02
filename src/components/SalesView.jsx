'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileDown,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function SalesView({
  sales = [],
  shops = [],
  onOpenNewSale,
  onViewInvoice,
}) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedShopId, setSelectedShopId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = sales.filter((s) => {
    const matchesStatus =
      selectedStatus === 'All' || s.paymentStatus === selectedStatus;
    const matchesShop =
      selectedShopId === 'All' || s.shopId === selectedShopId;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(query) ||
      s.shopName.toLowerCase().includes(query);

    return matchesStatus && matchesShop && matchesSearch;
  });

  const totalInvoiced = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalPaid = sales.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
  const totalCredit = sales.reduce((acc, s) => acc + (s.remainingCredit || 0), 0);

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const handleExportSalesExcel = () => {
    const data = filteredSales.map((s) => ({
      Invoice_No: s.invoiceNumber,
      Date: new Date(s.date).toLocaleDateString('en-GB'),
      Shop_Name: s.shopName,
      Items_Count: s.items?.length || 0,
      Total_Amount: s.totalAmount,
      Paid_Amount: s.paidAmount,
      Remaining_Credit: s.remainingCredit,
      Status: s.paymentStatus,
      Payment_Method: s.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Records');
    XLSX.writeFile(workbook, `Lazza_Sales_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Sales & Product Distribution</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#3b185f] border border-purple-200">
              {sales.length} Dispatches
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch ice creams to retailers, create tax invoices, adjust cold storage inventory, and record payments.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleExportSalesExcel}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={onOpenNewSale}
            className="px-4 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Sale</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Total Invoiced</span>
            <div className="text-xl font-black text-slate-900 mt-1">{formatRs(totalInvoiced)}</div>
            <span className="text-[11px] text-slate-500">{sales.length} invoices generated</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#3b185f] flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Immediate Payments</span>
            <div className="text-xl font-black text-emerald-600 mt-1">{formatRs(totalPaid)}</div>
            <span className="text-[11px] text-emerald-700">Cash / UPI at delivery</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Credit Extended</span>
            <div className="text-xl font-black text-rose-600 mt-1">{formatRs(totalCredit)}</div>
            <span className="text-[11px] text-rose-700">Added to shop ledger</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number or shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Shop filter */}
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

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Fully Paid</option>
            <option value="Partial">Partial Payment</option>
            <option value="Credit">Full Credit</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Retailer Shop</th>
                <th className="py-3.5 px-4">Supplied Varieties</th>
                <th className="py-3.5 px-4 text-right">Total Invoice</th>
                <th className="py-3.5 px-4 text-right">Paid</th>
                <th className="py-3.5 px-4 text-right">Credit Balance</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    No sales dispatches match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-purple-50/20 transition">
                    <td className="py-3.5 px-4 font-bold text-[#3b185f]">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {sale.shopName}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] text-slate-600 truncate">
                        {(sale.items || [])
                          .map((it) => `${it.quantity}x ${it.productName.split('(')[0]}`)
                          .join(', ')}
                      </div>
                      <span className="text-[10px] text-purple-700 font-semibold">
                        {sale.items?.length || 0} varieties
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatRs(sale.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      {formatRs(sale.paidAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                      {formatRs(sale.remainingCredit)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewInvoice(sale)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-[#3b185f] rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tax Invoice</span>
                      </button>
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
