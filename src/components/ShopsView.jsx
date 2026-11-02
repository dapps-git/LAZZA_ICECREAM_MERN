'use client';

import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  ShoppingCart,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import AddShopModal from './AddShopModal';
import ShopDetailModal from './ShopDetailModal';

export default function ShopsView({
  shops = [],
  transactions = [],
  sales = [],
  onAddShop,
  onUpdateShop,
  onDeleteShop,
  onOpenNewSaleForShop,
  onOpenPaymentForShop,
  selectedShopForModal,
  setSelectedShopForModal,
}) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('All'); // All | Outstanding | Cleared
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState(null);

  // Extract unique cities
  const cities = ['All', ...new Set(shops.map((s) => s.city))];

  const filteredShops = shops.filter((shop) => {
    const matchesCity = selectedCity === 'All' || shop.city === selectedCity;
    const matchesBalance =
      balanceFilter === 'All'
        ? true
        : balanceFilter === 'Outstanding'
        ? shop.currentOutstanding > 0
        : shop.currentOutstanding === 0;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      shop.shopName.toLowerCase().includes(query) ||
      shop.ownerName.toLowerCase().includes(query) ||
      shop.phoneNumber.includes(query) ||
      shop.city.toLowerCase().includes(query);

    return matchesCity && matchesBalance && matchesSearch;
  });

  const handleEdit = (shop) => {
    setShopToEdit(shop);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from retailer database?`)) {
      onDeleteShop(id);
    }
  };

  const handleSaveShop = (data) => {
    if (shopToEdit) {
      onUpdateShop(shopToEdit.id, data);
    } else {
      onAddShop(data);
    }
    setShopToEdit(null);
  };

  const formatRs = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Retailer Shops & Mini CRM</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#3b185f] border border-purple-200">
              {shops.length} Active Shops
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track retailer accounts, GPS delivery routes, individual ledger statements, and credit balances.
          </p>
        </div>

        <button
          onClick={() => {
            setShopToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Shop</span>
        </button>
      </div>

      {/* City Tabs and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        {/* City Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {cities.map((city) => {
            const count =
              city === 'All' ? shops.length : shops.filter((s) => s.city === city).length;
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#3b185f] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Balance status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by shop name, owner, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]/20 focus:border-[#3b185f]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Balances</option>
              <option value="Outstanding">Has Outstanding Due (&gt;₹0)</option>
              <option value="Cleared">Cleared Balance (₹0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredShops.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No shops found matching your search and filter criteria.
          </div>
        ) : (
          filteredShops.map((shop) => {
            const hasOutstanding = shop.currentOutstanding > 0;
            return (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card card-hover flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {shop.city}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-1.5 leading-snug">
                        {shop.shopName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Owner: <strong className="text-slate-800">{shop.ownerName}</strong>
                      </p>
                    </div>

                    {/* Outstanding Pill */}
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black ${
                          hasOutstanding
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {formatRs(shop.currentOutstanding)}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {hasOutstanding ? 'Outstanding' : 'Cleared'}
                      </span>
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${shop.phoneNumber}`}
                        className="hover:underline font-semibold text-slate-800"
                      >
                        {shop.phoneNumber}
                      </a>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{shop.address}</span>
                    </div>
                    {shop.additionalDetails && (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        &quot;{shop.additionalDetails}&quot;
                      </p>
                    )}
                  </div>

                  {/* GPS Location Link if available */}
                  {shop.liveLocation?.googleMapsUrl && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <a
                        href={shop.liveLocation.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900"
                      >
                        <MapPin className="w-3 h-3 text-purple-600" />
                        <span>
                          GPS ({shop.liveLocation.latitude || 'Geo'}, {shop.liveLocation.longitude || 'Nav'})
                        </span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Lifetime Statistics */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Lifetime Sales</span>
                      <span className="font-bold text-slate-800">{formatRs(shop.totalSalesAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Supplied SKUs</span>
                      <span className="font-bold text-slate-800">{shop.totalProductsSupplied || 0} units</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setSelectedShopForModal(shop)}
                    className="flex-1 py-1.5 px-2.5 text-xs font-semibold bg-purple-50 text-[#3b185f] hover:bg-purple-100 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#3b185f]" />
                    <span>Ledger Statement</span>
                  </button>

                  <button
                    onClick={() => onOpenNewSaleForShop(shop)}
                    className="p-2 text-slate-600 hover:text-[#3b185f] hover:bg-purple-50 rounded-xl transition"
                    title="Dispatch / Supply Products"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenPaymentForShop(shop)}
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                    title="Collect Payment"
                  >
                    <CreditCard className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEdit(shop)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                    title="Edit shop details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(shop.id, shop.shopName)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete shop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Shop Modal */}
      <AddShopModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setShopToEdit(null);
        }}
        onSave={handleSaveShop}
        shopToEdit={shopToEdit}
      />

      {/* Individual Shop Account & Ledger Statement Modal */}
      <ShopDetailModal
        isOpen={!!selectedShopForModal}
        onClose={() => setSelectedShopForModal(null)}
        shop={selectedShopForModal}
        transactions={transactions}
        sales={sales}
        onOpenNewSaleForShop={onOpenNewSaleForShop}
        onOpenPaymentForShop={onOpenPaymentForShop}
      />
    </div>
  );
}
