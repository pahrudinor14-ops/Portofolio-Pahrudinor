/**
 * Konten utama portofolio berada di file ini supaya mudah diedit dengan Codex.
 * Ganti nama, email, link sosial, status proyek, dan detail pengalaman sebelum dipublikasikan.
 */
export const profile = {
  name: 'Pahrudinor',
  role: 'Lulusan PGSD & Pengembang Teknologi Pendidikan',
  shortRole: 'Pendidikan Dasar × Teknologi Pendidikan',
  email: 'pahrudinor14@gmail.com',
  location: 'Banjarmasin, Kalimantan Selatan, Indonesia',
  tagline: 'Merancang pengalaman belajar yang bermakna. Membangun teknologi yang berdampak.',
  summary:
    'Lulusan S1 Pendidikan Guru Sekolah Dasar Universitas Achmad Yani Banjarmasin dengan predikat Cum Laude. Memadukan pengalaman pendidikan, pengembangan media pembelajaran, dan pembuatan produk digital untuk mendukung pembelajaran serta tata kelola sekolah.',
  links: {
    dinoEdu: 'https://dinoedu-space.pahrudinor14.workers.dev/',
    school: 'https://mialmuhajirinkm6.sch.id/',
    sip: 'https://sip.mialmuhajirinkm6.sch.id/',
    github: 'https://github.com/mialmuhajirinkm6/sip-mis-al-muhajirin',
    linkedin: '',
  },
};

export type ProjectCategory = 'Digital' | 'Education' | 'Research';

export const projects: Array<{
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  href: string;
  cta: string;
  visual: 'space' | 'land' | 'ocean' | 'coral' | 'sun';
  logo?: string;
}> = [
  {
    id: 'dinoedu', number: '01', title: 'DinoEdu Space', eyebrow: 'EDUCATION PLATFORM',
    description: 'Platform digital yang menghubungkan alat bantu AI pendidikan, komik belajar DinoMath, dan komunitas NUMEA EDU.',
    category: 'Education', tags: ['AI for Education', 'DinoMath', 'NUMEA EDU'],
    href: profile.links.dinoEdu, cta: 'Jelajahi produk', visual: 'space', logo: 'dinoedu-logo.png',
  },
  {
    id: 'sip', number: '02', title: 'SIP MIS Al Muhajirin', eyebrow: 'SCHOOL INFORMATION SYSTEM',
    description: 'Sistem informasi perpustakaan dan pembelajaran untuk mendukung pengelolaan layanan sekolah secara digital, dari pengalaman pengguna hingga alur administrasi.',
    category: 'Digital', tags: ['React', 'Supabase', 'School System'],
    href: profile.links.sip, cta: 'Buka sistem', visual: 'ocean', logo: 'sip-mis-logo.png',
  },
  {
    id: 'mis-website', number: '03', title: 'Website MIS Al Muhajirin', eyebrow: 'SCHOOL WEBSITE',
    description: 'Website sekolah yang merangkum profil, informasi akademik, program, berita, galeri, dan informasi penerimaan peserta didik dalam satu kanal publik.',
    category: 'Digital', tags: ['Web Development', 'School Profile', 'Responsive UI'],
    href: profile.links.school, cta: 'Kunjungi website', visual: 'land', logo: 'mis-almuhajirin-logo.png',
  },
  {
    id: 'komi', number: '04', title: 'KoMI', eyebrow: 'SCHOOL COOPERATIVE MANAGEMENT',
    description: 'Konsep dan aplikasi manajemen koperasi sekolah untuk membantu pencatatan transaksi, stok, pembelian, penjualan, pemasukan, pengeluaran, dan pelaporan.',
    category: 'Digital', tags: ['APK', 'EXE', 'Inventory & Reporting'],
    href: '#contact', cta: 'Diskusikan proyek', visual: 'coral', logo: 'komi-logo.png',
  },
  {
    id: 'dinomath', number: '05', title: 'DinoMath', eyebrow: 'INTERACTIVE LEARNING MEDIA',
    description: 'Komik matematika interaktif “DinoMath: Serunya Belajar Pecahan” untuk siswa kelas IV SD, menggabungkan cerita, visual, aktivitas, dan akses kuis digital.',
    category: 'Education', tags: ['Learning Media', 'Mathematics', 'Quizizz'],
    href: '#contact', cta: 'Lihat ringkasan karya', visual: 'sun', logo: 'dinomath-logo.png',
  },
  {
    id: 'research', number: '06', title: 'Riset & Publikasi Pendidikan', eyebrow: 'RESEARCH & PUBLICATION',
    description: 'Kegiatan penelitian pengembangan media pembelajaran dan pengalaman editorial jurnal, termasuk pemeriksaan naskah, metadata, DOI, dan proses publikasi.',
    category: 'Research', tags: ['R&D', 'Academic Writing', 'Journal Workflow'],
    href: '#experience', cta: 'Lihat pengalaman', visual: 'space',
  },
];

