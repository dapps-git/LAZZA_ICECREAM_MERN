'use client';

import React from 'react';
import { X, Printer, FileDown, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function InvoicePrintModal({ isOpen, onClose, sale, shop }) {
  if (!isOpen || !sale) return null;

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(59, 24, 95);
    doc.text('LAZZA ICE CREAM DISTRIBUTOR HUB', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('Authorized Distribution Center | FSSAI Lic #11322004000128', 14, 24);
    doc.text(`Tax Invoice: ${sale.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${new Date(sale.date).toLocaleDateString('en-GB')}`, 14, 35);
    doc.text(`Billed To: ${sale.shopName}`, 14, 42);

    const itemsData = (sale.items || []).map((it, idx) => [
      idx + 1,
      it.productName,
      `${it.quantity} ${it.unit || 'pcs'}`,
      formatRs(it.unitPrice),
      formatRs(it.discount || 0),
      formatRs(it.totalAmount),
    ]);

    doc.autoTable({
      startY: 48,
      head: [['#', 'Product Item', 'Qty', 'Unit MRP', 'Discount', 'Total Amount']],
      body: itemsData,
      theme: 'grid',
      headStyles: { fillColor: [59, 24, 95] },
      styles: { fontSize: 8 },
    });

    const finalY = doc.lastAutoTable.finalY + 8;
    doc.text(`Sub Total: ${formatRs(sale.subTotal || sale.totalAmount)}`, 140, finalY);
    doc.text(`Total Discount: ${formatRs(sale.totalDiscount || 0)}`, 140, finalY + 5);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Invoice Grand Total: ${formatRs(sale.totalAmount)}`, 140, finalY + 11);
    doc.text(`Paid Amount: ${formatRs(sale.paidAmount)}`, 140, finalY + 16);
    doc.setTextColor(180, 0, 0);
    doc.text(`Remaining Balance: ${formatRs(sale.remainingCredit)}`, 140, finalY + 22);

    doc.save(`${sale.invoiceNumber}_Lazza.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-light">
      <div className="bg-white rounded-2xl border border-purple-100 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Actions Bar */}
        <div className="bg-[#1f0732] text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 border-b border-purple-900/40">
          <div className="flex items-center space-x-2">
            <span className="font-normal text-sm text-purple-200">Tax Invoice Preview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-violet-950 font-medium">
              {sale.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1 text-xs font-light bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition text-amber-300"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-1 text-xs font-light bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition text-amber-300"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 text-xs font-sans print:p-0">
          {/* Brand & Distributor Header with Official Logo */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-yellow-500">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 relative flex items-center justify-center p-1 bg-amber-400 rounded-lg shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/lazza-logo.png"
                    alt="Lazza Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-normal text-[#3b185f] tracking-wide">
                    LAZZA ICE CREAMS
                  </h1>
                  <p className="text-[11px] font-normal text-amber-700">
                    Official Authorized Cold-Chain Distributor Hub
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-light">
                Central Kerala Depot #104, NH-66 Bypass, Kochi • Phone: +91 484 2901820
              </p>
              <p className="text-[10px] text-slate-400 font-light">
                FSSAI License: 11322004000128 • GSTIN: 32AABCU9603R1ZM
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded font-medium text-xs bg-yellow-100 text-yellow-900 uppercase tracking-wider border border-yellow-300">
                TAX INVOICE
              </span>
              <div className="mt-2 font-medium text-slate-800 text-sm">{sale.invoiceNumber}</div>
              <div className="text-[11px] text-slate-500 font-light">
                Date: {new Date(sale.date).toLocaleDateString('en-GB')}
              </div>
              <div className="text-[11px] text-slate-500 font-light">
                Status:{' '}
                <strong
                  className={
                    sale.paymentStatus === 'Paid'
                      ? 'text-emerald-600'
                      : sale.paymentStatus === 'Partial'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }
                >
                  {sale.paymentStatus}
                </strong>
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-medium text-slate-400 block mb-1">
                Delivered / Billed To:
              </span>
              <h3 className="font-normal text-sm text-slate-900">{sale.shopName}</h3>
              {shop && (
                <div className="text-slate-600 text-[11px] space-y-0.5 mt-0.5 font-light">
                  <p>Attn: {shop.ownerName}</p>
                  <p>Ph: {shop.phoneNumber}</p>
                  <p>{shop.address}, {shop.city}</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-medium text-slate-400 block mb-1">
                Payment Details:
              </span>
              <p className="font-normal text-slate-800">
                Method: {sale.paymentMethod || 'Credit'}
              </p>
              {sale.referenceNumber && (
                <p className="text-slate-500 text-[11px] font-light">Ref: {sale.referenceNumber}</p>
              )}
              {sale.notes && (
                <p className="text-slate-400 text-[10px] italic mt-1 font-light">&quot;{sale.notes}&quot;</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px]">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Product Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit MRP</th>
                  <th className="pb-2 text-right">Discount</th>
                  <th className="pb-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(sale.items || []).map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 font-normal text-slate-800">{item.productName}</td>
                    <td className="py-2.5 text-center font-normal text-slate-700">
                      {item.quantity} {item.unit || 'pcs'}
                    </td>
                    <td className="py-2.5 text-right text-slate-600">{formatRs(item.unitPrice)}</td>
                    <td className="py-2.5 text-right text-emerald-600">
                      {item.discount > 0 ? formatRs(item.discount) : '-'}
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-900">
                      {formatRs(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs font-light">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatRs(sale.subTotal || sale.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Distributor Discount:</span>
                <span className="text-emerald-600">-{formatRs(sale.totalDiscount || 0)}</span>
              </div>
              <div className="flex justify-between font-normal text-sm text-[#3b185f] pt-1.5 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>{formatRs(sale.totalAmount)}</span>
              </div>
              <div className="flex justify-between font-normal text-emerald-600">
                <span>Amount Paid:</span>
                <span>{formatRs(sale.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-medium text-rose-600 pt-1 border-t border-slate-100">
                <span>Remaining Due:</span>
                <span>{formatRs(sale.remainingCredit)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between font-light">
            <div>
              <p className="font-normal text-slate-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Goods dispatched in cold chain deep freezer at -18°C.
              </p>
              <p>Store immediately in deep freezers to maintain optimum texture and flavor.</p>
            </div>
            <div className="text-right">
              <p className="font-normal text-slate-700">For LAZZA ICE CREAM DISTRIBUTORS</p>
              <p className="mt-4 text-slate-400">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
