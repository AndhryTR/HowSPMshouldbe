// ==UserScript==
// @name         SPM Fakturis Pro - PT Sinar Pangan Makmur
// @namespace    https://stagingsinarpanganmakmur.my.id/
// @version      4.3.0
// @description  Precision ERP High-Density Layout, Collapsible Sidebar (Ctrl+B), F2 Instant Search, Arrow+Enter Dropdown Navigation, Auto-Open Satuan -> Qty, Live Over-Limit/Over-Stock/Duplicate Guards, Auto-Collapse Bonus & Full Keyboard Navigation.
// @author       Fakturis Helper
// @match        https://stagingsinarpanganmakmur.my.id/*
// @match        http://stagingsinarpanganmakmur.my.id/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const customCss = `
/* ==========================================================================
   SPM Fakturis Pro v4.0 - Precision ERP High-Density Stylesheet
   Target: stagingsinarpanganmakmur.my.id/module-penjualan/penjualan/add
   ========================================================================== */

:root {
    --spm-bg: #f1f5f9;
    --spm-surface: #ffffff;
    --spm-border: #cbd5e1;
    --spm-border-soft: #e2e8f0;
    --spm-text: #0f172a;
    --spm-text-muted: #64748b;
    --spm-primary: #0284c7;
    --spm-primary-hover: #0369a1;
    --spm-success: #16a34a;
    --spm-success-hover: #15803d;
    --spm-amber-bg: #fffbeb;
    --spm-amber-border: #fde68a;
    --spm-amber-text: #92400e;
    --spm-emerald-bg: #f0fdf4;
    --spm-emerald-border: #bbf7d0;
    --spm-emerald-text: #166534;
    --spm-sky-bg: #f0f9ff;
    --spm-sky-border: #bae6fd;
    --spm-sky-text: #0369a1;
    --spm-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    --spm-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ==========================================================================
   1. GLOBAL SIDEBAR COLLAPSE (Aktif di semua halaman SPM)
   ========================================================================== */
body.spm-sidebar-collapsed aside,
body.spm-sidebar-collapsed [role="complementary"] {
    display: none !important;
}

body.spm-sidebar-collapsed main {
    max-width: 100% !important;
    width: 100% !important;
}

/* ==========================================================================
   2. SHELL & PAGE CHROME (Khusus halaman form penjualan)
   ========================================================================== */
body.spm-penjualan-form {
    background-color: var(--spm-bg) !important;
}

body.spm-penjualan-form header {
    height: 44px !important;
    min-height: 44px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    background-color: #ffffff !important;
    border-bottom: 1px solid var(--spm-border-soft) !important;
}

body.spm-penjualan-form main {
    padding-bottom: 72px !important;
}

body.spm-penjualan-form main > div {
    padding: 6px 10px !important;
    gap: 0 !important;
}

/* Sembunyikan judul ganda "Tambah Penjualan Baru" agar form langsung di atas */
body.spm-penjualan-form main > div > h1,
body.spm-penjualan-form .spm-card-header-hidden {
    display: none !important;
}

body.spm-penjualan-form .spm-form-card {
    background: transparent !important;
    box-shadow: none !important;
    --tw-ring-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

body.spm-penjualan-form form#module-transaksi > div:first-of-type {
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
}

/* Reset margin bawaan (.card-content, .row-12, .tw:mb-*, dll) antar section */
body.spm-penjualan-form form#module-transaksi > div:first-of-type > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

/* Sembunyikan <br>, <hr>, divider, dan spacer kosong bawaan antar section */
body.spm-penjualan-form .spm-hide-divider,
body.spm-penjualan-form form#module-transaksi > div:first-of-type > br,
body.spm-penjualan-form form#module-transaksi > div:first-of-type > hr,
body.spm-penjualan-form form#module-transaksi > div:first-of-type > div:empty,
body.spm-penjualan-form form#module-transaksi > div:first-of-type > p:empty,
body.spm-penjualan-form form#module-transaksi > div:first-of-type > div[class*="h-px"] {
    display: none !important;
}

