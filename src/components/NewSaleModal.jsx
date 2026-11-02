'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function NewSaleModal({
  isOpen,
  onClose,
  shops = [],
  products = [],
  onCreateSale,
  preselectedShop = null,
  onSaleCreatedSuccess,
}) {
  const [shopId, setShopId] = useState('');
  const [items, setItems] = useState([
    {
      productId: '',
      productName: '',
      category: '',
      quantity: 10,
      unitPrice: 0,
      discount: 0,
      totalAmount: 0,
      availableStock: 0,
      unit: 'pcs',
    },
  ]);
  const [paidAmount, setPaidAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle preselected shop
  useEffect(() => {
    if (preselectedShop) {
      setShopId(preselectedShop.id);
    } else if (shops.length > 0 && !shopId) {
      setShopId(shops[0].id);
    }
  }, [preselectedShop, shops, isOpen]);

  // Set default product for initial row if needed
  useEffect(() => {
    if (products.length > 0 && items.length === 1 && !items[0].productId) {
      const firstProd = products[0];
      setItems([
        {
          productId: firstProd.id,
          productName: firstProd.name,
          category: firstProd.category,
          quantity: Math.min(10, firstProd.quantity || 1),
          unitPrice: firstProd.price,
          discount: Math.max(0, firstProd.price - (firstProd.discountedPrice || firstProd.price)),
          totalAmount:
            Math.min(10, firstProd.quantity || 1) *
            (firstProd.price - Math.max(0, firstProd.price - (firstProd.discountedPrice || firstProd.price))),
          availableStock: firstProd.quantity,
          unit: firstProd.unit,
        },
      ]);
    }
  }, [products, isOpen]);

  if (!isOpen) return null;

  const currentShop = shops.find((s) => s.id === shopId);

  // Line item change handlers
  const handleProductChange = (index, prodId) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    const discountVal = Math.max(0, prod.price - (prod.discountedPrice || prod.price));
    const newItems = [...items];
    const initialQty = Math.min(10, prod.quantity || 1);

    newItems[index] = {
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      quantity: initialQty,
      unitPrice: prod.price,
      discount: discountVal,
      totalAmount: initialQty * Math.max(0, prod.price - discountVal),
      availableStock: prod.quantity,
      unit: prod.unit,
    };
    setItems(newItems);
  };

  const handleQtyChange = (index, qtyVal) => {
    const q = Math.max(1, Number(qtyVal) || 1);
    const newItems = [...items];
    const item = newItems[index];
    const unitP = Number(item.unitPrice) || 0;
    const disc = Number(item.discount) || 0;
    const effPrice = Math.max(0, unitP - disc);

    newItems[index] = {
      ...item,
      quantity: q,
      totalAmount: q * effPrice,
    };
    setItems(newItems);
  };

  const handlePriceChange = (index, priceVal) => {
    const p = Math.max(0, Number(priceVal) || 0);
    const newItems = [...items];
    const item = newItems[index];
    const disc = Number(item.discount) || 0;
    const effPrice = Math.max(0, p - disc);

    newItems[index] = {
      ...item,
      unitPrice: p,
      totalAmount: (item.quantity || 1) * effPrice,
    };
    setItems(newItems);
  };

  const handleDiscountChange = (index, discVal) => {
    const d = Math.max(0, Number(discVal) || 0);
    const newItems = [...items];
    const item = newItems[index];
    const unitP = Number(item.unitPrice) || 0;
    const effPrice = Math.max(0, unitP - d);

    newItems[index] = {
      ...item,
      discount: d,
      totalAmount: (item.quantity || 1) * effPrice,
    };
    setItems(newItems);
  };

  const handleAddItem = () => {
    const availableProds = products.filter(
      (p) => !items.some((it) => it.productId === p.id)
    );
    const nextProd = availableProds[0] || products[0];
    if (!nextProd) return;

    const discountVal = Math.max(0, nextProd.price - (nextProd.discountedPrice || nextProd.price));
    const initQty = Math.min(10, nextProd.quantity || 1);

    setItems([
      ...items,
      {
        productId: nextProd.id,
        productName: nextProd.name,
        category: nextProd.category,
        quantity: initQty,
        unitPrice: nextProd.price,
        discount: discountVal,
        totalAmount: initQty * Math.max(0, nextProd.price - discountVal),
        availableStock: nextProd.quantity,
        unit: nextProd.unit,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return alert('At least one product must be selected.');
    setItems(items.filter((_, i) => i !== index));
  };

  // Totals calculations
  const subTotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  const totalDiscount = items.reduce((sum, it) => sum + (it.quantity * (it.discount || 0)), 0);
  const grandTotal = items.reduce((sum, it) => sum + (it.totalAmount || 0), 0);
  const paid = Math.min(grandTotal, Math.max(0, Number(paidAmount) || 0));
  const remainingCredit = Math.max(0, grandTotal - paid);

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!shopId) {
      setErrorMsg('Please select a retailer shop');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Please add at least one product');
      return;
    }

    // Validate quantities against stock
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        setErrorMsg(`Product not found`);
        return;
      }
      if (item.quantity > prod.quantity) {
        setErrorMsg(
          `Cannot dispatch ${item.quantity} units of ${prod.name}. Only ${prod.quantity} ${prod.unit} available in cold storage!`
        );
        return;
      }
    }

    const saleResult = onCreateSale({
      shopId,
      items,
      totalAmount: grandTotal,
      paidAmount: paid,
      paymentMethod: paid > 0 ? paymentMethod : 'Credit',
      referenceNumber,
      notes,
    });

    if (saleResult.success) {
      onClose();
      if (onSaleCreatedSuccess) {
        onSaleCreatedSuccess(saleResult.sale);
      }
    } else {
      setErrorMsg(saleResult.message || 'Error creating sale');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#3b185f] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">New Sales Dispatch & Tax Invoice</h3>
              <p className="text-xs text-purple-200">
                Supply ice cream products, adjust cold storage stock & update shop credit ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Shop Selector & Outstanding Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-purple-50/40 p-4 rounded-xl border border-purple-100">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3b185f] mb-1">
                Select Retailer Shop *
              </label>
              <select
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shopName} ({s.city}) — Owner: {s.ownerName}
                  </option>
                ))}
              </select>
            </div>

            {currentShop && (
              <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current Credit Due
                </span>
                <span
                  className={`text-base font-black ${
                    currentShop.currentOutstanding > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {formatRs(currentShop.currentOutstanding)}
                </span>
              </div>
            )}
          </div>

          {/* Multi-Product Dispatch Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Products to Supply ({items.length} Selected)
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#3b185f] hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Variety</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const isOverStock = item.quantity > item.availableStock;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition ${
                      isOverStock
                        ? 'border-rose-300 bg-rose-50/40'
                        : 'border-slate-200 bg-white hover:border-purple-200'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs">
                      {/* Product Selector (5 cols) */}
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Ice Cream Product
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(idx, e.target.value)}
                          className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Avail: {p.quantity} {p.unit} | ₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity (2 cols) */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                            Qty ({item.unit})
                          </label>
                          <span
                            className={`text-[10px] font-bold ${
                              isOverStock ? 'text-rose-600' : 'text-slate-400'
                            }`}
                          >
                            Max: {item.availableStock}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className={`w-full font-bold px-2 py-1.5 rounded-lg border text-xs focus:outline-none ${
                            isOverStock
                              ? 'border-rose-400 text-rose-700 bg-rose-50'
                              : 'border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Unit Price (2 cols) */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Base Price (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(idx, e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Discount per unit (1 col) */}
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Disc (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.discount}
                          onChange={(e) => handleDiscountChange(idx, e.target.value)}
                          className="w-full px-1.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Subtotal & Delete (2 cols) */}
                      <div className="sm:col-span-2 flex items-center justify-between gap-1 pt-3 sm:pt-0">
                        <div>
                          <span className="block text-[10px] text-slate-400">Total</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {formatRs(item.totalAmount)}
                          </span>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isOverStock && (
                      <div className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          Exceeds available storage stock! Maximum dispatch quantity is{' '}
                          {item.availableStock} {item.unit}.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Credit Settlement Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
            {/* Left: Notes & Reference */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode & Reference (If payment received at dispatch)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI', 'Bank Transfer'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition ${
                        paymentMethod === m
                          ? 'bg-[#3b185f] text-white border-[#3b185f]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="UPI Ref / Cheque No. / Transaction ID"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <textarea
                  rows="2"
                  placeholder="Driver / Dispatch Notes (e.g. delivered in Van #KL-07-2210)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Calculations breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Gross Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatRs(subTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Distributor Discount:</span>
                <span className="font-semibold text-emerald-600">-{formatRs(totalDiscount)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Invoice Total:</span>
                <span className="text-[#3b185f] text-base">{formatRs(grandTotal)}</span>
              </div>

              {/* Paid Amount */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Amount Paid Now (₹):</label>
                  <div className="space-x-1">
                    <button
                      type="button"
                      onClick={() => setPaidAmount('0')}
                      className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                    >
                      Full Credit (₹0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaidAmount(String(grandTotal))}
                      className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                    >
                      Full Paid (100%)
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full text-sm font-extrabold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
                />
              </div>

              {/* Remaining Credit to add to Shop Ledger */}
              <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200 flex items-center justify-between font-bold text-rose-800">
                <span>Remaining Credit Added to Shop:</span>
                <span className="text-sm font-black">{formatRs(remainingCredit)}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions Sticky */}
          <div className="sticky bottom-0 bg-white pt-4 pb-1 border-t border-slate-200 flex items-center justify-between shadow-xs">
            <div className="text-[11px] text-slate-500 hidden sm:block">
              * On saving: Product stock reduces, and shop account ledger updates automatically.
            </div>

            <div className="flex items-center space-x-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>Confirm & Generate Invoice</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
