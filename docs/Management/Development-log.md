# Development Log

## [Phase 4 & 5] - TypeScript Interfaces & Dummy Data

- **Phase**: Phase 4 & 5
- **File yang dibuat atau diubah**:
  - `src/types/player.ts`
  - `src/types/board.ts`
  - `src/types/question.ts`
  - `src/types/fact.ts`
  - `src/types/gameState.ts`
  - `src/data/questions.ts`
  - `src/data/facts.ts`
  - `src/data/board.ts`
  - `src/data/snakes.ts`
  - `src/data/ladders.ts`
- **Alasan Perubahan**:
  - Phase 4: Diperlukan untuk mendefinisikan kontrak tipe data yang ketat (strict typing) berdasarkan Domain Model agar sistem aman dari runtime error.
  - Phase 5: Diperlukan untuk memasok data dummy (karena MVP bersifat *client-side* tanpa database) agar game board dapat dibangun dan dirender, serta menyediakan konten soal edukasi sejarah.
- **Dampak Perubahan**:
  - Membuka jalan bagi implementasi *Game Engine* (Phase 6) dan *React Components* (Phase 7). Engine dan UI sekarang memiliki kepastian bentuk data dan nilai awal untuk dikonsumsi.
- **Status**: Completed

## [Phase 6.1] - Dice Module

- **Phase**: Phase 6.1
- **File yang dibuat atau diubah**:
  - `src/lib/dice.ts`
  - `src/hooks/useDice.ts`
  - `src/components/dice/Dice.tsx`
  - `src/components/dice/Dice.module.css`
- **Alasan Perubahan**:
  - Diperlukan untuk mensimulasikan lemparan dadu. Pemecahan menjadi 3 layar (Logic, State/Hook, UI) ditujukan untuk mematuhi aturan arsitektur di mana UI tidak boleh berisi algoritma.
- **Dampak Perubahan**:
  - Sistem pengacakan angka dadu sekarang dapat diakses secara mandiri tanpa tergantung pada Game Engine utama. State pengacakan (`isRolling`) dapat dibaca UI untuk memutar animasi getar (*shake*).
- **Status**: Waiting Review

## [Phase 6.2] - Movement Module

- **Phase**: Phase 6.2
- **File yang dibuat atau diubah**:
  - `src/lib/movement.ts`
- **Alasan Perubahan**:
  - Diperlukan untuk menghitung perpindahan posisi pemain berdasarkan posisi saat ini dan nilai dadu. Module ini diimplementasikan agar Game Engine dapat mengeksekusi pergerakan pion secara independen, memisahkan logika dari UI sesuai arsitektur.
- **Dampak Perubahan**:
  - Game Engine sekarang bisa memanggil fungsi `calculateMovement` untuk menentukan ke mana pion harus bergerak, serta mendeteksi apakah pemain telah mencapai garis akhir (menang) atau gagal melangkah karena lemparan dadu melebihi batas petak terakhir.
- **Status**: Waiting Review

## [Phase 6.3] - Score Module

- **Phase**: Phase 6.3
- **File yang dibuat atau diubah**:
  - `src/lib/score.ts`
- **Alasan Perubahan**:
  - Diperlukan modul sentral untuk memproses penambahan, pengurangan, serta perhitungan ulang skor total pemain berdasarkan jumlah benar atau salah.
- **Dampak Perubahan**:
  - Modul ini memastikan manipulasi skor terpusat dalam *Business Logic* murni tanpa melibatkan dependensi dari antarmuka pengguna (UI). Game Engine maupun Quiz Module dapat memanfaatkan fungsi-fungsi ini nantinya.
- **Status**: Waiting Review

## [Phase 6.4] - Quiz Module

- **Phase**: Phase 6.4
- **File yang dibuat atau diubah**:
  - `src/lib/quiz.ts`
- **Alasan Perubahan**:
  - Diperlukan untuk mengelola logika kuis, termasuk pengambilan data soal berdasarkan ID dan memvalidasi jawaban pemain secara independen sesuai prinsip pemisahan *Business Logic* dari UI.
  - (Revisi): Mengimplementasikan *Dependency Injection* pada fungsi `getQuestionById` dan `validateAnswer` agar modul tidak *tightly coupled* dengan sumber data internal, sehingga mudah untuk ditesting dan disesuaikan di masa mendatang. Interface diubah menjadi `QuizResult`.