/* Sembunyikan footer copyright bawaan agar tidak bertumpuk dengan sticky bar */
body.spm-penjualan-form footer {
    display: none !important;
}

/* ==========================================================================
   3. BASE COMPACT FORM CONTROLS
   ========================================================================== */
body.spm-penjualan-form form#module-transaksi input[type="text"],
body.spm-penjualan-form form#module-transaksi input[type="number"],
body.spm-penjualan-form form#module-transaksi select,
body.spm-penjualan-form form#module-transaksi [x-data*="searchableSelect"] > button[x-ref="tombol"] {
    height: 30px !important;
    min-height: 30px !important;
    padding: 2px 8px !important;
    font-size: 12px !important;
    line-height: 1.25 !important;
    border-radius: 6px !important;
    border: 1px solid var(--spm-border) !important;
    box-shadow: none !important;
    --tw-ring-shadow: none !important;
}

body.spm-penjualan-form form#module-transaksi input:focus,
body.spm-penjualan-form form#module-transaksi select:focus,
body.spm-penjualan-form form#module-transaksi textarea:focus,
body.spm-penjualan-form form#module-transaksi [x-data*="searchableSelect"] > button[x-ref="tombol"]:focus {
    outline: 2px solid var(--spm-primary) !important;
    outline-offset: 0 !important;
    border-color: var(--spm-primary) !important;
    background-color: #ffffff !important;
}

body.spm-penjualan-form form#module-transaksi input[readonly],
body.spm-penjualan-form form#module-transaksi textarea[readonly] {
    background-color: #f8fafc !important;
    color: #475569 !important;
    border-color: var(--spm-border-soft) !important;
    cursor: default !important;
}

/* ==========================================================================
   4. SECTION 1: HEADER TRANSAKSI (4 KOLOM SEJAJAR)
   ========================================================================== */
.spm-header-grid {
    display: grid !important;
    grid-template-columns: 1.75fr 1.35fr 1.15fr 0.95fr !important;
    gap: 8px !important;
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border) !important;
    border-radius: 7px !important;
    padding: 7px 10px !important;
    margin: 0 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}

/* Unwrap 2 kolom bawaan secara visual tanpa memindah DOM (Alpine-safe) */
.spm-header-col-unwrap {
    display: contents !important;
}

.spm-field-stacked {
    display: flex !important;
    flex-direction: column !important;
    gap: 3px !important;
    margin: 0 !important;
    min-width: 0 !important;
}

.spm-field-stacked > label {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 3px !important;
    width: 100% !important;
    margin: 0 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #334155 !important;
    white-space: nowrap !important;
}

.spm-field-stacked > div {
    width: 100% !important;
    min-width: 0 !important;
}

/* Urutan prioritas Fakturis: Pelanggan -> Golongan -> Gudang -> Nomor Penjualan */
.spm-order-pelanggan { order: 1 !important; }
.spm-order-golongan  { order: 2 !important; }
.spm-order-gudang    { order: 3 !important; }
.spm-order-nomor     { order: 4 !important; }

/* Aksen visual khusus field utama */
.spm-order-pelanggan button[x-ref="tombol"] {
    font-weight: 700 !important;
    color: #0f172a !important;
    border-color: #93c5fd !important;
    background-color: #f8fbff !important;
}

.spm-order-golongan button[x-ref="tombol"] {
    font-weight: 600 !important;
    color: #3730a3 !important;
    background-color: #eef2ff !important;
    border-color: #c7d2fe !important;
}

.spm-order-nomor input {
    font-family: var(--spm-mono) !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    color: #475569 !important;
}

/* Helper text di bawah input dibuat mikro & rapi */
.spm-field-stacked p,
.spm-identitas-fieldset p {
    font-size: 10px !important;
    color: #94a3b8 !important;
    margin: 2px 0 0 0 !important;
    line-height: 1.2 !important;
}

.spm-inline-kbd {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    padding: 0 4px;
    border-radius: 3px;
    font-size: 9.5px;
    font-weight: 700;
    font-family: var(--spm-sans);
    margin-left: auto;
}

/* ==========================================================================
   5. SECTION 1B: IDENTITAS PELANGGAN (DARI 9 BARIS VERTIKAL -> 1 BARIS METRIK)
   ========================================================================== */
