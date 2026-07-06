## [2026-07-06] Bugfix: Modal Kuis Terpotong di Mobile

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/quiz/QuizModal.tsx`
- **Alasan Perubahan**:
  - Pada layar perangkat seluler (mobile), pop up kuis ukurannya seringkali terlalu panjang, terutama pada soal dengan deskripsi atau trivia panjang. Akibatnya, pemain tidak bisa menekan tombol konfirmasi atau melihat trivia karena area bawah modal terpotong dan tidak dapat digulir (scroll).
- **Dampak Perubahan**:
  - Membatasi tinggi maksimum wadah modal menggunakan `max-h-[95vh] sm:max-h-[90vh]`.
  - Menerapkan `shrink-0` pada header dan footer kuis agar ukurannya tidak tertekan.
  - Menambahkan utilitas `overflow-y-auto` dan `flex-1` pada bagian konten utama (pertanyaan & jawaban) sehingga secara otomatis mendukung proses *scrolling* bila konten melebihi batas layar, sementara elemen navigasi (tombol) selalu berada di dasar dengan aman.
- **Status**: Completed

## [2026-07-06] Fitur: Optimalisasi Tata Letak Tombol & Klasemen Mode Mobile

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/components/ui/HUD.tsx`
  - `src/components/ui/FloatingAudioControl.tsx`
- **Alasan Perubahan**:
  - Di perangkat seluler (*mobile*), tombol *Game Log* (catatan permainan) dan *Settings* (pengaturan suara) melayang (menggunakan `position: fixed`) tepat di atas papan permainan. Hal ini sangat mengganggu karena menutupi petak papan bagian atas. Selain itu, daftar klasemen sementara terpotong apabila jumlah pemain banyak karena ketiadaan fitur *scroll*.
- **Dampak Perubahan**:
  - **Relokasi Tombol**: Tombol *Game Log* (📝) dan *Audio Settings* (⚙️) kini dipindahkan sepenuhnya ke dalam *Header* navigasi paling atas di sisi kiri dan kanan. Tidak ada lagi elemen mengambang yang menutupi papan.
  - **Leaderboard Scroll**: Menambahkan properti `overflow-y-auto` dan membatasi tinggi maksimum (max-height `60vh`) pada modal daftar klasemen di perangkat seluler agar pengguna bisa menggulir (scroll) sisa nama pemain tanpa terpotong.
- **Status**: Completed

## [2026-07-06] Bugfix: Menyamakan Skala Tampilan Mobile (iPhone 12 Pro Standard)

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/app/layout.tsx`
- **Alasan Perubahan**:
  - Pengguna melaporkan bahwa tampilan game pada perangkat seluler Android (seperti Realme C51s) terlihat berbeda dibandingkan dengan tampilan standar iPhone 12 Pro, menyebabkan proporsi elemen layout menjadi tidak konsisten.
- **Dampak Perubahan**:
  - Menambahkan konfigurasi `viewport` pada Next.js (`layout.tsx`) dengan menetapkan `width: 390` dan `userScalable: false`. Hal ini memaksa *browser* di semua *smartphone* (apapun merek atau resolusinya) untuk mensimulasikan layar dengan lebar logis 390px (standar iPhone 12 Pro) lalu melakukan proses *zoom-to-fit* secara otomatis. Hasilnya, pengalaman visual UI (padding, margin, dan posisi SVG) terkunci sempurna dan konsisten.
- **Status**: Reverted (Dibatalkan karena tampilan menjadi tidak proporsional di beberapa perangkat)

## [2026-07-06] Dokumentasi: Penulisan Ulang README.md

- **Phase**: Documentation
- **File yang dibuat atau diubah**:
  - `README.md`
- **Alasan Perubahan**:
  - `README.md` yang lama memiliki beberapa konsep *legacy* yang sudah tidak relevan (seperti mekanik terpental dari petak 100) dan belum mencakup keseluruhan arsitektur canggih yang telah kita bangun (sistem gelar anti-monopoli, tumpukan *buff/debuff*, fase krisis).
- **Dampak Perubahan**:
  - Merombak seluruh deskripsi `README.md` menjadi komprehensif, mencakup narasi tujuan permainan (edukasi tanpa kebosanan melalui *active recall*), penjelasan mendalam mengenai 6 fitur utama (Kuis, Fase Krisis, Gelar), serta perbaikan tatanan *stack* teknologi yang digunakan.
- **Status**: Completed

## [2026-07-06] Bugfix: Menghilangkan Scrollbar di Semua Tema Permainan

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/app/globals.css`
- **Alasan Perubahan**:
  - Permainan terkadang memunculkan *scrollbar* utama di peramban yang memungkinkan pemain men-*scroll* ke luar jalur area *gameplay*, padahal seharusnya (sesuai GDD) seluruh permainan termuat dalam 1 layar pas (*single page viewport*) tanpa perpindahan posisi.
- **Dampak Perubahan**:
  - Menambahkan aturan ketat `overflow: hidden;`, `height: 100vh;`, `height: 100dvh;` (untuk *mobile browser* adaptif), dan `width: 100vw;` pada selektor `body` dan `html` di `globals.css`. Hal ini menjamin bahwa apa pun temanya, area permainan tidak akan bocor melebihi ukuran layar fisik.
- **Status**: Completed

## [2026-07-06] Fitur: Sistem Anti-Monopoli Gelar (Result Screen)

- **Phase**: Gameplay Logic & UI Refinement
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
  - `src/components/ui/ResultScreen.tsx`
- **Alasan Perubahan**:
  - Diperlukan aturan yang jelas untuk menentukan Juara Utama berdasarkan poin tertinggi, serta menghindari pemonopolian gelar (seperti Fastest Explorer, History Master, Sharpshooter) oleh satu pemain saja agar apresiasi terdistribusi merata ke pemain lain.
- **Dampak Perubahan**:
  - Mengubah *engine* untuk langsung menyetop permainan ketika ada yang mencapai petak 100 dan memberikan *Grand Finish Bonus* sebesar +1000 Poin.
  - Menerapkan fungsi *Tie-Breaker* di Backend UI: Jika skor sama, pemenang ditentukan oleh jumlah Jawaban Benar, lalu Posisi Petak. Gelar *Sharpshooter* minimal harus menjawab 3 soal.
  - Memasukkan visualisasi *Bypass* (Skenario A): Jika Juara Utama adalah *Fastest Explorer*, gelarnya diintegrasikan ke Header tanpa mengambil slot penghargaan orang lain.
  - Pembuatan *helper* `renderAchievementCard` yang secara dinamis mengisi 2 slot penghargaan spesial di bawah Header dengan prioritas *Fastest Explorer* (Jika Skenario B) -> *History Master* -> *Sharpshooter*.
  - Menambahkan informasi statistik Persentase Akurasi (🎯) pada Papan Peringkat Akhir.
- **Status**: Completed

## [2026-07-06] Bugfix: Layar Game Over Terlalu Besar

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/ui/ResultScreen.tsx`
- **Alasan Perubahan**:
  - Tampilan layar saat permainan selesai (*Game Over*) yang memunculkan rekap hasil, terlalu besar dan memakan ruang (padding besar) sehingga seringkali memerlukan *scroll* di mode *Desktop* maupun *Mobile*.
- **Dampak Perubahan**:
  - Membatasi tinggi maksimal *container* utama menjadi `max-h-[95vh]` agar tidak menembus tinggi layar.
  - Mengubah struktur tabel pemain menjadi `overflow-y-auto` agar *scroll* terjadi di dalam tabel klasemen alih-alih di seluruh *page*.
  - Menyesuaikan (mengurangi) nilai *padding* di berbagai komponen penyusun (*Header*, *Special Achievements*, dan *Footer*) agar lebih ringkas (*compact*).
- **Status**: Completed

## [2026-07-06] Fitur (Eksperimen): Sistem Stacking Efek

- **Phase**: Gameplay Logic Refinement
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
  - `src/components/ui/HUD.tsx`
  - `src/app/prototype/gameplay/components/PrototypeHUD.tsx`
- **Alasan Perubahan**:
  - Diperlukan standarisasi terhadap efek ganda (*stacking*) yang dialami pemain, membedakannya antara yang bersifat statis (intensitas) dan yang terakumulasi (durasi).
- **Dampak Perubahan**:
  - Menuliskan perlindungan berlapis di `gameEngine.ts` agar efek kategori *Intensitas* (seperti `AntiSnake`) hanya di-refresh durasinya (maksimal *stack* 1), sedangkan efek kategori *Durasi* (seperti `PajakKolonial`) akan terakumulasi giliran sisanya.
  - Menambahkan *badge* angka merah kecil di pojok kanan ikon efek pada panel Klasemen untuk mengindikasikan bahwa durasi sisa efek penalti lebih dari 1 giliran.
  - Implementasi ini ditandai dengan komentar `[EXPERIMENT: Stacking System]` agar dapat ditarik kembali (*revert*) dengan sangat mudah apabila eksperimen ini dirasa kurang sesuai.
- **Status**: Completed

## [2026-07-06] Fitur: Indikator Efek pada Klasemen (Leaderboard)

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/ui/HUD.tsx`
  - `src/app/prototype/gameplay/components/PrototypeHUD.tsx`
- **Alasan Perubahan**:
  - Pemain perlu mengetahui efek (Buff/Debuff) yang sedang dimiliki oleh lawannya secara *real-time* tanpa harus menunggu giliran lawan tersebut tiba, agar mereka dapat memikirkan strategi.
- **Dampak Perubahan**:
  - Membuat fungsi pemetaan ikon efek `getEffectIcon()` dan komponen fungsi render terpisah `renderPlayerEffects(player: Player)`.
  - Memasukkan deretan indikator ikon kecil di samping nama setiap pemain pada panel Klasemen Sementara. Kini setiap efek (mulai dari Anti-Snake hingga Mesin Waktu) akan ditandai dengan emoji unik yang jelas.
- **Status**: Completed

## [2026-07-06] Bugfix: Klasemen Terpotong pada Mode Desktop

- **Phase**: Bug Fix
- **File yang dibuat atau diubah**:
  - `src/components/ui/HUD.tsx`
  - `src/app/prototype/gameplay/components/PrototypeHUD.tsx`
- **Alasan Perubahan**:
  - Saat ada 4 pemain, informasi pemain peringkat ke-4 pada klasemen tidak terlihat (terpotong) karena *container* HUD terpaksa mengecil (`flex-shrink`) dan area klasemen tertutup *overflow* di mode *Desktop*.
- **Dampak Perubahan**:
  - Menghapus aturan `overflow-y-auto` di dalam daftar list pemain agar daftar dirender secara utuh.
  - Menambahkan class `shrink-0` pada kotak utama HUD agar kotak tersebut tidak bisa menyusut (*squished*) karena limitasi tinggi layar, sehingga semua isinya selalu dijamin tampil. Scroll bar hanya akan muncul di area layar samping (`aside`) jika layar benar-benar pendek.
- **Status**: Completed

## [2026-07-06] Fitur (Eksperimen): Velocity Stretch pada Path Following

