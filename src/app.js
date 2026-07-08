/**
 * EasyPOS - Frontend Cashier Application Logic
 * Powered by Vue.js 3 (ESM)
 * 
 * This file handles all reactive states, transaction calculations, 
 * local storage persistence, responsive layout listeners, and mock database.
 * It is fully integrated with the `/src/api.js` service for smooth backend migration.
 */

import { createApp, ref, reactive, computed, onMounted, onBeforeUnmount } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiService } from './api.js';

const App = {
  setup() {
    // --- AUTHENTICATION STATES ---
    const isLoggedIn = ref(false);
    const loginUsername = ref('');
    const loginPassword = ref('');
    const loginError = ref('');
    const isLoggingIn = ref(false);

    // --- APP SCREEN STATES ---
    const activePage = ref('Beranda'); // Options: 'Beranda', 'Kasir', 'Laporan', 'Akun'
    const isSidebarOpen = ref(true);
    const isMobile = ref(false);
    const isMobileCartOpen = ref(false); // Mobile drawer toggle for the cart
    const isDeleteMode = ref(false); // Toggled by "Hapus Menu"
    const isAddMenuModalOpen = ref(false); // "Tambah Menu" modal popup
    const isTableDropdownOpen = ref(false); // Table selection dropdown grid
    const rightPanelState = ref('Keranjang'); // Options: 'Keranjang', 'Pembayaran'

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
    const selectedTable = ref(''); // e.g. "05"
    const currentDateTime = ref(new Date());
    const paymentMethod = ref('Tunai'); // 'Tunai', 'QRIS', 'Debit'
    const nominalInput = ref(''); // Raw string inputted by cashier
    
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

    const laporanFilterType = ref('Tanggal'); // 'Semua', 'Hari', 'Tanggal', 'Bulan'
    const laporanSelectedDate = ref(`${yyyy}-${mm}-${dd}`);
    const laporanSelectedMonth = ref(`${yyyy}-${mm}`);
    const isFilterModalOpen = ref(false);
    const isDeleteConfirmModalOpen = ref(false);
    const menuToDelete = ref(null);

    // Preset categories
    const categories = ['Makanan', 'Minuman', 'Snack'];
    const activeCategory = ref('Makanan');

    // Preset tables (matches Image 5)
    const tables = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // --- PHOTO / IMAGE PRESETS FOR TAMBAH MENU ---
    const imagePresets = [
      { url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60', label: 'Nasi Goreng' },
      { url: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&auto=format&fit=crop&q=60', label: 'Nasi Telur' },
      { url: 'https://images.unsplash.com/photo-1591814468924-cafb06223adc?w=500&auto=format&fit=crop&q=60', label: 'Laksa Noodles' },
      { url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60', label: 'Teh Hangat' },
      { url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60', label: 'Iced Lemon Tea' },
      { url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60', label: 'Jus Mangga' }
    ];

    // --- CORE DATABASES ---
    const menus = ref([]);
    const cart = ref([]);
    const transactionHistory = ref([]);
    const userEmail = ref('nadiyanilufi27@gmail.com');

    // New menu form template
    const newMenu = reactive({
      name: '',
      price: '',
      category: 'Makanan',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60'
    });

    // --- INITIALIZATION & LIFECYCLE ---
    onMounted(async () => {
      // Check checkLoggedInState
      const sessionUser = localStorage.getItem('easypos_session');
      if (sessionUser) {
        isLoggedIn.value = true;
      }

      // Load initial databases via API
      await loadInitialData();

      // Determine starting transaction sequence
      updateTransactionSequence();

      // Check Mobile Width and listen
      checkViewport();
      window.addEventListener('resize', checkViewport);

      // Start Clock ticker
      const timer = setInterval(() => {
        currentDateTime.value = new Date();
      }, 1000);

      // Close dropdowns if click outside
      window.addEventListener('click', handleOutsideClick);

      // Save timer for unmount
      onBeforeUnmount(() => {
        clearInterval(timer);
        window.removeEventListener('resize', checkViewport);
        window.removeEventListener('click', handleOutsideClick);
      });
    });

    const loadInitialData = async () => {
      try {
        menus.value = (await apiService.getMenus()) || [];
        transactionHistory.value = (await apiService.getTransactions()) || [];
        
        // Load Account info
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
      // Table dropdown outside click
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
          // Clean login fields
          loginUsername.value = '';
          loginPassword.value = '';
          activePage.value = 'Beranda';
          // Reload fresh data
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
        // Trigger popup modal langsung sesuai permintaan user tanpa berpindah halaman
        openAccountModal();
        return;
      }
      activePage.value = page;
      if (isMobile.value) {
        isSidebarOpen.value = false;
      }
    };

    const logout = () => {
      const confirmLogout = confirm('Apakah Anda yakin ingin keluar dari sistem EasyPOS?');
      if (confirmLogout) {
        localStorage.removeItem('easypos_session');
        isLoggedIn.value = false;
        isSidebarOpen.value = false;
        activePage.value = 'Beranda';
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
        // Simpan nama/username saja
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
          // Update local reactive values
          accountPassword.value = newPasswordInput.value;
          accountSuccessMsg.value = 'Kata sandi berhasil diubah!';
          setTimeout(() => {
            isChangePasswordModalOpen.value = false;
            // reopen account modal with fresh info
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
    };

    const confirmDeleteMenu = (menu) => {
      menuToDelete.value = menu;
      isDeleteConfirmModalOpen.value = true;
    };

    const executeDeleteMenu = async () => {
      if (!menuToDelete.value) return;
      try {
        await apiService.deleteMenu(menuToDelete.value.id);
        // Reload from service
        menus.value = await apiService.getMenus();
        // Remove from cart if active
        removeCartItem(menuToDelete.value.id);
        isDeleteConfirmModalOpen.value = false;
        menuToDelete.value = null;
      } catch (err) {
        alert('Gagal menghapus menu');
      }
    };

    const cancelDeleteMenu = () => {
      isDeleteConfirmModalOpen.value = false;
      menuToDelete.value = null;
    };

    const openAddMenuModal = () => {
      isAddMenuModalOpen.value = true;
      // Reset form variables
      newMenu.name = '';
      newMenu.price = '';
      newMenu.category = activeCategory.value; // default to current active category
      newMenu.image = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60'; // default preset image
    };

    const closeAddMenuModal = () => {
      isAddMenuModalOpen.value = false;
    };

    const submitAddMenu = async () => {
      if (!newMenu.name || !newMenu.price) {
        alert('Mohon isi nama dan harga menu dengan benar.');
        return;
      }

      const menuToAdd = {
        name: newMenu.name,
        price: Number(newMenu.price),
        category: newMenu.category,
        image: newMenu.image || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60'
      };

      try {
        await apiService.addMenu(menuToAdd);
        // Reload fresh list
        menus.value = await apiService.getMenus();
        alert(`Menu "${newMenu.name}" berhasil ditambahkan!`);
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
        return;
      }
      const existingItem = cart.value.find(item => item.menuId === menu.id);
      if (existingItem) {
        existingItem.quantity += 1;
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

      // Save complete receipt data
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
        // Reload transactions from API to keep state synchronized perfectly!
        transactionHistory.value = await apiService.getTransactions();
        
        // Trigger receipt popup
        isReceiptModalOpen.value = true;
      } catch (err) {
        alert('Gagal memproses transaksi: ' + err.message);
      }
    };

    const closeReceiptModal = () => {
      isReceiptModalOpen.value = false;
      
      // Clear cart & Reset inputs
      cart.value = [];
      selectedTable.value = '';
      nominalInput.value = '';
      isMobileCartOpen.value = false;
      rightPanelState.value = 'Keranjang';

      // Increment sequence number
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

    // --- NEW: FILTERED TRANSACTIONS FOR REPORT SCREEN ---
    const filteredTransactionsHistory = computed(() => {
      const history = transactionHistory.value || [];
      if (laporanFilterType.value === 'Semua') {
        return history;
      }
      
      if (laporanFilterType.value === 'Hari') {
        // Ambil transaksi hari ini berdasarkan tanggal DD/MM/YYYY
        const today = new Date();
        const todayStr = String(today.getDate()).padStart(2, '0') + '/' + 
                         String(today.getMonth() + 1).padStart(2, '0') + '/' + 
                         today.getFullYear();
        return history.filter(tx => tx && tx.date && tx.date.startsWith(todayStr));
      }
      
      if (laporanFilterType.value === 'Tanggal') {
        if (!laporanSelectedDate.value) return history;
        // Format laporanSelectedDate: YYYY-MM-DD -> ubah ke DD/MM/YYYY
        const parts = laporanSelectedDate.value.split('-');
        if (parts.length !== 3) return history;
        const dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        return history.filter(tx => tx && tx.date && tx.date.startsWith(dateStr));
      }
      
      if (laporanFilterType.value === 'Bulan') {
        if (!laporanSelectedMonth.value) return history;
        // Format laporanSelectedMonth: YYYY-MM -> ubah ke MM/YYYY
        const parts = laporanSelectedMonth.value.split('-');
        if (parts.length !== 2) return history;
        const monthStr = `${parts[1]}/${parts[0]}`;
        return history.filter(tx => {
          // tx.date format: DD/MM/YYYY HH:mm -> ambil MM/YYYY (indeks 3 sampai 10)
          return tx && tx.date && tx.date.length >= 10 && tx.date.substring(3, 10) === monthStr;
        });
      }
      
      return history;
    });

    // --- NEW: WINDOWED PRINT HELPER FOR MODAL/IFRAME ISOLATION ---
    const printElementHTML = (htmlContent, title = 'Cetak') => {
      const printWindow = window.open('', '_blank', 'width=850,height=700');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: "Plus Jakarta Sans", sans-serif; }
                .font-mono { font-family: "JetBrains Mono", monospace; }
                @media print {
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body class="p-6 bg-white text-slate-800">
              <div class="max-w-2xl mx-auto border border-slate-200 rounded-3xl p-6 shadow-sm no-print mb-4 flex justify-between items-center bg-slate-50">
                <span class="text-xs text-slate-500 font-bold">Pratinjau Dokumen Cetak. Gunakan tombol browser untuk mencetak atau menutup pratinjau.</span>
                <button onclick="window.print()" class="px-4 py-2 bg-[#1452B9] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">Cetak Sekarang</button>
              </div>
              <div class="max-w-3xl mx-auto">
                ${htmlContent}
              </div>
              <script>
                window.onload = function() {
                  // Auto trigger print
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        alert('Gagal membuka pratinjau cetak. Harap izinkan pop-up pada browser Anda.');
      }
    };

    // --- NEW: ACTION FOR PRINT REPORT ---
    const printLaporan = () => {
      let filterText = 'Semua Transaksi';
      if (laporanFilterType.value === 'Hari') filterText = 'Transaksi Hari Ini';
      else if (laporanFilterType.value === 'Tanggal') {
        const parts = laporanSelectedDate.value.split('-');
        filterText = parts.length === 3 ? `Transaksi Tanggal ${parts[2]}/${parts[1]}/${parts[0]}` : `Transaksi Tanggal ${laporanSelectedDate.value}`;
      } else if (laporanFilterType.value === 'Bulan') {
        const parts = laporanSelectedMonth.value.split('-');
        filterText = parts.length === 2 ? `Transaksi Bulan ${parts[1]}/${parts[0]}` : `Transaksi Bulan ${laporanSelectedMonth.value}`;
      }

      const rowsHtml = filteredTransactionsHistory.value.map(tx => {
        const totalItems = tx.items && tx.items.length > 0 ? tx.items.reduce((acc, item) => acc + item.quantity, 0) : 1;
        return `
          <tr class="border-b border-slate-200">
            <td class="py-3 px-4 font-bold text-slate-900">${tx.id}</td>
            <td class="py-3 px-4 text-slate-600 font-mono text-[11px]">${tx.date}</td>
            <td class="py-3 px-4 text-center text-slate-800 font-bold">${totalItems}</td>
            <td class="py-3 px-4 text-right text-slate-900 font-bold">${formatRupiah(tx.amount)}</td>
            <td class="py-3 px-4 text-center font-bold text-slate-700">${tx.paymentMethod}</td>
            <td class="py-3 px-4 text-center text-green-600 font-bold">Selesai</td>
          </tr>
        `;
      }).join('');

      const grandTotal = filteredTransactionsHistory.value.reduce((acc, tx) => acc + tx.amount, 0);
      const totalCount = filteredTransactionsHistory.value.length;

      const content = `
        <div class="p-4">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-extrabold text-slate-950 tracking-tight">LAPORAN TRANSAKSI PENJUALAN</h1>
            <h2 class="text-base font-extrabold text-[#1452B9] uppercase mt-1 tracking-wide">EASYPOS - RUMAH MAKAN IBU</h2>
            <p class="text-[10px] text-slate-400 font-medium mt-1">Sistem Laporan Kasir Profesional • Waktu Cetak: ${currentFormattedDateTime.value} WIB</p>
          </div>

          <div class="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex justify-between items-center text-xs">
            <div>
              <span class="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-0.5">Filter Periode</span>
              <span class="font-extrabold text-slate-800 text-sm">${filterText}</span>
            </div>
            <div class="text-right">
              <span class="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-0.5">Ringkasan Volume</span>
              <span class="font-extrabold text-[#1452B9] text-sm">${totalCount} Transaksi Selesai</span>
            </div>
          </div>

          <table class="w-full text-left border-collapse text-xs mb-8">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th class="py-3 px-4">No. Transaksi</th>
                <th class="py-3 px-4">Tanggal / Waktu</th>
                <th class="py-3 px-4 text-center">Total Item</th>
                <th class="py-3 px-4 text-right">Total Pembayaran</th>
                <th class="py-3 px-4 text-center">Metode Bayar</th>
                <th class="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${rowsHtml || '<tr><td colspan="6" class="py-12 text-center text-slate-400 font-semibold">Tidak ada transaksi ditemukan untuk filter ini</td></tr>'}
            </tbody>
          </table>

          <div class="flex justify-end gap-6 border-t border-slate-200 pt-6">
            <div class="text-right">
              <span class="text-slate-400 block text-xs uppercase font-bold tracking-wider text-[9px] mb-1">TOTAL OMSET PENDAPATAN</span>
              <span class="text-2xl font-black text-[#1452B9]">${formatRupiah(grandTotal)}</span>
            </div>
          </div>

          <div class="mt-16 flex justify-between text-center text-xs text-slate-600">
            <div>
              <p class="mb-14 font-medium text-slate-500">Mengetahui, Owner</p>
              <p class="font-bold border-t border-slate-300 pt-1 w-44 mx-auto text-slate-800">( Ibu Owner )</p>
            </div>
            <div>
              <p class="mb-14 font-medium text-slate-500">Petugas Kasir</p>
              <p class="font-bold border-t border-slate-300 pt-1 w-44 mx-auto text-slate-800">( Administrator )</p>
            </div>
          </div>
        </div>
      `;

      printElementHTML(content, 'Laporan_Transaksi_EasyPOS');
    };

    // --- NEW: ACTION FOR PRINT RECEIPT ---
    const printReceipt = () => {
      const tx = lastCompletedTransaction.value;
      if (!tx || !tx.id) return;

      const itemsHtml = tx.items.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
          <span style="font-weight: bold; font-family: sans-serif; color: #111;">${item.name}</span>
          <span style="font-weight: bold; color: #000;">${formatRupiah(item.price * item.quantity)}</span>
        </div>
        <div style="font-size: 10px; color: #666; margin-bottom: 6px; margin-top: -1px;">
          ${item.quantity} x ${formatRupiah(item.price)}
        </div>
      `).join('');

      const receiptHtml = `
        <div style="max-width: 290px; margin: 0 auto; padding: 15px; font-family: 'JetBrains Mono', Courier, monospace; font-size: 11px; line-height: 1.4; color: #000; border: 1px solid #eee; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 15px; font-weight: 800; letter-spacing: 0.5px;">RUMAH MAKAN IBU</h3>
            <p style="margin: 3px 0; font-size: 10px; color: #444; font-family: sans-serif;">Jl. Kavling 12, Jakarta Selatan</p>
            <p style="margin: 2px 0; font-size: 10px; color: #444; font-family: sans-serif;">Telp: 0812-8888-9999</p>
            <p style="margin: 8px 0 0 0; font-size: 9px; font-weight: bold; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0; letter-spacing: 0.5px;">STRUK PEMBAYARAN ASLI</p>
          </div>

          <div style="margin-bottom: 10px; font-size: 10px; color: #333;">
            <div style="display: flex; justify-content: space-between;">
              <span>No. Transaksi:</span>
              <span style="font-weight: bold;">${tx.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Tanggal:</span>
              <span>${tx.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Meja:</span>
              <span style="font-weight: bold;">Meja ${tx.tableNo}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Kasir:</span>
              <span>Administrator</span>
            </div>
          </div>

          <div style="border-top: 1px dashed #000; margin-bottom: 8px;"></div>

          <div style="margin-bottom: 8px;">
            ${itemsHtml}
          </div>

          <div style="border-top: 1px dashed #000; padding-top: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
              <span>TOTAL</span>
              <span>${formatRupiah(tx.amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #333;">
              <span>Metode Bayar:</span>
              <span style="text-transform: uppercase; font-weight: bold;">${tx.paymentMethod}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px; color: #333;">
              <span>Nominal Bayar:</span>
              <span>${formatRupiah(tx.nominalPaid)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px dotted #000; padding-top: 4px; margin-top: 4px; color: #000;">
              <span>KEMBALIAN</span>
              <span>${formatRupiah(tx.change)}</span>
            </div>
          </div>

          <div style="border-top: 1px dashed #000; margin-top: 12px; padding-top: 8px; text-align: center; font-size: 10px; color: #444;">
            <p style="margin: 0; font-weight: bold;">TERIMA KASIH ATAS KUNJUNGANNYA</p>
            <p style="margin: 2px 0 0 0; font-family: sans-serif;">Selamat Menikmati Hidangan Kami!</p>
          </div>
        </div>
      `;

      const printWindow = window.open('', '_blank', 'width=340,height=580');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Struk_${tx.id}</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap">
              <style>
                body { 
                  margin: 0; 
                  padding: 15px; 
                  background: #fff; 
                  display: flex; 
                  justify-content: center; 
                  align-items: flex-start;
                }
              </style>
            </head>
            <body>
              ${receiptHtml}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        alert('Gagal mencetak struk. Harap izinkan pop-up pada browser Anda.');
      }
    };

    return {
      // Auth
      isLoggedIn,
      loginUsername,
      loginPassword,
      loginError,
      isLoggingIn,
      handleLogin,

      // Report Filtering
      laporanFilterType,
      laporanSelectedDate,
      laporanSelectedMonth,
      isFilterModalOpen,
      isDeleteConfirmModalOpen,
      menuToDelete,
      filteredTransactionsHistory,
      printLaporan,
      printReceipt,

      // Account settings popups
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

      // Screen views
      activePage,
      isSidebarOpen,
      isMobile,
      isMobileCartOpen,
      isDeleteMode,
      isAddMenuModalOpen,
      isTableDropdownOpen,
      rightPanelState,

      // App states
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

      // Core models
      menus,
      cart,
      transactionHistory,
      newMenu,

      // Formatters
      formatRupiah,
      currentFormattedDateTime,
      formatLoginTime,

      // Actions
      toggleSidebar,
      setActivePage,
      logout,
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

      // Analytics
      totalIncomeToday,
      totalTransactionsToday,
      averageTransactionValue
    };
  }
};

// Mount Vue Application
createApp(App).mount('#app');