.spm-identitas-wrap {
    margin: 0 !important;
    padding: 0 !important;
}

.spm-identitas-fieldset {
    display: grid !important;
    grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
    gap: 5px 8px !important;
    align-items: start !important;
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border) !important;
    border-radius: 7px !important;
    padding: 6px 10px 7px 10px !important;
    margin: 0 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}

.spm-identitas-fieldset > legend {
    grid-column: 1 / -1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    padding: 0 0 4px 0 !important;
    margin: 0 !important;
    border-bottom: 1px solid var(--spm-border-soft) !important;
    font-size: 10.5px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
    color: #475569 !important;
}

.spm-identity-toggle-btn {
    background: #f1f5f9 !important;
    color: #475569 !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 4px !important;
    padding: 1px 8px !important;
    font-size: 10.5px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    cursor: pointer !important;
    height: 22px !important;
    min-height: 22px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
}

.spm-identity-toggle-btn:hover {
    background: #e2e8f0 !important;
    color: #0f172a !important;
}

/* Field aktif + strip metrik kredit sejajar 12 kolom */
.spm-id-sales      { grid-column: span 3 !important; order: 1 !important; }
.spm-id-jatuhtempo { grid-column: span 2 !important; order: 2 !important; }
.spm-id-kredit     { grid-column: span 2 !important; order: 3 !important; }
.spm-id-plafond    { grid-column: span 2 !important; order: 4 !important; }
.spm-id-kanvas     { grid-column: span 2 !important; order: 5 !important; }
.spm-id-bill       { grid-column: span 1 !important; order: 6 !important; }

/* Field pasif (NIK, NPWP, Jenis) di baris 2 yang bisa dilipat */
.spm-id-nik        { grid-column: span 4 !important; order: 10 !important; }
.spm-id-npwp       { grid-column: span 4 !important; order: 11 !important; }
.spm-id-jenis      { grid-column: span 4 !important; order: 12 !important; }

.spm-identitas-fieldset.spm-identity-collapsed .spm-passive-identity {
    display: none !important;
}

/* Styling angka metrik kredit agar langsung terbaca sekilas */
.spm-id-jatuhtempo input {
    background-color: #fffbeb !important;
    border-color: #fcd34d !important;
    color: #92400e !important;
    font-weight: 700 !important;
    text-align: center !important;
}

.spm-id-kredit input,
.spm-id-plafond input,
.spm-id-kanvas input,
.spm-id-bill input {
    font-family: var(--spm-mono) !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    text-align: right !important;
    background-color: #f8fafc !important;
}

.spm-id-kredit input {
    color: #047857 !important;
    background-color: #ecfdf5 !important;
    border-color: #a7f3d0 !important;
}

.spm-id-bill input {
    text-align: center !important;
    color: #1e40af !important;
    background-color: #eff6ff !important;
    border-color: #bfdbfe !important;
}

/* Sembunyikan helper text panjang di jatuh tempo agar baris tetap rata */
.spm-id-jatuhtempo p,
.spm-id-jatuhtempo small,
#tanggal_jatuh_tempo ~ * {
    display: none !important;
}

/* ==========================================================================
   6. SECTION 2: PROMO GRUP PRODUK & LIST PROMO (ULTRA-COMPACT STRIP)
   ========================================================================== */
.spm-list-promo-card {
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border-soft) !important;
    border-radius: 6px !important;
    padding: 4px 10px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    flex-wrap: wrap !important;
}

.spm-list-promo-card > label {
    font-size: 10.5px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.03em !important;
    color: #64748b !important;
    margin: 0 !important;
    white-space: nowrap !important;
}

.spm-list-promo-card #promo-container {
    flex: 1 !important;
    padding: 2px 8px !important;
    font-size: 11px !important;
    border-radius: 5px !important;
    background: #f8fafc !important;
    border: 1px dashed #cbd5e1 !important;
    min-height: 24px !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    flex-wrap: wrap !important;
}

.spm-list-promo-card #promo-default {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 6px !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
    color: #94a3b8 !important;
    font-size: 11px !important;
}