- **Phase**: UI & UX Refinement (Experimental)
- **File yang dibuat atau diubah**:
  - `src/components/player/PlayerToken.tsx`
- **Alasan Perubahan**:
  - Untuk melengkapi efek *Path Following* pada saat menuruni ular atau menaiki tangga, pengguna ingin mencoba melihat bagaimana jika token diregangkan seolah-olah ditarik oleh kecepatan jatuhnya (aerodinamis).
- **Dampak Perubahan**:
  - Menambahkan modifikasi `scaleX: 0.8` dan `scaleY: 1.25` pada varian `transitioning`. Ini membuat pion memanjang sejajar dengan arah rotasi jatuhnya selama dalam animasi kurva bezier. Sifatnya tidak permanen dan mudah dibatalkan jika visualnya terasa aneh.
- **Status**: Reverted (Dibatalkan sesuai permintaan pengguna)

## [2026-07-06] Fitur: Optimasi Animasi Stretch di Mode Mobile

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/player/PlayerToken.tsx`
- **Alasan Perubahan**:
  - Proporsi tinggi lompatan (Y) dan distorsi (*squash & stretch*) yang dibuat untuk layar *desktop* terlalu ekstrem untuk perangkat *mobile*, membuat pergerakan animasi terlihat janggal karena petak papan berukuran sangat kecil di *mobile*.
- **Dampak Perubahan**:
  - Menambahkan *event listener* ukuran layar `window.innerWidth < 768` (`isMobile`).
  - Mengurangi lompatan maksimal ke arah sumbu Y pada *smartphone* menjadi `-12px` (dari sebelumnya `-20px`).
  - Merapikan rasio meregang maksimal hingga `1.15x` dan rasio memipih maksimal hingga `0.85x` secara responsif.
- **Status**: Completed

## [2026-07-06] Bugfix: Kesalahan Kategori Pop-up Buff & Debuff

- **Phase**: Bug Fix
- **File yang dibuat atau diubah**:
  - `src/components/ui/EffectModal.tsx`
- **Alasan Perubahan**:
  - Terdapat *logical bug* dimana efek "Cendekiawan" dan "Mesin Waktu" terdeteksi sebagai Debuff (sehingga memunculkan Pop-up merah) padahal seharusnya berupa Buff (Pop-up hijau).
- **Dampak Perubahan**:
  - Memperbarui array `isBuff` di `EffectModal.tsx` untuk secara eksplisit mencakup `'Cendekiawan'` dan `'MesinWaktu'`. Kini semua pop up tampil dengan warna yang seharusnya.
- **Status**: Completed

## [2026-07-06] Fitur: Peningkatan Animasi Token (Squash & Path Following)

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/app/prototype/gameplay/components/PrototypeGameLayout.tsx`
  - `src/components/papan/Board.tsx`
  - `src/app/prototype/gameplay/components/PrototypeBoard.tsx`
  - `src/components/player/PlayerToken.tsx`
- **Alasan Perubahan**:
  - Mengubah rasa permainan (Game Feel) agar lebih memuaskan. Animasi lompat saat bergerak petak-demi-petak diubah menjadi "Squash and Stretch", sedangkan saat ular dan tangga menggunakan "Path Following" dengan menyertakan perhitungan rotasi arah, sehingga pion terlihat condong meluncur alami.
- **Dampak Perubahan**:
  - Semua state transisi posisi pion saat ini mendukung kalkulasi nilai rotasi derajat matematis yang dibaca melalui kurva bezier ular atau garis linear tangga.
  - Varian `squash` dari `framer-motion` diaktifkan secara global untuk pergerakan papan normal.
- **Status**: Completed

## [2026-07-06] Fitur: Penyempurnaan Teks Game Log dan Headline

- **Phase**: UI & UX Refinement
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
- **Alasan Perubahan**:
  - Pengguna meminta agar teks Game Log dan Headline (popup yang berjalan di atas) secara eksplisit menyebutkan nama pemain dan nama efek yang didapatkan, agar lebih jelas saat dibaca.
- **Dampak Perubahan**:
  - Mengubah struktur *string message* pada seluruh eksekusi `newState.logs.push` di `gameEngine.ts`.
  - Semua efek Buff dan Debuff, serta respons sistem (terkena ular, menolak tangga, dll) kini mencantumkan nama pemain (misalnya: `✨ Fauzan mendapatkan efek Double Roll!`).
- **Status**: Completed

## [2026-07-06] Fitur: About Game Modal

- **Phase**: UI Feature
- **File yang dibuat atau diubah**:
  - `src/components/ui/AboutModal.tsx`
  - `src/components/ui/MainMenu.tsx`
  - `implementation_plan.md`
  - `task.md`
- **Alasan Perubahan**:
  - Menambahkan menu informasi permainan (About Game) pada layar utama (Main Menu) sebagai tugas kelompok sesuai referensi pengguna.
- **Dampak Perubahan**:
  - `AboutModal.tsx` dirender sebagai modal popup dinamis yang menampilkan identitas kampus, anggota kelompok, dan deskripsi singkat.
  - Terdapat mekanisme _expand_ (Lihat Anggota) dengan animasi mulus via Framer Motion.
  - `MainMenu.tsx` kini memiliki tombol "❓" (About) di area sudut kanan atas bersebelahan dengan tombol pengaturan (⚙️).
- **Status**: Completed

## [2026-07-06] Phase 4: Prototype Integration (UI Migration)

- **Phase**: Prototype Integration
- **File yang dibuat atau diubah**:
  - src/app/page.tsx
  - src/components/ui/MainMenu.tsx
  - src/components/GameLayout.tsx
  - src/components/papan/Board.tsx
  - src/components/papan/Tile.tsx
  - src/components/ui/HUD.tsx
  - src/components/dice/Dice.tsx
- **Alasan Perubahan**:
  - Prototipe untuk halaman Landing Page, Main Menu, dan Gameplay telah disetujui secara visual oleh reviewer.
  - Memigrasikan semua komponen UI yang ada pada \src/app/prototype\ ke aplikasi utama tanpa mengubah \Game Logic\, \State Management\, atau \API\ (Sesuai dengan aturan Prototype sebagai Design Source of Truth).
- **Dampak Perubahan**:
  - Aplikasi utama sekarang menampilkan tata letak, efek gerak (Framer Motion), tema responsif, ornamen SVG, dan detail visual persis seperti yang disetujui pada prototipe.
  - Gameplay berjalan dengan mesin state lama tetapi dibalut visual baru.
  - Proses build (Next.js) terverifikasi berhasil dan bebas galat syntax/Tipe.
- **Status**: Waiting Review

# Development Log

## [Sandbox] - Tema Jakarta Visual Polish (Iterasi 2)

- **Phase**: Visual Polish (Sandbox)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/gameplay/components/PrototypeBoard.tsx`
  - `src/app/prototype/gameplay/components/PrototypeGameLayout.tsx`
  - `src/app/prototype/gameplay/components/PrototypeTile.tsx` (Baru)
  - `src/components/player/PlayerToken.tsx`
- **Alasan Perubahan**:
  - Umpan balik dari pengguna untuk menyempurnakan dominasi ular, menyederhanakan tangga, mempertegas token, dan menambah *ambience* tanpa menyentuh *logic* dan komponen utama (*sandbox isolation*).
- **Dampak Perubahan**:
  - Papan terlihat jauh lebih rapi, token sangat menonjol berkat ekstensi *box-shadow*, dan petak permainan dapat bercahaya ketika diarahkan (hover). Modals dan animasi dibiarkan terlebih dahulu.
- **Status**: Completed

## [Sandbox] - Tema Jakarta Visual Polish (Iterasi 1)

- **Phase**: Visual Polish (Sandbox)

## [Milestone 3] - Gameplay Visual Infusion (Phase 1)

- **Phase**: Visual Infusion (Phase 1)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/gameplay/components/PrototypeGameLayout.tsx`
  - `src/app/prototype/gameplay/components/PrototypeBoard.tsx`
- **Alasan Perubahan**:
  - Memulai proses peningkatan visual (*Visual Infusion*) ke dalam Gameplay Sandbox tanpa mengubah UX maupun hierarchy layout yang sudah stabil. Fokus pada elemen-elemen estetik.
- **Dampak Perubahan**:
  - **Background Ambience**: Menambahkan efek vignette dan pola latar belakang (sesuai tema) pada tata letak utama dengan blend mode agar terasa lebih dalam.
  - **Ambient Motion**: Menambahkan sistem animasi partikel mengambang (*floating ambient particles*) berbasis SVG di belakang papan yang bergerak secara asinkron untuk memberikan efek kehidupan (bernafas) pada lingkungan permainan tanpa membebani performa.
  - **Panel Styling**: Panel HUD dan Game Log kini memiliki nuansa frosted glass premium (`backdrop-blur`) dengan border aksen emas tanpa membuang warna dasar perkamen.
  - **Board Material**: Container papan permainan diberi *inner shadow* untuk efek pencahayaan 3D (seperti cekungan fisik) yang menambah kesan artefak premium.
  - **Snakes & Ladders**: Filter drop shadow `premiumShadow` ditambahkan pada ular untuk memberinya efek melayang namun tebal, serta garis *highlight* putih semi-transparan untuk efek kilap/licin. Tangga mendapatkan `ladderShadow` khusus untuk menguatkan siluet bentuk aslinya tanpa terlalu berlebihan.
- **Status**: Completed (Menunggu Feedback Tahap Berikutnya)
## [Milestone 3] - Gameplay Redesign Iteration 1 (Foundation Layout)

- **Phase**: Milestone 3 & Iteration 1
- **File yang dibuat atau diubah**:
  - `src/app/prototype/gameplay/page.tsx`
- **Alasan Perubahan**:
  - Mengulang Gameplay Redesign mulai dari Iteration 1 berdasarkan Concept Art terbaru sebagai Single Source of Truth.
  - Fokus utama pada Foundation Layout: Responsive Grid, proporsi, *visual hierarchy*, dan posisi komponen untuk Desktop, Tablet, dan Mobile.
- **Dampak Perubahan**:
  - **Responsive Grid**: Layout diubah menjadi 3-kolom di Desktop, adaptif 2-kolom/fleksibel di Tablet, dan vertikal (*flex-col*) di Mobile.
  - **Board Position**: Papan ditempatkan di *Center Column* dengan proporsi maksimal yang merespons ukuran layar. Area papan diperkecil di Desktop untuk ruang lega, dan dimaksimalkan (*w-full*) di Mobile.
  - **HUD & Log**: Panel HUD (Turn, Active Effect, Ranking) dikelompokkan di kolom kiri. *Game Log* dibuat sebagai *placeholder* kotak bergaris berbentuk buku terbuka khusus desktop (yang telah dipadatkan ukurannya agar tidak mendominasi), dan tombol *pop-up* di mobile.
  - **Dice Area**: Menggunakan layout gabungan (desktop vertikal kanan, mobile horizontal bawah) dengan mempertahankan model visual dadu yang ada dan ukuran yang lebih ringkas.
  - **SVG Assets**: Ular ditingkatkan kualitasnya dengan tubuh organik S-curve panjang, shading premium dan 3D kepala. Tangga diberi depth 3D perspektif dan efek bilah kayu realistis.
