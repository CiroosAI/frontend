# Perubahan dari PWA ke Mobile App (TWA) - Ciroos AI Frontend

## Ringkasan Perubahan

Website telah diperbarui untuk **menghapus PWA sepenuhnya** dan hanya menggunakan `applicationData.link_app` untuk redirect ke Play Store. Tampilan download hanya muncul di browser, dan dihilangkan untuk pengguna yang sudah menggunakan aplikasi mobile (TWA/WebView).

**Update Terbaru**: Menambahkan deteksi iOS untuk PWA dan custom alert yang sesuai dengan desain website.

## Perubahan Utama

### 1. Penghapusan PWA Configuration Sepenuhnya
- **File**: `next.config.js`
- **Perubahan**: Menghapus semua konfigurasi PWA dan `next-pwa`
- **File**: `package.json`
- **Perubahan**: Menghapus dependency `next-pwa` dan `pwa`
- **File**: `public/manifest.json`
- **Perubahan**: File dihapus karena tidak diperlukan lagi

### 2. Deteksi Mobile App & Device Type
- **File**: `utils/mobileAppDetection.js`
- **Fungsi**: Utility untuk mendeteksi device type dan mobile app environment
- **Deteksi**: 
  - WebView indicators (`wv` dalam user agent)
  - Chrome WebView patterns
  - iOS standalone mode
  - Custom app user agents
  - App referrer patterns
  - **Device Type**: iOS, Android, Desktop

### 3. Komponen Baru

#### CustomAlert (`components/CustomAlert.js`)
- **Custom modal alert** yang sesuai dengan desain website
- **Tidak menggunakan alert() bawaan browser**
- Support berbagai tipe: info, success, warning, error
- Responsive dan mobile-friendly
- Backdrop blur dan gradient styling

#### AppInstallButton (`components/AppInstallButton.js`)
- **Hanya untuk pengguna browser** - tidak ditampilkan jika di aplikasi mobile
- **Smart detection**: iOS → PWA, Android → Play Store, Desktop → Alert
- **Custom alerts** untuk setiap device type
- **Tidak ada PWA logic** - semua logika PWA dihapus
- **Syarat tampil**: Tidak di aplikasi mobile

#### MobileAppStatus (`components/MobileAppStatus.js`)
- **Hanya untuk pengguna aplikasi mobile** - tidak ditampilkan jika di browser
- Menampilkan status aplikasi mobile untuk pengguna TWA/WebView
- Menunjukkan bahwa aplikasi sudah terinstall dan aktif

### 4. Update Profile Page
- **File**: `pages/profile.js`
- **Perubahan**: 
  - Menggunakan komponen baru `AppInstallButton` dan `MobileAppStatus`
  - Menghapus semua logika PWA yang kompleks
  - Deteksi mobile app menggunakan utility function

## Cara Kerja

### Untuk Pengguna Browser (Web)

#### Android Browser
1. Sistem mendeteksi Android device
2. **Jika ada `applicationData.link_app`**: Menampilkan tombol "DOWNLOAD APK"
3. Ketika tombol diklik: **Redirect langsung ke Play Store**
4. **Jika tidak ada `link_app`**: Menampilkan custom alert error

#### iOS Browser (Safari)
1. Sistem mendeteksi iOS device
2. Menampilkan tombol "INSTALL PWA"
3. Ketika tombol diklik: **Menampilkan custom alert dengan panduan PWA**
4. Panduan: "Add to Home Screen" di Safari

#### Desktop Browser
1. Sistem mendeteksi desktop device
2. Menampilkan tombol "INSTALL APP"
3. Ketika tombol diklik: **Menampilkan custom alert warning**
4. Alert: "Install hanya untuk mobile"

### Untuk Pengguna Aplikasi Mobile (TWA/WebView)
1. Sistem mendeteksi bahwa pengguna menggunakan aplikasi mobile
2. **Menampilkan `MobileAppStatus`** dengan status "TERINSTALL"
3. **Tidak menampilkan tombol download sama sekali** ✅
4. Menunjukkan bahwa aplikasi mobile sedang aktif

## Konfigurasi Admin

Admin dapat mengatur `link_app` melalui:
- **File**: `pages/panel-admin/settings.js`
- **Field**: "Link Download Aplikasi"
- **Fungsi**: URL Play Store untuk aplikasi mobile
- **Penting**: Jika tidak ada `link_app`, tombol download tidak akan muncul untuk Android