.spm-list-promo-card #promo-default i,
.spm-list-promo-card #promo-default svg {
    font-size: 11px !important;
    width: 12px !important;
    height: 12px !important;
    margin: 0 !important;
}

.spm-list-promo-card #promo-default p,
.spm-list-promo-card #promo-default div {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.2 !important;
}

.spm-promo-grup-section {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 6px 10px !important;
    background: var(--spm-amber-bg) !important;
    border: 1px solid var(--spm-amber-border) !important;
    border-radius: 6px !important;
    padding: 4px 10px !important;
    margin: 0 0 5px 0 !important;
    box-shadow: 0 1px 2px rgba(217, 119, 6, 0.05) !important;
}

/* Override tw:space-y-3 agar tidak ada margin-top berlebih pada children flex */
.spm-promo-grup-section > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

/* Sembunyikan paragraf penjelasan panjang (tetap tersedia di tooltip judul) */
.spm-promo-grup-section > p,
.spm-promo-grup-section > div > p {
    display: none !important;
}

.spm-promo-grup-section h3 {
    font-size: 10.5px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.03em !important;
    color: var(--spm-amber-text) !important;
    margin: 0 !important;
    white-space: nowrap !important;
    cursor: help;
}

.spm-promo-grup-section > div[class*="grid"] {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 6px !important;
    flex: 1 1 auto !important;
}

.spm-promo-grup-section label {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    background: #ffffff !important;
    border: 1px solid #fcd34d !important;
    border-radius: 5px !important;
    padding: 2px 8px !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
    margin: 0 !important;
}

.spm-promo-grup-section label > div {
    display: inline-flex !important;
    align-items: baseline !important;
    gap: 5px !important;
}

.spm-promo-grup-section input[type="checkbox"] {
    margin: 0 !important;
}

.spm-promo-grup-section > div[class*="flex"] {
    margin-left: auto !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
}

.spm-promo-grup-section button {
    background: #d97706 !important;
    color: #ffffff !important;
    border: none !important;
    --tw-ring-shadow: none !important;
    height: 24px !important;
    min-height: 24px !important;
    padding: 0 10px !important;
    font-size: 10.5px !important;
    font-weight: 700 !important;
    border-radius: 5px !important;
    white-space: nowrap !important;
}

.spm-promo-grup-section button:hover {
    background: #b45309 !important;
}

/* ==========================================================================
   7. SECTION 3: DETAIL BARANG (#table-detailbarang) — HIGH DENSITY ERP TABLE
   ========================================================================== */
.spm-detail-barang-card {
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border) !important;
    border-radius: 7px !important;
    padding: 7px 10px !important;
    margin: 0 !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06) !important;
}

.spm-table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 5px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--spm-border-soft);
}

.spm-table-toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spm-table-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #0f172a;
}

.spm-item-count-pill {
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    font-size: 10.5px;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 999px;
}

.spm-table-toolbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
}

.spm-btn-add-top {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    background: var(--spm-primary) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px !important;
    height: 28px !important;
    padding: 0 12px !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    transition: background 0.15s ease !important;
}

.spm-btn-add-top:hover {
    background: var(--spm-primary-hover) !important;
}

.spm-btn-add-top kbd {
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 9.5px;
    font-weight: 800;
}

.spm-detail-barang-card > label[for="table-detailbarang"],
.spm-detail-barang-card > p {
    display: none !important;
}

.spm-detail-barang-card #btnToggleDiskon {
    margin-bottom: 0 !important;
    height: 28px !important;
    min-height: 28px !important;
    padding: 0 10px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    border-radius: 6px !important;
    background: #f8fafc !important;
    color: #334155 !important;
    border: 1px solid var(--spm-border) !important;
}

.spm-detail-barang-card #btnToggleDiskon:hover {
    background: #e2e8f0 !important;
}

.spm-detail-barang-card .ui-table-wrap {
    border: 1px solid var(--spm-border-soft) !important;
    border-radius: 6px !important;
    overflow-x: auto !important;
    background: #ffffff !important;
}