- **Status**: Completed (Gameplay Polish Pass Verified)

## [Milestone 3] - Gameplay Prototype: Iteration 3 (HUD & Modals)

- **Phase**: Milestone 3 (Tahap 4) & Iteration 3
- **File yang dibuat atau diubah**:
  - `src/app/prototype/gameplay/page.tsx`
- **Alasan Perubahan**:
  - Meningkatkan UI pendukung di sekitar papan agar sesuai tema "Expedition Table" dan mengimplementasikan konsistensi *Interaction Pattern* yang dioptimalkan untuk Mobile UX (Interaction Frequency > Information Importance).
- **Dampak Perubahan**: 
  - **Ranking**: Menggunakan Accordion di mobile dan Panel Tetap di desktop.
  - **Game Log**: Berubah menjadi *Collapsible Bottom Sheet* dengan indikator badge (titik notifikasi) merah pada tombol FAB log.
  - **Dice Tray**: Posisi & dimensi statis dipertahankan; visual ditingkatkan dengan tekstur beludru merah, bingkai kuningan tebal, bevel shadow, dan animasi glow konstan.
  - **Toast & Modals**: Penambahan mock-up Toast Ribbon (pita klasik berwarna emas/sukses) dan Popup Crisis (bergaya lembar perkamen tua, drop shadow berlapis, efek vignette).
  - Tidak merusak sedikitpun layer Grid, SVG Naga Nusantara, dan layout `100dvh` dari Iterasi 1 dan 2.
- **Status**: Completed (HUD & MODAL VERIFIED)

## [Milestone 3] - Gameplay Foundation Redesign (Planning Phase)

- **Phase**: Milestone 3 (Tahap 1, 2, 3) & Iteration 1 & 2
- **File yang dibuat atau diubah**:
  - `implementation_plan.md`
  - `docs/Management/Gameplay-Visual-Rules.md`
  - `src/app/prototype/gameplay/page.tsx`
- **Alasan Perubahan**:
  - Menjalankan Iterasi 2: Memperbaiki kualitas visual spesifik pada Papan Permainan (Board) agar tampil sebagai obyek fisik premium, sesuai batasan desain yang ditetapkan.
- **Dampak Perubahan**:
  - **Board Frame**: Diberi gaya pinggiran berbayang, tekstur kayu berukir, lengkap dengan aksen ujung kuningan (brass) agar terasa seperti kotak tebal sungguhan.
  - **Board Surface**: Menerapkan tekstur perkamen (parchment) dengan sedikit *noise* untuk menyimulasikan nuansa masa lampau (aging effect).
  - **Tile**: Menambah kontras petak nomor (bevel, inset shadow) serta desain ikon spesial (Start, Finish, Quiz, Bonus) tanpa menghalangi ruang pion.
  - **Snake & Ladder**: Menggunakan *drop shadow filter* berbasis SVG yang tajam. Tangga diganti material kayu solid (thick rails & rungs), sementara ular direvisi menjadi siluet ular utuh dengan *glossy highlight*, bintik sisik, kepala, mata, dan lidah yang jelas. Keduanya benar-benar berada di *atas* petak papan secara Z-index.
  - **Player Token**: Diberi penempatan semu (*dummy*) dengan bayangan kuat (*drop shadow* vertikal tinggi) untuk menunjukkan dimensi 3D pion logam/kayu.
  - Keseluruhan dimensi tata letak selaras 100% dengan dasar yang disetujui pada Iterasi 1 tanpa perubahan posisi sedikitpun. **Area Dadu (Dice Tray)** yang sempat terduplikasi secara keliru di dalam frame papan telah dihapus, mempertahankan komponen final dari Iterasi 1 yang posisinya berada di luar frame.
- **Status**: Iteration 2 Completed & Verified (Memasuki Iteration 3)

## [Tahap 8] - Main Menu Production Implementation (Milestone 2 Completed)

- **Phase**: Tahap 8 (Production) / Final
- **File yang dibuat atau diubah**:
  - `src/components/ui/MainMenu.tsx` (Diganti total)
- **Alasan Perubahan**:
  - Implementasi *Final Approval* dari rancangan Prototipe (Tahap 6A).
- **Dampak Perubahan**:
  - Komponen `MainMenu` di *Production* kini 100% menggunakan arsitektur *Progressive Disclosure* bergaya *Premium Game Setup Wizard*.
  - Transisi didukung oleh `framer-motion` untuk *cross-fade* layar, kemunculan formulir yang berurutan (*staggered*), dan modal melayang (*popover*) untuk `AudioSettings`.
  - Integrasi dengan `ThemeContext` menggunakan nilai dinamis dari `allThemes` secara iteratif.
  - Proses persiapan pemain dan bot otomatis disambungkan ke mesin utama permainan (`onStartGame`).
- **Status**: Completed (Milestone 2 Selesai)


## [Milestone 2] - Main Menu Redesign (Preparation Screen Prototype)

- **Phase**: Milestone 2 (Tahap 4 - Dummy Prototype)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/main-menu/page.tsx`
  - `implementation_plan.md` (Update)
  - `task.md` (Update)
- **Alasan Perubahan**:
  - Merombak total konsep layar Main Menu menjadi *Preparation Screen* (Meja Ekspedisi) berdasarkan persetujuan *Art Direction* baru pada Project Workflow 2.0. Bertujuan membangun hubungan emosional bahwa pemain sedang mempersiapkan petualangan, bukan sekadar mengisi konfigurasi.
- **Dampak Perubahan**:
  - Prototipe Dummy (statis/visual saja) diciptakan di rute `/prototype/main-menu`.
  - **Hero Area**: Mengambil alih 50% layar desktop (atau bagian atas mobile) yang menampilkan *Hero Art* dan Tipografi bernuansa ekspedisi (Thematic).
  - **Progressive Disclosure**: Opsi-opsi (Mode, Daftar Pemain, Tema) yang tadinya tertumpuk, kini disusun berurutan sebagai bagian dari satu kesatuan gulungan *Manifes* agar beban kognitif lebih rendah.
  - **Visual Identity**: Desain mengadopsi material perkamen, *badge* penjelajah untuk kartu nama, serta pratinjau tema statis agar estetika museum/board-game premium terbangun sejak awal.
- **Status**: Completed (Menunggu Feedback Tahap 5)


## [RC v1.0] - Landing Page Final Polish

- **Phase**: Release Candidate Polish (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Menuju versi rilis (*Release Candidate*), diperlukan iterasi mikroskopik pada UI tanpa menambah fitur baru. Mengatasi *error* Framer Motion (`rgba is not animatable`) yang memengaruhi stabilitas klien, menyeimbangkan konsistensi, dan melengkapi aksesibilitas *keyboard* serta optimalisasi lapis render.
- **Dampak Perubahan**:
  - **Framer Bug Fixed**: Animasi pinggiran fitur (*border color*) saat diarahkan panah tetikus (*hover*) diganti sepenuhnya dengan animasi batas cahaya (*glow inset box-shadow*). Hal ini mengeliminasi error `rgba not animatable` secara total.
  - **Premium Atmosphere**: Sentuhan cahaya hangat tak kentara di punggung Hero (via *drop-shadow*) dan tepian layar yang kian pekat (*vignette inset shadow* 150px) membuat nuansa ruang lebih memukau dan dalam (*deep*).
  - **Micro-Interaction & CTA**: Penambahan efek gaya pegas (*spring physics*) yang mulus pada tombol utama (CTA) saat diklik (`scale: 0.96`), disertai bayangan inset kilap di batas tombol.
  - **Feature Cards Uniformity**: Memastikan semua Kartu Fitur menggunakan `h-full` sehingga tinggi ubin merata sempurna. Animasi pendar (*hover*) kini terasa lebih organik dengan transisi pegas.
  - **Hydration Mismatch Fixed**: Mengatasi *error* spesifik `A tree hydrated but some attributes... didn't match` pada elemen SVG `<line>` dan `<circle>` dalam komponen `HeroMedallion`. Hal ini dicapai dengan menyelaraskan presisi desimal matematika (membulatkan nilai hasil `Math.cos/sin` via `.toFixed(2)`) sehingga nilai koordinat yang di-*render* oleh Server-Side (Next.js) sejalan dan sama persis dengan komputasi Client-Side (React).
  - **Performance & A11Y**: *Focus outlines* (Cincin navigasi) bagi pengguna *keyboard* kini terpadu. Lapisan debu, kabut, dan panji *parallax* diberikan akselerator GPU parsial (`willChange: "transform, opacity"`) demi mendongkrak mulusnya pergerakan layar (FPS).
- **Status**: Completed

## [Sprint 5] - Final Art Direction Review

