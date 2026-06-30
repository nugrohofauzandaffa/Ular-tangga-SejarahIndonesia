# Integration Report - Phase 7.9

Laporan ini mendokumentasikan proses integrasi antara komponen antarmuka (*React Components*) dengan Modul *Business Logic* (Game Engine) pada *Phase 7.9*.

## Komponen yang Diintegrasikan

1. **GameLayout (Main Container)**
   Bertindak sebagai *Single Source of Truth* (SSOT) yang menyimpan status utama aplikasi (`GameState`). Layout ini mendistribusikan data dari *Game Engine* ke seluruh komponen presentasional.

2. **Dice Component & `useDice` Hook**
   Dadu tidak lagi mengkalkulasi nilainya sendiri secara independen. Angka dadu sesungguhnya ditentukan oleh `rollDice()` di dalam `gameEngine.ts`. Saat pemain mengeklik dadu, antarmuka hanya akan beranimasi, dan `GameLayout` akan menginjeksi angka barunya.

3. **Board & Tile Component**
   Komponen `Board.tsx` kini bersifat sepenuhnya *dumb component*. Data peta `tiles` dan letak pion `players` dikirim murni melalui props `GameLayout`. `Board.tsx` tidak lagi mengambil langsung dari *folder data*.

4. **HUD Component**
   `HUD.tsx` secara proaktif bereaksi terhadap prop `activePlayer`. Ketika giliran berganti (berkat logika `turnManager`), HUD akan menampilkan profil pemain yang sedang aktif beserta perubahan nilainya.

5. **Quiz Modal Component**
   Menerima fungsi *callback* `onSubmit`. Saat pemain menekan tombol "Jawab", *modal* akan menampilkan hasil visual melalui *Quiz Module*, dan secara bersamaan memicu pembaruan *state* sentral di `GameLayout` via `submitQuizAnswer` agar skor pemain ditambahkan/dikurangi di *Game Engine*.

6. **Result Screen Component**
   Terintegrasi untuk membaca properti `gameState.gameStatus === 'finished'`. Hasilnya murni bersumber dari susunan papan peringkat dan pemain yang telah ditetapkan oleh *Game Engine* sesaat setelah pion mencapai garis finis.

## Alur Data dari Game Engine ke UI

Sistem menggunakan alur data searah (*Unidirectional Data Flow*):
1. **Aksi**: Pemain berinteraksi dengan komponen (misal: mengeklik tombol dadu).
2. **GameLayout Handler**: `GameLayout` merespons *event* dengan memanggil fungsi modul *Game Engine* terkait (seperti `processTurn`).
3. **Engine Processing**: `processTurn` mengkalkulasi perpindahan, mengeksekusi kotak acara (seperti kuis), memperbarui skor, mengubah giliran, dan mengembalikan objek `GameState` yang baru (*immutable*).
4. **State Update**: `GameLayout` memanggil fungsi `setGameState` dari React Hook.
5. **UI Rendering**: Seluruh komponen anakan (`Dice`, `Board`, `HUD`, `QuizModal`, `ResultScreen`) menerima *props* yang diperbarui dan merender ulang tampilan sesuai dengan spesifikasi terbaru dari *Game Engine*.

## Kendala yang Ditemukan dan Solusi

- **Kendala**: Terdapat potensi duplikasi logika antara state animasi dadu `useDice` dengan state permainan `diceState`.
  - **Solusi**: Menyederhanakan penanganan dadu murni di *handler* `handleRollDice` di dalam `GameLayout`. Memakai fungsi `setTimeout` untuk menampung masa transisi animasi (getar dadu) di UI sebelum hasil kalkulasi dari `processTurn` di-apply secara instan ke state komponen.
- **Kendala**: *Quiz Modal* sebelumnya didesain terpisah dengan *callback* validasi internal dan belum ada jembatan skor ke *Game Engine*.
  - **Solusi**: Membuat pemisahan *prop* di `QuizModal.tsx` menjadi `onSubmit(answer)` yang diteruskan ke atas, dan validasi tampilan kuis menggunakan *Quiz Module* yang sama, sehingga saat tombol jawab ditekan, secara asinkron `submitQuizAnswer` menyetel poin pemain di dalam *Game Engine*, dan pemain bisa membaca penjelasan di modal sebelum mengklik "Lanjutkan Permainan".
