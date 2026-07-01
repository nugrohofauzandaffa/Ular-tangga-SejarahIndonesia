# 🎲 Ular Tangga Sejarah Indonesia

**"Membawa Sejarah ke Meja Bermain: Edukasi Tanpa Bosan, Kompetisi Penuh Kejutan"**

Ular Tangga Sejarah Indonesia bukanlah sekadar adaptasi digital dari papan permainan klasik. Ini adalah proyek **EdTech Gamification** yang menyuntikkan nyawa kompetitif ke dalam pelajaran sejarah yang selama ini dianggap membosankan. 

Game ini merevolusi konsep *keberuntungan murni (pure luck)* menjadi permainan **strategi dan pengetahuan**. Di sini, mencapai petak terakhir tidak menjamin kemenangan jika pemain miskin wawasan sejarah. Dengan mekanik Kuis Trivia, Sistem MVP, Fase Krisis (Catch-up Mechanic), serta beragam *Buff* dan *Debuff*, game ini menawarkan *replayability* (daya main ulang) yang sangat tinggi.

---

## 🚀 Fitur Utama (Core Features)

1. **Sistem Mode Bermain**
   - **Multiplayer Lokal (Pass-and-Play)**: Hingga 4 pemain dalam 1 perangkat (Tablet/PC/Smartphone). Sangat cocok untuk acara keluarga, waktu luang di sekolah, atau *ice-breaking*.
   - **AI Bot Opponent**: Pemain tunggal dapat bermain melawan Bot komputer cerdas yang akan merespon dan melempar dadu secara otomatis.

2. **Kuis Sejarah Berjenjang (Trivia System)**
   - Petak di papan bukan hanya berisi ular atau tangga, melainkan petak Kuis. Kuis terbagi menjadi 4 level (*Easy, Medium, Hard, Extreme*). Menjawab benar memberikan poin besar, menjawab salah mengurangi poin.

3. **Mekanik MVP & Keadilan Bermain**
   - Menginjak petak 100 bukan akhir segalanya. Jika poin pemain lebih rendah dari lawannya, ia akan terpental kembali.
   - **Fase Krisis**: Pemain yang tertinggal akan mendapat bantuan sementara (seperti penangkal racun ular) untuk menyeimbangkan kompetisi dan mencegah rasa bosan.

4. **Ekosistem Efek (Buff & Debuff)**
   - 🛡️ **Anti-Snake (Tameng)**: Menahan gigitan ular.
   - 🎲 **Double Roll**: Giliran tambahan instan.
   - 🥷 **Steal Point**: Mencuri poin dari pemain peringkat satu.
   - ⛓️ **Absolute Roll**: Kecepatan dadu dibatasi (maksimal 4).
   - 📉 **Decreased Roll**: Dadu terpotong 2 langkah akibat kelelahan.
   - 🚫 **Silence**: Kehilangan giliran.

5. **Dynamic HUD & Leaderboard**
   - Antarmuka permainan modern dengan sistem Klasemen Sementara secara langsung (*real-time*) di layar perangkat Desktop dan Mobile.

---

## 🛠️ Stack Teknologi (Under the Hood)

Proyek ini dibangun menggunakan standar web modern:
- **Next.js 16 (React)**: Arsitektur UI berbasis komponen yang sangat modular dan optimal.
- **Tailwind CSS**: Desain UI/UX yang dinamis, animasi halus (*smooth*), efek *glassmorphism*, tanpa *file* CSS raksasa.
- **TypeScript**: Kepastian tipe data untuk Game Engine yang aman.
- **Client-Side Pure**: Seluruh logika permainan dan penyimpanan riwayat (kuis, turn, efek) berjalan 100% di peramban pengguna (*browser*) tanpa membebani server eksternal, membuat game ini _zero latency_.

---

## 💻 Panduan Menjalankan Secara Lokal (Local Setup)

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terpasang di komputer Anda.

1. **Klon atau unduh repositori ini** ke komputer Anda.
2. Buka terminal (CMD/PowerShell/Terminal) di dalam folder proyek.
3. **Instal dependensi** dengan perintah:
   ```bash
   npm install
   ```
4. **Jalankan server pengembangan** dengan perintah:
   ```bash
   npm run dev
   ```
5. Buka peramban (browser) dan akses alamat: [http://localhost:3000](http://localhost:3000)

_**Catatan Error Next.js:** Jika Anda mendapatkan pesan error `Blocked cross-origin resource HMR` saat menjalankan server dev, silakan mematikan server dengan menekan `Ctrl+C`, lalu ulangi jalankan `npm run dev`._

> *Game ini membuktikan bahwa edukasi tidak harus kaku, dan pelajaran sejarah bisa disulap menjadi medan kompetisi adu cerdas yang penuh tawa dan strategi.*
