'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Save } from 'lucide-react';

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
  categories = [],
  productToEdit = null,
  onAddNewCategory,
}) {
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Lazza',
    category: categories[0] || 'Cone Ice Cream',
    price: '',
    discountedPrice: '',
    quantity: '',
    unit: 'pcs',
    description: '',
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        brand: productToEdit.brand || 'Lazza',
        category: productToEdit.category || categories[0] || '',
        price: productToEdit.price || '',
        discountedPrice: productToEdit.discountedPrice || '',
        quantity: productToEdit.quantity || '',
        unit: productToEdit.unit || 'pcs',
        description: productToEdit.description || '',
      });
    } else {
      setFormData({
        name: '',
        brand: 'Lazza',
        category: categories[0] || 'Cone Ice Cream',
        price: '',
        discountedPrice: '',
        quantity: '',
        unit: 'pcs',
        description: '',
      });
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter product name');
    if (!formData.price || Number(formData.price) <= 0)
      return alert('Please enter a valid base price');

    onSave({
      ...formData,
      price: Number(formData.price),
      discountedPrice: Number(formData.discountedPrice) || Number(formData.price),
      quantity: Number(formData.quantity) || 0,
    });
    onClose();
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const added = onAddNewCategory(newCategoryName.trim());
    if (added) {
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName('');
      setShowAddCatInput(false);
    } else {
      alert('Category already exists!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#3b185f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {productToEdit ? 'Edit Product' : 'Add New Lazza Product'}
              </h3>
              <p className="text-xs text-purple-200">
                {productToEdit ? 'Update product details & pricing' : 'Register new ice cream SKU'}
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lazza Butterscotch Cone (120ml)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Category *</label>
                <button
                  type="button"
                  onClick={() => setShowAddCatInput(!showAddCatInput)}
                  className="text-[10px] text-[#3b185f] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddCatInput ? 'Cancel' : 'New'}</span>
                </button>
              </div>

              {showAddCatInput ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="New category..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-purple-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2 py-1 text-xs bg-[#3b185f] text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                MRP Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="45"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="40"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f] bg-white"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="tubs">Tubs (tubs)</option>
                <option value="cups">Cups (cups)</option>
                <option value="pots">Pots (pots)</option>
                <option value="boxes">Boxes (boxes)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Status Preview
              </label>
              <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {Number(formData.quantity) < 20 ? (
                  <span className="text-rose-600 font-semibold">Low Stock Alert (&lt;20)</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">Optimal Stock</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Flavor notes, packaging specifications, storage instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
