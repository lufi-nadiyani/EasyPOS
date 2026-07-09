// ======================== VUE 3 ESM ========================
// PASTIKAN SEMUA DI-IMPORT DENGAN BENAR
import {
    createApp,
    ref,
    reactive,
    computed,
    onMounted,
    onBeforeUnmount
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

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

// ===== TAMBAHKAN INI =====
// Format tanggal untuk display di beranda (dengan nama hari)
const currentDateDisplay = computed(() => {
    const d = currentDateTime.value;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[d.getDay()];
    const dateStr = String(d.getDate()).padStart(2, '0') + '/' +
        String(d.getMonth() + 1).padStart(2, '0') + '/' +
        d.getFullYear();
    return `${dayName}, ${dateStr}`;
});

// Format waktu untuk display di beranda (dengan detik)
const currentTimeDisplay = computed(() => {
    const d = currentDateTime.value;
    return String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':' +
        String(d.getSeconds()).padStart(2, '0') + ' WIB';
});
// ===== SAMPAI SINI =====

const formatLoginTime = computed(() => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' WIB';
});