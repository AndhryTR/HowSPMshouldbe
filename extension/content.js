/**
 * SPM Fakturis Pro - Content Script (Versi 3.6 - Clean & Unobtrusive)
 * - Tanpa banner di bagian atas (layout bersih dan maksimal untuk form)
 * - Auto-collapse sidebar (Ctrl+B)
 * - Quick Item Entry Bar di atas tabel
 * - 4 Kolom Diskon % + 2 Kolom Diskon Rp/Satuan lengkap
 * - Anti Tab-Trap pada field readonly
 * - Floating Grand Total Bar di dasar layar
 * - Tombol Simpan & Cetak
 */

(function () {
    'use strict';

    console.log('[SPM Fakturis Pro v3.6] Ekstensi aktif (Clean Mode)...');

    // Hapus banner jika sebelumnya pernah terinjeksi
    const existingBanner = document.getElementById('spm-pro-banner');
    if (existingBanner) existingBanner.remove();

    // 1. COLLAPSE SIDEBAR SECARA OTOMATIS (DEFAULT: COLLAPSED UNTUK FAKTURIS)
    function initSidebarCollapse() {
        const savedState = localStorage.getItem('spm_sidebar_collapsed');
        // Default: collapsed (tertutup) jika belum pernah diset, agar layar langsung lebar
        const shouldCollapse = savedState === null ? true : savedState === 'true';

        if (shouldCollapse) {
            document.body.classList.add('spm-sidebar-collapsed');
        } else {
            document.body.classList.remove('spm-sidebar-collapsed');
        }
    }

    function toggleSidebar() {
        const isCollapsed = document.body.classList.toggle('spm-sidebar-collapsed');
        localStorage.setItem('spm_sidebar_collapsed', isCollapsed ? 'true' : 'false');
        updateSidebarBadge();
    }

    function updateSidebarBadge() {
        const badge = document.getElementById('spm-sidebar-badge-text');
        if (!badge) return;
        const isCollapsed = document.body.classList.contains('spm-sidebar-collapsed');
        badge.textContent = isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar';
    }

    // 2. INJEKSI QUICK ITEM ENTRY BAR DI ATAS TABEL BARANG
    function injectQuickEntryBar() {
        if (document.getElementById('spm-quick-entry-bar')) return;

        // Cari tabel pertama di dalam form atau container tabel
        const table = document.querySelector('form table');
        if (!table) return;

        const tableContainer = table.closest('div') || table;

        const quickBar = document.createElement('div');
        quickBar.id = 'spm-quick-entry-bar';
        quickBar.className = 'spm-quick-entry-container';
        quickBar.innerHTML = `
            <div class="spm-quick-entry-header">
                <span style="display:flex; align-items:center; gap:6px;">
                    ⚡ Quick Item Entry (Input Cepat Numpad & Keyboard)
                </span>
                <span style="font-size:10.5px; font-weight:normal; color:#0369a1;">
                    Tekan <kbd style="background:#e0f2fe; color:#0369a1; padding:1px 5px; border-radius:3px; font-weight:700;">F2</kbd> tambah item • <kbd style="background:#e0f2fe; color:#0369a1; padding:1px 5px; border-radius:3px; font-weight:700;">Enter</kbd> submit
                </span>
            </div>
            <div class="spm-quick-entry-grid">
                <div>
                    <input type="text" id="spm-quick-sku" class="spm-quick-input font-bold" placeholder="Cari nama barang / SKU... (Tekan F2)">
                </div>
                <div>
                    <select id="spm-quick-satuan" class="spm-quick-input font-semibold text-sky-800">
                        <option value="Karton" selected>Karton (Dus)</option>
                        <option value="Bks">Bungkus (Pcs)</option>
                    </select>
                </div>
                <div>
                    <input type="number" id="spm-quick-qty" class="spm-quick-input text-center font-bold" value="1" placeholder="Qty">
                </div>
                <div>
                    <input type="text" id="spm-quick-d1" class="spm-quick-input text-center text-sky-700" value="0%" placeholder="Disc %">
                </div>
                <div>
                    <input type="text" id="spm-quick-drp" class="spm-quick-input text-right font-mono text-amber-800" value="0" placeholder="Disc Rp">
                </div>
                <div>
                    <button type="button" id="spm-quick-btn-add" class="spm-btn-quick-add">
                        <span>+ Tambah</span>
                        <kbd style="background:#0369a1; color:#fff; padding:1px 4px; border-radius:3px; font-size:10px;">Enter</kbd>
                    </button>
                </div>
            </div>
        `;

        tableContainer.parentNode.insertBefore(quickBar, tableContainer);

        const quickAddBtn = document.getElementById('spm-quick-btn-add');
        const quickSkuInput = document.getElementById('spm-quick-sku');

        function triggerNativeAdd() {
            const addBtn = getAddBarangButton();
            if (addBtn) {
                addBtn.click();
                setTimeout(() => {
                    const rows = document.querySelectorAll('form table tbody tr');
                    if (rows.length > 0) {
                        const lastRow = rows[rows.length - 1];
                        const searchBtn = lastRow.querySelector('button');
                        if (searchBtn) searchBtn.focus();
                    }
                }, 300);
            }
        }

        quickAddBtn?.addEventListener('click', triggerNativeAdd);
        quickSkuInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerNativeAdd();
            }
        });
    }

    // 3. HAPUS TAB-TRAP PADA FIELD READONLY
    function fixTabNavigation() {
        const readonlyInputs = document.querySelectorAll('input[readonly], textarea[readonly]');
        readonlyInputs.forEach(input => {
            input.setAttribute('tabindex', '-1');
        });
    }

    // 4. SELECTOR TOMBOL
    function getAddBarangButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => b.textContent && b.textContent.includes('Add Barang'));
    }

    function getSaveButton() {
        return document.querySelector('button.btn-save');
    }

    function getGrandTotalInput() {
        const inputs = Array.from(document.querySelectorAll('input[readonly]'));
        if (inputs.length >= 3) {
            return inputs[inputs.length - 1];
        }
        return null;
    }

    // 5. INJEKSI FLOATING STATUS BAR (DI DASAR LAYAR)
    function injectStatusBar() {
        if (document.getElementById('spm-statusbar')) return;

        const isCollapsed = document.body.classList.contains('spm-sidebar-collapsed');

        const bar = document.createElement('div');
        bar.id = 'spm-statusbar';
        bar.className = 'spm-fakturis-statusbar';
        bar.innerHTML = `
            <div class="spm-statusbar-left">
                <span class="spm-badge" id="spm-sidebar-toggle-badge" style="cursor:pointer;" title="Klik atau tekan Ctrl+B untuk buka/tutup sidebar">
                    <kbd>Ctrl+B</kbd> <span id="spm-sidebar-badge-text">${isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}</span>
                </span>
                <span class="spm-badge"><kbd>F2</kbd> Tambah Item</span>
                <span class="spm-badge"><kbd>Ctrl+S</kbd> Simpan</span>
                <span class="spm-badge"><kbd>Alt+P</kbd> Simpan & Cetak</span>
            </div>
            <div class="spm-statusbar-right">
                <span class="spm-total-label">Grand Total Faktur:</span>
                <span id="spm-grand-total-display" class="spm-total-value">Rp 0</span>
            </div>
        `;
        document.body.appendChild(bar);

        document.getElementById('spm-sidebar-toggle-badge')?.addEventListener('click', toggleSidebar);

        syncGrandTotal();
        setInterval(syncGrandTotal, 400);
    }

    function syncGrandTotal() {
        const display = document.getElementById('spm-grand-total-display');
        if (!display) return;
        const totalInput = getGrandTotalInput();
        if (totalInput && totalInput.value) {
            display.textContent = 'Rp ' + totalInput.value;
        }
    }

    // 6. INJEKSI TOMBOL SIMPAN & CETAK
    function injectSaveAndPrintButton() {
        const saveBtn = getSaveButton();
        if (!saveBtn || document.getElementById('spm-btn-save-print')) return;

        if (!saveBtn.querySelector('.spm-keyhint')) {
            const hint = document.createElement('span');
            hint.className = 'spm-keyhint';
            hint.textContent = 'Ctrl+S';
            saveBtn.appendChild(hint);
        }

        const printBtn = document.createElement('button');
        printBtn.id = 'spm-btn-save-print';
        printBtn.type = 'button';
        printBtn.className = 'spm-btn-save-print';
        printBtn.innerHTML = `
            <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            Simpan & Cetak
            <span class="spm-keyhint">Alt+P</span>
        `;

        printBtn.addEventListener('click', function () {
            sessionStorage.setItem('spm_auto_print', 'true');
            saveBtn.click();
        });

        saveBtn.parentNode.insertBefore(printBtn, saveBtn);

        const addBtn = getAddBarangButton();
        if (addBtn && !addBtn.querySelector('.spm-keyhint')) {
            const hint = document.createElement('span');
            hint.className = 'spm-keyhint';
            hint.textContent = 'F2';
            addBtn.appendChild(hint);
        }
    }

    // 7. KEYBOARD SHORTCUTS
    function setupKeyboardShortcuts() {
        window.addEventListener('keydown', function (e) {
            // Ctrl + B: Toggle Sidebar
            if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                toggleSidebar();
            }

            // F2: Tambah Item / Fokus Quick SKU
            if (e.key === 'F2') {
                e.preventDefault();
                const quickSku = document.getElementById('spm-quick-sku');
                if (quickSku) {
                    quickSku.focus();
                } else {
                    const addBtn = getAddBarangButton();
                    if (addBtn) addBtn.click();
                }
            }

            // Ctrl + S: Simpan Faktur
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                const saveBtn = getSaveButton();
                if (saveBtn) saveBtn.click();
            }

            // Alt + P atau Ctrl + Enter: Simpan & Cetak
            if ((e.altKey && (e.key === 'p' || e.key === 'P')) || (e.ctrlKey && e.key === 'Enter')) {
                e.preventDefault();
                const printBtn = document.getElementById('spm-btn-save-print');
                if (printBtn) printBtn.click();
            }
        });
    }

    // 8. SWEEP & RE-APPLY LOOP
    function applyTransformations() {
        // Bersihkan banner jika muncul kembali
        document.getElementById('spm-pro-banner')?.remove();

        injectQuickEntryBar();
        fixTabNavigation();
        injectStatusBar();
        injectSaveAndPrintButton();
    }

    function init() {
        initSidebarCollapse();
        setupKeyboardShortcuts();
        applyTransformations();

        const observer = new MutationObserver(() => {
            applyTransformations();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(applyTransformations, 1000);
        console.log('[SPM Fakturis Pro v3.6] Transformasi selesai!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