/* Scoping ketat ke #table-detailbarang */
#table-detailbarang {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100% !important;
    margin: 0 !important;
}

#table-detailbarang thead th {
    position: sticky !important;
    top: 0 !important;
    z-index: 5 !important;
    background-color: #f1f5f9 !important;
    color: #1e293b !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.02em !important;
    padding: 6px 4px !important;
    border-bottom: 2px solid #cbd5e1 !important;
    white-space: nowrap !important;
    text-align: center !important;
}

#table-detailbarang thead th:nth-child(1) {
    text-align: left !important;
    padding-left: 8px !important;
}

/* Header aksen biru untuk Disc 1-4 % */
#table-detailbarang thead th:nth-child(6),
#table-detailbarang thead th:nth-child(7),
#table-detailbarang thead th:nth-child(8),
#table-detailbarang thead th:nth-child(9) {
    background-color: #e0f2fe !important;
    color: #0369a1 !important;
}

/* Header aksen kuning untuk Disc Rp/Satuan 1-2 */
#table-detailbarang thead th:nth-child(10),
#table-detailbarang thead th:nth-child(11) {
    background-color: #fef3c7 !important;
    color: #92400e !important;
}

#table-detailbarang tbody td {
    padding: 3px 3px !important;
    font-size: 11.5px !important;
    border-bottom: 1px solid #e2e8f0 !important;
    vertical-align: middle !important;
}

#table-detailbarang tbody tr:nth-child(even) {
    background-color: #f8fafc !important;
}

#table-detailbarang tbody tr:hover {
    background-color: #f0fdf4 !important;
}

#table-detailbarang tbody tr:focus-within {
    background-color: #eff6ff !important;
}

/* Kolom 1: Barang */
#table-detailbarang tbody td:nth-child(1) {
    min-width: 200px !important;
    padding-left: 6px !important;
}

/* Kolom 2: Satuan */
#table-detailbarang tbody td:nth-child(2) {
    width: 96px !important;
    min-width: 88px !important;
}

/* Kolom 3: Jumlah (Qty Stepper Ringkas) */
#table-detailbarang tbody td:nth-child(3) {
    width: 96px !important;
    min-width: 90px !important;
}

#table-detailbarang .qty-step-wrap {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
}

#table-detailbarang .qty-step-wrap button {
    width: 22px !important;
    min-width: 22px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 0 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    border-radius: 4px !important;
    border: 1px solid var(--spm-border) !important;
    background: #f8fafc !important;
    color: #334155 !important;
}

#table-detailbarang .qty-step-wrap input.qty {
    width: 44px !important;
    min-width: 40px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 1px 3px !important;
    text-align: center !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    color: #0f172a !important;
}

/* Kolom 4: Stok Tersedia (Readonly) */
#table-detailbarang tbody td:nth-child(4) input {
    width: 54px !important;
    min-width: 48px !important;
    height: 26px !important;
    min-height: 26px !important;
    text-align: center !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    color: #047857 !important;
    background-color: #ecfdf5 !important;
    border-color: #d1fae5 !important;
}

/* Kolom 5: Harga (Readonly) */
#table-detailbarang tbody td:nth-child(5) input {
    width: 84px !important;
    min-width: 78px !important;
    height: 26px !important;
    min-height: 26px !important;
    text-align: right !important;
    font-family: var(--spm-mono) !important;
    font-size: 11px !important;
}

/* Kolom 6-9: 4 Kolom Diskon % (Aksen Biru) */
#table-detailbarang tbody td:nth-child(6) input,
#table-detailbarang tbody td:nth-child(7) input,
#table-detailbarang tbody td:nth-child(8) input,
#table-detailbarang tbody td:nth-child(9) input {
    width: 46px !important;
    min-width: 42px !important;
    max-width: 50px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 1px 3px !important;
    text-align: center !important;
    font-weight: 700 !important;
    font-size: 11.5px !important;
    color: var(--spm-sky-text) !important;
    background-color: var(--spm-sky-bg) !important;
    border-color: var(--spm-sky-border) !important;
}

