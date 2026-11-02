'use client';

import React, { useState } from 'react';
import { DataProvider, useData } from '../context/DataContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardView from '../components/DashboardView';
import ProductsView from '../components/ProductsView';
import ShopsView from '../components/ShopsView';
import SalesView from '../components/SalesView';
import PaymentsView from '../components/PaymentsView';
import ReportsView from '../components/ReportsView';
import NewSaleModal from '../components/NewSaleModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import AddProductModal from '../components/AddProductModal';
import InvoicePrintModal from '../components/InvoicePrintModal';

function MainApp() {
  const {
    categories,
    products,
    shops,
    sales,
    payments,
    transactions,
    addCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addShop,
    updateShop,
    deleteShop,
    createSale,
    recordPayment,
    resetToDemoData,
  } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedShopForLedger, setSelectedShopForLedger] = useState(null);
  const [activeInvoiceSale, setActiveInvoiceSale] = useState(null);
  const [preselectedShopForSale, setPreselectedShopForSale] = useState(null);
  const [preselectedShopForPayment, setPreselectedShopForPayment] = useState(null);

  // Quick Action Triggers
  const handleOpenNewSale = (shop = null) => {
    setPreselectedShopForSale(shop);
    setIsNewSaleOpen(true);
  };

  const handleOpenRecordPayment = (shop = null) => {
    setPreselectedShopForPayment(shop);
    setIsRecordPaymentOpen(true);
  };

  const handleSaleSuccess = (newSale) => {
    setActiveInvoiceSale(newSale);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resetToDemoData={resetToDemoData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          activeTab={activeTab}
          onOpenNewSale={() => handleOpenNewSale(null)}
          onOpenRecordPayment={() => handleOpenRecordPayment(null)}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          products={products}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                products={products}
                shops={shops}
                sales={sales}
                payments={payments}
                onSelectShopForStatement={(shop) => {
                  setSelectedShopForLedger(shop);
                  setActiveTab('shops');
                }}
                onOpenNewSale={() => handleOpenNewSale(null)}
                onOpenRecordPayment={() => handleOpenRecordPayment(null)}
                onViewInvoice={(sale) => setActiveInvoiceSale(sale)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'products' && (
              <ProductsView
                products={products}
                categories={categories}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                onUpdateStock={updateStock}
                onAddCategory={addCategory}
              />
            )}

            {activeTab === 'shops' && (
              <ShopsView
                shops={shops}
                transactions={transactions}
                sales={sales}
                onAddShop={addShop}
                onUpdateShop={updateShop}
                onDeleteShop={deleteShop}
                onOpenNewSaleForShop={(shop) => handleOpenNewSale(shop)}
                onOpenPaymentForShop={(shop) => handleOpenRecordPayment(shop)}
                selectedShopForModal={selectedShopForLedger}
                setSelectedShopForModal={setSelectedShopForLedger}
              />
            )}

            {activeTab === 'sales' && (
              <SalesView
                sales={sales}
                shops={shops}
                onOpenNewSale={() => handleOpenNewSale(null)}
                onViewInvoice={(sale) => setActiveInvoiceSale(sale)}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsView
                payments={payments}
                shops={shops}
                onOpenRecordPayment={() => handleOpenRecordPayment(null)}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                products={products}
                shops={shops}
                sales={sales}
                payments={payments}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. New Sale Multi-product Dispatch Modal */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => {
          setIsNewSaleOpen(false);
          setPreselectedShopForSale(null);
        }}
        shops={shops}
        products={products}
        onCreateSale={createSale}
        preselectedShop={preselectedShopForSale}
        onSaleCreatedSuccess={handleSaleSuccess}
      />

      {/* 2. Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setPreselectedShopForPayment(null);
        }}
        shops={shops}
        onRecordPayment={recordPayment}
        preselectedShop={preselectedShopForPayment}
      />

      {/* 3. Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={addProduct}
        categories={categories}
        onAddNewCategory={addCategory}
      />

      {/* 4. Tax Invoice Printable Modal */}
      <InvoicePrintModal
        isOpen={!!activeInvoiceSale}
        onClose={() => setActiveInvoiceSale(null)}
        sale={activeInvoiceSale}
        shop={shops.find((s) => s.id === activeInvoiceSale?.shopId)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
