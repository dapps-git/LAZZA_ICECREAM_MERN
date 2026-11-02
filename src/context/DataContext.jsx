'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const INITIAL_CATEGORIES = [
  'Cone Ice Cream',
  'Choco Bar',
  'Sip Up',
  '1 Litre Cup Ice Cream',
  'Other varieties'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Lazza Butterscotch Cone (120ml)',
    brand: 'Lazza',
    category: 'Cone Ice Cream',
    price: 45,
    discountedPrice: 40,
    quantity: 180,
    unit: 'pcs',
    description: 'Crispy waffle cone filled with rich butterscotch cream and roasted nut praline.',
  },
  {
    id: 'prod-2',
    name: 'Lazza Belgian Chocolate Cone (120ml)',
    brand: 'Lazza',
    category: 'Cone Ice Cream',
    price: 50,
    discountedPrice: 45,
    quantity: 140,
    unit: 'pcs',
    description: 'Dark Belgian chocolate cream topped with chocolate shavings in chocolate wafer cone.',
  },
  {
    id: 'prod-3',
    name: 'Lazza Strawberry Crunch Cone',
    brand: 'Lazza',
    category: 'Cone Ice Cream',
    price: 40,
    discountedPrice: 38,
    quantity: 95,
    unit: 'pcs',
    description: 'Fresh strawberry swirl ice cream with sweet strawberry crisp pearls.',
  },
  {
    id: 'prod-4',
    name: 'Lazza Choco Feast Bar (80ml)',
    brand: 'Lazza',
    category: 'Choco Bar',
    price: 35,
    discountedPrice: 30,
    quantity: 240,
    unit: 'pcs',
    description: 'Thick Belgian chocolate coating over creamy vanilla core on stick.',
  },
  {
    id: 'prod-5',
    name: 'Lazza Almond Crunch Choco Bar',
    brand: 'Lazza',
    category: 'Choco Bar',
    price: 50,
    discountedPrice: 45,
    quantity: 110,
    unit: 'pcs',
    description: 'Roasted California almonds in crisp milk chocolate shell.',
  },
  {
    id: 'prod-6',
    name: 'Lazza Dark Fantasy Stick',
    brand: 'Lazza',
    category: 'Choco Bar',
    price: 45,
    discountedPrice: 42,
    quantity: 16, // Low stock indicator!
    unit: 'pcs',
    description: '70% dark cocoa coating with choco-fudge core.',
  },
  {
    id: 'prod-7',
    name: 'Lazza Alphonso Mango Sip Up',
    brand: 'Lazza',
    category: 'Sip Up',
    price: 15,
    discountedPrice: 12,
    quantity: 450,
    unit: 'pcs',
    description: 'Refreshing real Alphonso mango pulp juice ice tube for hot summers.',
  },
  {
    id: 'prod-8',
    name: 'Lazza Tangy Orange Sip Up',
    brand: 'Lazza',
    category: 'Sip Up',
    price: 15,
    discountedPrice: 12,
    quantity: 380,
    unit: 'pcs',
    description: 'Zesty orange frozen pop loved by kids and tea stalls.',
  },
  {
    id: 'prod-9',
    name: 'Lazza Green Apple Sip Up',
    brand: 'Lazza',
    category: 'Sip Up',
    price: 15,
    discountedPrice: 12,
    quantity: 260,
    unit: 'pcs',
    description: 'Crisp green apple flavored refreshing ice tube candy.',
  },
  {
    id: 'prod-10',
    name: 'Lazza Vanilla Classic Tub (1 Litre)',
    brand: 'Lazza',
    category: '1 Litre Cup Ice Cream',
    price: 190,
    discountedPrice: 175,
    quantity: 65,
    unit: 'tubs',
    description: 'Classic creamy Madagascan vanilla ice cream family tub.',
  },
  {
    id: 'prod-11',
    name: 'Lazza Tender Coconut 1L Special',
    brand: 'Lazza',
    category: '1 Litre Cup Ice Cream',
    price: 240,
    discountedPrice: 220,
    quantity: 12, // Low stock indicator!
    unit: 'tubs',
    description: 'Signature real Kerala tender coconut chunks blended in fresh dairy cream.',
  },
  {
    id: 'prod-12',
    name: 'Lazza Spanish Delight 1L Tub',
    brand: 'Lazza',
    category: '1 Litre Cup Ice Cream',
    price: 260,
    discountedPrice: 240,
    quantity: 40,
    unit: 'tubs',
    description: 'Caramelised nuts, dates, and Spanish saffron flavored rich cream.',
  },
  {
    id: 'prod-13',
    name: 'Lazza Royal Cassata Slice',
    brand: 'Lazza',
    category: 'Other varieties',
    price: 65,
    discountedPrice: 60,
    quantity: 85,
    unit: 'pcs',
    description: 'Multi-layer sponge cake, tutti frutti and 3-flavor ice cream slice.',
  },
  {
    id: 'prod-14',
    name: 'Lazza Shahi Matka Kulfi (150ml)',
    brand: 'Lazza',
    category: 'Other varieties',
    price: 70,
    discountedPrice: 65,
    quantity: 55,
    unit: 'pots',
    description: 'Traditional slow-boiled milk kulfi packed in authentic earthen clay pot.',
  }
];

