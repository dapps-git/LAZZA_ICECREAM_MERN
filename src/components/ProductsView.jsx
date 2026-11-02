'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Layers,
  AlertTriangle,
  CheckCircle,
  Tag,
  LayoutGrid,
  List,
} from 'lucide-react';
import AddProductModal from './AddProductModal';
import StockAdjustmentModal from './StockAdjustmentModal';

export default function ProductsView({
  products = [],
  categories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
  onAddCategory,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // All | Low | Available
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table | grid

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCat =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesStock =
      stockFilter === 'All'
        ? true
        : stockFilter === 'Low'
        ? prod.quantity < 20
        : prod.quantity >= 20;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesStock && matchesSearch;
  });

  const handleEdit = (prod) => {
    setProductToEdit(prod);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from product catalog?`)) {
      onDeleteProduct(id);
    }
  };

  const handleSaveProduct = (data) => {
    if (productToEdit) {
      onUpdateProduct(productToEdit.id, data);
    } else {
      onAddProduct(data);
    }
    setProductToEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Product & Cold Storage Inventory</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#3b185f] border border-purple-200">
              {products.length} Varieties
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage Lazza cone ice creams, choco bars, sip ups, 1L tubs, and specialty items.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#3b185f] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#3b185f] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, Filter, and View toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product by name, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {/* Stock filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Stock Levels</option>
              <option value="Low">Low Stock (&lt;20)</option>
              <option value="Available">Healthy Stock (&ge;20)</option>
            </select>

            {/* Toggle Table/Grid */}
            <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-100">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'table' ? 'bg-white shadow text-[#3b185f]' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewMode === 'grid' ? 'bg-white shadow text-[#3b185f]' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">MRP Price</th>
                  <th className="py-3.5 px-4 text-right">Discount Price</th>
                  <th className="py-3.5 px-4 text-center">Available Stock</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No products match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const isLow = prod.quantity < 20;
                    return (
                      <tr key={prod.id} className="hover:bg-purple-50/20 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-purple-900">{prod.brand}</span>
                            {prod.description && <span>• {prod.description}</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          ₹{prod.price}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">
                          ₹{prod.discountedPrice || prod.price}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setStockModalProduct(prod)}
                            className="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-purple-100 hover:text-purple-900 transition"
                            title="Click to adjust stock"
                          >
                            <span>
                              {prod.quantity} {prod.unit}
                            </span>
                            <Layers className="w-3 h-3 text-slate-400" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Available
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setStockModalProduct(prod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition"
                              title="Restock / Inward"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => {
            const isLow = prod.quantity < 20;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#3b185f]">
                      {prod.category}
                    </span>
                    {isLow ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        In Stock
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2.5 leading-snug">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {prod.description || 'Premium Lazza real dairy ice cream formulation.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">MRP / Base</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹{prod.price}</span>
                      {prod.discountedPrice && prod.discountedPrice < prod.price && (
                        <span className="text-[10px] text-emerald-600 ml-1 font-semibold">
                          (₹{prod.discountedPrice})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Storage Stock</span>
                      <span
                        className={`font-bold ${isLow ? 'text-rose-600' : 'text-slate-800'}`}
                      >
                        {prod.quantity} {prod.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-1 pt-2">
                    <button
                      onClick={() => setStockModalProduct(prod)}
                      className="flex-1 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-purple-100 hover:text-purple-900 rounded-lg transition"
                    >
                      Adjust Stock
                    </button>
                    <button
                      onClick={() => handleEdit(prod)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        categories={categories}
        productToEdit={productToEdit}
        onAddNewCategory={onAddCategory}
      />

      {/* Quick Stock Modal */}
      <StockAdjustmentModal
        isOpen={!!stockModalProduct}
        onClose={() => setStockModalProduct(null)}
        product={stockModalProduct}
        onUpdateStock={onUpdateStock}
      />
    </div>
  );
}