/* Kolom 10-11: 2 Kolom Diskon Rp/Satuan (Aksen Kuning Monospace) */
#table-detailbarang tbody td:nth-child(10) input,
#table-detailbarang tbody td:nth-child(11) input {
    width: 72px !important;
    min-width: 66px !important;
    max-width: 78px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 1px 4px !important;
    text-align: right !important;
    font-family: var(--spm-mono) !important;
    font-weight: 700 !important;
    font-size: 11.5px !important;
    color: var(--spm-amber-text) !important;
    background-color: #fefce8 !important;
    border-color: #fde047 !important;
}

/* Kolom 12: Subtotal (Readonly) */
#table-detailbarang tbody td:nth-child(12) input {
    width: 94px !important;
    min-width: 86px !important;
    height: 26px !important;
    min-height: 26px !important;
    text-align: right !important;
    font-family: var(--spm-mono) !important;
    font-weight: 800 !important;
    font-size: 11.5px !important;
    color: #0f172a !important;
    background-color: #f8fafc !important;
}

/* Kolom 13: Catatan Item */
#table-detailbarang tbody td:nth-child(13) textarea {
    width: 108px !important;
    min-width: 96px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 3px 6px !important;
    font-size: 11px !important;
    line-height: 1.25 !important;
    border-radius: 4px !important;
    border: 1px solid var(--spm-border) !important;
    resize: none !important;
    transition: height 0.15s ease !important;
}

#table-detailbarang tbody td:nth-child(13) textarea:focus {
    height: 52px !important;
}

/* Kolom 14: Aksi Delete */
#table-detailbarang tbody td:nth-child(14) .btn-delete {
    width: 26px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 5px !important;
}

#table-detailbarang tfoot td {
    padding: 5px 8px !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    background: #f8fafc !important;
    color: #334155 !important;
    border-top: 1px solid var(--spm-border) !important;
}

/* Tombol Add Barang bawaan di bawah tabel dirampingkan */
.spm-detail-barang-card button[onclick="addRowBarang()"] {
    width: auto !important;
    margin-top: 6px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 0 12px !important;
    font-size: 11px !important;
    border-radius: 5px !important;
}

/* ==========================================================================
   8. SECTION 4: DETAIL BONUS (#table-detailbonus) — TEMA EMERALD + AUTO-COLLAPSE
   ========================================================================== */
.spm-detail-bonus-card {
    background: var(--spm-emerald-bg) !important;
    border: 1px solid var(--spm-emerald-border) !important;
    border-radius: 7px !important;
    padding: 6px 10px !important;
    margin: 0 !important;
    box-shadow: 0 1px 2px rgba(22, 163, 74, 0.05) !important;
}

/* Auto-collapse jadi 1 strip tipis saat 0 bonus */
.spm-detail-bonus-card.spm-bonus-empty {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 10px !important;
    padding: 4px 10px !important;
}

.spm-detail-bonus-card.spm-bonus-empty > label[for="table-detailbonus"] {
    margin: 0 !important;
}

.spm-detail-bonus-card.spm-bonus-empty > p,
.spm-detail-bonus-card.spm-bonus-empty > .ui-table-wrap {
    display: none !important;
}

.spm-detail-bonus-card.spm-bonus-empty button[onclick="addRowBonus()"] {
    margin-top: 0 !important;
}

.spm-bonus-count-pill {
    display: inline-block;
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
    font-size: 10px;
    font-weight: 700;
    padding: 0 6px;
    border-radius: 999px;
    margin-left: 6px;
    vertical-align: middle;
}

/* ==========================================================================
   8B. REAL-TIME VALIDATION HIGHLIGHTS (OVER-STOCK, DUPLIKAT, OVER-LIMIT)
   ========================================================================== */
#table-detailbarang tbody tr.spm-over-stock td:nth-child(3) input.qty,
#table-detailbarang tbody tr.spm-over-stock td:nth-child(4) input {
    background-color: #fef2f2 !important;
    border-color: #ef4444 !important;
    color: #b91c1c !important;
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.25) !important;
}

#table-detailbarang tbody tr.spm-duplicate-row {
    background-color: #fffbeb !important;
    box-shadow: inset 3px 0 0 #f59e0b !important;
}

