# Pahrudinor — Orbit of Learning & Technology

Portofolio pribadi untuk lulusan PGSD dan pengembang teknologi pendidikan. Identitas visual galaksi memadukan medan bintang, nebula berlapis, konstelasi interaktif, dan panel informasi astronomi.

## Teknologi

- React 18 + Vite + TypeScript
- CSS responsif tanpa framework styling tambahan
- Canvas 2D khusus untuk medan bintang berlapis, bias kepadatan galaktik, spektrum warna bintang, cahaya halus, parallax pointer, dan ripple saat klik
- Lucide React untuk ikon
- `prefers-reduced-motion`, jeda animasi, navigasi mobile, pencarian/penyaring proyek, modal studi kasus, dan formulir kontak berbasis `mailto:`

## Jalankan di Windows / PowerShell

Pastikan Node.js LTS telah terpasang. Ekstrak folder, buka terminal pada direktori proyek, lalu jalankan:

```powershell
npm install
npm run dev
```

Vite akan menampilkan alamat lokal, biasanya `http://localhost:5173`.

Untuk pemeriksaan build:

```powershell
npm run build
npm run preview
```

## Panduan pengembangan di Codex

### 1. Data portofolio

Edit `src/portfolio.ts` untuk memperbarui nama, peran, ringkasan, email, tautan, karya, keahlian, pengalaman, pendidikan, dan publikasi. Jangan mengubah data yang belum terverifikasi menjadi klaim pencapaian.

Email kontak diatur melalui `profile.email` pada `src/portfolio.ts`. Formulir menyiapkan pesan melalui aplikasi email pengunjung (`mailto:`); website ini tidak memiliki backend formulir.

### 2. Sistem visual

- `src/Starfield.tsx`: generasi bintang, nebula canvas, bintang terang, warna, interaksi pointer, ripple klik, dan pengaturan animasi.
- `src/index.css`: semua token warna, efek atmosfer, orbit CSS, layout, breakpoint perangkat, dan reduced motion.
- `src/App.tsx`: struktur halaman, navigasi, peta konstelasi yang dapat dipilih, pencarian proyek, modal detail, dan formulir kontak.
- `index.html`: metadata SEO, judul, dan metadata pratinjau sosial.

### 3. Cara kerja visual bintang

Starfield dibuat memakai distribusi bintang yang sengaja tidak seragam: mayoritas berupa titik kecil redup, kepadatan meningkat di sepanjang jalur galaksi diagonal, dan sebagian kecil bintang yang lebih terang memiliki glow serta diffraction spikes. Warna bervariasi antara putih, putih kebiruan, dan hangat. Nebula menggunakan gradasi transparan dan jalur debu gelap, bukan sekadar banyak titik putih atau satu gradien neon.

Lapisan nebula atmosfer tambahan memuat citra **Trifid Nebula** dari NASA/ESA/STScI sebagai tekstur astrofotografi rujukan. Citra ini dimuat melalui URL NASA sehingga perlu koneksi internet; bila ingin sepenuhnya mandiri/offline, unduh versi yang sesuai dari halaman sumber NASA dan simpan di `public/`, lalu ubah URL pada `src/index.css` menjadi `/trifid-nebula.jpg`.

Sumber visual/riseretema:
- NASA Science, *Trifid Nebula (Wide Field Camera 3 Image)* — menjelaskan wilayah biru, awan debu cokelat/amber, latar gelap, dan bintang yang tersebar: https://science.nasa.gov/asset/hubble/trifid-nebula-wide-field-camera-3-image/
- NASA Science, *Hubble’s Nebulae* — konteks gas, debu kosmik, dan struktur nebula: https://science.nasa.gov/mission/hubble/science/universe-uncovered/hubble-nebulae/
- Three.js documentation, *Points* dan *PointsMaterial* — rujukan umum representasi titik dalam medan visual: https://threejs.org/docs/pages/Points.html dan https://threejs.org/docs/pages/PointsMaterial.html
- MDN, *prefers-reduced-motion* — dukungan aksesibilitas untuk mengurangi gerakan: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

## Catatan penting

- Proyek ini **belum punya backend**. Form kontak hanya menyiapkan email lokal melalui aplikasi email perangkat.
- URL produk, MIS, SIP, dan GitHub disimpan pada `src/portfolio.ts`; verifikasi ulang sebelum publikasi.
- Efek bintang adalah visual interaktif, bukan simulasi astronomi fisik atau peta langit ilmiah yang terkalibrasi.
- Gerakan dapat dijeda dari kontrol `STARFIELD LIVE`; preferensi sistem `prefers-reduced-motion` juga didukung.
- Tidak ada klaim bahwa animasi selalu berjalan mulus di semua perangkat; uji pada HP, tablet, laptop, dan PC target sebelum deploy.
