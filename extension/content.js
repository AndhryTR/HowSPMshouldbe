/**
 * SPM Fakturis Pro - Content Script (v4.0 - Precision ERP Layout & Instant Search)
 * Target: stagingsinarpanganmakmur.my.id/module-penjualan/penjualan/add
 *
 * Fitur utama:
 * - Auto-collapse sidebar (Ctrl+B) di seluruh halaman SPM
 * - Layout high-density berbasis DOM asli form#module-transaksi (tanpa merusak Alpine.js)
 * - Header 4 kolom sejajar (Pelanggan, Golongan, Gudang, Nomor Penjualan)
 * - Identitas Pelanggan padat 1 baris + lipat otomatis NIK/NPWP/Jenis
 * - F2 Instant Search: klik Add Barang -> buka Cari Barang -> fokus input pencarian
 * - F4 Instant Pelanggan: buka & fokus pencarian Pelanggan
 * - Anti Tab-Trap pada field readonly & tombol stepper qty (-/+)
 * - Floating Grand Total & Action Bar tersinkron langsung ke #subtotal_bruto, #total_diskon, #total
 */

(function () {
    'use strict';

    console.log('[SPM Fakturis Pro v4.0] Aktif...');

    // =========================================================================
    // 1. SIDEBAR COLLAPSE (GLOBAL)
    // =========================================================================
    function initSidebarCollapse() {
        const saved = localStorage.getItem('spm_sidebar_collapsed');
        const shouldCollapse = saved === null ? true : saved === 'true';
        document.body.classList.toggle('spm-sidebar-collapsed', shouldCollapse);
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

    // =========================================================================
    // 2. DETEKSI HALAMAN FORM PENJUALAN & SELECTOR ASLI
    // =========================================================================
    function isPenjualanForm() {
        return Boolean(
            document.querySelector('form#module-transaksi') &&
            document.getElementById('table-detailbarang')
        );
    }

    function getAddBarangButton() {
        return (
            document.querySelector('button[onclick="addRowBarang()"]') ||
            Array.from(document.querySelectorAll('button')).find(
                (b) => b.textContent && b.textContent.trim().includes('Add Barang')
            )
        );
    }

    function getSaveButton() {
        return document.querySelector('form#module-transaksi button.btn-save');
    }

    function parseIdNumber(str) {
        if (str === null || str === undefined) return 0;
        const cleaned = String(str)
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.');
        const num = parseFloat(cleaned);
        return Number.isFinite(num) ? num : 0;
    }

    let toastTimer = null;
    function showToast(message) {
        let toast = document.getElementById('spm-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'spm-toast';
            toast.className = 'spm-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('spm-toast-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('spm-toast-show');
        }, 2200);
    }

    function handlePostSaveAutoPrint() {
        if (isPenjualanForm()) return;
        if (sessionStorage.getItem('spm_auto_print') !== 'true') return;
        sessionStorage.removeItem('spm_auto_print');

        // Cari tombol/link cetak pada halaman detail/daftar setelah simpan
        const printTrigger = document.querySelector(
            'a[href*="print"], a[href*="cetak"], button[onclick*="print"], .btn-print'
        );
        if (printTrigger) {
            showToast('Membuka cetak faktur...');
            setTimeout(() => printTrigger.click(), 350);
        } else {
            showToast('Faktur tersimpan. Klik tombol Cetak untuk mencetak.');
        }
    }

    function focusVisibleDropdownSearch(maxAttempts = 24) {
        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            const inputs = Array.from(document.querySelectorAll('input.dropdown-cari'));
            const visible = inputs.reverse().find((el) => el.offsetParent !== null);
            if (visible) {
                clearInterval(timer);
                visible.focus();
                visible.select();
            } else if (attempts >= maxAttempts) {
                clearInterval(timer);
            }
        }, 45);
    }

    // =========================================================================
    // 3. ALUR F2 INSTANT SEARCH & F4 PELANGGAN (OPSI 1)
    // =========================================================================
    function triggerInstantAddBarang() {
        const addBtn = getAddBarangButton();
        if (!addBtn) return;

        const tbody = document.querySelector('#table-detailbarang tbody');
        const prevCount = tbody ? tbody.querySelectorAll('tr').length : 0;

        addBtn.click();

        let attempts = 0;
        const waitRow = setInterval(() => {
            attempts++;
            const rows = tbody ? tbody.querySelectorAll('tr') : [];
            if (rows.length > prevCount) {
                clearInterval(waitRow);
                const lastRow = rows[rows.length - 1];
                lastRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

                const barangBtn = lastRow.querySelector(
                    'td:first-child button[x-ref="tombol"], td:first-child button'
                );
                if (barangBtn) {
                    barangBtn.click();
                    focusVisibleDropdownSearch();
                }
            } else if (attempts >= 30) {
                clearInterval(waitRow);
            }
        }, 45);
    }

    function triggerFocusPelanggan() {
        const custHidden = document.getElementById('id_customer');
        const wrapper = custHidden ? custHidden.closest('[x-data]') : null;
        const btn = wrapper
            ? wrapper.querySelector('button[x-ref="tombol"], button')
            : null;
        if (btn) {
            btn.scrollIntoView({ block: 'center', behavior: 'smooth' });
            btn.click();
            focusVisibleDropdownSearch();
        }
    }

    // =========================================================================
    // 3B. AUTO-BUKA SATUAN SETELAH PILIH BARANG -> AUTO-FOKUS QTY
    // =========================================================================
    function openSatuanDropdown(tr) {
        if (!tr || !tr.isConnected) return;
        const satuanBtn = tr.querySelector(
            'td:nth-child(2) button[x-ref="tombol"], td:nth-child(2) button'
        );
        if (!satuanBtn) return;

        // Tunggu sebentar agar popover Barang menutup & opsi satuan selesai dimuat
        let attempts = 0;
        setTimeout(() => {
            const waitReady = setInterval(() => {
                attempts++;
                if (!tr.isConnected) {
                    clearInterval(waitReady);
                    return;
                }
                if (!satuanBtn.disabled) {
                    clearInterval(waitReady);
                    tr.dataset.spmWaitingUnit = '1';
                    satuanBtn.click();
                    focusVisibleDropdownSearch(16);
                } else if (attempts >= 25) {
                    clearInterval(waitReady);
                }
            }, 60);
        }, 220);
    }

    function focusRowQty(tr) {
        if (!tr || !tr.isConnected) return;
        const qtyInput = tr.querySelector('input.qty, input[name="productQty[]"]');
        if (qtyInput) {
            setTimeout(() => {
                qtyInput.focus();
                qtyInput.select();
            }, 80);
        }
    }

    function watchProductAndUnitSelection() {
        const rows = document.querySelectorAll('#table-detailbarang tbody tr');
        rows.forEach((tr) => {
            const prodInput = tr.querySelector('input[name="product[]"]');
            const unitInput = tr.querySelector('input[name="unit[]"]');

            if (prodInput) {
                const currentProd = prodInput.value || '';
                if (tr.dataset.spmLastProduct === undefined) {
                    tr.dataset.spmLastProduct = currentProd;
                } else if (currentProd && currentProd !== tr.dataset.spmLastProduct) {
                    tr.dataset.spmLastProduct = currentProd;
                    tr.dataset.spmLastUnit = unitInput ? (unitInput.value || '') : '';
                    openSatuanDropdown(tr);
                }
            }

            if (unitInput) {
                const currentUnit = unitInput.value || '';
                if (tr.dataset.spmLastUnit === undefined) {
                    tr.dataset.spmLastUnit = currentUnit;
                } else if (
                    tr.dataset.spmWaitingUnit === '1' &&
                    currentUnit &&
                    currentUnit !== tr.dataset.spmLastUnit
                ) {
                    tr.dataset.spmLastUnit = currentUnit;
                    delete tr.dataset.spmWaitingUnit;
                    focusRowQty(tr);
                }
            }
        });
    }

    function setupRowAutoFlowListeners() {
        // Tangkap event change langsung (jika Alpine / script memicu change)
        document.addEventListener('change', (e) => {
            const target = e.target;
            if (!target || !target.matches) return;
            if (target.matches('#table-detailbarang input[name="product[]"]')) {
                const tr = target.closest('tr');
                if (tr && target.value && target.value !== tr.dataset.spmLastProduct) {
                    tr.dataset.spmLastProduct = target.value;
                    const unitInput = tr.querySelector('input[name="unit[]"]');
                    tr.dataset.spmLastUnit = unitInput ? (unitInput.value || '') : '';
                    openSatuanDropdown(tr);
                }
            } else if (target.matches('#table-detailbarang input[name="unit[]"]')) {
                const tr = target.closest('tr');
                if (tr && tr.dataset.spmWaitingUnit === '1' && target.value) {
                    tr.dataset.spmLastUnit = target.value;
                    delete tr.dataset.spmWaitingUnit;
                    focusRowQty(tr);
                }
            }
        }, true);

        // Jika user mengklik opsi yang sama di dropdown Satuan (nilai unit[] tidak berubah),
        // tetap lompat ke Qty agar alur input tetap cepat
        document.addEventListener('click', (e) => {
            const li = e.target?.closest?.('ul li');
            if (!li) return;
            const waitingRow = document.querySelector('#table-detailbarang tbody tr[data-spm-waiting-unit="1"]');
            if (waitingRow) {
                delete waitingRow.dataset.spmWaitingUnit;
                focusRowQty(waitingRow);
            }
        }, true);

        // Bersihkan status menunggu jika user menekan Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document
                    .querySelectorAll('#table-detailbarang tbody tr[data-spm-waiting-unit="1"]')
                    .forEach((tr) => delete tr.dataset.spmWaitingUnit);
            }
        }, true);
    }

    // =========================================================================
    // 3C. NAVIGASI ARROW KEYS + ENTER DI SEMUA DROPDOWN PENCARIAN (.dropdown-cari)
    // =========================================================================
    function findDropdownContainer(searchInput) {
        let node = searchInput?.parentElement;
        while (node && node !== document.body) {
            if (node.querySelector('ul')) return node;
            node = node.parentElement;
        }
        return null;
    }

    function getSelectableDropdownItems(container) {
        if (!container) return [];
        const allItems = Array.from(container.querySelectorAll('ul li')).filter(
            (li) => li.offsetParent !== null
        );
        const pointerItems = allItems.filter((li) =>
            li.className && li.className.includes('cursor-pointer')
        );
        if (pointerItems.length > 0) return pointerItems;

        return allItems.filter(
            (li) => !/^\s*(memuat|loading|tidak ditemukan|tidak ada|kosong|ketik)/i.test(li.textContent || '')
        );
    }

    function setActiveDropdownIndex(container, index) {
        const items = getSelectableDropdownItems(container);
        container.querySelectorAll('ul li.spm-dd-active').forEach((li) => {
            li.classList.remove('spm-dd-active');
        });
        if (items.length === 0) return null;

        const wrapped = ((index % items.length) + items.length) % items.length;
        const active = items[wrapped];
        active.classList.add('spm-dd-active');
        active.scrollIntoView({ block: 'nearest' });
        return active;
    }

    function syncActiveDropdownDefault() {
        const activeEl = document.activeElement;
        if (!activeEl || !activeEl.matches || !activeEl.matches('input.dropdown-cari')) return;
        const container = findDropdownContainer(activeEl);
        if (!container) return;
        const items = getSelectableDropdownItems(container);
        if (items.length === 0) return;

        const current = container.querySelector('ul li.spm-dd-active');
        if (!current || !items.includes(current)) {
            setActiveDropdownIndex(container, 0);
        }
    }

    function setupDropdownKeyboardNav() {
        // Auto-highlight item pertama saat user mengetik atau fokus di kotak pencarian
        document.addEventListener('input', (e) => {
            if (!e.target?.matches?.('input.dropdown-cari')) return;
            const container = findDropdownContainer(e.target);
            if (!container) return;
            requestAnimationFrame(() => setActiveDropdownIndex(container, 0));
        }, true);

        document.addEventListener('focusin', (e) => {
            if (!e.target?.matches?.('input.dropdown-cari')) return;
            const container = findDropdownContainer(e.target);
            if (!container) return;
            setTimeout(() => syncActiveDropdownDefault(), 60);
        }, true);

        // Sinkronkan highlight jika mouse ikut hover opsi
        document.addEventListener('mouseover', (e) => {
            const li = e.target?.closest?.('ul li');
            if (!li || !li.className.includes('cursor-pointer')) return;
            const container = li.closest('div');
            if (!container || !container.querySelector('input.dropdown-cari')) return;
            const items = getSelectableDropdownItems(container);
            const idx = items.indexOf(li);
            if (idx >= 0) {
                container.querySelectorAll('ul li.spm-dd-active').forEach((el) => el.classList.remove('spm-dd-active'));
                li.classList.add('spm-dd-active');
            }
        }, true);

        // ArrowDown, ArrowUp, Enter pada input.dropdown-cari
        document.addEventListener('keydown', (e) => {
            const input = e.target;
            if (!input || !input.matches || !input.matches('input.dropdown-cari')) return;

            const container = findDropdownContainer(input);
            if (!container) return;

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const items = getSelectableDropdownItems(container);
                if (items.length === 0) return;
                e.preventDefault();
                e.stopPropagation();

                const current = container.querySelector('ul li.spm-dd-active');
                const currentIdx = current ? items.indexOf(current) : -1;
                const nextIdx =
                    e.key === 'ArrowDown'
                        ? (currentIdx < 0 ? 0 : currentIdx + 1)
                        : (currentIdx < 0 ? items.length - 1 : currentIdx - 1);
                setActiveDropdownIndex(container, nextIdx);
                return;
            }

            if (e.key === 'Enter') {
                const items = getSelectableDropdownItems(container);
                if (items.length === 0) return;
                e.preventDefault();
                e.stopPropagation();

                const current = container.querySelector('ul li.spm-dd-active');
                const targetLi = (current && items.includes(current)) ? current : items[0];
                if (targetLi) {
                    targetLi.click();
                }
            }
        }, true);
    }

    // =========================================================================
    // 4. PENATAAN LAYOUT DOM ASLI (ALPINE-SAFE, ZERO CLONING)
    // =========================================================================
    function findDirectChildContaining(parent, selector) {
        if (!parent) return null;
        const target = parent.querySelector(selector);
        if (!target) return null;
        let node = target;
        while (node && node.parentElement !== parent) {
            node = node.parentElement;
        }
        return node;
    }

    function tagFieldRow(container, inputId, extraClasses) {
        const el = document.getElementById(inputId);
        if (!el || !container) return null;
        let row = el;
        while (row && row.parentElement !== container) {
            row = row.parentElement;
        }
        if (row) {
            row.classList.add('spm-field-stacked', ...extraClasses);
        }
        return row;
    }

    function tagLayoutStructure() {
        const form = document.querySelector('form#module-transaksi');
        if (!form) return;

        // Bersihkan elemen legacy dari versi sebelumnya
        document.getElementById('spm-pro-banner')?.remove();
        document.getElementById('spm-quick-entry-bar')?.remove();

        document.body.classList.add('spm-penjualan-form');

        // Card pembungkus form & judul ganda
        const formCard = form.parentElement;
        if (formCard) {
            formCard.classList.add('spm-form-card');
            const prevHeader = form.previousElementSibling;
            if (prevHeader && prevHeader.querySelector('h2')) {
                prevHeader.classList.add('spm-card-header-hidden');
            }
        }

        const formBody = form.querySelector(':scope > div');
        if (!formBody) return;

        // Sembunyikan <br>, <hr>, divider, dan div spacer kosong di antara section
        Array.from(formBody.children).forEach((child) => {
            if (child.tagName === 'BR' || child.tagName === 'HR') {
                child.classList.add('spm-hide-divider');
                return;
            }
            if (
                (child.tagName === 'DIV' || child.tagName === 'P') &&
                child.textContent.trim() === '' &&
                !child.querySelector('input, select, textarea, button, table, fieldset, img, canvas')
            ) {
                child.classList.add('spm-hide-divider');
            }
        });

        // --- SECTION 1: TOP HEADER GRID (4 KOLOM SEJAJAR) ---
        const headerGrid = findDirectChildContaining(formBody, '#kode_penjualan');
        if (headerGrid) {
            headerGrid.classList.add('spm-header-grid');
            Array.from(headerGrid.children).forEach((col) => {
                col.classList.add('spm-header-col-unwrap');
                tagFieldRow(col, 'id_customer', ['spm-order-pelanggan']);
                tagFieldRow(col, 'id_golongan', ['spm-order-golongan']);
                tagFieldRow(col, 'id_mh_warehouse', ['spm-order-gudang']);
                tagFieldRow(col, 'kode_penjualan', ['spm-order-nomor']);
            });

            // Tambahkan petunjuk F4 pada label Pelanggan
            const custRow = document.getElementById('id_customer')?.closest('.spm-order-pelanggan');
            const custLabel = custRow?.querySelector('label');
            if (custLabel && !custLabel.querySelector('.spm-inline-kbd')) {
                const kbd = document.createElement('span');
                kbd.className = 'spm-inline-kbd';
                kbd.textContent = 'F4';
                custLabel.appendChild(kbd);
            }
        }

        // --- SECTION 1B: IDENTITAS PELANGGAN (1 BARIS METRIK + COLLAPSIBLE NIK/NPWP) ---
        const fieldset = document.getElementById('nik')?.closest('fieldset');
        if (fieldset) {
            fieldset.classList.add('spm-identitas-fieldset');
            if (fieldset.parentElement) {
                fieldset.parentElement.classList.add('spm-identitas-wrap');
            }

            if (!fieldset.dataset.spmIdentityInit) {
                const savedCollapsed = localStorage.getItem('spm_identity_collapsed');
                const isCollapsed = savedCollapsed === null ? true : savedCollapsed === 'true';
                fieldset.classList.toggle('spm-identity-collapsed', isCollapsed);
                fieldset.dataset.spmIdentityInit = '1';
            }

            tagFieldRow(fieldset, 'sales', ['spm-id-sales']);
            tagFieldRow(fieldset, 'tanggal_jatuh_tempo', ['spm-id-jatuhtempo']);
            tagFieldRow(fieldset, 'available_credit', ['spm-id-kredit']);
            tagFieldRow(fieldset, 'plafond_value', ['spm-id-plafond']);
            tagFieldRow(fieldset, 'available_kanvas', ['spm-id-kanvas']);
            tagFieldRow(fieldset, 'jumlah_bill_customer', ['spm-id-bill']);

            tagFieldRow(fieldset, 'nik', ['spm-id-nik', 'spm-passive-identity']);
            tagFieldRow(fieldset, 'npwp', ['spm-id-npwp', 'spm-passive-identity']);
            tagFieldRow(fieldset, 'jenis', ['spm-id-jenis', 'spm-passive-identity']);

            const legend = fieldset.querySelector(':scope > legend');
            if (legend && !legend.querySelector('#spm-identity-toggle')) {
                const toggleBtn = document.createElement('button');
                toggleBtn.type = 'button';
                toggleBtn.id = 'spm-identity-toggle';
                toggleBtn.className = 'spm-identity-toggle-btn';
                const updateToggleLabel = () => {
                    const collapsed = fieldset.classList.contains('spm-identity-collapsed');
                    toggleBtn.textContent = collapsed
                        ? 'Tampilkan NIK / NPWP / Jenis ▾'
                        : 'Sembunyikan NIK / NPWP / Jenis ▴';
                };
                updateToggleLabel();
                toggleBtn.addEventListener('click', () => {
                    const collapsed = fieldset.classList.toggle('spm-identity-collapsed');
                    localStorage.setItem('spm_identity_collapsed', collapsed ? 'true' : 'false');
                    updateToggleLabel();
                });
                legend.appendChild(toggleBtn);
            }
        }

        // --- SECTION 2: LIST PROMO & PROMO GRUP PRODUK ---
        const listPromoCard = findDirectChildContaining(formBody, '#promo-container');
        if (listPromoCard) {
            listPromoCard.classList.add('spm-list-promo-card');
        }

        const promoGrup = formBody.querySelector('section[x-data="promoGrupPenjualan"]');
        if (promoGrup) {
            promoGrup.classList.add('spm-promo-grup-section');
            const desc = promoGrup.querySelector('p');
            const heading = promoGrup.querySelector('h3');
            if (desc && heading && !heading.title) {
                heading.title = desc.textContent.trim();
            }
        }

        // --- SECTION 3: DETAIL BARANG (#table-detailbarang) ---
        const detailBarangCard = findDirectChildContaining(formBody, '#table-detailbarang');
        if (detailBarangCard) {
            detailBarangCard.classList.add('spm-detail-barang-card');
            injectTableToolbar(detailBarangCard);
        }

        // --- SECTION 4: DETAIL BONUS (#table-detailbonus) ---
        const detailBonusCard = findDirectChildContaining(formBody, '#table-detailbonus');
        if (detailBonusCard) {
            detailBonusCard.classList.add('spm-detail-bonus-card');
        }

        // --- SECTION 5: FOOTER RINGKASAN & CATATAN ---
        const footerGrid = findDirectChildContaining(formBody, '#remark');
        if (footerGrid) {
            footerGrid.classList.add('spm-footer-grid');
            const leftCol = findDirectChildContaining(footerGrid, '#remark');
            const rightCol = findDirectChildContaining(footerGrid, '#total');
            if (leftCol) leftCol.classList.add('spm-footer-left');
            if (rightCol) {
                rightCol.classList.add('spm-footer-right');
                tagFieldRow(rightCol, 'nota', []);
                tagFieldRow(rightCol, 'status_pengambilan', []);

                const subRow = findDirectChildContaining(rightCol, '#subtotal_bruto');
                const discRow = findDirectChildContaining(rightCol, '#total_diskon');
                const totRow = findDirectChildContaining(rightCol, '#total');
                const imgRow = findDirectChildContaining(rightCol, '#image');

                if (subRow) subRow.classList.add('spm-summary-row');
                if (discRow) discRow.classList.add('spm-summary-row');
                if (totRow) totRow.classList.add('spm-summary-row');
                if (imgRow) imgRow.classList.add('spm-image-row');
            }
        }

        // Native action footer
        const saveBtn = getSaveButton();
        if (saveBtn && saveBtn.parentElement) {
            saveBtn.parentElement.classList.add('spm-native-actions');
        }
    }

    function injectTableToolbar(detailBarangCard) {
        if (document.getElementById('spm-table-toolbar')) return;
        const table = document.getElementById('table-detailbarang');
        const tableWrap = table ? table.closest('.ui-table-wrap') || table : null;
        if (!tableWrap) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'spm-table-toolbar';
        toolbar.className = 'spm-table-toolbar';
        toolbar.innerHTML = `
            <div class="spm-table-toolbar-left">
                <span class="spm-table-title">Detail Barang</span>
                <span id="spm-item-count-pill" class="spm-item-count-pill">0 item</span>
            </div>
            <div class="spm-table-toolbar-right" id="spm-table-toolbar-right">
                <button type="button" id="spm-btn-add-top" class="spm-btn-add-top">
                    <span>+ Tambah Barang</span>
                    <kbd>F2</kbd>
                </button>
            </div>
        `;

        tableWrap.parentNode.insertBefore(toolbar, tableWrap);

        // Pindahkan tombol #btnToggleDiskon bawaan ke toolbar kanan agar rapi
        const toggleDiskonBtn = document.getElementById('btnToggleDiskon');
        const toolbarRight = document.getElementById('spm-table-toolbar-right');
        if (toggleDiskonBtn && toolbarRight) {
            toolbarRight.insertBefore(toggleDiskonBtn, toolbarRight.firstChild);
        }

        document.getElementById('spm-btn-add-top')?.addEventListener('click', triggerInstantAddBarang);
    }

    // =========================================================================
    // 5. ANTI TAB-TRAP (READONLY & STEPPER QTY)
    // =========================================================================
    function fixTabNavigation() {
        document
            .querySelectorAll(
                'form#module-transaksi input[readonly], form#module-transaksi textarea[readonly], #table-detailbarang .qty-step-wrap button'
            )
            .forEach((el) => {
                if (el.getAttribute('tabindex') !== '-1') {
                    el.setAttribute('tabindex', '-1');
                }
            });
    }

    // =========================================================================
    // 6. FLOATING GRAND TOTAL & ACTION BAR + TOMBOL SIMPAN & CETAK
    // =========================================================================
    function triggerSaveAndPrint() {
        const saveBtn = getSaveButton();
        if (!saveBtn) return;
        sessionStorage.setItem('spm_auto_print', 'true');
        saveBtn.click();
    }

    function injectNativeSaveAndPrintButton() {
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
            <svg style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            <span>Simpan &amp; Cetak</span>
            <span class="spm-keyhint">Alt+P</span>
        `;
        printBtn.addEventListener('click', triggerSaveAndPrint);
        saveBtn.parentNode.insertBefore(printBtn, saveBtn);
    }

    function injectStatusBar() {
        if (document.getElementById('spm-statusbar')) return;
        const isCollapsed = document.body.classList.contains('spm-sidebar-collapsed');

        const bar = document.createElement('div');
        bar.id = 'spm-statusbar';
        bar.className = 'spm-fakturis-statusbar';
        bar.innerHTML = `
            <div class="spm-statusbar-left">
                <span class="spm-brand-dot"></span>
                <span class="spm-brand-title">Fakturis Pro</span>
                <span class="spm-badge" id="spm-sidebar-toggle-badge" title="Buka/Tutup Sidebar (Ctrl+B)">
                    <kbd>Ctrl+B</kbd> <span id="spm-sidebar-badge-text">${isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}</span>
                </span>
                <span class="spm-badge" id="spm-badge-f2" title="Tambah Barang & Cari Langsung (F2)">
                    <kbd>F2</kbd> Tambah Barang
                </span>
                <span class="spm-badge" id="spm-badge-f4" title="Pilih Pelanggan (F4)">
                    <kbd>F4</kbd> Pelanggan
                </span>
            </div>
            <div class="spm-statusbar-right">
                <div id="spm-guard-badges" class="spm-guard-badges"></div>
                <div class="spm-mini-totals">
                    <span>Subtotal: <strong id="spm-mini-subtotal">Rp 0</strong></span>
                    <span>Diskon: <strong id="spm-mini-diskon" class="spm-mini-disc">- Rp 0</strong></span>
                </div>
                <div class="spm-grand-total-box">
                    <span class="spm-total-label">Grand Total</span>
                    <span id="spm-grand-total-display" class="spm-total-value">Rp 0</span>
                </div>
                <div class="spm-statusbar-actions">
                    <button type="button" id="spm-bar-save" class="spm-btn-bar-save">
                        <span>Simpan</span>
                        <span class="spm-keyhint">Ctrl+S</span>
                    </button>
                    <button type="button" id="spm-bar-save-print" class="spm-btn-save-print">
                        <svg style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24">
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                        </svg>
                        <span>Simpan &amp; Cetak</span>
                        <span class="spm-keyhint">Alt+P</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(bar);

        document.getElementById('spm-sidebar-toggle-badge')?.addEventListener('click', toggleSidebar);
        document.getElementById('spm-badge-f2')?.addEventListener('click', triggerInstantAddBarang);
        document.getElementById('spm-badge-f4')?.addEventListener('click', triggerFocusPelanggan);
        document.getElementById('spm-bar-save')?.addEventListener('click', () => getSaveButton()?.click());
        document.getElementById('spm-bar-save-print')?.addEventListener('click', triggerSaveAndPrint);

        syncTotalsAndCount();
    }

    function syncTotalsAndCount() {
        const totalEl = document.getElementById('total');
        const subEl = document.getElementById('subtotal_bruto');
        const discEl = document.getElementById('total_diskon');

        const displayTotal = document.getElementById('spm-grand-total-display');
        const displaySub = document.getElementById('spm-mini-subtotal');
        const displayDisc = document.getElementById('spm-mini-diskon');

        if (displayTotal && totalEl) {
            displayTotal.textContent = 'Rp ' + (totalEl.value || '0');
        }
        if (displaySub && subEl) {
            displaySub.textContent = 'Rp ' + (subEl.value || '0');
        }
        if (displayDisc && discEl) {
            displayDisc.textContent = '- Rp ' + (discEl.value || '0');
        }

        const pill = document.getElementById('spm-item-count-pill');
        if (pill) {
            const count = document.querySelectorAll('#table-detailbarang tbody tr').length;
            pill.textContent = `${count} item`;
        }

        runLiveGuardsAndBonusCollapse();
    }

    function runLiveGuardsAndBonusCollapse() {
        // 1. Auto-collapse Detail Bonus saat 0 baris
        const bonusCard = document.querySelector('.spm-detail-bonus-card');
        if (bonusCard) {
            const bonusRows = document.querySelectorAll('#table-detailbonus tbody tr').length;
            bonusCard.classList.toggle('spm-bonus-empty', bonusRows === 0);

            const bonusLabel = bonusCard.querySelector('label[for="table-detailbonus"]');
            if (bonusLabel) {
                let countPill = bonusLabel.querySelector('#spm-bonus-count-pill');
                if (!countPill) {
                    countPill = document.createElement('span');
                    countPill.id = 'spm-bonus-count-pill';
                    countPill.className = 'spm-bonus-count-pill';
                    bonusLabel.appendChild(countPill);
                }
                countPill.textContent = `${bonusRows}`;
            }
        }

        // 2. Cek Qty > Stok & Duplikat Barang + Satuan
        const rows = Array.from(document.querySelectorAll('#table-detailbarang tbody tr'));
        const keyMap = new Map();
        let overStockCount = 0;

        rows.forEach((tr) => {
            const prodVal = tr.querySelector('input[name="product[]"]')?.value || '';
            const unitVal = tr.querySelector('input[name="unit[]"]')?.value || '';
            const qtyVal = parseIdNumber(tr.querySelector('input.qty, input[name="productQty[]"]')?.value);
            const stockVal = parseIdNumber(tr.querySelector('input.availableStock, input[name="availableStock[]"]')?.value);

            const isOverStock = Boolean(prodVal) && qtyVal > stockVal;
            tr.classList.toggle('spm-over-stock', isOverStock);
            const qtyInput = tr.querySelector('input.qty, input[name="productQty[]"]');
            if (qtyInput) {
                qtyInput.title = isOverStock
                    ? `Qty (${qtyVal}) melebihi stok tersedia (${stockVal})!`
                    : '';
            }
            if (isOverStock) overStockCount++;

            if (prodVal) {
                const key = `${prodVal}__${unitVal}`;
                if (!keyMap.has(key)) keyMap.set(key, []);
                keyMap.get(key).push(tr);
            }
        });

        let duplicateGroups = 0;
        const dupRows = new Set();
        keyMap.forEach((group) => {
            if (group.length > 1) {
                duplicateGroups++;
                group.forEach((tr) => dupRows.add(tr));
            }
        });

        rows.forEach((tr) => {
            const isDup = dupRows.has(tr);
            tr.classList.toggle('spm-duplicate-row', isDup);
            const firstTd = tr.querySelector('td:first-child');
            if (firstTd) {
                let tag = firstTd.querySelector('.spm-dup-tag');
                if (isDup && !tag) {
                    tag = document.createElement('span');
                    tag.className = 'spm-dup-tag';
                    tag.textContent = 'Duplikat';
                    firstTd.appendChild(tag);
                } else if (!isDup && tag) {
                    tag.remove();
                }
            }
        });

        // 3. Cek Over-Limit Kredit & Plafond
        const grandTotal = parseIdNumber(document.getElementById('total')?.value);
        const creditLimit = parseIdNumber(document.getElementById('available_credit')?.value);
        const plafondLimit = parseIdNumber(document.getElementById('plafond_value')?.value);

        const activeLimits = [creditLimit, plafondLimit].filter((v) => v > 0);
        const minLimit = activeLimits.length > 0 ? Math.min(...activeLimits) : 0;
        const isOverLimit = grandTotal > 0 && minLimit > 0 && grandTotal > minLimit;
        const isNearLimit = !isOverLimit && grandTotal > 0 && minLimit > 0 && grandTotal >= minLimit * 0.85;

        // Render guard badges di floating bar
        const guardBox = document.getElementById('spm-guard-badges');
        if (guardBox) {
            const badges = [];
            if (isOverLimit) {
                badges.push('<span class="spm-guard-pill spm-guard-danger" title="Grand Total melebihi Limit Kredit / Plafond">OVER LIMIT</span>');
            } else if (isNearLimit) {
                badges.push('<span class="spm-guard-pill spm-guard-warn" title="Grand Total mendekati Limit (>85%)">DEKAT LIMIT</span>');
            }
            if (overStockCount > 0) {
                badges.push(`<span class="spm-guard-pill spm-guard-danger" title="Ada ${overStockCount} baris dengan Qty melebihi stok">STOK KURANG (${overStockCount})</span>`);
            }
            if (duplicateGroups > 0) {
                badges.push(`<span class="spm-guard-pill spm-guard-warn" title="Ada ${duplicateGroups} barang/satuan terinput ganda">DUPLIKAT (${duplicateGroups})</span>`);
            }
            const html = badges.join('');
            if (guardBox.innerHTML !== html) {
                guardBox.innerHTML = html;
            }
        }
    }

    // =========================================================================
    // 7. KEYBOARD SHORTCUTS
    // =========================================================================
    function setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ctrl + B: Toggle Sidebar (Global)
            if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                toggleSidebar();
                return;
            }

            if (!isPenjualanForm()) return;

            // F2: Tambah Barang + Auto-Buka Cari Barang
            if (e.key === 'F2') {
                e.preventDefault();
                triggerInstantAddBarang();
                return;
            }

            // F4: Fokus & Buka Pencarian Pelanggan
            if (e.key === 'F4') {
                e.preventDefault();
                triggerFocusPelanggan();
                return;
            }

            // Ctrl + S: Simpan Faktur
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                getSaveButton()?.click();
                return;
            }

            // Alt + P atau Ctrl + Enter: Simpan & Cetak
            if ((e.altKey && (e.key === 'p' || e.key === 'P')) || (e.ctrlKey && e.key === 'Enter')) {
                e.preventDefault();
                triggerSaveAndPrint();
                return;
            }

            // Alt + H: Hitung Ulang Promo Grup
            if (e.altKey && (e.key === 'h' || e.key === 'H')) {
                e.preventDefault();
                const promoBtn = document.querySelector('section[x-data="promoGrupPenjualan"] button');
                if (promoBtn) {
                    promoBtn.click();
                    showToast('Menghitung ulang promo grup...');
                }
                return;
            }

            // Alt + D: Toggle Kolom Diskon
            if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                document.getElementById('btnToggleDiskon')?.click();
                return;
            }

            // Shortcut khusus di dalam baris tabel #table-detailbarang
            const activeEl = document.activeElement;
            const activeRow = activeEl?.closest?.('#table-detailbarang tbody tr');
            if (!activeRow) return;

            // Alt + Backspace: Hapus baris aktif
            if (e.altKey && e.key === 'Backspace') {
                e.preventDefault();
                const rows = Array.from(document.querySelectorAll('#table-detailbarang tbody tr'));
                const idx = rows.indexOf(activeRow);
                const nextFocusRow = rows[idx + 1] || rows[idx - 1];
                const delBtn = activeRow.querySelector('.btn-delete');
                if (delBtn) {
                    delBtn.click();
                    showToast('Baris barang dihapus');
                    if (nextFocusRow) {
                        setTimeout(() => nextFocusRow.querySelector('input.qty')?.focus(), 80);
                    }
                }
                return;
            }

            // Alt + ArrowUp / ArrowDown: Navigasi vertikal antar baris di kolom sama
            if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
                const activeTd = activeEl.closest('td');
                const rows = Array.from(document.querySelectorAll('#table-detailbarang tbody tr'));
                const rowIdx = rows.indexOf(activeRow);
                const tdIdx = activeTd ? Array.from(activeRow.children).indexOf(activeTd) : -1;
                const targetRow = e.key === 'ArrowUp' ? rows[rowIdx - 1] : rows[rowIdx + 1];
                if (targetRow && tdIdx >= 0) {
                    const targetInput = targetRow.children[tdIdx]?.querySelector('input:not([readonly]), textarea');
                    if (targetInput) {
                        targetInput.focus();
                        if (targetInput.select) targetInput.select();
                    }
                }
                return;
            }

            // Enter di Qty atau Disc: baris terakhir -> Tambah Barang (F2), selainnya -> baris berikutnya
            if (
                e.key === 'Enter' &&
                !e.ctrlKey &&
                !e.altKey &&
                activeEl.matches('input.qty, input.disc-persen, input.disc-rupiah')
            ) {
                e.preventDefault();
                const rows = Array.from(document.querySelectorAll('#table-detailbarang tbody tr'));
                const rowIdx = rows.indexOf(activeRow);
                if (rowIdx === rows.length - 1) {
                    triggerInstantAddBarang();
                } else {
                    const activeTd = activeEl.closest('td');
                    const tdIdx = activeTd ? Array.from(activeRow.children).indexOf(activeTd) : -1;
                    const nextInput = rows[rowIdx + 1]?.children[tdIdx]?.querySelector('input:not([readonly])');
                    if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                    }
                }
            }
        });
    }

    // =========================================================================
    // 8. INIT & DEBOUNCED OBSERVER
    // =========================================================================
    function applyTransformations() {
        if (!isPenjualanForm()) return;
        tagLayoutStructure();
        fixTabNavigation();
        injectStatusBar();
        injectNativeSaveAndPrintButton();
        syncTotalsAndCount();
    }

    function init() {
        initSidebarCollapse();
        setupKeyboardShortcuts();
        setupRowAutoFlowListeners();
        setupDropdownKeyboardNav();
        handlePostSaveAutoPrint();
        applyTransformations();

        let scheduled = false;
        const observer = new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                syncActiveDropdownDefault();
                if (isPenjualanForm()) {
                    fixTabNavigation();
                    watchProductAndUnitSelection();
                    syncTotalsAndCount();
                    if (!document.getElementById('spm-statusbar')) {
                        applyTransformations();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(() => {
            if (isPenjualanForm()) {
                watchProductAndUnitSelection();
                syncTotalsAndCount();
            }
        }, 250);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
