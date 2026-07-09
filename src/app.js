// ======================== VUE 3 GLOBAL ========================
const { createApp, ref, reactive, computed, onMounted, onBeforeUnmount } = Vue;

// ======================== API SERVICE (MOCK) ========================
const apiService = {
  async getMenus() {
    return [
      { id: 1, name: 'Mie Kuah', price: 25000, category: 'Makanan', image: 'dist/images/mie kuah.jpg' },
      { id: 2, name: 'Sate', price: 12000, category: 'Makanan', image: 'dist/images/sate.jpg' },
      { id: 3, name: 'Nasi Ayam', price: 20000, category: 'Makanan', image: 'dist/images/nasi ayam.jpg' },
      { id: 4, name: 'Nasi Telur', price: 22000, category: 'Makanan', image: 'dist/images/salted egg.jpg' },
      { id: 5, name: 'Nasi Goreng', price: 18000, category: 'Makanan', image: 'dist/images/nasi goreng.jpg' },
      { id: 6, name: 'Laksa', price: 16000, category: 'Makanan', image: 'dist/images/laksa.jpg' },
      { id: 7, name: 'Teh', price: 8000, category: 'Minuman', image: 'dist/images/teh.jpg' },
      { id: 8, name: 'Lemon Tea', price: 12000, category: 'Minuman', image: 'dist/images/lemon tea.jpg' },
      { id: 9, name: 'Jus Mangga', price: 14000, category: 'Minuman', image: 'dist/images/jus mangga.jpg' },
      { id: 10, name: 'Air Soda', price: 10000, category: 'Minuman', image: 'dist/images/squash lemon.jpg' },
      { id: 11, name: 'Kopi', price: 9000, category: 'Minuman', image: 'dist/images/coffe.jpg' },
      { id: 12, name: 'Es Cendol', price: 15000, category: 'Minuman', image: 'dist/images/es cendol.jpg' },
      { id: 13, name: 'Kentang Goreng', price: 15000, category: 'Snack', image: 'dist/images/french fries.jpg' },
      { id: 14, name: 'Pisang Goreng', price: 12000, category: 'Snack', image: 'dist/images/pisang goreng.jpg' },
      { id: 15, name: 'Donat', price: 10000, category: 'Snack', image: 'dist/images/donat.jpg' },
      { id: 16, name: 'Biskuit', price: 13000, category: 'Snack', image: 'dist/images/biskuit.jpg' },
      { id: 17, name: 'Roti Stroberi', price: 8000, category: 'Snack', image: 'dist/images/roti strawberry.jpg' },
      { id: 18, name: 'Pancake', price: 7000, category: 'Snack', image: 'dist/images/pancaake.jpg' }
    ];
  },
  async getTransactions() {
    return [
      { id: 'P001', date: '09/07/2026 10:30', amount: 57000, paymentMethod: 'Tunai', items: [{ name: 'Nasi Goreng', quantity: 2, price: 25000 }] },
      { id: 'P002', date: '09/07/2026 11:15', amount: 32000, paymentMethod: 'QRIS', items: [{ name: 'Ayam Bakar', quantity: 1, price: 32000 }] }
    ];
  },
  async getAccountInfo() {
    return { name: 'Admin', username: 'admin', password: 'admin123' };
  },
  async login(username, password) {
    if (username === 'admin' && password === 'admin123') {
      return { success: true, user: { name: 'Admin', username: 'admin' } };
    }
    throw new Error('Username atau password salah');
  },
  async addMenu(menu) {
    console.log('Menu ditambahkan:', menu);
    return { success: true };
  },
  async deleteMenu(id) {
    console.log('Menu dihapus:', id);
    return { success: true };
  },
  async updateAccount(name, username, password) {
    console.log('Akun diupdate:', { name, username, password });
    return { success: true };
  },
  async createTransaction(tx) {
    console.log('Transaksi dibuat:', tx);
    return { success: true };
  }
};

