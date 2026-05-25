# TypeFlow (SSC-Typing) ⌨️

TypeFlow adalah sebuah aplikasi tes dan latihan mengetik 10 jari (*touch typing*) modern berbasis web. Terinspirasi oleh antarmuka profesional seperti MonkeyType, aplikasi ini dibangun **sepenuhnya menggunakan Vanilla HTML, CSS, dan JavaScript** murni tanpa ketergantungan pada library atau framework eksternal apa pun.

Aplikasi ini menonjolkan desain *glassmorphism* modern, kinerja kilat, serta pengalaman pengguna (*user experience*) yang bebas gangguan (termasuk optimalisasi khusus untuk mencegah bug fokus di berbagai browser seperti Chrome, Firefox, dan Zen Browser).

---

## ✨ Fitur Utama

- **Desain Modern & UI Fluid**: Menggunakan arsitektur spasial, *glassmorphism*, dan transisi mulus.
- **Sistem Scrolling Pintar (MonkeyType Style)**: Baris aktif akan selalu terjaga di tengah layar (baris ke-2 dari 3 baris yang terlihat). Scroll hanya terjadi saat Anda memasuki baris baru, tanpa *jitter* berkat kalkulasi matriks yang presisi.
- **Fokus Anti-Gangguan (*Hidden Focus Trap*)**: Fitur level industri untuk memastikan *keyboard event* (seperti `Tab` atau `Space`) tidak akan pernah "bocor" ke UI browser, memastikan tes berjalan aman meski digunakan pada browser dengan *sidebar* ekstensif.
- **Virtual Keyboard Real-time**: Visualisasi tuts keyboard di layar yang menyala sinkron dengan ketikan fisik Anda. Membantu *muscle memory* tanpa harus melihat ke keyboard fisik.
- **Metrik Komprehensif**: Menghitung secara real-time:
  - **WPM** (Kata per menit)
  - **Akurasi** (%)
  - Rincian karakter (Benar / Salah / Ekstra)
- **Multi-Bahasa**: Mendukung kosakata Bahasa Inggris (`EN`) dan Bahasa Indonesia (`ID`).
- **Mode Berbeda**: Tersedia tes berdasarkan durasi waktu standar (15s, 30s, 60s, dsb.) serta mode tantangan / permainan tak terbatas.
- **Grafik Performa**: Menampilkan metrik visual fluktuasi WPM sepanjang tes menggunakan elemen `<canvas>`.
- **Dukungan Tema Dinamis**: Sistem beralih (Toggle) responsif antara Mode Terang (*Light Mode*) dan Mode Gelap (*Dark Mode*).

---

## 🚀 Cara Menjalankan

Karena proyek ini menggunakan fitur canggih **ES Modules** bawaan JavaScript standar, alasan keamanan browser (*CORS policy*) mengharuskan file HTML diakses melalui server lokal HTTP, bukan sekadar klik dua kali (`file://`).

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/amureftrh/SSC-Typing.git
   ```
2. Buka folder proyek di **Visual Studio Code**.
3. Pastikan Anda sudah menginstal ekstensi **Live Server**.
4. Klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.
5. Browser akan terbuka otomatis di alamat `http://localhost:5500` atau sejenisnya.

---

## ⌨️ Pintasan (*Shortcuts*)

- Mulai Mengetik: Cukup ketik huruf apa saja, tes akan berjalan secara otomatis.
- **`Esc`**: Menghentikan tes secara instan (jika tes sedang berjalan).
- **`Esc`**: Memulai ulang / *reset* tes (jika sedang tidak ada tes yang berjalan / hasil sedang ditampilkan).

---

## 🛠️ Arsitektur Kode

Aplikasi ini menggunakan pola arsitektur **Modular ES6** murni untuk memastikan kode dapat dikelola dengan standar industri, tanpa *bundler* seperti Webpack:

- **`index.html`**: Struktur semantik kerangka aplikasi.
- **`style.css`**: Sistem desain absolut dengan manajemen tema dinamis dan animasi performa tinggi.
- **`js/`**:
  - `main.js`: *Entry point*, merangkum seluruh inisiasi sistem dan interaksi *event listener*.
  - `engine.js`: Inti logika permainan, meliputi generator kata, sistem perhitungan *timer*, dan kalkulasi animasi matriks *scrolling*.
  - `state.js`: Manajemen *state* aplikasi murni.
  - `dom.js`: Sentralisasi seleksi semua elemen Document Object Model.
  - `chart.js`: Renderer khusus untuk melukis grafik analitik ke dalam `<canvas>` tanpa menggunakan pustaka eksternal.
  - `keyboard.js`: Animasi dan fungsionalitas tuts virtual 10-jari.
  - `ui.js`: Pengelola *feedback* visual mikro (animasi skor, efek lampu indikator).
  - `data.js`: Bank data kosa kata dan peta pemetaan tombol.

---

## 📝 Lisensi

Aplikasi TypeFlow ini bersifat terbuka (*open-source*) dan bebas untuk dipelajari, dimodifikasi, dan dikembangkan lebih lanjut.
