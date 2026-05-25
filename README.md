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

Karena proyek ini 100% *Vanilla Front-end*, instalasi sangat mudah:

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/amureftrh/SSC-Typing.git
   ```
2. Buka folder proyek.
3. Jalankan file `index.html` menggunakan browser modern apa pun (Chrome, Firefox, Safari, Edge, Zen Browser).
   - *Tip:* Anda juga dapat menggunakan ekstensi **Live Server** di VS Code untuk pengalaman pengembangan yang lebih baik (Otomatis *refresh* setiap menyimpan perubahan).

---

## ⌨️ Pintasan (*Shortcuts*)

- Mulai Mengetik: Cukup ketik huruf apa saja, tes akan berjalan secara otomatis.
- **`Esc`**: Menghentikan tes secara instan (jika tes sedang berjalan).
- **`Esc`**: Memulai ulang / *reset* tes (jika sedang tidak ada tes yang berjalan / hasil sedang ditampilkan).

---

## 🛠️ Arsitektur Kode

- **`index.html`**: Struktur semantik kerangka aplikasi.
- **`style.css`**: Sistem desain absolut. Menggunakan variabel CSS untuk manajemen tema, kueri ukuran *container*, dan animasi performa tinggi (*hardware-accelerated CSS properties*).
- **`script.js`**: Otak aplikasi. Terbagi ke dalam state machine, DOM selector, modul waktu, modul penghitung statistik, dan penganan input *focus-trap* asinkron.

---

## 📝 Lisensi

Aplikasi TypeFlow ini bersifat terbuka (*open-source*) dan bebas untuk dipelajari, dimodifikasi, dan dikembangkan lebih lanjut.