export const INITIAL_SHOPS = [
  {
    id: 'shop-1',
    shopName: 'Royal Bakery & Cool Bar',
    ownerName: 'Abdul Rahim',
    phoneNumber: '9847123456',
    city: 'Kochi',
    address: 'Near Metro Pillar 421, MG Road, Ernakulam, Kerala',
    liveLocation: {
      latitude: 9.9723,
      longitude: 76.2825,
      googleMapsUrl: 'https://maps.google.com/?q=9.9723,76.2825'
    },
    additionalDetails: 'Has 2 deep freezers. Primary customer for cones and 1L tubs.',
    currentOutstanding: 14500,
    totalSalesAmount: 48500,
    totalPaidAmount: 34000,
    totalProductsSupplied: 680,
  },
  {
    id: 'shop-2',
    shopName: 'Malabar Supermarket',
    ownerName: 'M. Faisal',
    phoneNumber: '9745234567',
    city: 'Calicut',
    address: 'Mavoor Road Junction, Near Bus Stand, Kozhikode',
    liveLocation: {
      latitude: 11.2588,
      longitude: 75.7804,
      googleMapsUrl: 'https://maps.google.com/?q=11.2588,75.7804'
    },
    additionalDetails: 'Weekly Tuesday restocking route. Always pays partially via UPI.',
    currentOutstanding: 8200,
    totalSalesAmount: 36200,
    totalPaidAmount: 28000,
    totalProductsSupplied: 520,
  },
  {
    id: 'shop-3',
    shopName: 'City Point Cafe & Bakers',
    ownerName: 'Suresh Kumar',
    phoneNumber: '9447345678',
    city: 'Trivandrum',
    address: 'Statue Junction, MG Road, Thiruvananthapuram',
    liveLocation: {
      latitude: 8.5028,
      longitude: 76.9532,
      googleMapsUrl: 'https://maps.google.com/?q=8.5028,76.9532'
    },
    additionalDetails: 'Heavy volume of Sip Up and Choco Bars during peak evening hours.',
    currentOutstanding: 22800,
    totalSalesAmount: 58800,
    totalPaidAmount: 36000,
    totalProductsSupplied: 890,
  },
  {
    id: 'shop-4',
    shopName: 'Highland Stores & Dairy',
    ownerName: 'George Thomas',
    phoneNumber: '9895456789',
    city: 'Kottayam',
    address: 'KK Road, Kanjikuzhy, Kottayam',
    liveLocation: {
      latitude: 9.5916,
      longitude: 76.5222,
      googleMapsUrl: 'https://maps.google.com/?q=9.5916,76.5222'
    },
    additionalDetails: 'Zero outstanding. Prompt full cash settlement on delivery.',
    currentOutstanding: 0,
    totalSalesAmount: 24500,
    totalPaidAmount: 24500,
    totalProductsSupplied: 340,
  },
  {
    id: 'shop-5',
    shopName: 'Thrissur Round Treats',
    ownerName: 'Venu Menon',
    phoneNumber: '9496567890',
    city: 'Thrissur',
    address: 'Round South, Opposite Swaraj Round, Thrissur',
    liveLocation: {
      latitude: 10.5276,
      longitude: 76.2144,
      googleMapsUrl: 'https://maps.google.com/?q=10.5276,76.2144'
    },
    additionalDetails: 'Prime location facing temple ground. Huge weekend rush.',
    currentOutstanding: 5400,
    totalSalesAmount: 28400,
    totalPaidAmount: 23000,
    totalProductsSupplied: 410,
  },
  {
    id: 'shop-6',
    shopName: 'Kannur Beachside Parlour',
    ownerName: 'Dinesh KP',
    phoneNumber: '9744678901',
    city: 'Kannur',
    address: 'Payyambalam Beach Road, Kannur',
    liveLocation: {
      latitude: 11.8745,
      longitude: 75.3704,
      googleMapsUrl: 'https://maps.google.com/?q=11.8745,75.3704'
    },
    additionalDetails: 'Tourist heavy shop. Demands high volume of Spanish Delight & Matka Kulfi.',
    currentOutstanding: 18900,
    totalSalesAmount: 42900,
    totalPaidAmount: 24000,
    totalProductsSupplied: 580,
  }
];