.spm-dup-tag {
    display: inline-block;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #f59e0b;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0 4px;
    border-radius: 3px;
    margin-top: 2px;
}

.spm-guard-badges {
    display: flex;
    align-items: center;
    gap: 6px;
}

.spm-guard-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
}

.spm-guard-danger {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid #ef4444;
}

.spm-guard-warn {
    background: rgba(245, 158, 11, 0.2);
    color: #fcd34d;
    border: 1px solid #f59e0b;
}

.spm-toast {
    position: fixed;
    bottom: 64px;
    right: 18px;
    background: #1e293b;
    color: #f8fafc;
    border: 1px solid #475569;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 11.5px;
    font-weight: 600;
    font-family: var(--spm-sans);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    opacity: 0;
    transform: translateY(6px);
    transition: all 0.18s ease;
    pointer-events: none;
}

.spm-toast.spm-toast-show {
    opacity: 1;
    transform: translateY(0);
}

/* Highlight item aktif saat navigasi ArrowUp/ArrowDown di dropdown pencarian */
ul li.spm-dd-active {
    background-color: #e0f2fe !important;
    color: #0369a1 !important;
    font-weight: 700 !important;
    box-shadow: inset 3px 0 0 #0284c7 !important;
}

.spm-detail-bonus-card > label[for="table-detailbonus"] {
    font-size: 11.5px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.03em !important;
    color: var(--spm-emerald-text) !important;
    margin: 0 0 4px 0 !important;
    display: inline-block !important;
}

.spm-detail-bonus-card > p {
    font-size: 10.5px !important;
    color: #15803d !important;
    margin: 0 0 6px 0 !important;
}

.spm-detail-bonus-card .ui-table-wrap {
    background: #ffffff !important;
    border: 1px solid var(--spm-emerald-border) !important;
    border-radius: 6px !important;
    overflow-x: auto !important;
}

#table-detailbonus {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    margin: 0 !important;
}

#table-detailbonus thead th {
    background: #dcfce7 !important;
    color: var(--spm-emerald-text) !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    padding: 5px 6px !important;
    border-bottom: 1px solid var(--spm-emerald-border) !important;
}

#table-detailbonus tbody td,
#table-detailbonus tfoot td {
    padding: 4px 6px !important;
    font-size: 11.5px !important;
}

.spm-detail-bonus-card button[onclick="addRowBonus()"] {
    width: auto !important;
    margin-top: 6px !important;
    height: 26px !important;
    min-height: 26px !important;
    padding: 0 12px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    background: #ffffff !important;
    color: #15803d !important;
    border: 1px solid #86efac !important;
    border-radius: 5px !important;
}

.spm-detail-bonus-card button[onclick="addRowBonus()"]:hover {
    background: #dcfce7 !important;
}

/* ==========================================================================
   9. SECTION 5: FOOTER RINGKASAN BIAYA & CATATAN
   ========================================================================== */
.spm-footer-grid {
    display: grid !important;
    grid-template-columns: 1.15fr 1fr !important;
    gap: 6px !important;
    align-items: stretch !important;
    margin: 0 !important;
}

.spm-footer-left,
.spm-footer-right {
    grid-column: auto !important;
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border) !important;
    border-radius: 7px !important;
    padding: 8px 10px !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}

.spm-footer-left textarea#remark {
    min-height: 92px !important;
    font-size: 12px !important;
    padding: 6px 8px !important;
    border-radius: 6px !important;
    border: 1px solid var(--spm-border) !important;
}

.spm-footer-right {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 6px 10px !important;
}

.spm-footer-right > div {
    margin: 0 !important;
}

/* Subtotal, Diskon, Grand Total & Image span 2 kolom dalam format baris rapat */
.spm-summary-row {
    grid-column: span 2 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 10px !important;
}

.spm-summary-row > label {
    width: auto !important;
    margin: 0 !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    color: #475569 !important;
    white-space: nowrap !important;
}

.spm-summary-row > div {
    width: 190px !important;
    flex-shrink: 0 !important;
}

.spm-summary-row input {
    text-align: right !important;
    font-family: var(--spm-mono) !important;
    font-weight: 700 !important;
}

