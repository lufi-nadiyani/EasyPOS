/**
 * EasyPOS - API Integration Service Layer
 * 
 * This file centralizes all backend API communications.
 * It is structured to be extremely easy to connect to a real backend.
 * 
 * To switch to a real backend:
 * 1. Set `USE_MOCK = false` below.
 * 2. Update `API_BASE_URL` with your friend's backend server URL.
 */

const API_BASE_URL = '/api';
const USE_MOCK = true; // Set to false to use real REST API endpoints

// --- Helper: Simulate network delay ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- In-Memory / LocalStorage Mock DB ---
const getMockData = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (parsed !== undefined && parsed !== null) {
        if (Array.isArray(defaultVal)) {
          if (Array.isArray(parsed)) {
            if (parsed.length < defaultVal.length) {
              localStorage.setItem(key, JSON.stringify(defaultVal));
              return defaultVal;
            }
            return parsed;
          }
        } else {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Error parsing mock data for key:', key, e);
  }
  return defaultVal;
};

const saveMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ==================== 18 MENU (6 per Kategori) ====================
const DEFAULT_MENUS = [
  // ==================== MAKANAN (6 Menu) ====================
  { id: 1, name: 'Nasi Goreng Spesial', price: 25000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Ayam Bakar Madura', price: 32000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=400&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Nasi Telur Dadar', price: 20000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=400&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Mie Goreng Jawa', price: 22000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1586543214126-6b4b13a6a7f4?w=400&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Soto Ayam', price: 18000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1556765104-0ef2a5e2b8b1?w=400&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Bakso Sapi', price: 16000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1567696911397-e4f3d5c9d6b4?w=400&auto=format&fit=crop&q=60' },

  // ==================== MINUMAN (6 Menu) ====================
  { id: 7, name: 'Es Teh Manis', price: 8000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Jus Mangga', price: 12000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Jus Alpukat', price: 14000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1534687949190-8ac4f3aa1d10?w=400&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Lemon Tea', price: 10000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1556679343-704c440ab73d?w=400&auto=format&fit=crop&q=60' },
  { id: 11, name: 'Kopi Hitam', price: 9000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Milkshake Coklat', price: 15000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=60' },

  // ==================== SNACK (6 Menu) ====================
  { id: 13, name: 'Kentang Goreng', price: 15000, category: 'Snack', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=60' },
  { id: 14, name: 'Pisang Goreng', price: 12000, category: 'Snack', image: 'https://images.unsplash.com/photo-1585902698455-b4c6e0f2f3b7?w=400&auto=format&fit=crop&q=60' },
  { id: 15, name: 'Tahu Isi', price: 10000, category: 'Snack', image: 'https://images.unsplash.com/photo-1585246195307-f22dbe2c9c51?w=400&auto=format&fit=crop&q=60' },
  { id: 16, name: 'Lumpia', price: 13000, category: 'Snack', image: 'https://images.unsplash.com/photo-1585246195307-f22dbe2c9c51?w=400&auto=format&fit=crop&q=60' },
  { id: 17, name: 'Cakwe', price: 8000, category: 'Snack', image: 'https://images.unsplash.com/photo-1576069982118-1d8cf6e3b6d2?w=400&auto=format&fit=crop&q=60' },
  { id: 18, name: 'Kue Cubir', price: 7000, category: 'Snack', image: 'https://images.unsplash.com/photo-1585246195307-f22dbe2c9c51?w=400&auto=format&fit=crop&q=60' }
];

const DEFAULT_TX = [
  { id: 'P001', date: '04/07/2026 12:00', tableNo: '01', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P002', date: '04/07/2026 14:00', tableNo: '03', amount: 8000, paymentMethod: 'QRIS', itemsSummary: '2x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 2 }] },
  { id: 'P003', date: '04/07/2026 14:55', tableNo: '05', amount: 18000, paymentMethod: 'QRIS', itemsSummary: '1x Laksa', items: [{ menuId: 6, name: 'Laksa', price: 20000, quantity: 1 }] },
  { id: 'P004', date: '04/07/2026 14:55', tableNo: '02', amount: 18000, paymentMethod: 'QRIS', itemsSummary: '1x Nasi Telur', items: [{ menuId: 4, name: 'Nasi Telur', price: 20000, quantity: 1 }] },
  { id: 'P005', date: '04/07/2026 14:55', tableNo: '07', amount: 18000, paymentMethod: 'QRIS', itemsSummary: '1x Nasi Goreng', items: [{ menuId: 5, name: 'Nasi Goreng', price: 20000, quantity: 1 }] },
  { id: 'P006', date: '04/07/2026 12:00', tableNo: '09', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P007', date: '04/07/2026 12:00', tableNo: '10', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P008', date: '04/07/2026 12:00', tableNo: '11', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P009', date: '04/07/2026 12:00', tableNo: '12', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P010', date: '04/07/2026 12:00', tableNo: '01', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P011', date: '04/07/2026 12:00', tableNo: '02', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P012', date: '04/07/2026 12:00', tableNo: '03', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] },
  { id: 'P013', date: '04/07/2026 12:00', tableNo: '04', amount: 5000, paymentMethod: 'Tunai', itemsSummary: '1x Teh', items: [{ menuId: 1, name: 'Teh', price: 4000, quantity: 1 }] }
];

