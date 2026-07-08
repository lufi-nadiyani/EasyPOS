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

const API_BASE_URL = '/api'; // e.g. 'http://localhost:5000/api'
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

const DEFAULT_MENUS = [
  { id: 1, name: 'Teh', price: 4000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Lemon tea', price: 20000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Jus Mangga', price: 22000, category: 'Minuman', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Nasi Telur', price: 20000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Nasi Goreng', price: 20000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Laksa', price: 20000, category: 'Makanan', image: 'https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=500&auto=format&fit=crop&q=60' }
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
  password: 'admin123', // Default password
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

    // Real API implementation
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
      currentTx.unshift(transaction); // Add to the top of list
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

  // 7. Get user account info (username and password)
  async getAccountInfo() {
    await delay(200);
    return getMockData('easypos_user', DEFAULT_USER);
  },

  // 8. Update user account password or username
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
