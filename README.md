# 🎲 Ular Tangga Sejarah Indonesia

**"Membawa Sejarah ke Meja Bermain: Edukasi Tanpa Bosan, Kompetisi Penuh Kejutan"**

**Ular Tangga Sejarah Indonesia** bukanlah sekadar adaptasi digital dari papan permainan klasik. Ini adalah proyek **EdTech Gamification** yang menyuntikkan nyawa kompetitif ke dalam pelajaran sejarah yang selama ini kerap dianggap monoton. 

Proyek ini diciptakan untuk mendisrupsi cara tradisional dalam belajar sejarah. Alih-alih menghafal buku secara pasif, pemain diajak masuk ke dalam medan pertempuran intelektual. Melalui konsep *active recall* (memaksa otak mengingat informasi saat di bawah tekanan kuis dan kompetisi), pemain dapat mempelajari sejarah kemerdekaan hingga budaya Nusantara sambil tertawa, meracik strategi, dan menantang teman atau keluarga.

---

## 🎯 1. Tujuan Permainan (The Goal)
Permainan ini merevolusi konsep *keberuntungan murni (pure luck)* menjadi permainan **strategi dan pengetahuan**. 

Di sini, **mencapai petak ke-100 bukanlah jaminan kemenangan, melainkan pemicu berakhirnya permainan**. Ketika seorang pemain menginjak petak 100, permainan langsung berhenti, dan pemain tersebut dianugerahi *Grand Finish Bonus* (+100 Poin). Namun, sang Juara Utama (Pemenang) sejati ditentukan secara mutlak oleh **Total Poin (Skor) tertinggi**. Keberhasilan bergantung pada seberapa pandai pemain memadukan kecepatan langkah, akurasi menjawab kuis, dan kejelian memanfaatkan status efek (Buff/Debuff) yang ada.

---

## 🚀 2. Fitur & Mekanisme Utama (Game Mechanics)

1. **Sistem Mode Bermain Beragam**
   - **Multiplayer Lokal (Pass-and-Play)**: Mainkan hingga 4 orang dalam 1 layar/perangkat. Sangat cocok untuk *ice-breaking* atau sesi belajar kelompok.
   - **AI Bot Opponent**: Uji wawasan Anda melawan Bot komputer yang mampu mengambil giliran secara otomatis.

2. **Kuis Sejarah Terintegrasi (Active Recall)**
   - Saat mendarat di petak tertentu, pemain akan dihadapkan pada kuis trivia sejarah (tersedia dalam berbagai level: *Easy, Medium, Hard, Extreme*).
   - Jawaban benar memberikan poin, jawaban salah akan memberikan sanksi/pengurangan poin.

3. **Dynamic Buff & Debuff (Status Efek)**
   - Game ini memperkenalkan elemen *RPG-lite* di mana pemain dapat terkena status efek (mendukung *stacking* intensitas maupun durasi giliran):
     - **Buff (Keuntungan):** *Anti-Snake* (kebal ular), *Cendekiawan* (pengganda poin kuis), *Double Roll* (lempar dadu lagi), dan *Mesin Waktu*.
     - **Debuff (Kerugian):** *Pajak Kolonial* (pengurangan poin setiap awal giliran), *Silence* (kehilangan giliran), *Amnesia Sejarah* (berjalan mundur), dan *Kelelahan* (penalti maksimal dadu).

4. **Fase Krisis (Endgame Tension)**
   - Begitu ada pemain yang menginjak **petak 91**, sistem alarm berbunyi dan papan permainan akan membara kemerahan. Ini menandakan *Fase Krisis*, di mana peluang munculnya kuis dan *debuff* berbahaya melonjak drastis, membuat perebutan garis akhir semakin sengit.

5. **Sistem Gelar Anti-Monopoli (Post-Match Result)**
   - Agar permainan tetap apresiatif, ketika permainan berakhir, gelar-gelar khusus akan didistribusikan secara adil dan pintar melalui algoritma *tie-breaker*:
     - 🏆 **Juara Utama:** Pemain dengan poin akhir terbanyak.
     - 🏃 **Fastest Explorer:** Pemain pertama yang mencapai petak 100.
     - 🧠 **History Master:** Pemain dengan kuantitas jawaban kuis benar terbanyak.
     - 🎯 **The Sharpshooter:** Pemain dengan persentase akurasi jawaban terbaik (minimal telah menjawab 3 kuis).
   - *Bypass Skenario*: Jika sang Juara juga memegang gelar *Fastest Explorer*, gelarnya hanya disematkan di piala utamanya, membebaskan slot *Special Achievement* di bawahnya untuk diberikan kepada juara kedua (Peringkat Runner-Up Kuis atau Akurasi), menghindari monopoli penghargaan oleh 1 orang.

6. **Thematic Experience & Dynamic HUD**
   - Mengusung UI/UX modern *glassmorphism* dengan sistem animasi transisi yang mulus.
   - Papan klasemen *real-time* (dengan indikator status efek dan akurasi).
   - Tersedia pengubahan **Theme (Tema Visual & Audio)**, seperti *Tema Klasik* hingga *Jakarta Heritage* (ornamen bernuansa Betawi dengan alat musik tradisional).

---

## 🛠️ 3. Stack Teknologi (Under the Hood)

Proyek ini dibangun sepenuhnya menggunakan standar web modern dan dirancang dengan arsitektur bebas hambatan (*client-side pure*):
- **Next.js 16 (React)**: Arsitektur UI berbasis komponen yang sangat modular dan optimal.
- **Tailwind CSS**: Pengaturan desain utilitas untuk animasi halus (*smooth transitions*), sistem grid responsif, adaptasi untuk semua jenis layar (*lock viewport*).
- **TypeScript**: Kepastian pengetikan data (*type safety*) tinggi untuk kalkulasi Game Engine dan manajemen *State*.
- **Client-Side Pure (Zero Latency)**: Seluruh logika putaran (*turn*), kalkulasi pergerakan *pathfinding*, dan efek status berjalan 100% secara instan di peramban pengguna tanpa panggilan *server API* eksternal.

---

## 💻 4. Panduan Menjalankan Secara Lokal (Local Setup)

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terpasang di komputer/laptop Anda.

1. **Klon atau unduh repositori ini** ke direktori lokal Anda.
2. Buka aplikasi Terminal (Command Prompt / PowerShell / Terminal Mac) di dalam folder proyek tersebut.
3. **Instal dependensi** dengan perintah:
   ```bash
   npm install
   ```
4. **Jalankan server pengembangan lokal** dengan perintah:
   ```bash
   npm run dev
   ```
5. Buka peramban (browser) dan akses alamat: [http://localhost:3000](http://localhost:3000)

_**Catatan Error Next.js:** Jika Anda mendapatkan pesan error `Blocked cross-origin resource HMR` secara berulang saat menjalankan server dev, silakan mematikan server dengan menekan `Ctrl+C` di terminal, lalu ulangi perintah `npm run dev`._

---

> *"Game ini membuktikan bahwa edukasi tidak harus kaku, dan pelajaran sejarah bisa disulap menjadi medan kompetisi adu cerdas yang penuh tawa, strategi, dan apresiasi positif."*
