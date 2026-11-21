// ==UserScript==
// @name         SPM Fakturis Pro - PT Sinar Pangan Makmur
// @namespace    https://stagingsinarpanganmakmur.my.id/
// @version      3.6.0
// @description  Clean Live UI/UX Redesign: No Top Banner, Collapsible Sidebar (Ctrl+B), Quick Item Entry, 4 Disc % + 2 Disc Rp, Auto Tab-Skip & Floating Grand Total Bar.
// @author       Fakturis Helper
// @match        https://stagingsinarpanganmakmur.my.id/*
// @match        http://stagingsinarpanganmakmur.my.id/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('[SPM Fakturis Pro v3.6] Userscript live (Clean Mode)...');

    const customCss = `
        /* 1. SIDEBAR COLLAPSE */
        body.spm-sidebar-collapsed aside,
        body.spm-sidebar-collapsed [role="complementary"],
        body.spm-sidebar-collapsed nav[class*="tw:fixed"],
        body.spm-sidebar-collapsed div[class*="tw:fixed"][class*="tw:inset-y-0"] {
            display: none !important;
        }
        body.spm-sidebar-collapsed main,
        body.spm-sidebar-collapsed [class*="tw:lg:pl-"],
        body.spm-sidebar-collapsed [class*="tw:md:pl-"],
        body.spm-sidebar-collapsed .tw\\:lg\\:pl-64,
        body.spm-sidebar-collapsed .tw\\:lg\\:pl-72 {
            padding-left: 14px !important;
            padding-right: 14px !important;
            margin-left: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 2. QUICK ITEM ENTRY BAR */
        .spm-quick-entry-container {
            background-color: #f0f9ff;
            border: 1.5px solid #0284c7;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 12px;
            box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
        }
        .spm-quick-entry-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 11.5px;
            font-weight: 700;
            color: #0369a1;
        }
        .spm-quick-entry-grid {
            display: grid;
            grid-template-columns: 2.5fr 1fr 0.8fr 0.8fr 1fr auto;
            gap: 8px;
            align-items: center;
        }
        .spm-quick-input {
            height: 30px !important;
            font-size: 12px !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            border: 1px solid #94a3b8 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            width: 100% !important;
        }
        .spm-quick-input:focus {
            outline: 2px solid #0284c7 !important;
            border-color: #0284c7 !important;
        }
        .spm-btn-quick-add {
            background: #0284c7 !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            height: 30px !important;
            padding: 0 14px !important;
            border-radius: 4px !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }

        /* 3. COMPACT FIELDS & TABLES */
        fieldset {
            padding: 6px 12px !important;
            margin-bottom: 8px !important;
            border-radius: 8px !important;
            background-color: #ffffff !important;
        }
        legend {
            font-size: 11px !important;
            font-weight: 700 !important;
            padding: 0 6px !important;
            color: #475569 !important;
        }
        form .tw\\:mb-4, form div[class*="tw:mb-4"] {
            margin-bottom: 4px !important;
        }
        form .tw\\:gap-4, form div[class*="tw:gap-4"] {
            gap: 8px !important;
        }
        form label {
            font-size: 11px !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important;
            color: #334155 !important;
        }
        form input[type="text"],
        form input[type="number"],
        form select,
        form button:not(.btn-save):not(.spm-btn-save-print):not(.spm-btn-quick-add) {
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            padding-left: 6px !important;
            padding-right: 6px !important;
            min-height: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
            border-radius: 4px !important;
        }
        form table {
            border-collapse: separate !important;
            border-spacing: 0 !important;
            width: 100% !important;
            margin-top: 4px !important;
        }
        form table thead th {
            position: sticky !important;
            top: 0 !important;
            background-color: #f1f5f9 !important;
            color: #1e293b !important;
            font-size: 10.5px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.02em !important;
            padding: 5px 4px !important;
            border-bottom: 2px solid #cbd5e1 !important;
            border-top: 1px solid #cbd5e1 !important;
            white-space: nowrap !important;
            z-index: 5 !important;
            text-align: center !important;
        }
        form table thead th:nth-child(1), form table thead th:nth-child(2) {
            text-align: left !important;
        }
        form table tbody td {
            padding: 3px 4px !important;
            font-size: 11.5px !important;
            border-bottom: 1px solid #e2e8f0 !important;
            vertical-align: middle !important;
        }
        form table tbody tr:nth-child(even) {
            background-color: #f8fafc !important;
        }
        form table tbody tr:hover {
            background-color: #f0fdf4 !important;
        }
        form table tbody td:nth-child(6) input,
        form table tbody td:nth-child(7) input,
        form table tbody td:nth-child(8) input,
        form table tbody td:nth-child(9) input {
            width: 48px !important;
            min-width: 44px !important;
            max-width: 52px !important;
            text-align: center !important;
            font-weight: 600 !important;
            background-color: #f0f9ff !important;
            border-color: #bae6fd !important;
        }
        form table tbody td:nth-child(10) input,
        form table tbody td:nth-child(11) input {
            width: 72px !important;
            min-width: 66px !important;
            max-width: 78px !important;
            text-align: right !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-weight: 600 !important;
            background-color: #fefce8 !important;
            border-color: #fde047 !important;
        }
        form table tbody td:nth-child(3) input {
            width: 52px !important;
            text-align: center !important;
            font-weight: 700 !important;
        }
        input[readonly], textarea[readonly] {
            background-color: #f1f5f9 !important;
            color: #64748b !important;
            cursor: default !important;
            border-color: #e2e8f0 !important;
        }
        .spm-fakturis-statusbar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 52px;
            background: #0f172a;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.35);
            z-index: 99999;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border-top: 1px solid #334155;
        }
        .spm-statusbar-left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
        }
        .spm-badge {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10.5px;
            color: #94a3b8;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }
        .spm-badge:hover {
            background: #334155;
            color: #ffffff;
        }
        .spm-badge kbd {
            background: #334155;
            color: #f8fafc;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: 700;
        }
        .spm-statusbar-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .spm-total-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        .spm-total-value {
            font-size: 24px;
            font-weight: 900;
            color: #4ade80;
            letter-spacing: -0.02em;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .spm-btn-save-print {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 0.5rem !important;
            font-weight: 700 !important;
            gap: 0.5rem !important;
            padding: 0.5rem 1rem !important;
            font-size: 0.875rem !important;
            background-color: #16a34a !important;
            color: #ffffff !important;
            cursor: pointer !important;
            border: none !important;
            box-shadow: 0 2px 4px rgba(22, 163, 74, 0.3) !important;
        }
        .spm-btn-save-print:hover {
            background-color: #15803d !important;
        }
        .spm-keyhint {
            margin-left: 6px;
            background: rgba(255, 255, 255, 0.25);
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
        }
        main {
            padding-bottom: 75px !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customCss);
    } else {
        const style = document.createElement('style');
        style.textContent = customCss;
        document.head.appendChild(style);
    }

    function initSidebarCollapse() {
        const savedState = localStorage.getItem('spm_sidebar_collapsed');
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
        badge.textContent = document.body.classList.contains('spm-sidebar-collapsed') ? 'Buka Sidebar' : 'Tutup Sidebar';
    }

    function injectQuickEntryBar() {
        if (document.getElementById('spm-quick-entry-bar')) return;
        const table = document.querySelector('form table');
        if (!table) return;
        const tableContainer = table.closest('div') || table;

        const quickBar = document.createElement('div');
        quickBar.id = 'spm-quick-entry-bar';
        quickBar.className = 'spm-quick-entry-container';
        quickBar.innerHTML = `
            <div class="spm-quick-entry-header">
                <span>⚡ Quick Item Entry (Input Numpad & Keyboard)</span>
                <span>Tekan <kbd>F2</kbd> tambah item • <kbd>Enter</kbd> submit</span>
            </div>
            <div class="spm-quick-entry-grid">
                <div><input type="text" id="spm-quick-sku" class="spm-quick-input font-bold" placeholder="Cari nama barang / SKU... (Tekan F2)"></div>
                <div><select id="spm-quick-satuan" class="spm-quick-input font-semibold text-sky-800"><option value="Karton" selected>Karton</option><option value="Bks">Bungkus</option></select></div>
                <div><input type="number" id="spm-quick-qty" class="spm-quick-input text-center font-bold" value="1" placeholder="Qty"></div>
                <div><input type="text" id="spm-quick-d1" class="spm-quick-input text-center text-sky-700" value="0%" placeholder="Disc %"></div>
                <div><input type="text" id="spm-quick-drp" class="spm-quick-input text-right font-mono text-amber-800" value="0" placeholder="Disc Rp"></div>
                <div><button type="button" id="spm-quick-btn-add" class="spm-btn-quick-add"><span>+ Tambah</span><kbd>Enter</kbd></button></div>
            </div>
        `;
        tableContainer.parentNode.insertBefore(quickBar, tableContainer);

        const quickAddBtn = document.getElementById('spm-quick-btn-add');
        const quickSkuInput = document.getElementById('spm-quick-sku');

        function triggerNativeAdd() {
            const addBtn = getAddBarangButton();
            if (addBtn) addBtn.click();
        }

        quickAddBtn?.addEventListener('click', triggerNativeAdd);
        quickSkuInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerNativeAdd();
            }
        });
    }

    function fixTabNavigation() {
        const readonlyInputs = document.querySelectorAll('input[readonly], textarea[readonly]');
        readonlyInputs.forEach(input => input.setAttribute('tabindex', '-1'));
    }

    function getAddBarangButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => b.textContent && b.textContent.includes('Add Barang'));
    }

    function getSaveButton() {
        return document.querySelector('button.btn-save');
    }

    function getGrandTotalInput() {
        const inputs = Array.from(document.querySelectorAll('input[readonly]'));
        if (inputs.length >= 3) return inputs[inputs.length - 1];
        return null;
    }

    function injectStatusBar() {
        if (document.getElementById('spm-statusbar')) return;
        const isCollapsed = document.body.classList.contains('spm-sidebar-collapsed');
        const bar = document.createElement('div');
        bar.id = 'spm-statusbar';
        bar.className = 'spm-fakturis-statusbar';
        bar.innerHTML = `
            <div class="spm-statusbar-left">
                <span class="spm-badge" id="spm-sidebar-toggle-badge" style="cursor:pointer;" title="Klik atau tekan Ctrl+B">
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
        if (totalInput && totalInput.value) display.textContent = 'Rp ' + totalInput.value;
    }

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
        printBtn.addEventListener('click', () => {
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

    function setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                toggleSidebar();
            }
            if (e.key === 'F2') {
                e.preventDefault();
                const quickSku = document.getElementById('spm-quick-sku');
                if (quickSku) quickSku.focus();
                else {
                    const addBtn = getAddBarangButton();
                    if (addBtn) addBtn.click();
                }
            }
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                const saveBtn = getSaveButton();
                if (saveBtn) saveBtn.click();
            }
            if ((e.altKey && (e.key === 'p' || e.key === 'P')) || (e.ctrlKey && e.key === 'Enter')) {
                e.preventDefault();
                const printBtn = document.getElementById('spm-btn-save-print');
                if (printBtn) printBtn.click();
            }
        });
    }

    function applyTransformations() {
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
        const observer = new MutationObserver(applyTransformations);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(applyTransformations, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
