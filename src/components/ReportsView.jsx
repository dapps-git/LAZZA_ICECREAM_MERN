'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Calendar,
  Filter,
  CheckCircle,
  TrendingUp,
  Package,
  Store,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsView({
  products = [],
  shops = [],
  sales = [],
  payments = [],
}) {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  // Filter items by date range
  const filteredSales = sales.filter((s) => {
    if (!s.date) return false;
    const d = s.date.slice(0, 10);
    return d >= startDate && d <= endDate;
  });

  const filteredPayments = payments.filter((p) => {
    if (!p.paymentDate) return false;
    const d = p.paymentDate.slice(0, 10);
    return d >= startDate && d <= endDate;
  });

  // 1. Daily Sales
  const dailyMap = {};
  filteredSales.forEach((s) => {
    const d = s.date.slice(0, 10);
    if (!dailyMap[d]) {
      dailyMap[d] = { date: d, count: 0, total: 0, paid: 0, credit: 0 };
    }
    dailyMap[d].count += 1;
    dailyMap[d].total += s.totalAmount || 0;
    dailyMap[d].paid += s.paidAmount || 0;
    dailyMap[d].credit += s.remainingCredit || 0;
  });
  const dailyData = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));

  // 2. Weekly Sales
  const weeklyMap = {};
  filteredSales.forEach((s) => {
    const d = new Date(s.date);
    const year = d.getFullYear();
    const firstDay = new Date(year, 0, 1);
    const pastDaysOfYear = (d - firstDay) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
    const key = `Week ${weekNum}, ${year}`;
    if (!weeklyMap[key]) {
      weeklyMap[key] = { week: key, count: 0, total: 0, paid: 0, credit: 0 };
    }
    weeklyMap[key].count += 1;
    weeklyMap[key].total += s.totalAmount || 0;
    weeklyMap[key].paid += s.paidAmount || 0;
    weeklyMap[key].credit += s.remainingCredit || 0;
  });
  const weeklyData = Object.values(weeklyMap);

  // 3. Monthly Sales
  const monthlyMap = {};
  filteredSales.forEach((s) => {
    const m = s.date.slice(0, 7);
    if (!monthlyMap[m]) {
      monthlyMap[m] = { month: m, count: 0, total: 0, paid: 0, credit: 0 };
    }
    monthlyMap[m].count += 1;
    monthlyMap[m].total += s.totalAmount || 0;
    monthlyMap[m].paid += s.paidAmount || 0;
    monthlyMap[m].credit += s.remainingCredit || 0;
  });
  const monthlyData = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month));

  // 4. Shop-wise Sales
  const shopWiseMap = {};
  filteredSales.forEach((s) => {
    if (!shopWiseMap[s.shopId]) {
      shopWiseMap[s.shopId] = {
        shopName: s.shopName,
        orders: 0,
        totalSales: 0,
        paid: 0,
        credit: 0,
      };
    }
    shopWiseMap[s.shopId].orders += 1;
    shopWiseMap[s.shopId].totalSales += s.totalAmount || 0;
    shopWiseMap[s.shopId].paid += s.paidAmount || 0;
    shopWiseMap[s.shopId].credit += s.remainingCredit || 0;
  });
  const shopWiseData = Object.values(shopWiseMap).sort((a, b) => b.totalSales - a.totalSales);

  // 5. Product-wise Sales
  const prodWiseMap = {};
  filteredSales.forEach((s) => {
    (s.items || []).forEach((item) => {
      if (!prodWiseMap[item.productId]) {
        prodWiseMap[item.productId] = {
          productName: item.productName,
          category: item.category,
          quantitySold: 0,
          totalRevenue: 0,
        };
      }
      prodWiseMap[item.productId].quantitySold += item.quantity || 0;
      prodWiseMap[item.productId].totalRevenue += item.totalAmount || 0;
    });
  });
  const productWiseData = Object.values(prodWiseMap).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  // 6. Available Stock
  const stockData = products.map((p) => ({
    name: p.name,
    category: p.category,
    price: p.price,
    quantity: p.quantity,
    unit: p.unit,
    valuation: (p.quantity || 0) * (p.price || 0),
    status: p.quantity < 20 ? 'Low Stock' : 'Optimal',
  }));

  // 7. Shop-wise Outstanding Credit
  const outstandingData = shops.map((s) => ({
    shopName: s.shopName,
    city: s.city,
    ownerName: s.ownerName,
    phone: s.phoneNumber,
    currentOutstanding: s.currentOutstanding,
    lifetimeSales: s.totalSalesAmount,
  })).sort((a, b) => b.currentOutstanding - a.currentOutstanding);

  // 8. Payment Collections
  const collectionData = filteredPayments.map((p) => ({
    receipt: p.receiptNumber,
    date: new Date(p.paymentDate).toLocaleDateString('en-GB'),
    shopName: p.shopName,
    method: p.paymentMethod,
    amount: p.collectedAmount,
    ref: p.referenceNumber,
    remaining: p.remainingBalance,
  }));

  // EXPORT EXCEL
  const handleExportExcel = () => {
    let exportRows = [];
    let fileName = `Lazza_${reportType}_Report_${new Date().toISOString().slice(0, 10)}`;

    if (reportType === 'daily') exportRows = dailyData;
    else if (reportType === 'weekly') exportRows = weeklyData;
    else if (reportType === 'monthly') exportRows = monthlyData;
    else if (reportType === 'shop') exportRows = shopWiseData;
    else if (reportType === 'product') exportRows = productWiseData;
    else if (reportType === 'stock') exportRows = stockData;
    else if (reportType === 'credit') exportRows = outstandingData;
    else if (reportType === 'payments') exportRows = collectionData;

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // EXPORT PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(59, 24, 95);
    doc.text('LAZZA ICE CREAMS - DISTRIBUTOR MANAGEMENT REPORT', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Report Type: ${reportType.toUpperCase()} | Range: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleDateString('en-GB')}`,
      14,
      25
    );

    let head = [];
    let body = [];

    if (reportType === 'daily') {
      head = [['Date', 'Invoices', 'Total Sales', 'Paid', 'Credit Extended']];
      body = dailyData.map((d) => [
        d.date,
        d.count,
        formatRs(d.total),
        formatRs(d.paid),
        formatRs(d.credit),
      ]);
    } else if (reportType === 'weekly') {
      head = [['Week Period', 'Orders', 'Total Sales', 'Paid', 'Credit Extended']];
      body = weeklyData.map((d) => [
        d.week,
        d.count,
        formatRs(d.total),
        formatRs(d.paid),
        formatRs(d.credit),
      ]);
    } else if (reportType === 'monthly') {
      head = [['Month Period', 'Orders', 'Total Revenue', 'Amount Paid', 'Credit Extended']];
      body = monthlyData.map((d) => [
        d.month,
        d.count,
        formatRs(d.total),
        formatRs(d.paid),
        formatRs(d.credit),
      ]);
    } else if (reportType === 'shop') {
      head = [['Retailer Shop', 'Dispatches', 'Total Sales Value', 'Paid', 'Credit Extended']];
      body = shopWiseData.map((d) => [
        d.shopName,
        d.orders,
        formatRs(d.totalSales),
        formatRs(d.paid),
        formatRs(d.credit),
      ]);
    } else if (reportType === 'product') {
      head = [['Product Variety', 'Category', 'Quantity Sold', 'Total Revenue']];
      body = productWiseData.map((d) => [
        d.productName,
        d.category,
        d.quantitySold,
        formatRs(d.totalRevenue),
      ]);
    } else if (reportType === 'stock') {
      head = [['Product Name', 'Category', 'Unit MRP', 'Current Stock', 'Stock Valuation']];
      body = stockData.map((d) => [
        d.name,
        d.category,
        formatRs(d.price),
        `${d.quantity} ${d.unit}`,
        formatRs(d.valuation),
      ]);
    } else if (reportType === 'credit') {
      head = [['Shop Name', 'City', 'Owner Name', 'Phone', 'Outstanding Balance']];
      body = outstandingData.map((d) => [
        d.shopName,
        d.city,
        d.ownerName,
        d.phone,
        formatRs(d.currentOutstanding),
      ]);
    } else {
      head = [['Receipt #', 'Date', 'Shop Name', 'Method', 'Collected Amount', 'Ref #']];
      body = collectionData.map((d) => [
        d.receipt,
        d.date,
        d.shopName,
        d.method,
        formatRs(d.amount),
        d.ref || '-',
      ]);
    }

    doc.autoTable({
      startY: 30,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [59, 24, 95] },
      styles: { fontSize: 8 },
    });

    doc.save(`Lazza_${reportType}_Report.pdf`);
  };

  const reportButtons = [
    { id: 'daily', label: 'Daily Sales' },
    { id: 'weekly', label: 'Weekly Sales' },
    { id: 'monthly', label: 'Monthly Sales' },
    { id: 'shop', label: 'Shop-wise Sales' },
    { id: 'product', label: 'Product-wise Sales' },
    { id: 'stock', label: 'Available Stock' },
    { id: 'credit', label: 'Shop Outstanding Credit' },
    { id: 'payments', label: 'Payment Collections' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Reports & Business Intelligence</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#3b185f] border border-purple-200">
              Excel & PDF
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Filter sales dispatches, stock valuation, retailer credit risks, and payment collection tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {reportButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setReportType(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                reportType === btn.id
                  ? 'bg-[#3b185f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            <span>Date Range:</span>
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
          />

          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                setStartDate(today);
                setEndDate(today);
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
            >
              Today
            </button>
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                setStartDate(d.toISOString().slice(0, 10));
                setEndDate(new Date().toISOString().slice(0, 10));
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                setStartDate(d.toISOString().slice(0, 10));
                setEndDate(new Date().toISOString().slice(0, 10));
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          {reportType === 'daily' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Dispatch Date</th>
                  <th className="py-3 px-4 text-center">Invoices</th>
                  <th className="py-3 px-4 text-right">Total Dispatched</th>
                  <th className="py-3 px-4 text-right">Immediate Paid</th>
                  <th className="py-3 px-4 text-right">Credit Extended</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No sales records for this date range.
                    </td>
                  </tr>
                ) : (
                  dailyData.map((d, i) => (
                    <tr key={i} className="hover:bg-purple-50/20">
                      <td className="py-3 px-4 font-bold text-slate-900">{d.date}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-600">{d.count}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-900">{formatRs(d.total)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatRs(d.paid)}</td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600">{formatRs(d.credit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === 'weekly' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Week Period</th>
                  <th className="py-3 px-4 text-center">Dispatches</th>
                  <th className="py-3 px-4 text-right">Total Volume</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeklyData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.week}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{d.count}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">{formatRs(d.total)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatRs(d.paid)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">{formatRs(d.credit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'monthly' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4 text-center">Dispatches</th>
                  <th className="py-3 px-4 text-right">Monthly Revenue</th>
                  <th className="py-3 px-4 text-right">Collected</th>
                  <th className="py-3 px-4 text-right">Added to Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.month}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{d.count}</td>
                    <td className="py-3 px-4 text-right font-black text-[#3b185f]">{formatRs(d.total)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatRs(d.paid)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">{formatRs(d.credit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'shop' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Retailer Shop</th>
                  <th className="py-3 px-4 text-center">Total Deliveries</th>
                  <th className="py-3 px-4 text-right">Total Invoiced Amount</th>
                  <th className="py-3 px-4 text-right">Total Paid</th>
                  <th className="py-3 px-4 text-right">Net Credit Given</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shopWiseData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.shopName}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">{d.orders}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">{formatRs(d.totalSales)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatRs(d.paid)}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">{formatRs(d.credit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'product' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Ice Cream Product Variety</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Quantity Dispatched</th>
                  <th className="py-3 px-4 text-right">Gross Sales Turnover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productWiseData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.productName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{d.quantitySold} units</td>
                    <td className="py-3 px-4 text-right font-black text-[#3b185f]">{formatRs(d.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'stock' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Product Variety</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">MRP Price</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-right">Cold Storage Valuation</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.category}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatRs(d.price)}</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-900">
                      {d.quantity} {d.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatRs(d.valuation)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'Low Stock'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'credit' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Retailer Shop</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Owner Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4 text-right">Current Outstanding Due</th>
                  <th className="py-3 px-4 text-center">Collection Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outstandingData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.shopName}</td>
                    <td className="py-3 px-4 text-slate-600">{d.city}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{d.ownerName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.phone}</td>
                    <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                      {formatRs(d.currentOutstanding)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.currentOutstanding > 15000
                            ? 'bg-rose-100 text-rose-800'
                            : d.currentOutstanding > 0
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {d.currentOutstanding > 15000
                          ? 'Immediate Recovery'
                          : d.currentOutstanding > 0
                          ? 'Standard Due'
                          : 'Cleared'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'payments' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Shop Name</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4 text-right">Collected Amount</th>
                  <th className="py-3 px-4 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collectionData.map((d, i) => (
                  <tr key={i} className="hover:bg-purple-50/20">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.receipt}</td>
                    <td className="py-3 px-4 text-slate-600">{d.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.shopName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100">
                        {d.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{d.ref || '-'}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600">{formatRs(d.amount)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{formatRs(d.remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
