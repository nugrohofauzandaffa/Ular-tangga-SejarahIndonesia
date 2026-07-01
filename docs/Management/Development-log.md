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

## [Phase 7.1] - Layout System

- **Phase**: Phase 7.1
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/app/page.tsx`
- **Alasan Perubahan**:
  - Diperlukan untuk merancang fondasi struktur layout utama yang memisahkan tata letak komponen antara Desktop dan Mobile sesuai dokumen `UX-Design.md` dan `Architecture.md`.
- **Dampak Perubahan**:
  - Mempersiapkan area peletakan komponen-komponen React selanjutnya (Board, HUD, Roll Dice) dalam grid atau flex layout yang responsif tanpa perlu khawatir menumpuk, serta menyediakan area sticky bottom panel untuk interaksi Mobile.
- **Status**: Waiting Review

## [Phase 7.2] - Board Component

- **Phase**: Phase 7.2
- **File yang dibuat atau diubah**:
  - `src/components/Board.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Diperlukan untuk merender papan permainan 10x10 menggunakan data asli dari `src/data/board.ts` dan mengganti area *placeholder* di dalam `GameLayout`.
- **Dampak Perubahan**:
  - Papan permainan kini tampil dengan 100 *tile* yang diurutkan dengan pola zig-zag (kiri-ke-kanan, kanan-ke-kiri). Setiap petak sudah memiliki indikator visual dasar terkait posisinya dan tipe petaknya (Quiz, Fact, Bonus, Penalty, dsb). Selain itu, komponen ini juga telah disiapkan untuk area peletakan bidak pemain (Player Token) serta *layer SVG overlay* untuk jalur ular dan tangga yang akan dikembangkan pada fase selanjutnya.
- **Status**: Waiting Review

## [Bugfix] - Fix Module Import Paths

- **Phase**: Bugfix (Phase 7.2 context)
- **File yang dibuat atau diubah**:
  - `src/data/papan/board.ts`
- **Alasan Perubahan**:
  - Terdapat error "Cannot find module '@/data/snakes'" karena file `snakes.ts` dan `ladders.ts` sebenarnya berada di dalam folder `src/data/events/`, bukan langsung di dalam `src/data/`.
- **Dampak Perubahan**:
  - Komponen `Board.tsx` (dan dependensi lainnya) sekarang dapat meng-compile dan dirender tanpa error module path.
- **Status**: Completed

## [Phase 7.3] - Tile Component

- **Phase**: Phase 7.3
- **File yang dibuat atau diubah**:
  - `src/components/Tile.tsx`
  - `src/components/Board.tsx`
- **Alasan Perubahan**:
  - Diperlukan untuk memecah komponen `Board` agar lebih modular. `Tile` sekarang menjadi komponen independen yang hanya bertanggung jawab untuk me-render satu petak permainan berdasarkan tipe datanya (props `tile`).
- **Dampak Perubahan**:
  - Kode di `Board.tsx` menjadi jauh lebih bersih dan ringkas. Komponen `Tile.tsx` dapat dikelola, diubah gayanya, dan diperluas secara mandiri (misalnya ketika harus menampung interaksi animasi atau token pemain) di masa depan tanpa menyentuh keseluruhan grid papan.
- **Status**: Completed

## [Phase 7.4] - Player Token Component

- **Phase**: Phase 7.4
- **File yang dibuat atau diubah**:
  - `src/components/player/PlayerToken.tsx`
  - `src/components/papan/Tile.tsx`
  - `src/components/papan/Board.tsx`
- **Alasan Perubahan**:
  - Diperlukan komponen visual khusus untuk mewakili pemain (bidak/token) di atas papan. `PlayerToken.tsx` merender lingkaran berwarna dengan inisial nama pemain. Modifikasi `Tile.tsx` diperlukan untuk menampung token-token tersebut (menyediakan area `div` berlapis). `Board.tsx` diubah sementara dengan menyediakan array data pemain statis (dummy) untuk menguji posisi token pada petak sebelum dihubungkan ke `Game Engine` asli.
- **Dampak Perubahan**:
  - Papan permainan sekarang dapat memvisualisasikan kehadiran pemain di petak tertentu. Pemain yang berpotongan di petak yang sama telah diprogram untuk bergeser sedikit (offset) agar tidak bertumpuk secara sempurna, memastikan setiap bidak dapat terlihat. 