## Keuntungan

1. **Pengalaman Pengguna Lebih Baik**: 
   - Pengguna aplikasi mobile tidak melihat tombol download yang tidak relevan
   - Pengguna browser mendapat panduan yang sesuai dengan device mereka
   - Custom alert yang sesuai dengan desain website

2. **Kode Lebih Sederhana**: 
   - Tidak ada logika PWA yang kompleks
   - Hanya menggunakan `link_app` untuk Android
   - PWA hanya untuk iOS dengan panduan manual

3. **Deteksi Otomatis**: 
   - Tidak perlu konfigurasi manual untuk deteksi aplikasi
   - Komponen otomatis menampilkan/menyembunyikan diri
   - Smart detection berdasarkan device type

4. **Maintainable**: 
   - Pemisahan logika ke komponen terpisah
   - Mudah untuk menambah fitur atau mengubah logika
   - Custom alert reusable untuk berbagai keperluan

## Testing

### Android Browser
- Buka website di browser Android
- **Jika ada `link_app`**: Harus menampilkan tombol "DOWNLOAD APK"
- **Jika tidak ada `link_app`**: Menampilkan custom alert error
- Klik tombol → Redirect ke Play Store

### iOS Browser (Safari)
- Buka website di Safari iOS
- Harus menampilkan tombol "INSTALL PWA"
- Klik tombol → Menampilkan custom alert dengan panduan PWA
- Panduan: "Add to Home Screen"

### Desktop Browser
- Buka website di browser desktop
- Harus menampilkan tombol "INSTALL APP"
- Klik tombol → Menampilkan custom alert warning
- Alert: "Install hanya untuk mobile"

### TWA/WebView Simulation
- Tambahkan `?debug=mobile` di URL
- Atau gunakan browser dengan user agent yang mengandung `wv`
- **Harus menampilkan status "TERINSTALL"**
- **Tidak boleh menampilkan tombol download**

### Manual Testing
- Ubah user agent browser untuk mensimulasikan WebView
- Contoh: `Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36 wv`

## File yang Dimodifikasi

1. `next.config.js` - Menghapus semua PWA config
2. `package.json` - Menghapus next-pwa dan pwa dependencies
3. `pages/profile.js` - Update untuk menggunakan komponen baru
4. `public/manifest.json` - Dihapus

## File Baru

1. `utils/mobileAppDetection.js` - Utility deteksi mobile app & device type
2. `components/CustomAlert.js` - Custom alert modal
3. `components/AppInstallButton.js` - Komponen tombol download (browser only)
4. `components/MobileAppStatus.js` - Komponen status aplikasi mobile (app only)

## Catatan Penting

- **PWA sudah dihapus sepenuhnya** - tidak ada lagi PWA functionality
- **Android**: Hanya menggunakan `link_app` - redirect langsung ke Play Store
- **iOS**: Menggunakan PWA dengan panduan manual "Add to Home Screen"
- **Desktop**: Custom alert bahwa install hanya untuk mobile
- **Tampilan download hanya di browser** - dihilangkan untuk pengguna aplikasi mobile
- **Custom alert** - tidak menggunakan alert() bawaan browser
- Pastikan `applicationData.link_app` sudah dikonfigurasi di admin panel untuk Android
- Deteksi mobile app bekerja berdasarkan user agent dan display mode
- Komponen dapat digunakan di halaman lain dengan mudah
- Tidak ada breaking changes untuk API atau data structure yang ada

## Perbedaan dari Versi Sebelumnya

| Aspek | Sebelumnya | Sekarang |
|-------|------------|----------|
| PWA | Ada | **Dihapus sepenuhnya** |
| Android Download | PWA + link_app | **Hanya link_app** |
| iOS Download | PWA + link_app | **PWA dengan panduan manual** |
| Desktop | PWA + link_app | **Custom alert "Mobile Only"** |
| Alert | alert() browser | **Custom alert sesuai desain** |
| Tampilan di App | Ada tombol download | **Dihilangkan** |
| Device Detection | Basic | **Smart detection (iOS/Android/Desktop)** |
| Kompleksitas | Tinggi | **Sederhana** |
