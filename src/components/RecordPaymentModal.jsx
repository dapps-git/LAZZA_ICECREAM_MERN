'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
} from 'lucide-react';

export default function RecordPaymentModal({
  isOpen,
  onClose,
  shops = [],
  onRecordPayment,
  preselectedShop = null,
}) {
  const [shopId, setShopId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedShop) {
      setShopId(preselectedShop.id);
    } else if (shops.length > 0 && !shopId) {
      setShopId(shops[0].id);
    }
  }, [preselectedShop, shops, isOpen]);

  if (!isOpen) return null;

  const currentShop = shops.find((s) => s.id === shopId);
  const currentOutstanding = currentShop ? currentShop.currentOutstanding : 0;
  const numAmount = Number(amount) || 0;
  const remainingBalance = Math.max(0, currentOutstanding - numAmount);

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!shopId) return setErrorMsg('Please select a shop');
    if (numAmount <= 0) return setErrorMsg('Collected amount must be greater than zero');

    const res = onRecordPayment({
      shopId,
      collectedAmount: numAmount,
      paymentMethod,
      referenceNumber,
      paymentDate: new Date(paymentDate).toISOString(),
      notes,
    });

    if (res.success) {
      alert(`Payment of ${formatRs(numAmount)} recorded successfully for ${currentShop?.shopName}!`);
      onClose();
    } else {
      setErrorMsg(res.message || 'Error saving payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#3b185f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Record Payment Collection</h3>
              <p className="text-xs text-purple-200">
                Receive retailer dues & reduce outstanding ledger balance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Shop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Retailer Shop *
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shopName} ({s.city}) — Due: {formatRs(s.currentOutstanding)}
                </option>
              ))}
            </select>
          </div>

          {/* Outstanding Balance Banner */}
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Current Outstanding Due:</span>
              <span className="font-extrabold text-rose-600 text-base">
                {formatRs(currentOutstanding)}
              </span>
            </div>
            {currentOutstanding > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(currentOutstanding))}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                Clear Full Due
              </button>
            )}
          </div>

          {/* Collected Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Amount Collected (₹) *
              </label>
              <div className="flex gap-1">
                {[1000, 2000, 5000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmount(String(quick))}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
                  >
                    +₹{quick}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-base font-black px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {['UPI', 'Cash', 'Bank Transfer', 'Other'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-1 rounded-xl font-semibold border text-center transition ${
                    paymentMethod === method
                      ? 'bg-[#3b185f] text-white border-[#3b185f] shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference / Transaction #
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/HDFC/9928371"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Collection Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Remarks</label>
            <input
              type="text"
              placeholder="e.g. Weekly routine collection by route driver"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          {/* Live Remaining Balance Preview */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Remaining Balance After Payment:</span>
            <span className="text-sm font-black text-emerald-700">
              {formatRs(remainingBalance)}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Update Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
