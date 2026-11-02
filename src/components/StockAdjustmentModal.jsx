'use client';

import React, { useState } from 'react';
import { X, Layers, Plus, Minus, Check } from 'lucide-react';

export default function StockAdjustmentModal({ isOpen, onClose, product, onUpdateStock }) {
  const [adjustType, setAdjustType] = useState('add'); // 'add' | 'subtract' | 'set'
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('New Cold-Storage Factory Batch Inward');

  if (!isOpen || !product) return null;

  const currentQty = product.quantity || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return alert('Please enter a valid amount');

    let newQty = currentQty;
    if (adjustType === 'add') {
      newQty = currentQty + num;
    } else if (adjustType === 'subtract') {
      newQty = Math.max(0, currentQty - num);
    } else {
      newQty = num;
    }

    onUpdateStock(product.id, newQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#3b185f] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm">Quick Stock Inward / Adjustment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-purple-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <div className="font-bold text-xs text-purple-950">{product.name}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Current Available:</span>
              <span className="font-bold text-purple-900">
                {currentQty} {product.unit}
              </span>
            </div>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAdjustType('add')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                adjustType === 'add' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Stock Inward
            </button>
            <button
              type="button"
              onClick={() => setAdjustType('subtract')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                adjustType === 'subtract' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Minus className="w-3.5 h-3.5" /> Wastage/Damage
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity ({product.unit}) *
            </label>
            <input
              type="number"
              min="1"
              required
              autoFocus
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-sm font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
