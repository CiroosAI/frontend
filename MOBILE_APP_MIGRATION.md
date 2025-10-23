# Perubahan dari PWA ke Mobile App (TWA) - Ciroos AI Frontend

## Ringkasan Perubahan

Website telah diperbarui untuk menggunakan `applicationData.link_app` sebagai pengganti PWA, dengan deteksi otomatis untuk pengguna yang sudah menggunakan aplikasi mobile (TWA/WebView).

## Perubahan Utama

### 1. Penghapusan PWA Configuration
- **File**: `next.config.js`
- **Perubahan**: Menghapus konfigurasi `next-pwa` dan semua pengaturan PWA
- **File**: `package.json`
- **Perubahan**: Menghapus dependency `next-pwa`
- **File**: `public/manifest.json`
- **Perubahan**: File dihapus karena tidak diperlukan lagi

### 2. Deteksi Mobile App
- **File Baru**: `utils/mobileAppDetection.js`
- **Fungsi**: Utility untuk mendeteksi apakah pengguna menggunakan aplikasi mobile (TWA/WebView)
- **Deteksi**: 
  - WebView indicators (`wv` dalam user agent)
  - Chrome WebView patterns
  - iOS standalone mode
  - Custom app user agents
  - App referrer patterns

### 3. Komponen Baru

#### AppInstallButton (`components/AppInstallButton.js`)
- Menampilkan tombol install untuk pengguna browser
- Otomatis redirect ke `applicationData.link_app` jika tersedia
- Fallback ke PWA install jika tidak ada link_app
- Tidak ditampilkan jika pengguna sudah menggunakan aplikasi mobile

#### MobileAppStatus (`components/MobileAppStatus.js`)
- Menampilkan status aplikasi mobile untuk pengguna TWA/WebView
- Hanya ditampilkan jika pengguna menggunakan aplikasi mobile
- Menunjukkan bahwa aplikasi sudah terinstall dan aktif

### 4. Update Profile Page
- **File**: `pages/profile.js`
- **Perubahan**: 
  - Menggunakan komponen baru `AppInstallButton` dan `MobileAppStatus`
  - Menghapus logika PWA yang kompleks
  - Deteksi mobile app menggunakan utility function

## Cara Kerja

### Untuk Pengguna Browser (Web)
1. Sistem mendeteksi bahwa pengguna tidak menggunakan aplikasi mobile
2. Menampilkan `AppInstallButton` dengan tombol "INSTALL NOW"
3. Ketika diklik:
   - Jika ada `applicationData.link_app`: redirect ke Play Store
   - Jika tidak ada: fallback ke PWA install atau panduan manual

### Untuk Pengguna Aplikasi Mobile (TWA/WebView)
1. Sistem mendeteksi bahwa pengguna menggunakan aplikasi mobile
2. Menampilkan `MobileAppStatus` dengan status "TERINSTALL"
3. Tidak menampilkan tombol download/install

## Konfigurasi Admin

Admin dapat mengatur `link_app` melalui:
- **File**: `pages/panel-admin/settings.js`
- **Field**: "Link Download Aplikasi"
- **Fungsi**: URL Play Store untuk aplikasi mobile

## Keuntungan

1. **Pengalaman Pengguna Lebih Baik**: Pengguna aplikasi mobile tidak melihat tombol download yang tidak relevan
2. **Redirect Langsung ke Play Store**: Pengguna browser langsung diarahkan ke Play Store
3. **Deteksi Otomatis**: Tidak perlu konfigurasi manual untuk deteksi aplikasi
4. **Kode Lebih Bersih**: Pemisahan logika ke komponen terpisah
5. **Maintainable**: Mudah untuk menambah fitur atau mengubah logika

## Testing

Untuk testing deteksi mobile app:

### Browser Normal
- Buka website di browser desktop/mobile
- Harus menampilkan tombol "INSTALL NOW"

### TWA/WebView Simulation
- Tambahkan `?debug=mobile` di URL
- Atau gunakan browser dengan user agent yang mengandung `wv`

### Manual Testing
- Ubah user agent browser untuk mensimulasikan WebView
- Contoh: `Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36 wv`

## File yang Dimodifikasi

1. `next.config.js` - Menghapus PWA config
2. `package.json` - Menghapus next-pwa dependency
3. `pages/profile.js` - Update untuk menggunakan komponen baru
4. `public/manifest.json` - Dihapus

## File Baru

1. `utils/mobileAppDetection.js` - Utility deteksi mobile app
2. `components/AppInstallButton.js` - Komponen tombol install
3. `components/MobileAppStatus.js` - Komponen status aplikasi mobile

## Catatan Penting

- Pastikan `applicationData.link_app` sudah dikonfigurasi di admin panel
- Deteksi mobile app bekerja berdasarkan user agent dan display mode
- Komponen dapat digunakan di halaman lain dengan mudah
- Tidak ada breaking changes untuk API atau data structure yang ada