- **Status**: Completed

## [Phase 7.5] - Dice Component

- **Phase**: Phase 7.5
- **File yang dibuat atau diubah**:
  - `src/components/dice/Dice.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Komponen antarmuka dadu yang ada perlu disesuaikan (*styling* ulang menggunakan Tailwind) agar memiliki bentuk kotak dadu yang nyata dan dapat ditempatkan ke dalam tata letak responsif aplikasi. Modifikasi `GameLayout.tsx` diperlukan untuk mendemonstrasikan integrasinya menggunakan React Hook `useDice`.
- **Dampak Perubahan**:
  - Dadu dapat diputar dengan mengklik tombol "Lempar Dadu". Pada mode *Desktop*, tombol dan dadu tampil vertikal di panel sebelah kanan (*Control Area*). Pada mode *Mobile*, komponen diringkas secara horizontal (*horizontal layout*) dan ditempelkan dengan rapi pada *Sticky Bottom Panel*, menyesuaikan aturan dari `UX-Design.md` tanpa memakan terlalu banyak ruang. Animasi pengacakan juga berfungsi dengan semestinya.
- **Status**: Completed

## [Phase 7.6] - HUD Component

- **Phase**: Phase 7.6
- **File yang dibuat atau diubah**:
  - `src/components/ui/HUD.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Diperlukan komponen *Heads-Up Display* (HUD) untuk menginformasikan status permainan terkini kepada pemain (siapa yang sedang mendapat giliran, posisi pion, dan skor terkini). `HUD.tsx` dibuat dengan menyesuaikan spesifikasi dari `UX-Design.md` di mana komponen ini harus memiliki antarmuka yang berbeda saat dimuat di layar besar (*Desktop Control Area*) dibandingkan saat di layar sentuh kecil (*Mobile Sticky Bottom Panel*).
- **Dampak Perubahan**:
  - Tampilan informasi permainan sekarang tersaji dengan estetik. Di PC, profil pemain (lengkap dengan inisial), angka posisi, dan skor dikemas di dalam satu *card* ringkas dengan indikator tajuk bergaya kapital. Di *Mobile*, informasi diringkas cukup menjadi dua baris teks agar menghemat ruang dan menempel mulus bersama komponen dadu di panel terbawah layar, sehingga pandangan pemain bisa tetap fokus pada papan permainan. Komponen sudah direkatkan dengan contoh data statis sebelum terhubung ke `Game Engine`.
- **Status**: Completed

## [Phase 7.7] - Quiz Modal Component

- **Phase**: Phase 7.7
- **File yang dibuat atau diubah**:
  - `src/components/quiz/QuizModal.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Permainan ini membutuhkan antarmuka pop-up (*modal*) untuk menyajikan pertanyaan edukasi sejarah secara interaktif ketika pemain menginjak petak `Quiz`. Komponen ini bertindak sebagai antarmuka yang mengirim jawaban pilihan pengguna untuk dinilai oleh `Quiz Module` (Business Logic) secara terisolasi tanpa mencampur logika permainan di level komponen UI.
- **Dampak Perubahan**:
  - Komponen `QuizModal` baru kini dapat menerima data `Question` utuh dan menampilkannya di atas area permainan yang sedikit diredupkan (memberikan efek fokus / *backdrop blur*). Jika pemain memilih jawaban yang salah, kotaknya menyala merah dan akan diberi penjelasan (*explanation*). Jika benar, ia akan berwarna hijau. Setelah itu, akan muncul tombol *"Lanjutkan Permainan"* untuk memberikan ruang bagi pemain membaca penjelasan sebelum menutup modal. Tombol sementara (*Test Quiz*) di header telah dipasang di `GameLayout.tsx` agar visualisasi komponen ini bisa diuji.
- **Status**: Completed

## [Phase 7.8] - Result Screen Component

- **Phase**: Phase 7.8
- **File yang dibuat atau diubah**:
  - `src/components/ui/ResultScreen.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Diperlukan layar selebrasi (Result Screen) untuk ditampilkan ketika kondisi menang telah tercapai (yakni saat `gameStatus === 'finished'`). Antarmuka ini mengomunikasikan dengan jelas siapa pemenangnya dan menampilkan papan peringkat akhir agar memberikan rasa pencapaian kepada pemain.
