'use client';

import React from 'react';
import {
  X,
  Store,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  PlusCircle,
  FileDown,
  Printer,
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ShopDetailModal({
  isOpen,
  onClose,
  shop,
  transactions = [],
  sales = [],
  onOpenNewSaleForShop,
  onOpenPaymentForShop,
}) {
  if (!isOpen || !shop) return null;

  // Filter transactions for this shop, sorted chronologically
  const shopTx = transactions
    .filter((tx) => tx.shopId === shop.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  // Export Ledger to Excel
  const handleExportExcel = () => {
    const data = shopTx.map((tx) => ({
      Date: new Date(tx.date).toLocaleDateString('en-GB'),
      Type: tx.type,
      Reference: tx.referenceNumber,
      Description: tx.description,
      Debit_Amount: tx.debit || 0,
      Credit_Paid: tx.credit || 0,
      Running_Balance: tx.balanceAfter || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger Statement');
    XLSX.writeFile(
      workbook,
      `Lazza_Statement_${shop.shopName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Export Ledger to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(59, 24, 95);
    doc.text('LAZZA ICE CREAM DISTRIBUTOR HUB', 14, 18);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Shop Account Ledger Statement: ${shop.shopName}`, 14, 25);
    doc.text(`Owner: ${shop.ownerName} | Phone: ${shop.phoneNumber} | City: ${shop.city}`, 14, 31);
    doc.text(
      `Current Outstanding Balance: ${formatRs(shop.currentOutstanding)} | As on: ${new Date().toLocaleDateString('en-GB')}`,
      14,
      37
    );

    const tableData = shopTx.map((tx) => [
      new Date(tx.date).toLocaleDateString('en-GB'),
      tx.type,
      tx.referenceNumber,
      tx.description,
      tx.debit > 0 ? formatRs(tx.debit) : '-',
      tx.credit > 0 ? formatRs(tx.credit) : '-',
      formatRs(tx.balanceAfter),
    ]);

    doc.autoTable({
      startY: 42,
      head: [['Date', 'Type', 'Ref #', 'Description', 'Debit (+)', 'Credit (-)', 'Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 24, 95] },
      styles: { fontSize: 8 },
    });

    doc.save(`Lazza_Ledger_${shop.shopName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#3b185f] text-white p-5 flex items-start justify-between shrink-0">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">{shop.shopName}</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700">
                  {shop.city}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-purple-200">
                <span>Owner: <strong className="text-white">{shop.ownerName}</strong></span>
                <span>•</span>
                <a
                  href={`tel:${shop.phoneNumber}`}
                  className="hover:underline text-amber-300 font-medium flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> {shop.phoneNumber}
                </a>
                <span>•</span>
                <span className="text-purple-300">{shop.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
              title="Print Statement"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Key Ledger Metrics Cards as specified in requirements */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Supplied Units
              </span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                {shop.totalProductsSupplied || 0} pcs
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Total Sales Amount
              </span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                {formatRs(shop.totalSalesAmount)}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Payments Received
              </span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                {formatRs(shop.totalPaidAmount)}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Opening Balance
              </span>
              <span className="text-base font-bold text-slate-700 mt-0.5 block">
                {formatRs(shopTx.find((t) => t.type === 'INITIAL_BALANCE')?.debit || 0)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-rose-50 to-rose-100 p-3 rounded-xl border border-rose-200 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase text-rose-700 block">
                Current Outstanding
              </span>
              <span className="text-base font-black text-rose-700 mt-0.5 block">
                {formatRs(shop.currentOutstanding)}
              </span>
            </div>
          </div>

          {/* Quick Actions & GPS */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              {shop.liveLocation?.googleMapsUrl ? (
                <a
                  href={shop.liveLocation.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>View GPS Location on Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              ) : (
                <span className="text-slate-400 text-xs">No GPS coordinates recorded</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportExcel}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" />
                <span>Excel</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewSaleForShop(shop);
                }}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#3b185f] text-white hover:bg-[#230a3a] transition flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Supply Products</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenPaymentForShop(shop);
                }}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3" />
                <span>Collect Due</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Ledger Table */}
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Chronological Account Ledger (Statement)
            </h4>
            <span className="text-xs text-slate-400">{shopTx.length} Transactions</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Particulars / Description</th>
                  <th className="py-2.5 px-3 text-right">Debit (+)</th>
                  <th className="py-2.5 px-3 text-right">Credit (-)</th>
                  <th className="py-2.5 px-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shopTx.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No ledger records found for this retailer yet.
                    </td>
                  </tr>
                ) : (
                  shopTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.type === 'SALE'
                              ? 'bg-purple-50 text-[#3b185f] border border-purple-200'
                              : tx.type === 'PAYMENT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tx.type === 'SALE' && <ArrowUpRight className="w-3 h-3" />}
                          {tx.type === 'PAYMENT' && <ArrowDownLeft className="w-3 h-3" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {tx.referenceNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs">{tx.description}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600 whitespace-nowrap">
                        {tx.debit > 0 ? formatRs(tx.debit) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {tx.credit > 0 ? formatRs(tx.credit) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                        {formatRs(tx.balanceAfter)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
