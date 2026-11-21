# SPM Fakturis Pro - Client-Side UI/UX Redesign
**Target Web:** `https://stagingsinarpanganmakmur.my.id/`  
**Khusus Peran:** Fakturis (User `fauzan`)

Proyek ini dibuat untuk merombak antarmuka (UI) dan alur kerja (UX) form input faktur penjualan PT Sinar Pangan Makmur langsung di browser Anda, **tanpa perlu akses source code server**.

---

## 🚀 Fitur Unggulan "Fakturis Pro v3.0"

1. **Struktur Diskon Lengkap Persis Sistem Asli:**
   - **4 Kolom Diskon %:** `Disc 1 %`, `Disc 2 %`, `Disc 3 %`, `Disc 4 %` (Aksen Biru Ringkas)
   - **2 Kolom Diskon Rp/Satuan:** `Disc Rp 1`, `Disc Rp 2` (Aksen Kuning Monospace)
   - Seluruh 6 kolom diskon tetap aktif dan dikompresi sedemikian rupa sehingga **muat 100% tanpa ada scroll horizontal**.
2. **Sembunyikan / Buka Sidebar (<kbd>Ctrl + B</kbd>):**  
   Sidebar kiri yang memakan tempat 240px dapat disembunyikan seketika dengan menekan <kbd>Ctrl + B</kbd> atau klik tombol toggle di pojok kiri atas. Area tabel otomatis melebar penuh (*full-width*). Status tersimpan otomatis di browser.
3. **Preservasi Promo Grup Produk & Detail Bonus:**
   - Bagian **Promo Grup Produk** dan tombol **"Hitung Ulang Promo"** tetap tampil rapi di atas tabel.
   - Tabel **Detail Barang Bonus Otomatis** tetap tersedia di bawah tabel utama.
4. **Anti Tab-Trap (Numpad Navigation):**
   - Menekan tombol <kbd>Tab</kbd> dari kolom *Qty* otomatis melompati field readonly (*Stok Tersedia* dan *Harga Dasar*) dan langsung mendarat di *Disc 1 %* hingga *Disc Rp 2*.
5. **Keyboard Shortcuts Lengkap:**
   - <kbd>Ctrl + B</kbd>: Buka / Sembunyikan Sidebar
   - <kbd>F2</kbd> atau <kbd>Alt + A</kbd>: Tambah baris barang baru seketika
   - <kbd>Ctrl + S</kbd>: Simpan faktur (mencegah popup default simpan webpage browser)
   - <kbd>Alt + P</kbd> atau <kbd>Ctrl + Enter</kbd>: Simpan & Cetak Langsung (tombol hijau baru)
6. **Floating Grand Total Bar:**
   - Bilah status mengambang di bawah layar menampilkan nilai Grand Total dengan ukuran font **24px tebal berwarna hijau neon kontras**.

---

## 📦 Cara Pemasangan di Browser Anda

### Pilihan 1: Sebagai Chrome Extension (Direkomendasikan)
1. Buka browser Google Chrome atau Microsoft Edge.
2. Buka tab baru, ketik `chrome://extensions` di address bar (atau `edge://extensions` di Edge).
3. Di pojok kanan atas, nyalakan toggle **"Developer mode"** (Mode Pengembang).
4. Di pojok kiri atas, klik tombol **"Load unpacked"** (Muat yang belum dibongkar).
5. Pilih folder:
   ```
   D:\AndhryTR\Project\SPMRedesign\extension
   ```
6. Buka kembali tab form penjualan staging Anda di:  
   `https://stagingsinarpanganmakmur.my.id/module-penjualan/penjualan/add`
7. Tekan **F5** (Refresh).  
   *Selesai! Tekan <kbd>Ctrl + B</kbd> untuk menyembunyikan sidebar dan nikmati form yang lega & padat.*

---

### Pilihan 2: Menggunakan Tampermonkey / Violentmonkey (Userscript)
1. Buka file [spm-fakturis-enhancer.user.js](file:///d:/AndhryTR/Project/SPMRedesign/spm-fakturis-enhancer.user.js) di text editor, salin semua kodenya.
2. Di browser, klik ikon Tampermonkey -> **Create a new script...**.
3. Paste kode tadi lalu tekan **Ctrl + S** (Save).
4. Refresh tab form penjualan staging Anda.

---

## 🖥️ Prototipe Interaktif
Untuk melihat dan mencoba simulasi prototipe interaktif:
* Buka berkas [redesign_prototype.html](file:///d:/AndhryTR/Project/SPMRedesign/redesign_prototype.html) langsung di browser Anda.