export const skillGroups = [
  {
    number: '01', title: 'Pendidikan & Pembelajaran', subtitle: 'DESIGN LEARNING THAT MATTERS',
    skills: ['Perangkat pembelajaran', 'Media pembelajaran', 'Literasi & numerasi', 'Riset pendidikan', 'Pembelajaran kontekstual'],
  },
  {
    number: '02', title: 'Teknologi & Pengembangan', subtitle: 'BUILD USEFUL DIGITAL TOOLS',
    skills: ['React & Vite', 'JavaScript / TypeScript', 'HTML & CSS', 'Supabase & basis data', 'GitHub & deployment'],
  },
  {
    number: '03', title: 'Kreatif & Kolaborasi', subtitle: 'MAKE IDEAS CLEAR',
    skills: ['Canva', 'Procreate', 'CapCut', 'Quizizz & Kahoot', 'Wordwall & Educaplay', 'Komunikasi tim'],
  },
];

export const experiences = [
  {
    period: '2026 — sekarang', type: 'EDITORIAL', title: 'Editorial Assistant / Editor Jurnal', place: 'Sultan Adam · Aducorio · JIS',
    detail: 'Mendukung pengelolaan naskah, pemeriksaan kelengkapan, metadata, DOI, dan persiapan publikasi artikel melalui workflow OJS.',
  },
  {
    period: '2024 — 2025', type: 'KOMUNIKASI DIGITAL', title: 'Menteri Kominfo BEM', place: 'Universitas Achmad Yani Banjarmasin',
    detail: 'Mengelola publikasi dan dokumentasi digital, menyiapkan konten organisasi, serta membantu promosi kegiatan dan kolaborasi dengan mitra.',
  },
  {
    period: '2024', type: 'PENGABDIAN PENDIDIKAN', title: 'Ketua Kelompok Kampus Mengajar Angkatan 8', place: 'Sekolah Dasar · Banjarmasin',
    detail: 'Mengoordinasikan program literasi, numerasi, adaptasi teknologi, dan berbagi praktik penggunaan media digital bersama guru.',
  },
  {
    period: '2024', type: 'PERTUKARAN MAHASISWA', title: 'Pertukaran Mahasiswa Merdeka Angkatan 4', place: 'Universitas Islam Makassar (PTI)',
    detail: 'Mengikuti pembelajaran lintas kampus dan kegiatan pengenalan keberagaman budaya, termasuk kontribusi pada daerah dan pendidikan.',
  },
];

export const education = [
  { period: '2022 — 2026', title: 'Pendidikan Guru Sekolah Dasar', place: 'Universitas Achmad Yani Banjarmasin', note: 'Sarjana' },
  { period: '2019 — 2022', title: 'MIPA', place: 'MAS Darussalam Awayan', note: 'Pendidikan menengah' },
];

export const publications = [
  'Inovasi Media Pembelajaran: Mengembangkan DinoMath, komik matematika interaktif berhak cipta untuk pembelajaran pecahan siswa SD.',
  'Kontribusi Ilmiah: Mempublikasikan penelitian pengembangan media komik matematika interaktif di Pendas: Jurnal Ilmiah Pendidikan Dasar (SINTA 4).',
  'Transformasi Digital Pendidikan: Merancang dan mengembangkan website sekolah, sistem informasi perpustakaan dan pembelajaran, aplikasi KoMI, serta platform edukasi DinoEdu Space.',
];