export const INITIAL_SALES = [
  {
    id: 'sale-1',
    invoiceNumber: 'INV-20261101-001',
    date: '2026-11-01T08:30:00.000Z',
    shopId: 'shop-1',
    shopName: 'Royal Bakery & Cool Bar',
    items: [
      {
        productId: 'prod-1',
        productName: 'Lazza Butterscotch Cone (120ml)',
        category: 'Cone Ice Cream',
        quantity: 50,
        unitPrice: 45,
        discount: 5,
        totalAmount: 2000,
      },
      {
        productId: 'prod-4',
        productName: 'Lazza Choco Feast Bar (80ml)',
        category: 'Choco Bar',
        quantity: 60,
        unitPrice: 35,
        discount: 5,
        totalAmount: 1800,
      },
      {
        productId: 'prod-10',
        productName: 'Lazza Vanilla Classic Tub (1 Litre)',
        category: '1 Litre Cup Ice Cream',
        quantity: 10,
        unitPrice: 190,
        discount: 15,
        totalAmount: 1750,
      }
    ],
    subTotal: 5850,
    totalDiscount: 300,
    totalAmount: 5550,
    paidAmount: 2000,
    remainingCredit: 3550,
    paymentStatus: 'Partial',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/98471/004',
    notes: 'Morning dispatch delivery. Paid ₹2,000 via GPay, rest added to credit.',
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-20261101-002',
    date: '2026-11-01T09:15:00.000Z',
    shopId: 'shop-3',
    shopName: 'City Point Cafe & Bakers',
    items: [
      {
        productId: 'prod-7',
        productName: 'Lazza Alphonso Mango Sip Up',
        category: 'Sip Up',
        quantity: 120,
        unitPrice: 15,
        discount: 3,
        totalAmount: 1440,
      },
      {
        productId: 'prod-8',
        productName: 'Lazza Tangy Orange Sip Up',
        category: 'Sip Up',
        quantity: 100,
        unitPrice: 15,
        discount: 3,
        totalAmount: 1200,
      },
      {
        productId: 'prod-5',
        productName: 'Lazza Almond Crunch Choco Bar',
        category: 'Choco Bar',
        quantity: 40,
        unitPrice: 50,
        discount: 5,
        totalAmount: 1800,
      }
    ],
    subTotal: 4740,
    totalDiscount: 300,
    totalAmount: 4440,
    paidAmount: 0,
    remainingCredit: 4440,
    paymentStatus: 'Credit',
    paymentMethod: 'Credit',
    referenceNumber: '',
    notes: 'Full credit delivery as per monthly agreement.',
  },
  {
    id: 'sale-3',
    invoiceNumber: 'INV-20261031-003',
    date: '2026-10-31T14:20:00.000Z',
    shopId: 'shop-4',
    shopName: 'Highland Stores & Dairy',
    items: [
      {
        productId: 'prod-12',
        productName: 'Lazza Spanish Delight 1L Tub',
        category: '1 Litre Cup Ice Cream',
        quantity: 15,
        unitPrice: 260,
        discount: 20,
        totalAmount: 3600,
      },
      {
        productId: 'prod-14',
        productName: 'Lazza Shahi Matka Kulfi (150ml)',
        category: 'Other varieties',
        quantity: 30,
        unitPrice: 70,
        discount: 5,
        totalAmount: 1950,
      }
    ],
    subTotal: 5750,
    totalDiscount: 200,
    totalAmount: 5550,
    paidAmount: 5550,
    remainingCredit: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    referenceNumber: 'CASH-REC-89',
    notes: 'Full cash settlement received instantly by driver.',
  },
  {
    id: 'sale-4',
    invoiceNumber: 'INV-20261030-004',
    date: '2026-10-30T11:00:00.000Z',
    shopId: 'shop-2',
    shopName: 'Malabar Supermarket',
    items: [
      {
        productId: 'prod-2',
        productName: 'Lazza Belgian Chocolate Cone (120ml)',
        category: 'Cone Ice Cream',
        quantity: 40,
        unitPrice: 50,
        discount: 5,
        totalAmount: 1800,
      },
      {
        productId: 'prod-13',
        productName: 'Lazza Royal Cassata Slice',
        category: 'Other varieties',
        quantity: 25,
        unitPrice: 65,
        discount: 5,
        totalAmount: 1500,
      }
    ],
    subTotal: 3500,
    totalDiscount: 200,
    totalAmount: 3300,
    paidAmount: 1500,
    remainingCredit: 1800,
    paymentStatus: 'Partial',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT/55481239',
    notes: 'Restocked before weekend festival.',
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-20261101-001',
    shopId: 'shop-1',
    shopName: 'Royal Bakery & Cool Bar',
    paymentDate: '2026-11-01T10:00:00.000Z',
    collectedAmount: 5000,
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/HDFC/9928371',
    previousBalance: 19500,
    remainingBalance: 14500,
    notes: 'Collected weekly due from owner Abdul Rahim.',
  },
  {
    id: 'pay-2',
    receiptNumber: 'REC-20261031-002',
    shopId: 'shop-6',
    shopName: 'Kannur Beachside Parlour',
    paymentDate: '2026-10-31T16:45:00.000Z',
    collectedAmount: 7000,
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'IMPS/SBIN/88127394',
    previousBalance: 25900,
    remainingBalance: 18900,
    notes: 'Direct online bank transfer settlement.',
  },
  {
    id: 'pay-3',
    receiptNumber: 'REC-20261030-003',
    shopId: 'shop-5',
    shopName: 'Thrissur Round Treats',
    paymentDate: '2026-10-30T17:15:00.000Z',
    collectedAmount: 6000,
    paymentMethod: 'Cash',
    referenceNumber: 'CASH-TR-102',
    previousBalance: 11400,
    remainingBalance: 5400,
    notes: 'Cash collected by sales executive Anandhu.',
  },
  {
    id: 'pay-4',
    receiptNumber: 'REC-20261029-004',
    shopId: 'shop-2',
    shopName: 'Malabar Supermarket',
    paymentDate: '2026-10-29T12:30:00.000Z',
    collectedAmount: 10000,
    paymentMethod: 'UPI',
    referenceNumber: 'GPAY-SBI-491028',
    previousBalance: 18200,
    remainingBalance: 8200,
    notes: 'Monthly bulk payment cleared.',
  }
];

