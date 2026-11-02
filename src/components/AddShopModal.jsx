'use client';

import React, { useState, useEffect } from 'react';
import { X, Store, MapPin, Save, Compass } from 'lucide-react';

export default function AddShopModal({
  isOpen,
  onClose,
  onSave,
  shopToEdit = null,
}) {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phoneNumber: '',
    city: 'Kochi',
    address: '',
    latitude: '',
    longitude: '',
    googleMapsUrl: '',
    additionalDetails: '',
    currentOutstanding: '',
  });

  useEffect(() => {
    if (shopToEdit) {
      setFormData({
        shopName: shopToEdit.shopName || '',
        ownerName: shopToEdit.ownerName || '',
        phoneNumber: shopToEdit.phoneNumber || '',
        city: shopToEdit.city || 'Kochi',
        address: shopToEdit.address || '',
        latitude: shopToEdit.liveLocation?.latitude || '',
        longitude: shopToEdit.liveLocation?.longitude || '',
        googleMapsUrl: shopToEdit.liveLocation?.googleMapsUrl || '',
        additionalDetails: shopToEdit.additionalDetails || '',
        currentOutstanding: shopToEdit.currentOutstanding || 0,
      });
    } else {
      setFormData({
        shopName: '',
        ownerName: '',
        phoneNumber: '',
        city: 'Kochi',
        address: '',
        latitude: '',
        longitude: '',
        googleMapsUrl: '',
        additionalDetails: '',
        currentOutstanding: '0',
      });
    }
  }, [shopToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            googleMapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
          }));
          alert(`Detected GPS Coordinates: ${lat}, ${lng}`);
        },
        (err) => {
          alert('GPS detection denied or not available. You can enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation not supported in browser');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.shopName.trim()) return alert('Please enter shop name');
    if (!formData.ownerName.trim()) return alert('Please enter owner name');
    if (!formData.phoneNumber.trim()) return alert('Please enter phone number');
    if (!formData.city.trim()) return alert('Please enter city');
    if (!formData.address.trim()) return alert('Please enter address');

    onSave({
      ...formData,
      currentOutstanding: Number(formData.currentOutstanding) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#3b185f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {shopToEdit ? 'Edit Retailer Shop' : 'Register New Retailer Shop'}
              </h3>
              <p className="text-xs text-purple-200">
                {shopToEdit ? 'Update contact & location details' : 'Add shop to distributor network'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop / Outlet Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Bakery & Cool Bar"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Abdul Rahim"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9847123456"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f] bg-white font-medium"
              >
                <option value="Kochi">Kochi (Ernakulam)</option>
                <option value="Calicut">Calicut (Kozhikode)</option>
                <option value="Trivandrum">Trivandrum (TVM)</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Kottayam">Kottayam</option>
                <option value="Kannur">Kannur</option>
                <option value="Palakkad">Palakkad</option>
                <option value="Kollam">Kollam</option>
                <option value="Other">Other Region</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opening Balance / Credit (₹)
              </label>
              <input
                type="number"
                min="0"
                disabled={!!shopToEdit}
                placeholder="0"
                value={formData.currentOutstanding}
                onChange={(e) => setFormData({ ...formData, currentOutstanding: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f] disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Street Address *</label>
            <textarea
              rows="2"
              required
              placeholder="Building, Landmark, Junction, PIN Code..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b185f]"
            />
          </div>

          {/* GPS Location Section */}
          <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                <span>Live GPS Location & Coordinates</span>
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-[10px] font-semibold text-purple-700 hover:text-purple-900 bg-white px-2 py-1 rounded-md border border-purple-200 shadow-xs flex items-center gap-1"
              >
                <Compass className="w-3 h-3" />
                <span>Detect Current GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="number"
                step="any"
                placeholder="Latitude (e.g. 9.9723)"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: e.target.value,
                    googleMapsUrl:
                      e.target.value && formData.longitude
                        ? `https://maps.google.com/?q=${e.target.value},${formData.longitude}`
                        : formData.googleMapsUrl,
                  })
                }
                className="px-2.5 py-1.5 rounded-lg border border-purple-200 text-xs bg-white"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude (e.g. 76.2825)"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: e.target.value,
                    googleMapsUrl:
                      formData.latitude && e.target.value
                        ? `https://maps.google.com/?q=${formData.latitude},${e.target.value}`
                        : formData.googleMapsUrl,
                  })
                }
                className="px-2.5 py-1.5 rounded-lg border border-purple-200 text-xs bg-white"
              />
            </div>

            <input
              type="url"
              placeholder="Google Maps URL (optional or auto-generated)"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 text-xs bg-white text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Freezer & Delivery Notes
            </label>
            <input
              type="text"
              placeholder="e.g. 2 deep freezers, Tuesday delivery route, preferred payment time"
              value={formData.additionalDetails}
              onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#3b185f] hover:bg-[#230a3a] text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{shopToEdit ? 'Save Changes' : 'Register Shop'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