- **Dampak Perubahan**:
  - Modul *Tile Resolver* atau *Game Engine* utama sekarang dapat memanggil modul kuis untuk menyajikan pertanyaan dan memvalidasi kebenaran jawaban pemain yang akan menentukan jalannya permainan selanjutnya tanpa memanipulasi skor atau pergerakan pemain di modul ini.
- **Status**: Completed

## [Phase 6.5] - Tile Resolver Module

- **Phase**: Phase 6.5
- **File yang dibuat atau diubah**:
  - `src/lib/tileResolver.ts`
- **Alasan Perubahan**:
  - Diperlukan untuk menerjemahkan posisi pemain atau tipe *Tile* menjadi event yang spesifik. Diperlukan agar *Game Engine* tahu persis apa yang harus dilakukan setelah pemain bergerak tanpa mencampurkan semua kondisi (seperti pengecekan kuis, tangga, atau fakta) di satu fungsi raksasa. 
  - (Revisi): Properti `message` dan `actionRequired` dihapus dari *Business Logic* agar pengolahan logika lebih efisien, membiarkan *Game Engine* menyimpulkan *action* yang diperlukan murni berdasarkan `type`. Properti `effectValue` dibuat eksplisit menjadi `destination` untuk posisi perpindahan ular/tangga dan `scoreDelta` untuk perubahan nilai skor bonus/penalti.
- **Dampak Perubahan**:
  - *Game Engine* sekarang dapat memasukkan data *Tile* (beserta data `snakes` dan `ladders` jika perlu) ke modul ini dan akan menerima kembali objek konfigurasi instruksi (`TileEvent`) yang mengarahkan alur permainan (apakah harus membuka modal kuis, menampilkan fakta, memindahkan posisi ke ular/tangga, atau sekadar memberikan bonus).
- **Status**: Completed

## [Phase 6.6] - Turn & Win Condition Module

- **Phase**: Phase 6.6
- **File yang dibuat atau diubah**:
  - `src/lib/turnManager.ts`
- **Alasan Perubahan**:
  - Diperlukan untuk mengatur sirkulasi giliran antar pemain (*circular turn*) dan memeriksa apakah seorang pemain telah mencapai kondisi kemenangan (menyentuh petak terakhir).
  - (Revisi): Fungsi `advanceTurn` direvisi untuk hanya mengembalikan tipe `string` berupa ID pemain selanjutnya (daripada objek Player) untuk mengurangi tingkat *coupling* antar modul dan menjadikan tipe data yang keluar-masuk lebih sederhana.
- **Dampak Perubahan**:
  - *Game Engine* kini memiliki modul independen untuk memutar giliran dari satu pemain ke pemain lain berdasarkan urutan dalam array, serta bisa dengan mudah memverifikasi jika permainan sudah selesai. Pemisahan fungsi ini menjaga modul engine tetap ringkas.
- **Status**: Completed

## [Phase 6.7] - Main Game Engine Facade

- **Phase**: Phase 6.7
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
  - `src/types/gameState.ts` (menambahkan status 'showing_quiz_result')
- **Alasan Perubahan**:
  - Diperlukan untuk menyatukan (orkestrasi) seluruh logika bisnis dari sub-modul (Dice, Score, Movement, Quiz, Tile Resolver, Turn Manager) ke dalam satu alur permainan yang utuh berdasarkan cetak biru *pseudocode* yang disepakati. Mengakomodasi kebutuhan jeda antara giliran untuk interaksi antarmuka (UI).
- **Dampak Perubahan**:
  - Fasad *Game Engine* kini terbentuk. UI tidak perlu lagi memanggil modul logika secara individu. UI hanya perlu memberikan injeksi data statis dan memanggil fungsi `processTurn`, `submitQuizAnswer`, `acknowledgeQuizResult`, atau `acknowledgeFact` yang otomatis mengembalikan state game terbaru (immutable). Dengan selesainya modul ini, **Phase 6 secara keseluruhan telah tuntas**.
- **Status**: Waiting Review