#total_diskon {
    color: #dc2626 !important;
}

#total {
    font-size: 14px !important;
    font-weight: 900 !important;
    color: #1d4ed8 !important;
    background-color: #eff6ff !important;
    border-color: #93c5fd !important;
}

.spm-image-row {
    grid-column: span 2 !important;
    padding-top: 4px !important;
    border-top: 1px solid var(--spm-border-soft) !important;
}

/* Native form action footer tetap rapi */
.spm-native-actions {
    background: var(--spm-surface) !important;
    border: 1px solid var(--spm-border) !important;
    border-radius: 7px !important;
    padding: 6px 10px !important;
    margin-top: 5px !important;
}

/* ==========================================================================
   10. FLOATING GRAND TOTAL & ACTION BAR (STICKY BOTTOM)
   ========================================================================== */
.spm-fakturis-statusbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 54px;
    background: #0f172a;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.35);
    z-index: 9999;
    font-family: var(--spm-sans);
    border-top: 1px solid #334155;
    gap: 12px;
}

.spm-statusbar-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
}

.spm-brand-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
    flex-shrink: 0;
}

.spm-brand-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: #e2e8f0;
    text-transform: uppercase;
    margin-right: 6px;
    white-space: nowrap;
}

.spm-badge {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11px;
    color: #cbd5e1;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
    user-select: none;
}

.spm-badge:hover {
    background: #334155;
    color: #ffffff;
    border-color: #475569;
}

.spm-badge kbd {
    background: #334155;
    color: #f8fafc;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 700;
    font-family: var(--spm-sans);
}

.spm-statusbar-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
}

.spm-mini-totals {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 10.5px;
    line-height: 1.3;
    color: #94a3b8;
    font-family: var(--spm-mono);
    border-right: 1px solid #334155;
    padding-right: 12px;
}

.spm-mini-totals strong {
    color: #e2e8f0;
}

.spm-mini-totals .spm-mini-disc {
    color: #fca5a5;
}

.spm-grand-total-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.05;
}

.spm-total-label {
    font-size: 9.5px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
}

.spm-total-value {
    font-size: 22px;
    font-weight: 900;
    color: #4ade80;
    letter-spacing: -0.02em;
    font-family: var(--spm-mono);
}

.spm-statusbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spm-btn-bar-save {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid #475569;
    background: #1e293b;
    color: #f8fafc;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
}

.spm-btn-bar-save:hover {
    background: #334155;
}

.spm-btn-save-print {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 6px !important;
    font-weight: 700 !important;
    gap: 6px !important;
    height: 34px !important;
    padding: 0 14px !important;
    font-size: 12px !important;
    background-color: var(--spm-success) !important;
    color: #ffffff !important;
    transition: all 0.15s ease !important;
    cursor: pointer !important;
    border: none !important;
    box-shadow: 0 2px 6px rgba(22, 163, 74, 0.35) !important;
}

.spm-btn-save-print:hover {
    background-color: var(--spm-success-hover) !important;
}

.spm-keyhint {
    background: rgba(255, 255, 255, 0.2);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5px;
    font-weight: 800;
    text-transform: uppercase;
}

/* ==========================================================================
   11. RESPONSIVE FALLBACK (Layar lebih sempit < 1200px)
   ========================================================================== */
@media (max-width: 1180px) {
    .spm-header-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .spm-id-sales      { grid-column: span 6 !important; }
    .spm-id-jatuhtempo { grid-column: span 6 !important; }
    .spm-id-kredit     { grid-column: span 3 !important; }
    .spm-id-plafond    { grid-column: span 3 !important; }
    .spm-id-kanvas     { grid-column: span 3 !important; }
    .spm-id-bill       { grid-column: span 3 !important; }
    .spm-footer-grid {
        grid-template-columns: 1fr !important;
    }
    .spm-mini-totals {
        display: none;
    }
}

`;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customCss);
    } else {
        const style = document.createElement('style');
        style.id = 'spm-fakturis-pro-style';
        style.textContent = customCss;
        document.head.appendChild(style);
    }

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