- **Dampak Perubahan**:
  - Komponen `ResultScreen.tsx` akan otomatis menutupi seluruh layar permainan ketika mendeteksi status permainan telah selesai. Di dalamnya, ia menobatkan pemenang di *header* besar berwarna elegan, lalu menampilkan *Leaderboard* terurut ke bawah berdasarkan skor. Total benar/salah tiap pemain juga direkap di sana. Dua tombol disediakan (Main Lagi dan Kembali ke Menu) yang mengandalkan fungsi *callback* eksternal sehingga murni menjaga UI terpisah dari logika navigasi/permainan utama. Saya juga menyisipkan tombol "Test Result" di *header* untuk pengujian visual.
- **Status**: Completed

## [Phase 7.9] - UI Integration

- **Phase**: Phase 7.9
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/components/papan/Board.tsx`
  - `src/components/quiz/QuizModal.tsx`
  - `docs/Integretion-Report.md`
- **Alasan Perubahan**:
  - Tiba waktunya untuk melepaskan seluruh *mockup* dan merakit semua kepingan *puzzle* komponen (Board, Dice, HUD, Kuis, Result Screen) bersama dengan "Otak" utama (*Game Engine*). Ini menyelaraskan *Phase 6* dan *Phase 7* menjadi satu aplikasi utuh yang reaktif. Berdasarkan masukan pengguna, pendekatan *Prop Drilling* tanpa `React Context` dipilih demi kesederhanaan arsitektur di tingkat MVP.
- **Dampak Perubahan**:
  - Seluruh status permainan *(GameState)* kini disentralisasi menggunakan *hook* `useState` di `GameLayout.tsx`. Antarmuka dadu, rute pion, dan modal akan mengikuti instruksi murni yang dikelola oleh `Game Engine`. Permainan sudah dapat dimainkan dari awal hingga akhir (dadu dikocok, pemain pindah, kuis ditanya, poin dihitung, pemenang diumumkan) secara lokal. Detail selengkapnya tertuang di `Integretion-Report.md`.
- **Status**: Completed

## [Phase 8.1] - Test Plan

- **Phase**: Phase 8.1
- **File yang dibuat atau diubah**:
  - `docs/Test-Plan.md`
- **Alasan Perubahan**:
  - Menyusun dokumen Test Plan sebagai acuan standar pengujian kualitas (QA) komprehensif sebelum tahapan *Manual Testing*. Diperlukan pemetaan skenario pengujian yang jelas meliputi fungsi utama, edge case, responsivitas tampilan, tata letak UI, dan pengujian regresi untuk menghindari lolosnya *bug* ke tahap selanjutnya.
- **Dampak Perubahan**:
  - Tim kini memiliki referensi pengujian baku (`Test-Plan.md`) dengan pembagian 6 area fungsional, menggunakan format tabel dengan Test ID, langkah-langkah, hasil yang diharapkan (Expected Result), dan metrik Test Summary. Dokumen ini memastikan tidak ada skenario krusial (seperti *bounce-back*, tumpukan pion, dsb.) yang luput dari verifikasi QA Phase 8.2 nanti.
- **Status**: Completed

## [Phase 8.2] - Manual Testing (Bug Report)

- **Phase**: Phase 8.2
- **File yang dibuat atau diubah**:
  - `docs/Management/Development-Log.md`
- **Alasan Perubahan**:
  - Menjalankan pengujian fungsional dan *gameplay* (QA) secara manual melalui `localhost:3000` (`npm run dev`) sebagaimana diinstruksikan dalam `Test-Plan.md`. Pengujian ini diperlukan untuk memvalidasi interaksi UI dengan *Game Engine* secara _real-time_.
- **Dampak Perubahan / Laporan Pengujian**:
  - **Ular & Tangga**: Berfungsi dengan baik. Pemain otomatis menaiki tangga dan turun saat terkena ular.
  - **Sistem Kuis**: Berfungsi dengan baik. Mendarat di petak kuis (contoh: Tile 45) sukses memunculkan `QuizModal`, merespons jawaban, menambahkan skor, dan giliran beralih saat klik "Lanjutkan Permainan".
  - **Temuan Bug (Kritis)**: Mendarat di **Tile 10 (Fact Tile / Fakta Sejarah)** menyebabkan permainan macet (*freeze*). Tombol dadu menjadi *disabled* secara permanen, tidak ada *modal* maupun informasi fakta yang muncul, dan giliran pemain tidak pernah berganti.
  - **Penyebab**: *Game Engine* mendeteksi petak `Fact` dan mengubah `gameStatus` menjadi `'reading_fact'`, namun di lapisan presentasi (`GameLayout.tsx`) belum ada *UI component* (seperti `FactModal`) yang merespons status tersebut, sehingga permainan tersangkut tanpa jalan keluar.
- **Status**: Completed

## [Phase 9.1] - Planning: Fact, Bonus, dan Penalty (Buff/Debuff)

- **Phase**: Phase 9
- **File yang dibuat atau diubah**:
  - `implementation_plan.md`
  - `docs/Management/task.md`
- **Alasan Perubahan**:
  - Pengguna mengusulkan perubahan mekanika permainan secara signifikan untuk fungsi *Fact*, *Bonus*, dan *Penalty*. Perubahan ini memasukkan elemen *Buff* (AntiSnake, DoubleRoll, StealPoint) dan *Debuff* (absoluteRoll, factBanned, decresedRoll) yang melekat secara temporer atau permanen pada status *Player*. Oleh karenanya, dibutuhkan *Implementation Plan* sebelum menulis ulang logika agar *state management* tidak tumpang tindih.
- **Dampak Perubahan**:
  - Dokumen *Implementation Plan* telah dicetak. Menguraikan penambahan *array* `activeEffects` di dalam *Player model*, serta alur pengecekan dadu (Pre-Roll) dan penentuan efek (Post-Roll) pada *Game Engine*. Beberapa *Open Questions* telah diajukan ke pengguna untuk mengklarifikasi ambiguitas spesifikasi desain.
- **Status**: Completed

## [Phase 9.2] - Design Review: Effect System

- **Phase**: Phase 9.2
- **File yang dibuat atau diubah**:
  - `docs/Effect-System.md`
- **Alasan Perubahan**:
  - Pengguna meminta ulasan desain komprehensif (*Design Review*) terhadap rancangan Buff, Debuff, dan sistem Fakta. Tujuannya adalah mendokumentasikan spesifikasi yang pasti (aturan *stacking*, prioritas efek, rincian durasi, perilaku antarmuka) agar arsitektur tidak simpang siur sebelum benar-benar diimplementasikan ke dalam *Game Engine*.
- **Dampak Perubahan**:
  - Tim sekarang memiliki buku pedoman `Effect-System.md` yang menetapkan secara mutlak kapan sebuah efek didapatkan, di mana disimpan (`activeEffects`), bagaimana *Turn Flow* memotong umurnya, dan efek apa yang menang jika bertabrakan (*Priority*). Beberapa poin keputusan (*Open Decisions*) juga disoroti untuk difinalisasi oleh pengguna.
- **Status**: Completed

## [Phase 9.3] - Implementation: Effect System & Modals

- **Phase**: Phase 9 (9.2, 9.3, 9.4)
- **File yang dibuat atau diubah**:
  - `src/types/player.ts`
  - `src/components/GameLayout.tsx`
  - `src/lib/gameEngine.ts`
  - `src/components/ui/FactModal.tsx`
  - `src/components/ui/EffectModal.tsx`
  - `src/components/ui/HUD.tsx`
- **Alasan Perubahan**:
  - Mengeksekusi penulisan kode setelah spesifikasi desain pada `Effect-System.md` disetujui. Tujuannya adalah mendatangkan mekanika *Buff* dan *Debuff* yang merespons lemparan dadu serta pergerakan pemain (seperti batasan *AbsoluteRoll*, pengurang dadu *DecreasedRoll*, *StealPoint* dari pemain tertinggi, dan imunitas *AntiSnake*), dilengkapi antarmuka visual pendukung.
- **Dampak Perubahan**:
  - **Domain Model**: `Player` kini memiliki tumpukan `activeEffects: PlayerEffect[]`.
  - **Game Engine**: `processTurn` sekarang mengundi efek acak jika mendarat di *Bonus/Penalty*. Status `showing_effect` dan `showing_fact` menahan putaran giliran hingga pemain merespons UI.
  - **UI/UX**: Diciptakannya `FactModal` dan `EffectModal` yang dipasang pada `GameLayout`. `HUD` juga diperbarui untuk menayangkan lencana status/efek yang sedang menempel pada tubuh pemain menggunakan deretan *icon* (seperti 🛡️, 📉, ⛓️, 🚫).
- **Status**: Completed

## [Phase 9.5] - Implementation: Random Spawn System

- **Phase**: Phase 9 (9.5)
- **File yang dibuat atau diubah**:
  - `src/data/papan/board.ts`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Agar letak petak Bonus dan Penalti tidak monoton. Hal ini meningkatkan *replayability* (keseruan bermain ulang) dengan mengacak lokasi spawn (3 Bonus, 3 Penalty) pada petak-petak `Normal` yang tersedia.
- **Dampak Perubahan**:
  - **Board Data**: `board.ts` kini menggunakan fungsi dinamis `generateRandomBoard(3,3)` menggantikan konstanta `board` yang sepenuhnya statis.
  - **Game Layout**: `GameLayout.tsx` kini menyimpan array papan dalam `currentBoard` state. Setiap kali pemain me-restart dengan tombol "Main Lagi", `generateRandomBoard()` akan dipanggil sehingga bentuk papan baru akan di-render.
- **Status**: Completed (Siap untuk dilakukan Pengujian Ulang)

## [Bugfix] - Fix TypeScript Missing Imports

- **Phase**: Bugfix
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Terdapat error TypeScript `Cannot find name 'GAME_CONSTANTS'` pada `gameEngine.ts` dan `Cannot find name 'Tile'` pada `GameLayout.tsx` akibat hilangnya baris import terkait.
- **Dampak Perubahan**:
  - Proyek dapat dikompilasi kembali (bebas dari error type checking).
- **Status**: Completed

## [Phase 9.6] - Game Log System

- **Phase**: Phase 9.6
- **File yang dibuat atau diubah**:
  - `src/types/gameState.ts`
  - `src/lib/gameEngine.ts`
  - `src/components/ui/GameLogBox.tsx` (Baru)
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Untuk memfasilitasi transparansi permainan, diperlukan sistem log aktivitas (Game Log). Karena adanya fitur *Bonus* dan *Penalty* yang bisa terjadi mendadak, pemain butuh riwayat visual untuk mengetahui kejadian spesifik yang menimpa pion mereka (misalnya jenis efek buff/debuff apa yang didapat).
- **Dampak Perubahan**:
  - *State* `logs` telah ditambahkan di `GameState`. *GameEngine* kini men-*push* pesan baru khusus ketika pemain mendapatkan Bonus atau Penalti.
  - Secara visual, *Desktop* kini memiliki kotak riwayat (`GameLogBox`) yang bersanding di *sidebar* kanan, sedangkan *Mobile* memiliki tombol "📝 Log" khusus di samping kontrol dadu yang akan memicu jendela *Pop-up Modal* dari bawah layar. Panel log ini akan otomatis bergeser (*scroll*) ke bawah saat pesan baru masuk.
- **Status**: Completed

## [Phase 9.7] - Quiz Revamp & Fact Removal

- **Phase**: Phase 9.7
- **File yang dibuat atau diubah**:
  - `src/types/question.ts`
  - `src/types/board.ts`
  - `src/types/player.ts`
  - `src/types/gameState.ts`
  - `src/data/questions.ts`
  - `src/data/papan/board.ts`
  - `src/lib/gameEngine.ts`
  - `src/lib/tileResolver.ts`
  - `src/components/GameLayout.tsx`
  - `src/components/ui/EffectModal.tsx`
  - `src/components/ui/HUD.tsx`
  - `src/components/papan/Tile.tsx`
  - `src/components/ui/FactModal.tsx` (Deleted)
  - `src/data/facts/facts.ts` (Deleted)
- **Alasan Perubahan**: Menghapus mekanik Fakta sepenuhnya untuk menyederhanakan game, merombak kuis dengan 4 tingkat kesulitan (Easy, Medium, Hard, Extreme) yang memiliki variasi poin penalti progresif, serta memperkenalkan debuff *Silence* (Kehilangan Giliran) pengganti *FactBanned*.
- **Dampak Perubahan**: Papan kini memiliki lebih banyak kuis (10 titik acak), memberikan dinamika poin yang lebih variatif antara risiko dan imbalan kuis, sementara petak statis Fakta dihapus sepenuhnya dari game flow.
- **Status**: Completed

## [Phase 10] - Main Menu & Bot System

- **Phase**: Phase 10
- **File yang dibuat atau diubah**:
  - `src/types/player.ts` (menambah atribut `isBot`)
  - `src/components/ui/MainMenu.tsx` (File Baru)
  - `src/app/page.tsx` (Routing state MainMenu)
  - `src/components/GameLayout.tsx` (Bot Controller useEffect)
- **Alasan Perubahan**:
  - Pengguna membutuhkan halaman utama untuk merancang sesi permainan sebelum masuk ke area game (papan). Pemain harus bisa memilih jumlah pemain (maks 4), mengubah nama pemain sesuai keinginan, dan menentukan apakah karakter tersebut digerakkan oleh Manusia (Multiplayer Local) atau Bot (Solo).
- **Dampak Perubahan**:
  - Aplikasi kini dimulai dari layar `MainMenu`. Konfigurasi awal (jumlah pemain, nama, status bot/human) diteruskan ke dalam state awal `GameState` di `GameLayout.tsx`.
  - Sistem AI dasar (Bot) telah tertanam di level komponen *frontend* menggunakan `useEffect`. Ketika giliran beralih ke pemain berstatus `isBot`, tombol dadu manual akan dinonaktifkan (`disabled`), dan UI akan otomatis memanggil fungsi lempar dadu, menebak kuis secara acak, dan menyetujui efek dalam kurun waktu jeda tertentu agar natural.
- **Status**: Completed

## [Phase 11] - Audio & Sound Effects (SFX) System

- **Phase**: Phase 11
- **File yang dibuat atau diubah**:
  - `src/contexts/AudioContext.tsx` (File Baru)
  - `src/app/layout.tsx` (Membungkus aplikasi dengan AudioProvider)
  - `src/components/ui/AudioSettings.tsx` (Komponen kontrol di MainMenu)
  - `src/components/ui/FloatingAudioControl.tsx` (Tombol *floating* di area papan game)
  - `src/components/ui/MainMenu.tsx` (Injeksi AudioSettings)
  - `src/components/GameLayout.tsx` (Pemanggilan hook untuk BGM & trigger SFX)
- **Alasan Perubahan**:
  - Pengguna ingin menambahkan dimensi pendengaran (suara) agar permainan lebih imersif. Diperlukan sebuah sistem global untuk mengelola `Volume` dan `Mute` yang state-nya tersimpan (diingat) oleh browser melalui `LocalStorage`.
- **Dampak Perubahan**:
  - Pustaka pihak ketiga `howler.js` telah ditambahkan ke proyek.
  - Saat masuk ke layar permainan (papan), *Background Music* (BGM) akan diputar otomatis secara *looping*.
  - Aksi melempar dadu, menebak kuis (benar/salah), serta mendapat efek (ular/tangga) kini memutar file `.mp3` khusus untuk umpan balik *real-time*.
  - Pemain dapat menyesuaikan volume permainan di Main Menu dan menyembunyikan/memunculkan kembali *slider* volume saat di tengah-tengah papan melalui tombol gowes (⚙️) melayang.
  - **Pemisahan BGM**: Ada dua *track* BGM yang berbeda, yakni `bgm_menu.mp3` untuk diputar di Menu Utama, dan `bgm.mp3` untuk diputar selama permainan berlangsung (dikendalikan via `AudioContext`).
- **Status**: Completed

## [Phase 12] - Late Game Mechanics (Krisis) & MVP Win Condition

- **Phase**: Phase 12
- **File yang dibuat atau diubah**:
  - `src/types/gameState.ts` (Menambahkan `isCrisisPhaseActive`)
  - `src/lib/movement.ts` (Menambahkan logika Bouncing dan isMVP)
  - `src/lib/gameEngine.ts` (Menerapkan +2 dadu, pengecekan krisis, dan cek pemenang MVP)
  - `src/data/papan/board.ts` (Memaksa petak 92, 95, 98 menjadi Kuis untuk area panen poin)
  - `src/components/ui/CrisisAlertModal.tsx` (Pop-up UI baru)
  - `src/components/GameLayout.tsx` (Injeksi modal dan handler penahanan aksi Bot)
- **Alasan Perubahan**:
  - Membutuhkan sistem *balancing* agar pemain tertinggal tetap punya harapan menang, serta memastikan pemenang (yang mendarat di 100) adalah pemain yang pintar menjawab soal sejarah (memiliki gelar MVP/Poin tertinggi), bukan cuma yang sekadar hoki melempar dadu.
- **Dampak Perubahan**:
  - Saat ada pion mendarat di petak 91-100, fase krisis aktif dan ditandai dengan pop-up pemberitahuan secara global. Pemain yang masih tertinggal (< 80) akan otomatis mendapat bonus +2 saat melempar dadu (notifikasi muncul di *Game Log*).
  - Papan kini dijamin memiliki Kuis di petak 92, 95, dan 98 (selain dari penempatan acak reguler) untuk area *farming* skor di akhir.
  - Jika seorang pemain mendarat di petak 100 namun skornya bukanlah yang tertinggi (Bukan MVP), pemain tersebut akan "terpental" dan dipaksa mundur dari garis finish sesuai sisa langkahnya atau tertahan di 99.
- **Catatan Self-Review**:
  - Ditemukan cacat logika (*timing bug*) di mana pengecekan kondisi Fase Krisis dilakukan di **awal** giliran (`processTurn`), sehingga jika pemain A mendarat di petak krisis, pop-up peringatan baru akan muncul di awal giliran pemain B, yang mana ini membingungkan secara UI/UX.
  - **Perbaikan**: Pengecekan kondisi `isAnyoneEndgame` dipindah ke **akhir** giliran (setelah *movement* dan kalkulasi *tile* pemain bersangkutan selesai diproses), sehingga *pop-up* akan terpicu secara instan begitu pemain terkait mendarat di zona krisis.
- **Status**: Completed

## [Future Planning] - Potensi Update Program (Post-MVP)

- **Phase**: Future Updates
- **Area Pengembangan Berikutnya (Phase 13)**:
  1. **Polishing Mode Solo (Bot)**: Membuat animasi pilihan saat Bot menjawab kuis, sehingga opsi yang dipilih Bot akan tersorot (ter- *highlight*) layaknya diklik oleh pemain manusia, memberikan interaksi yang lebih nyata.
  2. **Perbaikan Layout Mobile**: Menyesuaikan antarmuka layar sentuh (*mobile*) agar fitur-fitur baru (seperti *floating audio control* dan *settings*) tidak bertabrakan atau menutupi elemen penting lainnya.
  3. **Penggabungan Mute & Setting**: Menyederhanakan UI dengan menggabungkan/memindahkan fungsi tombol *Mute* ke dalam menu (atau tombol) *Setting* utama.
  4. **Dynamic Position / Leaderboard Bar**: Menghilangkan indikator "Posisi Petak" statis pada HUD, dan menggantinya dengan informasi peringkat (1st, 2nd, 3rd) beserta Poin terkini. Urutan daftar pemain ini akan terus berubah dan tersortir secara otomatis (*real-time*) mengikuti siklus giliran (*lifecycle*) permainan.
- **Tujuan**: Memperhalus antarmuka pengguna (UI/UX) di semua perangkat, memberikan kejelasan kompetisi antar pemain, dan membuat kecerdasan buatan (*Bot*) terasa lebih manusiawi.

- **Ide Fitur Lanjutan Lainnya (Bisa Terus Dikembangkan)**:
  - **Perbaikan Aksesibilitas Layar Sentuh (Mobile UI)**: Mengatasi celah (bug) krusial di mana interaksi pemain pada perangkat mobile/ponsel pintar masih terblokir atau belum bisa diinteraksi secara maksimal akibat tumpah tindih elemen tata letak (overlap) atau absennya event sentuh (touch). Memperbaiki proporsi ukuran dari tiap button seperti setting button dan container nya.
  - **Penambahan Animasi Pergerakan pada tiap component (Dadu, Pion, Alert, Naik tangga, turun Ular)**: Mengganti perpindahan instan (teleportasi pion) menjadi animasi melangkah dari satu petak ke petak lainnya secara *smooth*. Selain itu, menambahkan animasi pada tiap component seperti dadu, pion, alert, naik tangga, turun ular menjadi lebih menarik dan interaktif.
  - **Sistem Pencapaian In-Game (Fase "Ahli Sejarah Kuno")**: Merombak ide *badge* statis menjadi mekanik dinamis di dalam permainan. Ketika seorang pemain berhasil menjawab pertanyaan dengan benar sebanyak 5 kali berturut-turut (*combo* = 5), pemain akan mendapatkan gelar "Ahli Sejarah Kuno" yang memicu sebuah *pop-up*. Pemain tersebut kemudian berhak memilih 1 dari 2 pilihan *Buff Bonus* acak yang ditawarkan sistem untuk memperkuat posisinya. **Balancing**: Pemain akan terus mendapat pilihan *buff* setiap kali benar menjawab selama memegang gelar ini. Jika salah menjawab 1 kali, *buff* miliknya hangus tapi gelar tetap dipertahankan. Jika salah menjawab untuk kedua kalinya, barulah gelar "Ahli Sejarah Kuno" tersebut dicabut.
  - **Kustomisasi Avatar Pahlawan**: Memungkinkan pemain memilih *avatar* tokoh pahlawan nasional, tidak sekadar warna dan inisial.
  - **Efek Papan Dinamis (Event Petak)**: Misalnya ada petak "Mesin Waktu" yang mengacak posisi semua pemain, atau petak "Jebakan" yang membekukan pemain selama 2 putaran.
  - **Tema dan Kustomisasi Visual (*Theming & Skin*)**: Mendesain ulang dan memungkinkan pemain memilih desain *board* (papan) berdasarkan sistem *theme* yang merepresentasikan sejarah lokal. Contoh: *Theme* Candi Borobudur, *Theme* Jakarta Monas, atau *Theme* Gedung Sate Jawa Barat. Pemain cukup memilih prasetel (preset) desain ini tanpa perlu repot mengatur kosmetik satu per satu.
- **Status**: Proposed / Perencanaan (Waiting for Next Milestone)

---
### Phase 13.1: Polishing Mode Solo Bot (Sedang Dikerjakan)
- **Tujuan**: Memberikan interaksi visual yang lebih nyata saat Bot mendapatkan petak kuis.
- **Rencana Perubahan**:
  - Memindahkan otak/logika *Bot Answering* dari `GameLayout.tsx` ke dalam `QuizModal.tsx`.
  - Memberikan *delay* untuk menyimulasikan bot sedang membaca.
  - Memilih opsi dan menyorot *button* yang dipilih oleh Bot sebelum mengevaluasi benar/salahnya.
- **Status**: Completed (Logika animasi telah berjalan aman dan efisien di dalam `QuizModal.tsx` menggunakan perlindungan `useRef` untuk menghindari bug double-firing).

---
### Phase 13.2 & 13.3: Perbaikan Layout Mobile & Penggabungan Mute/Setting (Sedang Dikerjakan)
- **Tujuan**: Membersihkan area bawah UI mobile untuk fokus pada kontrol *game* (dadu, log) dan menyederhanakan pengaturan audio.
- **Rencana Perubahan**:
  - Menggeser posisi *Floating Audio Control* dari pojok kanan bawah ke pojok kanan atas.
  - Membuang tombol *mute* yang terpisah dari *Floating Audio Control*.
  - Memanfaatkan kembali (reusable) komponen `AudioSettings.tsx` di dalam *pop-up floating control*.
- **Status**: Completed (Tombol berhasil digeser ke area aman di bawah Header (Top-Right), UI terlihat jauh lebih elegan karena tombol Mute disatukan ke dalam pop-up Settings secara DRY menggunakan komponen `<AudioSettings />`).