const DEFAULT_USER = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin EasyPOS'
};

export const apiService = {
  // 1. Authenticate user
  async login(username, password) {
    if (USE_MOCK) {
      await delay(500);
      const user = getMockData('easypos_user', DEFAULT_USER);
      if (user.username === username && user.password === password) {
        return { success: true, user: { username: user.username, name: user.name } };
      }
      throw new Error('Username atau kata sandi salah');
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Gagal login');
    }
    return await response.json();
  },

  // 2. Fetch all menus
  async getMenus() {
    if (USE_MOCK) {
      await delay(300);
      return getMockData('easypos_menus', DEFAULT_MENUS);
    }

    const response = await fetch(`${API_BASE_URL}/menus`);
    if (!response.ok) throw new Error('Gagal mengambil data menu');
    return await response.json();
  },

  // 3. Add menu item
  async addMenu(menuItem) {
    if (USE_MOCK) {
      await delay(400);
      const currentMenus = getMockData('easypos_menus', DEFAULT_MENUS);
      const newId = currentMenus.length > 0 ? Math.max(...currentMenus.map(m => m.id)) + 1 : 1;
      const createdItem = { id: newId, ...menuItem };
      currentMenus.push(createdItem);
      saveMockData('easypos_menus', currentMenus);
      return createdItem;
    }

    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem)
    });
    if (!response.ok) throw new Error('Gagal menambahkan menu');
    return await response.json();
  },

  // 4. Delete menu item
  async deleteMenu(id) {
    if (USE_MOCK) {
      await delay(300);
      let currentMenus = getMockData('easypos_menus', DEFAULT_MENUS);
      currentMenus = currentMenus.filter(m => m.id !== id);
      saveMockData('easypos_menus', currentMenus);
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Gagal menghapus menu');
    return await response.json();
  },

  // 5. Fetch all completed transactions
  async getTransactions() {
    if (USE_MOCK) {
      await delay(300);
      return getMockData('easypos_transactions', DEFAULT_TX);
    }

    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Gagal mengambil riwayat transaksi');
    return await response.json();
  },

  // 6. Create new transaction
  async createTransaction(transaction) {
    if (USE_MOCK) {
      await delay(500);
      const currentTx = getMockData('easypos_transactions', DEFAULT_TX);
      currentTx.unshift(transaction);
      saveMockData('easypos_transactions', currentTx);
      return transaction;
    }

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!response.ok) throw new Error('Gagal memproses transaksi');
    return await response.json();
  },

  // 7. Get user account info
  async getAccountInfo() {
    await delay(200);
    return getMockData('easypos_user', DEFAULT_USER);
  },

  // 8. Update user account
  async updateAccount(name, username, password) {
    if (USE_MOCK) {
      await delay(400);
      const user = getMockData('easypos_user', DEFAULT_USER);
      user.name = name;
      user.username = username;
      user.password = password;
      saveMockData('easypos_user', user);
      return { success: true, user };
    }

    const response = await fetch(`${API_BASE_URL}/account`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password })
    });
    if (!response.ok) throw new Error('Gagal memperbarui kata sandi');
    return await response.json();
  }
};