- **Phase**: Sprint 5 (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Melakukan *polish* visual terakhir pada Prototype sebelum dipindahkan ke fase produksi. Merespons keluhan pengguna mengenai tumpang tindih elemen (*overlap*) antara teks atas dengan kotak fitur di bawah pada beberapa ukuran layar desktop.
- **Dampak Perubahan**:
  - **Composition**: Menambahkan `padding-bottom` (pb-24 hingga pb-32) dan mengaplikasikan *responsive scale* (scale-90 hingga scale-100) pada wadah utama. Hal ini menyelesaikan bug visual di mana teks "Game Edukasi Sejarah Indonesia" menghilang (terpotong ke atas) saat kartu fitur mendesak tombol "Mulai Petualangan" di bagian bawah layar.
  - **Visual Hierarchy & Sizing**: Mengurangi dimensi keseluruhan pada Kotak Fitur (padding, font-size, dan ukuran ikon di- *scale down*) sehingga memberikan ruang napas yang lebih baik antara tombol dan menu fitur.
  - **Contrast & Atmosphere**: Mempergelap bayangan sudut layar (*vignette*) menjadi `rgba(10,26,46,0.50)` agar perhatian mata semakin terkunci ke pusat (*Hero container*). 
  - **Premium Feel**: Menaikkan kontras teks subtitel kotak fitur demi keterbacaan, serta menerapkan `mixBlendMode: "multiply"` pada teks Aksara air (*watermark*) di belakang judul utama agar terasa terukir langsung pada tekstur kertas.
- **Status**: Completed

## [Sprint 4] - Premium UI Language

- **Phase**: Sprint 4 (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Menyelaraskan seluruh *Design Language* dari komponen UI penunjang (Kartu Fitur, Tombol, Panel Deskripsi) agar setara dan konsisten dengan Hero Section yang bernuansa ukiran prasasti (berornamen emas-biru dongker). Membuang gaya *modern web / glassmorphism* putih yang terasa generik.
- **Dampak Perubahan**:
  - Panel Tagline/Deskripsi kini menggunakan *background gradient Navy* dengan batas ganda *gold emboss*, terasa seperti lempengan prasasti.
  - Kartu Fitur (Bermain, Belajar, dll) diubah dari panel transparan putih menjadi panel gelap elegan dengan pendaran keemasan saat diarahkan kursor (*hover*).
  - Tombol CTA dipertegas batas ukirannya (*inner inset shadow*) dan pendaran partikel saat di-*hover*.
  - Garis Pembatas (Divider) diganti menjadi bentuk gradasi emas dengan ornamen ketupat, menggantikan border kayu biasa.
  - Memperbaiki peringatan *Hydration Mismatch Error* secara menyeluruh dengan memasang status peringatan supresi pada SVG `HeroMedallion`.
- **Status**: Completed

## [Sprint 3] - Indonesian Identity

- **Phase**: Sprint 3 (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Memperkuat identitas sejarah Indonesia agar saat *screenshot* diambil tanpa judul, orang tetap tahu bahwa ini adalah game Indonesia, dengan cara mengganti elemen generik menjadi ikon dan ornamen khas Nusantara secara elegan (premium).
- **Dampak Perubahan**:
  - Mengganti kompas barat menjadi lambang *Surya Majapahit* (dan sekaligus memperbaiki *hydration mismatch error*).
  - Mengganti crest bagian atas dengan ornamen siluet *Keris Bersilang*.
  - Mengganti corner styling dengan *Ukiran Jepara*.
  - Mengganti garis bawah dengan pola *Batik Parang*.
  - Mengganti feature icons (Belajar, Bermain, Menang, Bangga) dengan ikon bernuansa nusantara (Lontar, Dadu Kayu, Mahkota Nusantara, Bambu Runcing & Bendera).
  - Menambahkan watermark *Aksara Jawa/Nusantara* yang sangat tipis di belakang judul utama "ULAR TANGGA".
- **Status**: Completed

## [Sprint 2] - Ambient Motion

- **Phase**: Sprint 2 (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Menghidupkan layar *Idle* pada Hero Section agar tidak membosankan tanpa mengganggu elemen antarmuka atau klik pemain (aksesibilitas tinggi). Semua motion/animasi diperlambat agar terasa sinematik dan mengikuti standar "prefers-reduced-motion".
- **Dampak Perubahan**:
  - *Parallax Background Tracking*: Lapisan debu, siluet candi, dan kabut cahaya kini bergerak sedikit lambat merespons pergerakan *mouse* pengguna (menggunakan `useSpring` dari Framer Motion).
  - *Ambient Depth*: Menambahkan kabut (*fog*), cahaya god-rays (*light rays*), serta memperlambat dan memperluas partikel debu melayang dan ornamen pernafasan logo (*breathing logo*).
  - *Accessibility*: Semua animasi dihentikan atau disederhanakan ketika mendeteksi kondisi perangkat `prefers-reduced-motion: reduce`.
- **Status**: Completed

## [Sprint 1] - Hero Section 2.0

- **Phase**: Sprint 1 (Completed)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx`
- **Alasan Perubahan**:
  - Mengubah Hero Section agar menjadi pusat perhatian utama yang dramatis namun tetap elegan, tidak seperti poster atau landing page biasa melainkan lebih menyerupai *premium indie game artifact*.
- **Dampak Perubahan**:
  - Redesign *Hero Container* menggunakan layer SVG, ukiran berlapis (engraved effect), paper texture dengan blend mode, dan penambahan iluminasi/glow yang dinamis.
  - Implementasi *3D Bevel/Embossed text shadow* pada teks "Ular Tangga".
  - Menambahkan ilustrasi latar *Gunungan Wayang* bersiluet dengan opacity rendah dan pergerakan halus (breathing).
  - Mengubah layout title box sebelumnya menjadi desain yang lebih menyatu secara arsitektural.
- **Status**: Completed (Prototype updated)


## [Prototype V2] - Main Menu Redesign — Atmosphere & Visual Identity

- **Phase**: Prototype V2 (Menunggu Review)
- **File yang dibuat atau diubah**:
  - `src/app/prototype-v2/page.tsx` (**BARU** — Prototype standalone, dapat dihapus)
- **Alasan Perubahan**:
  - Iterasi kedua redesign splash screen, berfokus pada pengisian ruang kosong dan pembangunan ambience. Layout tidak berubah dari V1.
- **Dampak Perubahan**:
  - Tidak ada perubahan pada file existing. Dapat diakses di `/prototype-v2`. Hapus dengan menghapus folder `src/app/prototype-v2/`.
  - Elemen baru yang ditambahkan vs V1:
    - **Siluet Borobudur** (bottom-left, opacity 10%, floating animation lambat)
    - **Siluet Prambanan** (bottom-right, opacity 9%, floating animation lambat)
    - **Kapal Pinisi** (left-center, opacity 13%, wave animation)
    - **Old compass ornament** (lower-left area, opacity 12%)
    - **Nusantara map outline** (right-center, opacity 7%, xl breakpoint)
    - **16 ambient floating particles** (gold dots tersebar, opacity 8–13%)
    - **3 layer cahaya**: diagonal kiri, diagonal kanan, vertical top (god ray)
    - **Vignette diperkuat**: rgba(10,26,46,0.35) vs sebelumnya 0.28
    - **Bottom fade** untuk kontras feature strip
- **Status**: Waiting Review

## [Prototype] - Main Menu Redesign — Splash Screen

- **Phase**: Prototype (Menunggu Review)
- **File yang dibuat atau diubah**:
  - `src/app/prototype/page.tsx` (**BARU** — Prototype standalone, dapat dihapus)
- **Alasan Perubahan**:
  - Melakukan redesign visual splash screen (Main Menu pertama) agar terasa seperti main menu game premium, bukan landing page. Dibuat sebagai prototype terpisah agar mudah dihapus apabila hasil tidak memuaskan.
- **Dampak Perubahan**:
  - Tidak ada perubahan pada file existing. Prototype dapat diakses di `/prototype`. Untuk menghapus: hapus folder `src/app/prototype/`.
  - Elemen baru yang diimplementasikan:
    - Multi-layer background (radial gradient + paper grain SVG filter + batik pattern + golden spotlight + vignette kuat)
    - Hero Map SVG (kiri layar) dengan floating animation via Framer Motion, opacity 30%
    - Compass Rose SVG (kanan atas) dengan rotasi sangat lambat (140s/loop)
    - Hero Title Frame dengan double border gold, corner ornaments 4 sudut
    - Subtitle "Sejarah Nusantara" dengan shimmer animation
    - CTA Button redesign: gradient navy, dice icon, Framer Motion whileHover/whileTap, gold shimmer sweep on hover, sub-hint text reveal
    - Feature Strip 4-kolom di bagian bawah: Belajar / Bermain / Menang / Bangga
- **Status**: Waiting Review

## [Experimental] - Custom Background Image Board

- **Phase**: Experimental
- **File yang dibuat atau diubah**:
  - `src/components/papan/BoardExperimental.tsx` (Baru)
  - `src/components/papan/TileExperimental.tsx` (Baru)
  - `src/components/GameLayout.tsx` (Modifikasi import)
- **Alasan Perubahan**:
  - Membuat papan percobaan menggunakan gambar (asset) custom dari user. Pendekatan eksperimental digunakan agar tidak merusak `Board.tsx` utama.
- **Dampak Perubahan**:
  - `GameLayout` sekarang merender `BoardExperimental` yang menggunakan `papan-baru.png` sebagai latar utuh dan memiliki tile transparan tanpa nomor.
- **Status**: Completed (Menunggu user memasukkan file `papan-baru.png`)

## [Phase Q2.1] - Board Background Polish

- **Phase**: Phase Q2.1
- **File yang dibuat atau diubah**:
  - `src/components/papan/Board.tsx`
- **Alasan Perubahan**:
  - Papan membutuhkan elemen visual bernuansa Nusantara. Menggunakan gambar pola batik sebagai background agar papan terasa lebih otentik.
- **Dampak Perubahan**:
  - `Board.tsx` telah dimodifikasi dengan penambahan *inline style* `backgroundImage` untuk menggunakan `batik-pattern.png`. Mode *blend* (multiply) ditambahkan agar pattern menyatu dengan warna dasar `bg-[#f4ebd0]` sehingga tidak mengganggu visibilitas petak papan.
- **Status**: Completed

## [Patch v1.1] - Special Tiles Mechanic Expansion

- **Phase**: Patch v1.1
- **File yang dibuat atau diubah**:
  - `src/types/player.ts`
  - `src/lib/gameEngine.ts`
  - `src/lib/movement.ts`
  - `src/components/ui/EffectModal.tsx`
- **Alasan Perubahan**:
  - Melakukan ekspansi Petak Bonus dan Penalti dari 6 efek menjadi 10 efek dinamis (5 Buff & 5 Debuff).
  - Memperbarui mekanisme *Double Roll* agar tidak memicu petak bonus ganda (mencegah *infinite loop*) dan menambahkan mekanisme *Anti-Snowball* (Bonus Konsistensi +3 Poin) pada *Steal Point* untuk pemain dengan peringkat pertama.
- **Dampak Perubahan**:
  - Dinamika taktik permainan semakin bervariasi dengan hadirnya efek seperti *Cendekiawan* (pengganda poin kuis), *Mesin Waktu* (teleportasi instan), *Pajak Kolonial*, *Amnesia Sejarah*, dan *Phobia Tangga*.
- **Status**: Completed

## [Phase 14.5] - Feature Polish (Headline, Quiz Zones, DoubleRoll)

- **Phase**: Phase 14.5
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/data/papan/board.ts`
- **Alasan Perubahan**:
  - Headline pada Desktop disesuaikan lebarnya agar tidak bertabrakan dengan sidebar.
  - Zona kuis diseimbangkan berdasarkan distribusi baru (Total 35 soal): 10 Easy (1-20), 15 Medium/Hard (21-70), 10 Extreme (71-99).
  - Mekanika *DoubleRoll* dibuat lebih instan dan otomatis. AI sekarang akan secara otomatis mengeksekusi roll kedua tanpa pemain perlu mengeklik tombol "Lanjutkan" pada popup efek, membuat langkah terkesan *seamless* (sebagai satu kesatuan aksi berturut-turut).
- **Dampak Perubahan**:
  - UI pada Desktop terlihat jauh lebih rapi. Distribusi kesulitan kuis lebih proporsional dari awal hingga akhir papan. Siklus DoubleRoll tidak lagi mengganggu ritme putaran giliran.
- **Status**: Completed

## [Bug Investigation] - Bot Teleportation 85 -> 43

- **Phase**: Solved
- **File yang diperiksa**:
  - `src/lib/gameEngine.ts`
  - `src/components/GameLayout.tsx`
- **Hasil Investigasi**:
  - Analisa Anda **100% tepat!** Animasi gerakan (*Hop-by-hop*) mengkalkulasi panjang rute (path) HANYA berdasarkan nilai dadu murni (`dice.currentValue`), TANPA menyertakan penambahan +2 langkah dari fase krisis.
  - Hal ini menyebabkan animasi pion akan berhenti lebih awal (kurang 2 langkah). Namun di belakang layar, Game Engine tetap menghitung posisi tujuan dengan +2 langkah.
  - Ketidakselarasan ini menyebabkan saat animasi hop selesai, pion secara paksa ditarik (teleport) ke hasil akhir Game Engine. Dalam kejadian yang Anda alami, kemungkinan hasil akhir Game Engine mendarat pada **Ular di petak 87 (yang turun ke 24)** atau ular lainnya, sehingga tiba-tiba muncul animasi ular yang membuat pion turun secara misterius dari titik berhenti animasinya.
- **Kesimpulan**: Bug telah diatasi dengan menambahkan properti `movementSteps` dari `gameEngine.ts` yang dikirim ke `GameLayout.tsx` agar rute animasi selalu sinkron dengan hasil hitungan riil engine (Dadu + Buff/Debuff).

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
- **Status**: Completed

## [Phase 6.2] - Movement Module

- **Phase**: Phase 6.2
- **File yang dibuat atau diubah**:
  - `src/lib/movement.ts`
- **Alasan Perubahan**:
  - Diperlukan untuk menghitung perpindahan posisi pemain berdasarkan posisi saat ini dan nilai dadu. Module ini diimplementasikan agar Game Engine dapat mengeksekusi pergerakan pion secara independen, memisahkan logika dari UI sesuai arsitektur.
- **Dampak Perubahan**:
  - Game Engine sekarang bisa memanggil fungsi `calculateMovement` untuk menentukan ke mana pion harus bergerak, serta mendeteksi apakah pemain telah mencapai garis akhir (menang) atau gagal melangkah karena lemparan dadu melebihi batas petak terakhir.
- **Status**: Completed

## [Phase 6.3] - Score Module

- **Phase**: Phase 6.3
- **File yang dibuat atau diubah**:
  - `src/lib/score.ts`
- **Alasan Perubahan**:
  - Diperlukan modul sentral untuk memproses penambahan, pengurangan, serta perhitungan ulang skor total pemain berdasarkan jumlah benar atau salah.
- **Dampak Perubahan**:
  - Modul ini memastikan manipulasi skor terpusat dalam *Business Logic* murni tanpa melibatkan dependensi dari antarmuka pengguna (UI). Game Engine maupun Quiz Module dapat memanfaatkan fungsi-fungsi ini nantinya.
- **Status**: Completed

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
- **Status**: Completed

## [Phase 7.1] - Layout System

- **Phase**: Phase 7.1
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
  - `src/app/page.tsx`
- **Alasan Perubahan**:
  - Diperlukan untuk merancang fondasi struktur layout utama yang memisahkan tata letak komponen antara Desktop dan Mobile sesuai dokumen `UX-Design.md` dan `Architecture.md`.
- **Dampak Perubahan**:
  - Mempersiapkan area peletakan komponen-komponen React selanjutnya (Board, HUD, Roll Dice) dalam grid atau flex layout yang responsif tanpa perlu khawatir menumpuk, serta menyediakan area sticky bottom panel untuk interaksi Mobile.
- **Status**: Completed

## [Phase 7.2] - Board Component

- **Phase**: Phase 7.2
- **File yang dibuat atau diubah**:
  - `src/components/Board.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Diperlukan untuk merender papan permainan 10x10 menggunakan data asli dari `src/data/board.ts` dan mengganti area *placeholder* di dalam `GameLayout`.
- **Dampak Perubahan**:
  - Papan permainan kini tampil dengan 100 *tile* yang diurutkan dengan pola zig-zag (kiri-ke-kanan, kanan-ke-kiri). Setiap petak sudah memiliki indikator visual dasar terkait posisinya dan tipe petaknya (Quiz, Fact, Bonus, Penalty, dsb). Selain itu, komponen ini juga telah disiapkan untuk area peletakan bidak pemain (Player Token) serta *layer SVG overlay* untuk jalur ular dan tangga yang akan dikembangkan pada fase selanjutnya.
- **Status**: Completed

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

## [Phase 14] - Game Design Revision 01

- **Phase**: Phase 14
- **File yang dibuat atau diubah**: player.ts, gameState.ts, MainMenu.tsx, gameEngine.ts, board.ts, ResultScreen.tsx.
- **Alasan Perubahan**: Revisi sistem penentuan pemenang (Champion bukan lagi siapa yang mencapai petak 100, tapi skor tertinggi). Petak 100 kini hanya garis finish biasa tanpa syarat MVP. Juga menambahkan penghargaan Fastest Explorer dan History Master, serta meningkatkan frekuensi kuis menjadi ~25 petak dengan sebaran kesulitan progresif.
- **Dampak Perubahan**: GameEngine dirombak pada pengecekan akhir permainan dan resolusi petak 100. Papan (board.ts) kini memproduksi 25 petak kuis yang disebar ke 4 zona. ResultScreen direkayasa ulang dengan antarmuka yang menampilkan panel penghargaan khusus.
- **Status**: Completed

## [Phase 14.1] - Gameplay Balancing Update

- **Phase**: Phase 14.1
- **File yang dibuat atau diubah**:
  - `src/lib/gameEngine.ts`
  - `src/data/papan/ladders.ts`
  - `src/components/papan/Tile.tsx`
- **Alasan Perubahan**:
  - Menindaklanjuti hasil audit *Gameplay Review & Balancing*. Diperlukan penyesuaian agar sistem kemenangan berbasis skor tidak bertolak belakang dengan pencapaian mencapai garis akhir (petak 100), mengatur tempo bermain agar tidak terlalu cepat selesai karena tangga yang terlalu panjang, menyesuaikan persentase reward dari efek mencuri poin (*StealPoint*), dan memberikan petunjuk visual kepada pemain terkait *Endgame Zone*.
- **Dampak Perubahan**:
  - `gameEngine.ts`: Pemain yang pertama kali mencapai petak 100 kini langsung mendapatkan instan +15 Poin (Fastest Explorer Reward). Hal ini memotivasi pemain untuk berlomba mencapai garis akhir tanpa takut kalah poin. Efek *StealPoint* juga diperkuat dari 3 menjadi 7 poin agar setara dengan bobot kuis tingkat *Medium-Hard*.
  - `ladders.ts`: Tangga super panjang dari 28 ke 84 dipotong menjadi 28 ke 54. Hal ini memastikan permainan tidak berakhir prematur dan pemain masih memiliki waktu yang cukup untuk memanen poin edukasi sejarah di papan tengah.
  - `Tile.tsx`: Petak bernomor 91 hingga 99 (Zona Krisis/Farming) kini memiliki indikator visual berupa *border* merah dan *glow* merah di bagian dalam untuk menandakan area genting/pertarungan poin terakhir.
- **Status**: Completed

## [Phase Q1] - Visualisasi Ular & Tangga

- **Phase**: Phase Q1
- **File yang dibuat atau diubah**:
  - `src/components/papan/Board.tsx`
  - `docs/Management/task.md`
- **Alasan Perubahan**:
  - Menindaklanjuti audit UI/UX, jalur ular dan tangga tidak terlihat secara visual di papan, membingungkan pemain.
- **Dampak Perubahan**:
  - Menambahkan layer SVG absolut pada papan. Garis SVG digambar menggunakan koordinat dinamis berbasis persentase (dari `getCoordinates`) agar responsif. Ular menggunakan gradient merah putus-putus, dan tangga menggunakan gradient hijau solid.
- **Status**: Completed

## [Phase Q2] - Peningkatan Estetika Papan

- **Phase**: Phase Q2
- **File yang dibuat atau diubah**:
  - `src/components/papan/Tile.tsx`
  - `src/components/papan/Board.tsx`
- **Alasan Perubahan**:
  - Papan sebelumnya terlihat terlalu kaku dengan warna modern (putih/abu-abu). Dibutuhkan sentuhan tema "Sejarah" berupa warna kayu/perkamen dan pergantian teks kaku menjadi ikonografi.
- **Dampak Perubahan**:
  - Menyelaraskan seluruh palet papan (`Board.tsx`) dan petak (`Tile.tsx`) menggunakan warna perkamen (`#fdf6e3`), `border` cokelat/kayu, serta mengganti teks tipe petak dengan ikon (📜, ⭐, ⚠️, 👑).
- **Status**: Completed

## [Phase Q3] - Dice Animation

- **Phase**: Phase Q3
- **File yang dibuat atau diubah**:
  - `src/components/dice/Dice.tsx`
  - `src/components/dice/Dice.module.css`
- **Alasan Perubahan**:
  - Animasi dadu sekadar bergetar kiri-kanan secara 2D. Diperlukan interaksi lemparan yang lebih memuaskan secara visual.
- **Dampak Perubahan**:
  - Mengubah keyframes menjadi efek lompatan `tumble` (scale, translateY, rotasi 360 derajat) dan memberikan ikon dadu berputar (🎲) selama proses *rolling* via `::after`.
- **Status**: Completed

## [Phase Q4] - Player Movement Animation

- **Phase**: Phase Q4
- **File yang dibuat atau diubah**:
  - `src/components/player/PlayerToken.tsx`
  - `src/components/papan/Tile.tsx`
  - `src/components/papan/Board.tsx`
- **Alasan Perubahan**:
  - Pion sebelumnya terperangkap di dalam DOM petak masing-masing, sehingga pemain berpindah petak secara teleportasi instan (mengganggu *game feel*).
- **Dampak Perubahan**:
  - Melepas `PlayerToken` dari dalam `<Tile>` dan memindahkannya ke dalam *absolute overlay* di `<Board>`. Memposisikan pion dengan properti `left` dan `top` secara kalkulasi persentase, ditambah transisi CSS mulus agar perpindahan petak terlihat seperti meluncur (*sliding*).
- **Status**: Completed

## [Phase Q5] - Snake & Ladder Transition Animation

- **Phase**: Phase Q5
- **File yang dibuat atau diubah**:
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Animasi pergerakan saat terkena ular atau tangga terasa prematur, pion langsung berpindah ke ujung tanpa jeda. Hal ini menghilangkan sensasi kejutan.
- **Dampak Perubahan**:
  - Menambahkan *interceptor* di dalam `applyGameResult`. Jika pemain mendarat di ular/tangga, state pertama (*intermediate state*) diterapkan untuk membiarkan pemain bergerak ke petak pendaratan. Setelah jeda waktu (`700ms`), baru state akhir diaplikasikan (merosot/naik) dan memunculkan pop-up yang sebelumnya tertunda.
- **Status**: Completed

## [Phase Q6] - Result Screen Improvement

- **Phase**: Phase Q6
- **File yang dibuat atau diubah**:
  - `src/components/ui/ResultScreen.tsx`
  - `src/components/ui/Confetti.tsx` (Baru)
- **Alasan Perubahan**:
  - Tampilan akhir (*Result Screen*) perlu memberikan kesan *closure* yang memuaskan dan merayakan kemenangan pemain secara visual.
- **Dampak Perubahan**:
  - Membuat komponen `Confetti` murni menggunakan React & CSS tanpa library eksternal agar proyek tetap ringan dan arsitektur modular terjaga.
  - Menambahkan animasi *bounce* dan *pulse* pada ikon piala Champion di `ResultScreen` serta menyertakan rintikan konfeti di latar belakang.
  - Komponen lain di Result Screen seperti metrik *Fastest Explorer* dan *History Master* sudah tertata dengan baik sehingga dipertahankan.
- **Status**: Completed

## [Phase Q7] - Audio Polish

- **Phase**: Phase Q7
- **File yang dibuat atau diubah**:
  - `src/components/ui/ResultScreen.tsx`
  - `src/components/ui/AudioSettings.tsx`
  - `src/components/ui/FloatingAudioControl.tsx`
  - `src/components/ui/DiceModifierModal.tsx`
  - `src/components/GameLayout.tsx`
- **Alasan Perubahan**:
  - Audio (BGM dan SFX) perlu diintegrasikan secara menyeluruh ke seluruh interaksi pengguna yang sebelumnya masih belum memutar suara, untuk memastikan suasana permainan hidup namun terkontrol.
- **Dampak Perubahan**:
  - Menambahkan eksekusi *sound effect* (`playSFX('click')`) pada berbagai tombol kritis yang sebelumnya belum merespons dengan audio (misalnya tombol navigasi `ResultScreen`, tombol *Lanjutkan* pada modal penalti, tombol kontrol Audio mengambang, serta tombol menu log).
  - Sistem BGM antara antarmuka utama (`MainMenu`) dan permainan (`GameLayout`) sudah tervalidasi menggunakan sinkronisasi siklus hidup React (`mount`/`unmount`), menghindari tumpang tindih (*overlap*) BGM secara absolut.
- **Status**: Completed

# #   [ P h a s e   P 1 ]   -   I t e r a s i   G a m e   F e e l   &   V i s u a l   A u d i t 
 
 -   * * P h a s e * * :   P h a s e   P 1 
 -   * * F i l e   y a n g   d i b u a t   a t a u   d i u b a h * * : 
     -   \ s r c / l i b / m o v e m e n t . t s \ 
     -   \ s r c / c o m p o n e n t s / G a m e L a y o u t . t s x \ 
     -   \ s r c / c o m p o n e n t s / p l a y e r / P l a y e r T o k e n . t s x \ 
     -   \ s r c / c o m p o n e n t s / p a p a n / B o a r d . t s x \ 
 -   * * A l a s a n   P e r u b a h a n * * : 
     -   M e n i n d a k l a n j u t i   a u d i t   p e n g a l a m a n   b e r m a i n   ( G a m e   F e e l )   d a n   b u g   r e n d e r   v i s u a l   U l a r / T a n g g a . 
     -   P e r g e r a k a n   p i o n   ( * s l i d i n g * )   d i p o t o n g   m e n j a d i   a n i m a s i   l o m p a t   ( * h o p - b y - h o p * )   p e r   p e t a k   u n t u k   m e n i n g k a t k a n   i n t e r a k t i v i t a s . 
     -   U l a r   l u r u s   v e r t i k a l   s e b e l u m n y a   m e n g a l a m i   b u g   t i d a k   t e r - r e n d e r   p a d a   b r o w s e r   w e b   ( C h r o m e / S a f a r i )   k a r e n a   k e t e r b a t a s a n   \ l i n e a r G r a d i e n t \   d e n g a n   \ o b j e c t B o u n d i n g B o x \ . 
 -   * * D a m p a k   P e r u b a h a n * * : 
     -   * * M o v e m e n t   M o d u l e * * :   D i b u a t   f u n g s i   \ c a l c u l a t e M o v e m e n t P a t h \   u n t u k   m e n j a b a r k a n   r u t e   l a n g k a h   s e c a r a   a b s o l u t   d a r i   p o s i s i   a s a l   k e   t u j u a n   ( t e r m a s u k   s a a t   p a n t u l a n / \  o u n c i n g \   d a r i   g a r i s   a k h i r ) . 
     -   * * G a m e   L a y o u t * * :   M e r o m b a k   o r k e s t r a s i   t i m e l i n e   m e n g g u n a k a n   \ e x e c u t e H o p A n i m a t i o n \ .   P e r g e r a k a n   p i o n   d i t u n d a   s e t i a p   3 5 0 m s   ( d i s e r t a i   S F X   l a n g k a h )   h i n g g a   m e n c a p a i   t u j u a n   d a d u ,   l a l u   d i j e d a   s e j e n a k   s e b e l u m   p i o n   b e r e a k s i   p a d a   e f e k   u a r / t a n g g a . 
     -   * * P l a y e r   T o k e n * * :   M e n a m b a h k a n   h o o k   \ i s H o p p i n g \   y a n g   m e r e s p o n s   t r a n s i s i   k o o r d i n a t ,   m e n c i p t a k a n   e f e k   l o m p a t a n   ( p a n t u l a n   * s c a l e *   d a n   p e n i n g g i a n   * t r a n s l a t e Y * )   s e h i n g g a   b i d a k   t i d a k   s e k a d a r   b e r g e s e r   t e t a p i   ' m e l a n g k a h ' . 
     -   * * B o a r d   S V G * * :   \ B o a r d . t s x \   m e r o m b a k   r e n d e r   g a r i s   m e n j a d i   b e r b a s i s   v i e w B o x   m u r n i   ( \     0   1 0 0   1 0 0 \ ) .   U l a r   k i n i   b e r b e n t u k   * B e z i e r   C u r v e *   ( \ < p a t h > \ )   l e n g k a p   d e n g a n   v i s u a l i s a s i   k e p a l a   ( m a t a   d a n   l i d a h )   s e r t a   s i s i k   u l a r .   T a n g g a   d i t a m b a h k a n   d e t a i l   * r u n g s *   ( a n a k   t a n g g a )   d i   a n t a r a   d u a   g a r i s   p e g a n g a n   s e h i n g g a   l e b i h   m e n y e r u p a i   o b j e k   n y a t a   a l i h - a l i h   s e k a d a r   g a r i s   s e m u .   G a r i s   g r a d i e n   j u g a   m e m a n f a a t k a n   k o o r d i n a t   a b s o l u t   \ u s e r S p a c e O n U s e \   d e m i   t e r h i n d a r   d a r i   c a c a t   r e n d e r . 
 -   * * S t a t u s * * :   C o m p l e t e d 
 
 
 # #   [ P h a s e   P 1 . 1 ]   -   G a m e   F e e l   P o l i s h i n g   ( I t e r a s i   A n i m a s i ) 
 
 -   * * P h a s e * * :   P h a s e   P 1 . 1 
 -   * * F i l e   y a n g   d i b u a t   a t a u   d i u b a h * * : 
     -   \ s r c / u t i l s / g e o m e t r y . t s \   ( B a r u ) 
     -   \ s r c / c o n s t a n t s / g a m e . t s \ 
     -   \ s r c / c o m p o n e n t s / p a p a n / B o a r d . t s x \ 
     -   \ s r c / c o m p o n e n t s / G a m e L a y o u t . t s x \ 
     -   \ s r c / c o m p o n e n t s / p l a y e r / P l a y e r T o k e n . t s x \ 
 -   * * A l a s a n   P e r u b a h a n * * : 
     -   M e r e v i s i   a r s i t e k t u r   a g a r   k a l k u l a s i   g e o m e t r i   v i s u a l   ( C u b i c   B e z i e r   u l a r ,   k e m i r i n g a n   t a n g g a )   d i p i s a h k a n   d a r i   l a y e r   b i s n i s   \ m o v e m e n t . t s \ . 
     -   M e n g e k s t r a k s i   a n g k a   \ m a g i c   n u m b e r s \   d u r a s i   t i m e o u t   a n i m a s i   k e   d a l a m   \ G A M E _ C O N S T A N T S \ . 
     -   M e r o m b a k   a n i m a s i   * s l i d i n g *   s t a t i s   s a a t   m e n a i k i   t a n g g a / m e n u r u n i   u l a r   m e n j a d i   p e n g a n i m a s i a n   a b s o l u t   * f r a m e - b y - f r a m e *   a g a r   p i o n   b e n a r - b e n a r   m e l u n c u r   d i   a t a s   l e n g k u n g a n   b a d a n   u l a r   s e c a r a   r e a l i s t i s . 
 -   * * D a m p a k   P e r u b a h a n * * : 
     -   * * A r s i t e k t u r * * :   \ g e o m e t r y . t s \   k i n i   b e r t a n g g u n g   j a w a b   p e n u h   t e r h a d a p   * p r e s e n t a t i o n   l o g i c * .   L a y e r   U I   m e m a n g g i l   f u n g s i   u t i l i t a s   i n i . 
     -   * * B a l a n c i n g * * :   D u r a s i   a n i m a s i   h o p   d a n   d e l a y   a n t a r   e v e n t   d i k e n d a l i k a n   p e n u h   o l e h   p r o p e r t i   \ A N I M A T I O N \   d i   \ G A M E _ C O N S T A N T S \ . 
     -   * * G a m e   F e e l * * :   \ e x e c u t e T i l e E v e n t A n i m a t i o n \   m e n g g u n a k a n   \ 
 e q u e s t A n i m a t i o n F r a m e \   s e l a m a   8 0 0 m s   b e r s a m a   * e a s i n g   f u n c t i o n *   k u a d r a t i k .   H a l   i n i   m e m a k s a   R e a c t   u n t u k   m e n e r j e m a h k a n   p e r h i t u n g a n   B e z i e r   d a n   m e m - * b y p a s s *   C S S   T r a n s i t i o n   ( d i k o n t r o l   v i a   f l a g   \ i s T r a n s i t i o n i n g \   d i   \ P l a y e r T o k e n \ ) .   E f e k   d e s i s a n   u l a r   d a n   k e m e r o s o t a n   t e r a s a   s i n k r o n   s e c a r a   p r e s i s i   d e n g a n   b e n t u k   v i s u a l   u l a r   ( S - C u r v e )   d a n   t a n g g a . 
 -   * * S t a t u s * * :   C o m p l e t e d 
 
 
## [Phase 14.2] - Visual & Content Polishing

- **Phase**: Phase 14.2
- **File yang dibuat atau diubah**:
  - src/components/player/PlayerToken.tsx
  - src/components/dice/Dice.module.css
  - src/data/questions.ts
- **Alasan Perubahan**:
  - Pengguna melaporkan bahwa animasi lemparan dadu kurang *smooth*, presisi animasi ular dan tangga kurang tepat, dan soal kuis perlu ditambah agar variasi bertambah. Pengguna juga meminta untuk menghapus kondisi ular pada petak 56 (sudah terhapus di komit sebelumnya).
- **Dampak Perubahan**:
  - *PlayerToken*: Menghilangkan offset saat sedang proses transisi (ular/tangga) sehingga token mengikuti koordinat SVG *board* secara presisi tanpa pergeseran.
  - *Dice*: Menerapkan transisi rotasi *cubic-bezier* di animasi *roll* sehingga dadu terlihat berputar lebih realistis (memantul secara *smooth*).
  - *Questions*: Menambahkan 20 pertanyaan sejarah baru (Total 40 soal), sehingga setiap kategori *difficulty* memiliki 10 soal, mengurangi repetisi selama sesi permainan.
- **Status**: Completed


## [Phase 14.3] - Mobile Responsiveness & Anim Fix

- **Phase**: Phase 14.3
- **File yang dibuat atau diubah**:
  - src/components/GameLayout.tsx
  - src/components/papan/Board.tsx
  - src/components/papan/Tile.tsx
  - src/components/player/PlayerToken.tsx
  - src/components/ui/FloatingAudioControl.tsx
- **Alasan Perubahan**:
  - Poin 1: Menangani bug posisi animasi Ular/Tangga dan bug _hopping_ saat landing di posisi akhir ular.
  - Poin 2: Dadu yang menggulung kelamaan menghalangi game flow.
  - Poin 3-5: Layout Environment, Tombol Audio, dan Pop-up banner sangat over-scaled di device Mobile.
- **Dampak Perubahan**:
  - *PlayerToken.tsx*: Menambahkan useRef prevIsTransitioning untuk mencegah trigger animasi Squash & Stretch secara tidak sengaja ketika koordinat pendaratan presisi dan transisi (isTransitioning) berakhir.
  - *GameLayout.tsx*: Mengurangi durasi rolling dadu menjadi 400ms dan menambahkan jeda 600ms ekstra untuk menampilkan hasil dadu; banner diperkecil secara responsif menggunakan utilitas *sm:px-8*.
  - *Tile & Board & Audio*: Menyempurnakan ukuran font, stroke svg ular/tangga, dan dimensi elemen pada ukuran base agar ideal untuk versi mobile.
- **Status**: Completed


## [Phase 14.4] - Dynamic Token Sizing & Animation Sync

- **Phase**: Phase 14.4
- **File yang diubah**:
  - src/components/GameLayout.tsx
  - src/components/player/PlayerToken.tsx
- **Alasan Perubahan**:
  - Poin 1: Ukuran pion dirasa tidak konsisten kebutuhannya; butuh ukuran kecil saat tumpuk-menumpuk (Start) dan ukuran normal saat sendirian.
  - Poin 2: Pergerakan hop-by-hop terasa kurang smooth akibat ketidaksesuaian durasi loop dengan CSS transisi.
- **Dampak Perubahan**:
  - (Menunggu Implementasi)
- **Status**: Completed


## [Phase 15.0] - Polish & Rantai Event

- **Phase**: Phase 15.0
- **File yang diubah**:
  - src/lib/gameEngine.ts
  - src/components/GameLayout.tsx
  - src/components/ui/EffectModal.tsx
  - src/components/ui/CrisisAlertModal.tsx
- **Alasan Perubahan**:
  - Menerapkan penundaan buff Double Roll.
  - Memperluas area Crisis Buff hingga petak 90.
  - Memindahkan posisi Game Log ke kiri (Desktop) dan via floating button (Mobile).
  - Membuat pop-up otomatis tertutup tanpa klik.
  - Memperbaiki animasi ular/tangga yang tertimpa pop-up quiz.
- **Dampak Perubahan**:
  - (Menunggu Implementasi)
- **Status**: Waiting Review


- **Status**: Completed


## [Phase 16.0] - UI Refinements & Animasi

- **Phase**: Phase 16.0
- **File yang diubah**:
  - src/components/ui/EffectModal.tsx
  - src/components/GameLayout.tsx
  - src/components/player/PlayerToken.tsx
  - src/globals.css (untuk animasi marquee)
- **Alasan Perubahan**:
  - Laporan bug di mana pop-up masih memiliki tombol lanjutkan.
  - Posisi layout Top Bar (Mobile) yang kurang presisi.
  - Kebutuhan memaksimalkan ukuran papan di mode Desktop via collapsible Sidebar Log.
  - Efek jumping setelah pion menuruni ular.
  - Permintaan efek animasi Marquee untuk headline.
- **Dampak Perubahan**:
  - (Menunggu Implementasi)
- **Status**: Waiting Review


- **Status**: Completed


## [Phase 16.1] - Hotfix UI & Animasi

- **Phase**: Phase 16.1
- **File yang diubah**:
  - src/components/player/PlayerToken.tsx
  - src/components/GameLayout.tsx
  - src/app/globals.css
- **Alasan Perubahan**:
  - Memperbaiki pion lain yang terlihat melompat saat merapikan formasi.
  - Menyembunyikan tombol log saat sidebar log di desktop sedang terbuka.
  - Memperbaiki CSS marquee yang tidak ter-load sebelumnya.
- **Dampak Perubahan**:
  - Formasi pion kini merapat secara presisi dan instan.
  - UI top bar lebih bersih saat log terbuka di desktop.
  - Marquee berjalan normal dari ujung kanan.
- **Status**: Completed


## [Phase 16.2] - Fine-tuning Animasi & Marquee

- **Phase**: Phase 16.2
- **File yang diubah**:
  - src/components/player/PlayerToken.tsx
  - src/components/GameLayout.tsx
  - src/app/globals.css
- **Alasan Perubahan**:
  - Pergeseran formasi pion secara instan masih terasa kaku seperti melompat.
  - Headline perlu menghilang setelah teks selesai meluncur satu kali.
- **Dampak Perubahan**:
  - Pergeseran pion kini berjalan mulus (resize + translate serentak).
  - Headline memicu onAnimationEnd untuk langsung menghilang dengan bersih.
- **Status**: Completed


## [Phase 16.3] - Resolusi Final Animasi & Marquee

- **Phase**: Phase 16.3
- **File yang diubah**:
  - src/components/player/PlayerToken.tsx
  - src/components/GameLayout.tsx
- **Alasan Perubahan**:
  - Framer Motion tidak dapat meng-interpolasi nilai calc() CSS secara mulus, menyebabkan offset melompat secara instan.
  - Teks Marquee masih me-looping tanpa henti.
- **Dampak Perubahan**:
  - Offset x dan y diubah murni menjadi numerik agar Framer Motion bisa melakukan tween animasi 0.3s dengan presisi.
  - Marquee dipaksa menggunakan arbitrary class Tailwind \orwards\ agar animasi berakhir secara definitif dan disembunyikan.
- **Status**: Completed


## [Phase 16.4] - Perbaikan Logika Trigger Headline

- **Phase**: Phase 16.4
- **File yang diubah**:
  - src/components/GameLayout.tsx
- **Alasan Perubahan**:
  - Headline sebelumnya memicu setiap kali status game ber-update, menyebabkan log yang sama ditampilkan berulang-ulang.
  - Headline terlalu banyak menampilkan log sistem sehingga mengganggu konsentrasi.
- **Dampak Perubahan**:
  - Headline menggunakan sistem tracking \latestLogId\ sehingga 1 log hanya diiklankan 1 kali.
  - Headline difilter hanya untuk event 'bonus', 'penalty', dan pesan 'alert phase' fase krisis.
- **Status**: Completed


## [Feature] - Randomize Quiz Options

- **Phase**: Tambahan Fitur
- **File yang diubah**:
  - src/components/quiz/QuizModal.tsx
- **Alasan Perubahan**:
  - Pemain dapat dengan mudah menghafal posisi huruf opsi jawaban jika urutannya selalu statis.
- **Dampak Perubahan**:
  - Opsi jawaban kini akan diacak posisinya (*shuffle*) setiap kali modal kuis terbuka.
- **Status**: Completed


## [Bugfix] - Comprehensive Debug & Linter Cleanup

- **Phase**: Bugfix
- **File yang diperiksa/diubah**:
  - src/components/GameLayout.tsx
  - src/components/player/PlayerToken.tsx
  - src/components/quiz/QuizModal.tsx
  - src/components/ui/Confetti.tsx
  - src/components/dice/Dice.tsx
  - src/components/papan/Tile.tsx
  - src/components/ui/CrisisAlertModal.tsx
  - src/components/ui/EffectModal.tsx
  - src/contexts/AudioContext.tsx
  - src/hooks/useGameFeedbackPipeline.ts
- **Alasan Perubahan**:
  - Terdapat sisa import dari komponen eksperimental yang telah dihapus (BoardExperimental).
  - Ditemukan peringatan Linter (React Hooks exhaustive-deps dan *synchronous state updates in effect*) yang bisa memicu render ganda (*cascading renders*).
  - Banyaknya variabel, prop, atau *import* tidak terpakai (unused vars) yang mengotori *codebase*.
  - Menertibkan referensi tipe (membuang ny) pada PlayerToken.tsx.
- **Dampak Perubahan**:
  - *Cascading renders* akibat pemanggilan setState di dalam useEffect secara sinkron telah diatasi dengan membungkusnya dalam *microtask* (Promise.resolve().then()) dan menggunakan inisialisasi state statis (*lazy initialization*).
  - Seluruh masalah linting dan masalah Tipe telah dibersihkan. Aplikasi kini lulus 
pm run lint dan kompilasi tipe dengan sempurna (0 Error, 0 Warning).
- **Status**: Completed


## [Phase Theme] - Implementasi Modular Theme System

- **Phase**: Phase Theme
- **File yang dibuat/diubah**:
  - `src/constants/themes.tsx` (NEW)
  - `src/contexts/ThemeContext.tsx` (NEW)
  - `src/components/ui/ThemeSelector.tsx` (NEW)
  - `src/app/globals.css` (MODIFY)
  - `src/app/layout.tsx` (MODIFY)
  - `src/app/page.tsx` (MODIFY)
  - `src/components/ui/MainMenu.tsx` (MODIFY)
  - `src/components/papan/Board.tsx` (MODIFY)
  - `src/components/papan/Tile.tsx` (MODIFY)
  - `src/components/ui/HUD.tsx` (MODIFY)
  - `src/components/ui/ResultScreen.tsx` (MODIFY)
- **Alasan Perubahan**:
  - Merealisasikan arsitektur Theme System yang modular, memisahkan Presentation Layer dari Game Engine dan Core Business Logic.
  - Menyediakan minimal 2 tema visual awal: **Classic** (baseline perkamen & batik jawa) dan **Jakarta Heritage** (skema Betawi oranye-hijau, border Gigi Balang, siluet landscape Batavia, serta ikon SVG kustom untuk petak Quiz, Bonus, Penalty, dan Win).
  - Menyediakan Theme Selector pada Main Menu dengan penyimpanan status pilihan tema di `localStorage` dan pembaruan real-time tanpa refresh halaman.
- **Dampak Perubahan**:
  - Seluruh komponen visual dan layout (Splash screen, Main Menu, Board, Tile, HUD, Leaderboard, dan Result page) menyerap warna dan ornamen dinamis sesuai tema aktif.
  - Performa terjamin tanpa duplikasi state react, render ganda, atau memory leaks.
  - Lulus uji tipe TypeScript compiler (`npx tsc`) dan audit linter (`npm run lint`), serta berhasil dikompilasi ke static production build.
- **Status**: Completed


## [Phase Theme v2.0] - Jakarta Heritage Visual Identity Revision

- **Phase**: Phase Theme v2.0
- **File yang diubah**:
  - `src/contexts/AudioContext.tsx`
  - `src/constants/themes.tsx`
  - `src/components/papan/Board.tsx`
  - `src/components/papan/Tile.tsx`
  - `src/components/player/PlayerToken.tsx`
  - `src/components/dice/Dice.module.css`
  - `src/components/quiz/QuizModal.tsx`
  - `src/components/ui/ResultScreen.tsx`
  - `src/components/ui/EffectModal.tsx`
  - `src/components/ui/CrisisAlertModal.tsx`
  - `src/components/ui/DiceModifierModal.tsx`
- **Alasan Perubahan**:
  - Menyempurnaan identitas budaya Betawi pada tema **Jakarta Heritage** agar tampil konsisten, premium, dan menyerupai digital board game profesional.
  - Merestorasi sistem audio (`AudioContext.tsx`) ke baseline musik latar (`bgm_main.mp3`) dan efek suara (`click.mp3`, `ladder.mp3`, `snake.mp3`) asli untuk menghindari pesan 404 network warnings pada konsol peramban lokal.
  - Merancang aset visual SVG kustom inline presisi tinggi (Naga Betawi/Jaladara untuk Ular, Tangga Bambu 3D dengan tali pengikat, Ondel-ondel Putih untuk Bonus Tile, Ondel-ondel Merah untuk Penalty Tile, dan Landmark Monas Megah dengan radial glow di petak 100).
  - Melakukan penyelarasan menyeluruh (Theme Consistency) pada seluruh dialog modal (`QuizModal`, `EffectModal`, `CrisisAlertModal`, `DiceModifierModal`), dadu 3D, pion pemain, HUD, leaderboard, dan Result Screen kemenangan menggunakan warna parchment, ornamen Gigi Balang, dan bingkai kayu.
- **Dampak Perubahan**:
  - Tampilan game tetap terasa sangat tematik, kaya detail historis (*historical board game*), dan menyatu dengan ornamen kebudayaan Jakarta.
  - Log konsol peramban bersih dari pesan kegagalan memuat berkas audio (`404 Not Found`).
  - Semua linter checks (`npm run lint`), type-safety checks (`npx tsc`), dan Next.js production build (`npm run build`) lulus dengan status 100% sukses (0 Error, 0 Warning).
- **Status**: Completed


## [Phase Final Polish] - First Impression & UX Audit

- **Phase**: Phase Final Polish
- **File yang diubah**:
  - `src/constants/themes.tsx`
  - `src/app/globals.css`
  - `src/app/page.tsx`
  - `src/components/ui/MainMenu.tsx`
  - `src/components/ui/FloatingAudioControl.tsx`
  - `src/components/ui/AudioSettings.tsx`
  - `src/components/effects/ParticleManager.tsx`
  - `src/components/dice/Dice.tsx`
  - `src/components/dice/Dice.module.css`
  - `src/components/player/PlayerToken.tsx`
  - `src/components/quiz/QuizModal.tsx`
  - `src/components/ui/EffectModal.tsx`
  - `src/components/ui/CrisisAlertModal.tsx`
  - `src/components/ui/DiceModifierModal.tsx`
- **Alasan Perubahan**:
  - Menyelesaikan audit kegunaan (UX), visual, dan animasi pada 30 detik pertama kesan pemain (First Impression).
  - Menghilangkan galat berkas batik dan peta classic yang hilang (404) dengan merancang data-uri SVG batik Kawung dan ClassicHeroMap inline yang berkinerja tinggi.
  - Memoles form masukan nama pemain dan tombol menu ke visual board game kuno berbasis kertas perkamen dan bingkai kayu jati tebal dengan fokus border emas.
  - Menambahkan letupan game juice memuaskan berupa getaran kontainer dadu saat berputar, semburan partikel kaset emas saat dadu berhenti, dan riak gelombang emas melingkar di bawah pion pemain sesaat setelah mendarat di petak.
  - Meningkatkan transisi pop-up modal dialog Quiz, Effect, Crisis, dan Dice Modifier dengan spring bounce transition Framer Motion yang elastis dan organik.
  - Meningkatkan aksesibilitas jemari ponsel dengan menata ulang ukuran tombol roda gigi audio ke target minimum 44px (`w-11 h-11`) dan menyelaraskan warna FloatingAudioControl ke palet tema aktif.
- **Dampak Perubahan**:
  - Game memiliki pengalaman visual dan animasi premium board game digital komersial yang utuh sejak pertama kali dibuka.
  - Masalah kegagalan memuat berkas statis (404) telah selesai secara menyeluruh.
  - Kode mematuhi aturan kemurnian rendering React (React Component Purity/Idempotency Rules).
  - Seluruh rangkaian Next.js production build (`npm run build`) dan eslint checks lulus dengan status 100% sukses bersih.
- **Status**: Completed




## [2026-07-04] Hero Section Redesign (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Menjadikan Hero sebagai pusat perhatian dengan framing dramatis, depth (shadows), dan pencahayaan (subtle light).
  - Menambahkan layer foreground dan background (particles, distant silhouettes Borobudur & Prambanan) untuk efek parallax dan depth.
  - Mempertahankan identitas warna, tipografi, dan desain tombol CTA asli.
- **Dampak Perubahan**:
  - Tampilan splash screen/hero pada prototype menjadi sangat premium, memiliki nuansa game board edukasi sejarah yang lebih kuat.
- **Status**: Waiting Review

## [2026-07-04] Ambient Motion (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Menambahkan kesan hidup pada layar saat pemain diam (ambient motion) tanpa mengganggu fokus utama, sesuai dengan instruksi desain premium.
  - Mengimplementasikan debu bergerak (drifting dust particles), cahaya yang bernafas/bergerak pelan, parallax pada background dan foreground berbasis posisi mouse, ornamen yang melayang lambat (slow floating ornament), efek breathing pada logo, dan efek premium saat hover pada tombol.
- **Dampak Perubahan**:
  - UI terasa lebih dinamis, dalam, dan hidup layaknya aplikasi game AAA. Efek parallax meningkatkan persepsi kedalaman (depth).
- **Status**: Waiting Review

## [2026-07-04] Feature Section Redesign (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Empat fitur di bagian bawah layar (BELAJAR, BERMAIN, MENANG, BANGGA) terasa terlalu lemah secara visual (sebelumnya hanya berupa feature strip dengan pemisah garis tipis).
  - Mengubahnya menjadi struktur individual cards dengan gaya frosted glass (blur).
  - Menambahkan border dekoratif beraksen emas di sudut, efek pop/angkat saat hover, serta container ikon yang reaktif terhadap hover.
- **Dampak Perubahan**:
  - Tampilan card lebih bertekstur, tidak menghilangkan esensi minimalis (tetap ringan), dan interaksi *hover* meningkatkan kesan interaktif yang memuaskan (*premium feel*).
- **Status**: Waiting Review

## [2026-07-04] Remove Parallax Effect (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Instruksi untuk menghilangkan pergerakan elemen yang mengikuti kursor (*parallax effect*).
- **Dampak Perubahan**:
  - Semua *event listener* mousemove dan state *parallax* (via useMotionValue, useTransform) dihapus. Animasi ambient yang lain (seperti debu mengambang, cahaya, dan animasi lambat *breathing*) tetap berjalan namun layar tidak lagi bereaksi saat kursor digerakkan (kecuali efek *hover* pada tombol dan fitur).
- **Status**: Completed

## [2026-07-04] Landing Page Size Adjustment (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Ukuran elemen-elemen *landing page* secara keseluruhan membuat layar memanjang melebihi batas *viewport*, sehingga menimbulkan *scroll* (tidak murni 100vh).
- **Dampak Perubahan**:
  - Mengecilkan skala *font* judul (h1 menjadi maksimal 	ext-7xl), menyesuaikan *padding* dan *margin* antar elemen (Crest, Title, Divider, Tagline), serta sedikit mengecilkan skala padding tombol.
  - Mengubah *wrapper container* dari min-h-screen ke h-[100dvh] untuk memastikan aplikasi memuat tepat pada 1 tampilan layar, tanpa *scroll*, sambil mempertahankan *overflow-hidden*.
- **Status**: Completed

## [2026-07-04] Feature Cards & Layout Overlap Fix (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Ukuran Feature Cards di bagian bawah terlalu besar (terutama pada resolusi atau perangkat tertentu yang memadatkannya menjadi 2 baris), sehingga menutupi tombol CTA utama (Mulai Petualangan).
- **Dampak Perubahan**:
  - Memperkecil dimensi Feature Cards: Mengurangi ukuran *padding*, ukuran *icon* SVG (menjadi w-4 h-4 s/d w-5 h-5), dan sedikit mengecilkan ukuran teks (*title* dan *subtitle*).
  - Menambah *padding-bottom* pada *container* konten utama (menjadi pb-32 md:pb-24) agar konten terdorong lebih ke atas dan memberi ruang lapang bagi deretan kartu fitur di bagian bawah, mencegah tabrakan/tumpang tindih (*overlap*).
- **Status**: Completed

## [2026-07-04] Hero Layout Height Constraint Fix (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Total tinggi dari susunan *Main Content* di tengah layar terlalu memanjang, sehingga fungsi justify-center dari bungkus layar (h-[100dvh]) justru mendorong teks *badge* (Game Edukasi) menembus batas atas layar dan memotong elemen.
- **Dampak Perubahan**:
  - Mengurangi drastis jeda vertikal (*margin/padding*) antar elemen: Genre badge, Hero Frame, Divider, Tagline, dan CTA.
  - Menurunkan kembali skala ukuran teks: h1 	ext-5xl -> text-4xl untuk layar kecil.
  - Memasukkan utilitas penyesuaian skala CSS (scale-95 md:scale-100 origin-center) pada kontainer teks jika layarnya terlalu sempit, serta mengembalikan padding-bottom ke nilai aman agar area tengah lebih leluasa bernapas dan tepat berada di jantung *viewport*.
- **Status**: Completed

## [2026-07-04] Premium Visual Polish (Prototype)

- **Phase**: Prototype Polishing
- **File yang dibuat atau diubah**:
  - src/app/prototype/page.tsx
- **Alasan Perubahan**:
  - Mengangkat kualitas visual layar antarmuka utama (Main Menu) agar setara dengan game *indie premium* melalui audit komposisi, spasial, hierarki teks, keterbacaan, keseimbangan visual, dan atmosfer (sesuai instruksi *Premium Polish*).
- **Dampak Perubahan**:
  - **Depth of Field (Atmosfer)**: Menambahkan efek *blur* bervariasi pada partikel debu di lapisan latar belakang dan depan.
  - **Volumetric Elements**: Menyematkan *linear gradient* (emas dan *navy*) pada seluruh komponen SVG ornamen dan candi (Borobudur, Prambanan, TopCrest, dll.) menghilangkan kesan pewarnaan *flat*.
  - **Hierarchy & Readability**: Menambahkan struktur bevel/3D tebal (*text-shadow*) pada teks "Ular Tangga", memasang *glassmorphic backdrop-blur pill* yang sangat tipis di belakang teks *tagline* agar tajam terbaca meski terkena pancaran efek cahaya/partikel dari layar, serta memberikan aksen *inner glow* memudar pada lencana (badge) "Game Edukasi".
- **Status**: Completed

### Fix TypeScript Error
- **Phase**: Bugfix
- **File yang diubah**: \src/lib/gameEngine.ts\
- **Alasan**: Memperbaiki error TypeScript \'acquiredEffect' is possibly 'undefined'\ di dalam callback fungsi \indIndex\.
- **Dampak**: Menghilangkan error TS saat proses kompilasi.
- **Status**: Completed