// ======================== VUE APP ========================
const App = {
  setup() {
    // --- AUTHENTICATION STATES ---
    const isLoggedIn = ref(false);
    const loginUsername = ref('');
    const loginPassword = ref('');
    const loginError = ref('');
    const isLoggingIn = ref(false);

    // --- APP SCREEN STATES ---
    const activePage = ref('Beranda');
    const isSidebarOpen = ref(true);
    const isMobile = ref(false);
    const isMobileCartOpen = ref(false);
    const isDeleteMode = ref(false);
    const isAddMenuModalOpen = ref(false);
    const isTableDropdownOpen = ref(false);
    const rightPanelState = ref('Keranjang');

    // --- ACCOUNT POPUP STATES ---
    const isAccountModalOpen = ref(false);
    const isChangePasswordModalOpen = ref(false);
    const isAccountPasswordVisible = ref(false);
    const accountName = ref('');
    const accountUsername = ref('');
    const accountPassword = ref('');
    const oldPasswordInput = ref('');
    const newPasswordInput = ref('');
    const accountErrorMsg = ref('');
    const accountSuccessMsg = ref('');

    // --- CODES AND SYSTEM DATA ---
    const transactionNo = ref('P001');
    const kasirName = ref('Admin');
    const selectedTable = ref('');
    const currentDateTime = ref(new Date());
    const paymentMethod = ref('Tunai');
    const nominalInput = ref('');

    // Receipt popup trigger
    const isReceiptModalOpen = ref(false);
    const lastCompletedTransaction = ref({
      id: '',
      date: '',
      tableNo: '',
      items: [],
      amount: 0,
      paymentMethod: '',
      nominalPaid: 0,
      change: 0
    });

    // --- REPORT FILTERS ---
    const todayObj = new Date();
    const yyyy = todayObj.getFullYear();
    const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
    const dd = String(todayObj.getDate()).padStart(2, '0');

    const laporanFilterType = ref('Tanggal');
    const laporanSelectedDate = ref(`${yyyy}-${mm}-${dd}`);
    const laporanSelectedMonth = ref(`${yyyy}-${mm}`);
    const isFilterModalOpen = ref(false);
    const isDeleteConfirmModalOpen = ref(false);
    const menuToDelete = ref(null);

    // --- TOAST NOTIFICATION STATES ---
    const toastMessage = ref('');
    const toastType = ref('success');
    const showToastFlag = ref(false);
    const toastTimeout = ref(null);

    // --- LOGOUT MODAL STATES ---
    const isLogoutModalOpen = ref(false);

    // Preset categories
    const categories = ['Makanan', 'Minuman', 'Snack'];
    const activeCategory = ref('Makanan');

    // Preset tables
    const tables = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // --- PHOTO / IMAGE PRESETS ---
    const imagePresets = [
      { url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60', label: 'Nasi Goreng' },
      { url: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&auto=format&fit=crop&q=60', label: 'Nasi Telur' },
      { url: 'https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=500&auto=format&fit=crop&q=60', label: 'Laksa Noodles' }
    ];

    // --- CORE DATABASES ---
    const menus = ref([]);
    const cart = ref([]);
    const transactionHistory = ref([]);
    const userEmail = ref('admin@easypos.com');

    // New menu form template
    const newMenu = reactive({
      name: '',
      price: '',
      category: 'Makanan',
      image: '',
      imageFile: null,
      imagePreview: ''
    });

    // --- INITIALIZATION & LIFECYCLE ---
    let timer = null;

    onMounted(async () => {
      const sessionUser = localStorage.getItem('easypos_session');
      if (sessionUser) {
        isLoggedIn.value = true;
      }

      await loadInitialData();
      updateTransactionSequence();
      checkViewport();
      window.addEventListener('resize', checkViewport);

      timer = setInterval(() => {
        currentDateTime.value = new Date();
      }, 1000);

      window.addEventListener('click', handleOutsideClick);
    });

    onBeforeUnmount(() => {
      if (timer) {
        clearInterval(timer);
      }
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('click', handleOutsideClick);
    });

    const loadInitialData = async () => {
      try {
        menus.value = (await apiService.getMenus()) || [];
        transactionHistory.value = (await apiService.getTransactions()) || [];

        const acc = await apiService.getAccountInfo();
        if (acc) {
          accountName.value = acc.name || '';
          accountUsername.value = acc.username || '';
          accountPassword.value = acc.password || '';
        }
      } catch (err) {
        console.error('Gagal mengambil data awal:', err);
      }
    };

    const checkViewport = () => {
      isMobile.value = window.innerWidth < 1024;
      if (isMobile.value) {
        isSidebarOpen.value = false;
      } else {
        isSidebarOpen.value = true;
      }
    };

    const handleOutsideClick = (e) => {
      const container = document.getElementById('table-selector-container');
      if (container && !container.contains(e.target)) {
        isTableDropdownOpen.value = false;
      }
    };

    const updateTransactionSequence = () => {
      const history = transactionHistory.value || [];
      if (history.length > 0) {
        const nextId = history.length + 1;
        transactionNo.value = 'P' + String(nextId).padStart(3, '0');
      } else {
        transactionNo.value = 'P001';
      }
    };

    // --- TOAST NOTIFICATION METHODS ---
    const showToast = (message, type = 'success') => {
      if (toastTimeout.value) {
        clearTimeout(toastTimeout.value);
      }

      toastMessage.value = message;
      toastType.value = type;
      showToastFlag.value = true;

      toastTimeout.value = setTimeout(() => {
        showToastFlag.value = false;
      }, 2500);
    };

    const closeToast = () => {
      showToastFlag.value = false;
      if (toastTimeout.value) {
        clearTimeout(toastTimeout.value);
      }
    };

    // --- LOGOUT METHODS ---
    const openLogoutModal = () => {
      isLogoutModalOpen.value = true;
    };

    const closeLogoutModal = () => {
      isLogoutModalOpen.value = false;
    };

    const executeLogout = () => {
      isLogoutModalOpen.value = false;
      localStorage.removeItem('easypos_session');
      isLoggedIn.value = false;
      isSidebarOpen.value = false;
      activePage.value = 'Beranda';
    };

    // --- LOGIN ACTIONS ---
    const handleLogin = async () => {
      if (!loginUsername.value || !loginPassword.value) {
        loginError.value = 'Nama dan kata sandi harus diisi.';
        return;
      }

      isLoggingIn.value = true;
      loginError.value = '';

      try {
        const result = await apiService.login(loginUsername.value, loginPassword.value);
        if (result.success) {
          localStorage.setItem('easypos_session', JSON.stringify(result.user));
          isLoggedIn.value = true;
          loginUsername.value = '';
          loginPassword.value = '';
          activePage.value = 'Beranda';
          await loadInitialData();
          updateTransactionSequence();
        }
      } catch (err) {
        loginError.value = err.message || 'Login gagal, periksa kembali input Anda.';
      } finally {
        isLoggingIn.value = false;
      }
    };

    // --- SIDEBAR ACTIONS ---
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const setActivePage = (page) => {
      if (page === 'Akun') {
        openAccountModal();
        return;
      }
      activePage.value = page;
      if (isMobile.value) {
        isSidebarOpen.value = false;
      }
    };

    // --- ACCOUNT POPUP ACTIONS ---
    const openAccountModal = async () => {
      try {
        const acc = await apiService.getAccountInfo();
        accountName.value = acc.name;
        accountUsername.value = acc.username;
        accountPassword.value = acc.password;

        isAccountModalOpen.value = true;
        isChangePasswordModalOpen.value = false;
        accountSuccessMsg.value = '';
        accountErrorMsg.value = '';
      } catch (err) {
        alert('Gagal memuat detail akun');
      }
    };

    const closeAccountModal = () => {
      isAccountModalOpen.value = false;
    };

    const handleSaveAccount = async () => {
      try {
        const res = await apiService.updateAccount(accountName.value, accountUsername.value, accountPassword.value);
        if (res.success) {
          accountSuccessMsg.value = 'Profil berhasil disimpan!';
          setTimeout(() => {
            isAccountModalOpen.value = false;
          }, 1200);
        }
      } catch (err) {
        accountErrorMsg.value = 'Gagal menyimpan profil';
      }
    };

    const openChangePasswordModal = () => {
      isAccountModalOpen.value = false;
      isChangePasswordModalOpen.value = true;
      oldPasswordInput.value = '';
      newPasswordInput.value = '';
      accountSuccessMsg.value = '';
      accountErrorMsg.value = '';
    };

    const closeChangePasswordModal = () => {
      isChangePasswordModalOpen.value = false;
    };

    const handleUpdatePassword = async () => {
      if (!oldPasswordInput.value || !newPasswordInput.value) {
        accountErrorMsg.value = 'Lengkapi semua kolom formulir.';
        return;
      }

      if (oldPasswordInput.value !== accountPassword.value) {
        accountErrorMsg.value = 'Kata sandi saat ini salah!';
        return;
      }

      try {
        const res = await apiService.updateAccount(accountName.value, accountUsername.value, newPasswordInput.value);
        if (res.success) {
          accountPassword.value = newPasswordInput.value;
          accountSuccessMsg.value = 'Kata sandi berhasil diubah!';
          setTimeout(() => {
            isChangePasswordModalOpen.value = false;
            openAccountModal();
          }, 1200);
        }
      } catch (err) {
        accountErrorMsg.value = 'Gagal mengubah kata sandi';
      }
    };

    // --- FORMATTERS ---
    const formatRupiah = (value) => {
      if (value === undefined || value === null) return 'Rp 0';
      return 'Rp ' + Number(value).toLocaleString('id-ID');
    };

    const currentFormattedDateTime = computed(() => {
      const d = currentDateTime.value;
      const dateStr = String(d.getDate()).padStart(2, '0') + '/' +
        String(d.getMonth() + 1).padStart(2, '0') + '/' +
        d.getFullYear();
      const timeStr = String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
      return `${dateStr} ${timeStr}`;
    });

    const currentDateDisplay = computed(() => {
      const d = currentDateTime.value;
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = days[d.getDay()];
      const dateStr = String(d.getDate()).padStart(2, '0') + '/' +
        String(d.getMonth() + 1).padStart(2, '0') + '/' +
        d.getFullYear();
      return `${dayName}, ${dateStr}`;
    });

    const currentTimeDisplay = computed(() => {
      const d = currentDateTime.value;
      return String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':' +
        String(d.getSeconds()).padStart(2, '0') + ' WIB';
    });

    const formatLoginTime = computed(() => {
      const d = new Date();
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' WIB';
    });

    // --- MENU MANAGEMENT ---
    const filteredMenus = computed(() => {
      const list = menus.value || [];
      return list.filter(menu => menu && menu.category === activeCategory.value);
    });

    const toggleDeleteMode = () => {
      isDeleteMode.value = !isDeleteMode.value;
      if (!isDeleteMode.value) {
        menuToDelete.value = null;
        isDeleteConfirmModalOpen.value = false;
      }
    };

    const confirmDeleteMenu = (menu) => {
      menuToDelete.value = menu;
      isDeleteConfirmModalOpen.value = true;
    };

    const executeDeleteMenu = async () => {
      if (!menuToDelete.value) return;
      try {
        await apiService.deleteMenu(menuToDelete.value.id);
        menus.value = await apiService.getMenus();
        removeCartItem(menuToDelete.value.id);
        isDeleteConfirmModalOpen.value = false;
        menuToDelete.value = null;
        isDeleteMode.value = false;
        showToast('Menu berhasil dihapus!', 'success');
      } catch (err) {
        alert('Gagal menghapus menu');
      }
    };

    const cancelDeleteMenu = () => {
      isDeleteConfirmModalOpen.value = false;
      menuToDelete.value = null;
    };

    // --- FUNGSI UPLOAD FOTO ---
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Harap pilih file gambar!', 'error');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran file maksimal 2MB!', 'error');
        event.target.value = '';
        return;
      }

      newMenu.imageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        newMenu.imagePreview = e.target.result;
        newMenu.image = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const removeSelectedImage = () => {
      newMenu.imageFile = null;
      newMenu.imagePreview = '';
      newMenu.image = '';
      const fileInput = document.getElementById('menu-image-input');
      if (fileInput) fileInput.value = '';
    };

    const openAddMenuModal = () => {
      isAddMenuModalOpen.value = true;
      newMenu.name = '';
      newMenu.price = '';
      newMenu.category = activeCategory.value;
      newMenu.image = '';
      newMenu.imageFile = null;
      newMenu.imagePreview = '';
      const fileInput = document.getElementById('menu-image-input');
      if (fileInput) fileInput.value = '';
    };

    const closeAddMenuModal = () => {
      isAddMenuModalOpen.value = false;
    };

    const chooseMenuImage = () => {
      document.getElementById('menu-image-input').click();
    };

    const submitAddMenu = async () => {
      if (!newMenu.name || !newMenu.price) {
        alert('Mohon isi nama dan harga menu dengan benar.');
        return;
      }

      const imageToSave = newMenu.image || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60';

      const menuToAdd = {
        name: newMenu.name,
        price: Number(newMenu.price),
        category: newMenu.category,
        image: imageToSave
      };

      try {
        await apiService.addMenu(menuToAdd);
        menus.value = await apiService.getMenus();
        showToast(`Menu "${newMenu.name}" berhasil ditambahkan!`, 'success');
        closeAddMenuModal();
      } catch (err) {
        alert('Gagal menambahkan menu');
      }
    };

    // --- TABLE SELECTION ---
    const toggleTableDropdown = (e) => {
      e.stopPropagation();
      isTableDropdownOpen.value = !isTableDropdownOpen.value;
    };

    const selectTable = (tableNum) => {
      selectedTable.value = tableNum;
      isTableDropdownOpen.value = false;
    };

    // --- SHOPPING CART LOGIC ---
    const addToCart = (menu) => {
      if (rightPanelState.value === 'Pembayaran') {
        showToast('Tidak dapat menambah menu saat proses pembayaran. Klik Kembali ke keranjang.', 'warning');
        return;
      }

      const existingItem = cart.value.find(item => item.menuId === menu.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.value.push({
          menuId: menu.id,
          name: menu.name,
          price: menu.price,
          quantity: 1
        });
      }
    };

    const incrementCartItem = (menuId) => {
      const item = cart.value.find(item => item.menuId === menuId);
      if (item) {
        item.quantity += 1;
      }
    };

    const decrementCartItem = (menuId) => {
      const item = cart.value.find(item => item.menuId === menuId);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          removeCartItem(menuId);
        }
      }
    };

    const removeCartItem = (menuId) => {
      cart.value = cart.value.filter(item => item.menuId !== menuId);
    };

    const cartTotalItems = computed(() => {
      return cart.value.reduce((total, item) => total + item.quantity, 0);
    });

    const cartTotal = computed(() => {
      return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    const cartCount = computed(() => {
      return cart.value.reduce((total, item) => total + item.quantity, 0);
    });

    // --- PAYMENT FLOW ---
    const proceedToPayment = () => {
      if (cart.value.length === 0) {
        alert('Keranjang Anda kosong.');
        return;
      }
      if (!selectedTable.value) {
        alert('Harap pilih nomor meja terlebih dahulu.');
        return;
      }
      rightPanelState.value = 'Pembayaran';
      nominalInput.value = '';
    };

    const backToCart = () => {
      rightPanelState.value = 'Keranjang';
    };

    const selectPaymentMethod = (method) => {
      paymentMethod.value = method;
      if (method !== 'Tunai') {
        nominalInput.value = String(cartTotal.value);
      } else {
        nominalInput.value = '';
      }
    };

    const handleNominalInput = (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      nominalInput.value = val;
    };

    const addCash = (amount) => {
      let currentVal = Number(nominalInput.value) || 0;
      nominalInput.value = String(currentVal + amount);
    };

    const setExactCash = () => {
      nominalInput.value = String(cartTotal.value);
    };

    const calculatedChange = computed(() => {
      if (paymentMethod.value !== 'Tunai') return 0;
      const cash = Number(nominalInput.value) || 0;
      const total = cartTotal.value;
      const diff = cash - total;
      return diff > 0 ? diff : 0;
    });

    const isNominalValid = computed(() => {
      if (paymentMethod.value !== 'Tunai') return true;
      const cash = Number(nominalInput.value) || 0;
      return cash >= cartTotal.value;
    });

    const isPaymentExecutable = computed(() => {
      if (cart.value.length === 0) return false;
      if (!selectedTable.value) return false;
      if (paymentMethod.value === 'Tunai') {
        const cash = Number(nominalInput.value) || 0;
        return cash >= cartTotal.value;
      }
      return true;
    });

    const confirmPayment = async () => {
      if (!isPaymentExecutable.value) return;

      const totalAmount = cartTotal.value;
      const paidAmount = paymentMethod.value === 'Tunai' ? (Number(nominalInput.value) || totalAmount) : totalAmount;
      const changeAmount = paidAmount - totalAmount;

      const summaryParts = cart.value.map(item => `${item.quantity}x ${item.name}`);
      const summaryStr = summaryParts.join(', ');

      const d = new Date();
      const dateStr = String(d.getDate()).padStart(2, '0') + '/' +
        String(d.getMonth() + 1).padStart(2, '0') + '/' +
        d.getFullYear();
      const timeStr = String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
      const transactionDate = `${dateStr} ${timeStr}`;

      lastCompletedTransaction.value = {
        id: transactionNo.value,
        date: transactionDate,
        tableNo: selectedTable.value,
        items: [...cart.value],
        amount: totalAmount,
        paymentMethod: paymentMethod.value,
        nominalPaid: paidAmount,
        change: changeAmount
      };

      const txRecord = {
        id: transactionNo.value,
        date: transactionDate,
        tableNo: selectedTable.value,
        amount: totalAmount,
        paymentMethod: paymentMethod.value,
        itemsSummary: summaryStr,
        items: [...cart.value]
      };

      try {
        await apiService.createTransaction(txRecord);
        transactionHistory.value = await apiService.getTransactions();
        isReceiptModalOpen.value = true;
      } catch (err) {
        alert('Gagal memproses transaksi: ' + err.message);
      }
    };

    const closeReceiptModal = () => {
      isReceiptModalOpen.value = false;
      cart.value = [];
      selectedTable.value = '';
      nominalInput.value = '';
      isMobileCartOpen.value = false;
      rightPanelState.value = 'Keranjang';
      updateTransactionSequence();
    };

    // --- ANALYTICS / REPORTS COMPUTED VALUES ---
    const totalIncomeToday = computed(() => {
      const history = transactionHistory.value || [];
      return history.reduce((total, tx) => total + (tx && tx.amount ? tx.amount : 0), 0);
    });

    const totalTransactionsToday = computed(() => {
      const history = transactionHistory.value || [];
      return history.length;
    });

    const averageTransactionValue = computed(() => {
      const history = transactionHistory.value || [];
      if (history.length === 0) return 0;
      return Math.round(totalIncomeToday.value / history.length);
    });

    // --- FILTERED TRANSACTIONS FOR REPORT SCREEN ---
    const filteredTransactionsHistory = computed(() => {
      const history = transactionHistory.value || [];
      if (laporanFilterType.value === 'Semua') {
        return history;
      }

      if (laporanFilterType.value === 'Hari') {
        const today = new Date();
        const todayStr = String(today.getDate()).padStart(2, '0') + '/' +
          String(today.getMonth() + 1).padStart(2, '0') + '/' +
          today.getFullYear();
        return history.filter(tx => tx && tx.date && tx.date.startsWith(todayStr));
      }

      if (laporanFilterType.value === 'Tanggal') {
        if (!laporanSelectedDate.value) return history;
        const parts = laporanSelectedDate.value.split('-');
        if (parts.length !== 3) return history;
        const dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        return history.filter(tx => tx && tx.date && tx.date.startsWith(dateStr));
      }

      if (laporanFilterType.value === 'Bulan') {
        if (!laporanSelectedMonth.value) return history;
        const parts = laporanSelectedMonth.value.split('-');
        if (parts.length !== 2) return history;
        const monthStr = `${parts[1]}/${parts[0]}`;
        return history.filter(tx => {
          return tx && tx.date && tx.date.length >= 10 && tx.date.substring(3, 10) === monthStr;
        });
      }

      return history;
    });

    // --- PRINT FUNCTIONS ---
    const printElementHTML = (htmlContent, title = 'Cetak') => {
      const printWindow = window.open('', '_blank', 'width=850,height=700');
      if (printWindow) {
        const doc = printWindow.document;
        doc.write('<!DOCTYPE html>');
        doc.write('<html>');
        doc.write('<head>');
        doc.write(`<title>${title}</title>`);
        doc.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap">');
        doc.write('<script src="https://cdn.tailwindcss.com"><\/script>');
        doc.write('<style>');
        doc.write('body { font-family: "Plus Jakarta Sans", sans-serif; }');
        doc.write('.font-mono { font-family: "JetBrains Mono", monospace; }');
        doc.write('@media print { .no-print { display: none !important; } }');
        doc.write('<\/style>');
        doc.write('<\/head>');
        doc.write('<body class="p-6 bg-white text-slate-800">');
        doc.write('<div class="max-w-2xl mx-auto border border-slate-200 rounded-3xl p-6 shadow-sm no-print mb-4 flex justify-between items-center bg-slate-50">');
        doc.write('<span class="text-xs text-slate-500 font-bold">Pratinjau Dokumen Cetak. Gunakan tombol browser untuk mencetak atau menutup pratinjau.<\/span>');
        doc.write('<button onclick="window.print()" class="px-4 py-2 bg-[#1452B9] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">Cetak Sekarang<\/button>');
        doc.write('<\/div>');
        doc.write('<div class="max-w-3xl mx-auto">');
        doc.write(htmlContent);
        doc.write('<\/div>');
        doc.write('<script>');
        doc.write('window.onload = function() { window.print(); };');
        doc.write('<\/script>');
        doc.write('<\/body>');
        doc.write('<\/html>');
        doc.close();
      } else {
        alert('Gagal membuka pratinjau cetak. Harap izinkan pop-up pada browser Anda.');
      }
    };

    const printLaporan = () => {
      // ... (kode print laporan, sama seperti sebelumnya)
    };

    const printReceipt = () => {
      // ... (kode print receipt, sama seperti sebelumnya)
    };

    // ======================== RETURN ALL ========================
    return {
      isLoggedIn,
      loginUsername,
      loginPassword,
      loginError,
      isLoggingIn,
      handleLogin,
      laporanFilterType,
      laporanSelectedDate,
      laporanSelectedMonth,
      isFilterModalOpen,
      isDeleteConfirmModalOpen,
      menuToDelete,
      filteredTransactionsHistory,
      printLaporan,
      printReceipt,
      isAccountModalOpen,
      isChangePasswordModalOpen,
      isAccountPasswordVisible,
      accountName,
      accountUsername,
      accountPassword,
      oldPasswordInput,
      newPasswordInput,
      accountErrorMsg,
      accountSuccessMsg,
      openAccountModal,
      closeAccountModal,
      handleSaveAccount,
      openChangePasswordModal,
      closeChangePasswordModal,
      handleUpdatePassword,
      activePage,
      isSidebarOpen,
      isMobile,
      filteredMenus,
      isMobileCartOpen,
      isDeleteMode,
      isAddMenuModalOpen,
      isTableDropdownOpen,
      rightPanelState,
      transactionNo,
      kasirName,
      selectedTable,
      currentDateTime,
      paymentMethod,
      nominalInput,
      isReceiptModalOpen,
      lastCompletedTransaction,
      categories,
      activeCategory,
      tables,
      imagePresets,
      userEmail,
      menus,
      cart,
      transactionHistory,
      newMenu,
      toastMessage,
      toastType,
      showToastFlag,
      showToast,
      closeToast,
      isLogoutModalOpen,
      openLogoutModal,
      closeLogoutModal,
      executeLogout,
      formatRupiah,
      currentFormattedDateTime,
      currentDateDisplay,
      currentTimeDisplay,
      formatLoginTime,
      toggleSidebar,
      setActivePage,
      toggleDeleteMode,
      confirmDeleteMenu,
      executeDeleteMenu,
      cancelDeleteMenu,
      openAddMenuModal,
      closeAddMenuModal,
      submitAddMenu,
      toggleTableDropdown,
      selectTable,
      addToCart,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
      cartTotalItems,
      cartTotal,
      cartCount,
      proceedToPayment,
      backToCart,
      selectPaymentMethod,
      handleNominalInput,
      addCash,
      setExactCash,
      calculatedChange,
      isNominalValid,
      isPaymentExecutable,
      confirmPayment,
      closeReceiptModal,
      chooseMenuImage,
      handleFileUpload,
      removeSelectedImage,
      totalIncomeToday,
      totalTransactionsToday,
      averageTransactionValue
    };
  }
};

// ======================== MOUNT APP ========================
createApp(App).mount('#app');