export const INITIAL_TRANSACTIONS = [
  // Shop 1 Transactions
  {
    id: 'tx-1',
    shopId: 'shop-1',
    date: '2026-10-25T10:00:00.000Z',
    type: 'INITIAL_BALANCE',
    referenceNumber: 'OPENING',
    description: 'Opening ledger balance',
    debit: 15950,
    credit: 0,
    balanceAfter: 15950,
  },
  {
    id: 'tx-2',
    shopId: 'shop-1',
    date: '2026-11-01T08:30:00.000Z',
    type: 'SALE',
    referenceNumber: 'INV-20261101-001',
    description: 'Products supplied: 50x Cones, 60x Choco Bar, 10x 1L Tubs (Paid: ₹2,000)',
    debit: 3550,
    credit: 0,
    balanceAfter: 19500,
  },
  {
    id: 'tx-3',
    shopId: 'shop-1',
    date: '2026-11-01T10:00:00.000Z',
    type: 'PAYMENT',
    referenceNumber: 'REC-20261101-001',
    description: 'UPI Payment received (Ref: UPI/HDFC/9928371)',
    debit: 0,
    credit: 5000,
    balanceAfter: 14500,
  },
  // Shop 2
  {
    id: 'tx-4',
    shopId: 'shop-2',
    date: '2026-10-20T10:00:00.000Z',
    type: 'INITIAL_BALANCE',
    referenceNumber: 'OPENING',
    description: 'Opening balance',
    debit: 16400,
    credit: 0,
    balanceAfter: 16400,
  },
  {
    id: 'tx-5',
    shopId: 'shop-2',
    date: '2026-10-29T12:30:00.000Z',
    type: 'PAYMENT',
    referenceNumber: 'REC-20261029-004',
    description: 'UPI Payment cleared',
    debit: 0,
    credit: 10000,
    balanceAfter: 6400,
  },
  {
    id: 'tx-6',
    shopId: 'shop-2',
    date: '2026-10-30T11:00:00.000Z',
    type: 'SALE',
    referenceNumber: 'INV-20261030-004',
    description: 'Products supplied: 40x Belgian Cones, 25x Cassata (Paid: ₹1,500)',
    debit: 1800,
    credit: 0,
    balanceAfter: 8200,
  },
  // Shop 3
  {
    id: 'tx-7',
    shopId: 'shop-3',
    date: '2026-10-25T09:00:00.000Z',
    type: 'INITIAL_BALANCE',
    referenceNumber: 'OPENING',
    description: 'Opening balance',
    debit: 18360,
    credit: 0,
    balanceAfter: 18360,
  },
  {
    id: 'tx-8',
    shopId: 'shop-3',
    date: '2026-11-01T09:15:00.000Z',
    type: 'SALE',
    referenceNumber: 'INV-20261101-002',
    description: 'Full credit delivery: Sip Ups & Choco Bars',
    debit: 4440,
    credit: 0,
    balanceAfter: 22800,
  },
  // Shop 4
  {
    id: 'tx-9',
    shopId: 'shop-4',
    date: '2026-10-31T14:20:00.000Z',
    type: 'SALE',
    referenceNumber: 'INV-20261031-003',
    description: 'Fully paid cash order (₹5,550)',
    debit: 0,
    credit: 0,
    balanceAfter: 0,
  },
  // Shop 5
  {
    id: 'tx-10',
    shopId: 'shop-5',
    date: '2026-10-20T10:00:00.000Z',
    type: 'INITIAL_BALANCE',
    referenceNumber: 'OPENING',
    description: 'Opening balance',
    debit: 11400,
    credit: 0,
    balanceAfter: 11400,
  },
  {
    id: 'tx-11',
    shopId: 'shop-5',
    date: '2026-10-30T17:15:00.000Z',
    type: 'PAYMENT',
    referenceNumber: 'REC-20261030-003',
    description: 'Cash payment collected',
    debit: 0,
    credit: 6000,
    balanceAfter: 5400,
  },
  // Shop 6
  {
    id: 'tx-12',
    shopId: 'shop-6',
    date: '2026-10-22T10:00:00.000Z',
    type: 'INITIAL_BALANCE',
    referenceNumber: 'OPENING',
    description: 'Opening balance',
    debit: 25900,
    credit: 0,
    balanceAfter: 25900,
  },
  {
    id: 'tx-13',
    shopId: 'shop-6',
    date: '2026-10-31T16:45:00.000Z',
    type: 'PAYMENT',
    referenceNumber: 'REC-20261031-002',
    description: 'Bank transfer received',
    debit: 0,
    credit: 7000,
    balanceAfter: 18900,
  }
];

