# Development Log - Thangun Afa Web App

Log ini mencatat perjalanan pengembangan aplikasi Web Thangun Afa sebagai bahan pembelajaran dan dokumentasi teknis.

## Fase 1: Inisialisasi Project (4 Januari 2026)

### Aktivitas
- **User**: Memberikan `spec.md` dan kredensial Supabase.
- **Antigravity (AI)**: Inisialisasi project React + Vite + Tailwind, konfigurasi tema Earth/Primary.
- **Antigravity (AI)**: Setup struktur folder (components, pages, context, hooks, lib).

### Kendala & Solusi
1. **Masalah**: `vite.config.js` error karena penggunaan `__dirname` di lingkungan ESM (ES Modules).
   - **Solusi**: Menggunakan `fileURLToPath` dan `path.dirname` untuk mendefinisikan `__dirname` secara manual di config.

## Fase 2: Database & Autentikasi

### Aktivitas
- **Antigravity (AI)**: Membuat `supabase/schema.sql` yang komprehensif (auth, users, transactions, news, gallery).
- **User**: Eksekusi schema di SQL Editor Supabase.
- **Antigravity (AI)**: Implementasi `AuthContext.jsx` dan `ProtectedRoute.jsx`.

### Kendala & Solusi
1. **Masalah**: Layar putih setelah instalasi (Error: Failed to resolve import "@hookform/resolvers/zod").
   - **Penyebab**: Library `@hookform/resolvers` belum terinstall.
   - **Solusi**: Melakukan `npm install @hookform/resolvers`.
2. **Masalah**: Uncaught SyntaxError terkait `ReceiptText` tidak ditemukan di `lucide-react`.
   - **Penyebab**: Perbedaan versi library `lucide-react`. Ikon yang benar adalah `Receipt`.
   - **Solusi**: Mengganti semua referensi `ReceiptText` menjadi `Receipt` di seluruh codebase.

## Fase 3: Core Features MVP (Update 4 Januari 2026, 21:05)

### Aktivitas
- **Antigravity (AI)**: Implementasi Dashboard, Transactions, Profile.
- **Antigravity (AI)**: Menambahkan font Plus Jakarta Sans.

### Kendala & Solusi
1. **Masalah**: Font tidak berubah di browser.
   - **Penyebab**: Konfigurasi Tailwind belum "dipaksa" atau browser menggunakan cache lama.
   - **Solusi**: Menambahkan aturan eksplisit `font-family` di `src/index.css`.
2. **Masalah**: Pesan error "infinite recursion detected" di Console dan nama user tidak muncul ("Halo, User!").
   - **Penyebab**: RLS Policy pada tabel `users` bersifat rekursif. Saat sistem mencoba mengecek role user di tabel `users`, ia memicu pengecekan policy di tabel itu sendiri secara terus-menerus.
   - **Solusi**: Menggunakan fungsi `SECURITY DEFINER` (khususnya `public.is_admin()`) yang dieksekusi sebagai role `postgres` (owner) sehingga melewati pengecekan RLS secara internal, memutus rantai rekursi.

## Debugging: Login & RLS (4 Januari 2026, 21:30)

### Kendala & Solusi
1. **Masalah**: Login gagal dengan error 400 (Bad Request).
   - **Penyebab**: Akun baru di Supabase Auth membutuhkan konfirmasi email secara default, atau password tidak sesuai.
   - **Solusi**: Memperjelas status konfirmasi email di Supabase (Confirm User) dan menyederhanakan aturan RLS agar tidak membebani proses login.
## Penyempurnaan UI & Estetika (4 Januari 2026, 21:55)

### Aktivitas
- **Antigravity (AI)**: Implementasi tema **Elegant Light Green** secara menyeluruh di semua halaman.
- **Antigravity (AI)**: Sinkronisasi font **Plus Jakarta Sans** ke seluruh elemen aplikasi (termasuk Dashboard).
- **Antigravity (AI)**: Re-desain komponen Card, Button, dan Input agar terlihat lebih premium dan mobile-first.
- **Antigravity (AI)**: Menambahkan efek glassmorphism dan transisi halus untuk pengalaman pengguna yang lebih modern.

### Kendala & Solusi
1. **Masalah**: Font di Dashboard tidak berubah.
   - **Solusi**: Memaksa penggunaan font-family di `index.css` secara lebih spesifik dan menambahkan class `font-sans` pada wrapper utama aplikasi.
2. **Masalah**: Warna elemen terlalu ramai.
   - **Solusi**: Menyatukan palet warna menggunakan base color `primary` (Hijau Thangun) dengan berbagai opacity untuk menciptakan kontras yang elegan namun tetap simpel.

---
*Log ini akan terus diupdate seiring berjalannya pengembangan. (Last update: 21:55, 4 Jan 2026)*