export const DataProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Initialize from LocalStorage after hydration
  useEffect(() => {
    try {
      const c = localStorage.getItem('lazza_next_categories');
      if (c) setCategories(JSON.parse(c));
      const p = localStorage.getItem('lazza_next_products');
      if (p) setProducts(JSON.parse(p));
      const s = localStorage.getItem('lazza_next_shops');
      if (s) setShops(JSON.parse(s));
      const sl = localStorage.getItem('lazza_next_sales');
      if (sl) setSales(JSON.parse(sl));
      const py = localStorage.getItem('lazza_next_payments');
      if (py) setPayments(JSON.parse(py));
      const tx = localStorage.getItem('lazza_next_transactions');
      if (tx) setTransactions(JSON.parse(tx));
    } catch (e) {
      console.warn('Storage read error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_categories', JSON.stringify(categories));
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_products', JSON.stringify(products));
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_shops', JSON.stringify(shops));
  }, [shops, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_sales', JSON.stringify(sales));
  }, [sales, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_payments', JSON.stringify(payments));
  }, [payments, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lazza_next_transactions', JSON.stringify(transactions));
  }, [transactions, isLoaded]);

  // CATEGORY OPERATIONS
  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
      return true;
    }
    return false;
  };

  // PRODUCT OPERATIONS
  const addProduct = (prodData) => {
    const newProduct = {
      ...prodData,
      id: 'prod-' + Date.now(),
      brand: prodData.brand || 'Lazza',
      price: Number(prodData.price) || 0,
      discountedPrice: Number(prodData.discountedPrice) || Number(prodData.price) || 0,
      quantity: Number(prodData.quantity) || 0,
      unit: prodData.unit || 'pcs',
    };
    setProducts([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(products.map(p => p.id === id ? { 
      ...p, 
      ...updatedFields,
      price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
      discountedPrice: Number(updatedFields.discountedPrice !== undefined ? updatedFields.discountedPrice : p.discountedPrice),
      quantity: Number(updatedFields.quantity !== undefined ? updatedFields.quantity : p.quantity),
    } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateStock = (id, newQuantity) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: Math.max(0, Number(newQuantity)) } : p));
  };

  // SHOP OPERATIONS
  const addShop = (shopData) => {
    const newShop = {
      ...shopData,
      id: 'shop-' + Date.now(),
      currentOutstanding: Number(shopData.currentOutstanding) || 0,
      totalSalesAmount: 0,
      totalPaidAmount: 0,
      totalProductsSupplied: 0,
      liveLocation: {
        latitude: shopData.latitude ? Number(shopData.latitude) : null,
        longitude: shopData.longitude ? Number(shopData.longitude) : null,
        googleMapsUrl: shopData.googleMapsUrl || (shopData.latitude && shopData.longitude ? `https://maps.google.com/?q=${shopData.latitude},${shopData.longitude}` : '')
      }
    };
    setShops([newShop, ...shops]);

    if (newShop.currentOutstanding > 0) {
      const initTx = {
        id: 'tx-' + Date.now(),
        shopId: newShop.id,
        date: new Date().toISOString(),
        type: 'INITIAL_BALANCE',
        referenceNumber: 'OPENING',
        description: 'Opening ledger balance',
        debit: newShop.currentOutstanding,
        credit: 0,
        balanceAfter: newShop.currentOutstanding,
      };
      setTransactions(prev => [initTx, ...prev]);
    }
    return newShop;
  };

  const updateShop = (id, updatedFields) => {
    setShops(shops.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...updatedFields,
          liveLocation: {
            latitude: updatedFields.latitude !== undefined ? Number(updatedFields.latitude) : s.liveLocation?.latitude,
            longitude: updatedFields.longitude !== undefined ? Number(updatedFields.longitude) : s.liveLocation?.longitude,
            googleMapsUrl: updatedFields.googleMapsUrl || s.liveLocation?.googleMapsUrl,
          }
        };
      }
      return s;
    }));
  };

  const deleteShop = (id) => {
    setShops(shops.filter(s => s.id !== id));
  };

  // SALES DISTRIBUTION
  const createSale = (saleData) => {
    const targetShop = shops.find(s => s.id === saleData.shopId);
    if (!targetShop) return { success: false, message: 'Shop not found' };

    // 1. Stock verification
    for (const item of saleData.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return { success: false, message: `Product ${item.productName} not found` };
      if (prod.quantity < item.quantity) {
        return { 
          success: false, 
          message: `Insufficient stock for ${prod.name}. Available: ${prod.quantity}, requested: ${item.quantity}` 
        };
      }
    }

    // 2. Reduce stock
    setProducts(prevProducts => prevProducts.map(p => {
      const soldItem = saleData.items.find(it => it.productId === p.id);
      if (soldItem) {
        return { ...p, quantity: p.quantity - soldItem.quantity };
      }
      return p;
    }));

    // 3. Generate invoice number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invCount = sales.length + 1;
    const invoiceNumber = `INV-${dateStr}-${String(invCount).padStart(3, '0')}`;

    const totalQty = saleData.items.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = saleData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = saleData.items.reduce((sum, item) => sum + (item.quantity * (item.discount || 0)), 0);
    const totalAmount = Number(saleData.totalAmount);
    const paidAmount = Number(saleData.paidAmount) || 0;
    const remainingCredit = Math.max(0, totalAmount - paidAmount);

    let paymentStatus = 'Credit';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partial';
    }

    const newSale = {
      id: 'sale-' + Date.now(),
      invoiceNumber,
      date: new Date().toISOString(),
      shopId: targetShop.id,
      shopName: targetShop.shopName,
      items: saleData.items,
      subTotal,
      totalDiscount,
      totalAmount,
      paidAmount,
      remainingCredit,
      paymentStatus,
      paymentMethod: saleData.paymentMethod || (paidAmount > 0 ? 'Cash' : 'Credit'),
      referenceNumber: saleData.referenceNumber || '',
      notes: saleData.notes || '',
    };

    setSales(prev => [newSale, ...prev]);

    // 4. Update shop financial balance
    const previousOutstanding = targetShop.currentOutstanding;
    const newOutstanding = previousOutstanding + remainingCredit;

    setShops(prevShops => prevShops.map(s => {
      if (s.id === targetShop.id) {
        return {
          ...s,
          currentOutstanding: newOutstanding,
          totalSalesAmount: s.totalSalesAmount + totalAmount,
          totalPaidAmount: s.totalPaidAmount + paidAmount,
          totalProductsSupplied: s.totalProductsSupplied + totalQty,
        };
      }
      return s;
    }));

    // 5. Create Ledger transaction for shop
    const productSummary = saleData.items.map(it => `${it.quantity}x ${it.productName.split('(')[0].trim()}`).join(', ');
    const tx = {
      id: 'tx-' + Date.now(),
      shopId: targetShop.id,
      date: new Date().toISOString(),
      type: 'SALE',
      referenceNumber: invoiceNumber,
      description: `Sale: ${productSummary} ${paidAmount > 0 ? `(Paid: ₹${paidAmount.toLocaleString()})` : '(Full Credit)'}`,
      debit: remainingCredit,
      credit: 0,
      balanceAfter: newOutstanding,
    };
    setTransactions(prev => [tx, ...prev]);

    // 6. If paidAmount > 0, log in payment collection
    if (paidAmount > 0) {
      const recNumber = `REC-${dateStr}-${String(payments.length + 1).padStart(3, '0')}`;
      const paymentRecord = {
        id: 'pay-' + Date.now(),
        receiptNumber: recNumber,
        shopId: targetShop.id,
        shopName: targetShop.shopName,
        paymentDate: new Date().toISOString(),
        collectedAmount: paidAmount,
        paymentMethod: saleData.paymentMethod || 'Cash',
        referenceNumber: saleData.referenceNumber || `Against ${invoiceNumber}`,
        previousBalance: previousOutstanding + totalAmount,
        remainingBalance: newOutstanding,
        notes: `Immediate payment received at sale dispatch (${invoiceNumber})`,
      };
      setPayments(prev => [paymentRecord, ...prev]);
    }

    return { success: true, sale: newSale };
  };

  // PAYMENT COLLECTION
  const recordPayment = (paymentData) => {
    const targetShop = shops.find(s => s.id === paymentData.shopId);
    if (!targetShop) return { success: false, message: 'Shop not found' };

    const collectedAmount = Number(paymentData.collectedAmount) || 0;
    if (collectedAmount <= 0) return { success: false, message: 'Amount must be greater than zero' };

    const previousBalance = targetShop.currentOutstanding;
    const remainingBalance = Math.max(0, previousBalance - collectedAmount);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const recNumber = `REC-${dateStr}-${String(payments.length + 1).padStart(3, '0')}`;

    const newPayment = {
      id: 'pay-' + Date.now(),
      receiptNumber: recNumber,
      shopId: targetShop.id,
      shopName: targetShop.shopName,
      paymentDate: paymentData.paymentDate || new Date().toISOString(),
      collectedAmount,
      paymentMethod: paymentData.paymentMethod || 'Cash',
      referenceNumber: paymentData.referenceNumber || '',
      previousBalance,
      remainingBalance,
      notes: paymentData.notes || '',
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update shop balance
    setShops(prevShops => prevShops.map(s => {
      if (s.id === targetShop.id) {
        return {
          ...s,
          currentOutstanding: remainingBalance,
          totalPaidAmount: s.totalPaidAmount + collectedAmount,
        };
      }
      return s;
    }));

    // Add ledger transaction
    const tx = {
      id: 'tx-' + Date.now(),
      shopId: targetShop.id,
      date: newPayment.paymentDate,
      type: 'PAYMENT',
      referenceNumber: recNumber,
      description: `${paymentData.paymentMethod} Payment received ${paymentData.referenceNumber ? `(Ref: ${paymentData.referenceNumber})` : ''}`,
      debit: 0,
      credit: collectedAmount,
      balanceAfter: remainingBalance,
    };
    setTransactions(prev => [tx, ...prev]);

    return { success: true, payment: newPayment };
  };

  // Reset demo data
  const resetToDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setShops(INITIAL_SHOPS);
    setSales(INITIAL_SALES);
    setPayments(INITIAL_PAYMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem('lazza_next_categories');
    localStorage.removeItem('lazza_next_products');
    localStorage.removeItem('lazza_next_shops');
    localStorage.removeItem('lazza_next_sales');
    localStorage.removeItem('lazza_next_payments');
    localStorage.removeItem('lazza_next_transactions');
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
