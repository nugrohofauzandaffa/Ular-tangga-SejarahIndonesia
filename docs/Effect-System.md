# Effect System Design (Buff, Debuff, & Fact)

## 1. Overview
Sistem Efek ini bertujuan untuk merombak mekanika dari petak *Bonus*, *Penalty*, dan *Fact* agar memiliki interaksi yang lebih strategis dan tidak hanya sebatas penambahan/pengurangan poin seketika. 

Melalui sistem ini, pemain dapat memperoleh keuntungan berkelanjutan (Buff), terkena hukuman yang membatasi pergerakan (Debuff), serta mendapatkan petunjuk (Fact / Hint) yang akan membantu dalam menjawab tantangan kuis. Seluruh efek ini akan disimpan di dalam status `Player` dan dikelola murni oleh *Game Engine* (`turnManager.ts` & `gameEngine.ts`) untuk memastikan integritas logika bisnis sebelum diteruskan ke UI.

---

## 2. Buff List

Kumpulan efek positif yang diperoleh dari mendarat di petak **Bonus**.

### 2.1. AntiSnake
- **Deskripsi**: Pelindung gaib yang membuat pemain kebal terhadap bisa ular.
- **Efek**: Saat pemain mendarat di kepala ular, pemain tidak akan diturunkan ke ekor ular.
- **Cara diperoleh**: Mendarat di petak Bonus (hasil undian *AntiSnake*).
- **Durasi**: Permanen sampai digunakan (1 kali pemakaian).
- **Cara berakhir**: Dihapus dari status pemain segera setelah efeknya digunakan untuk membatalkan 1 (satu) petak ular.

### 2.2. DoubleRoll
- **Deskripsi**: Memberikan kesempatan melempar dadu ekstra.
- **Efek**: Pemain dapat melempar dadu satu kali lagi setelah mendarat di petak ini tanpa memutar giliran ke pemain berikutnya.
- **Cara diperoleh**: Mendarat di petak Bonus (hasil undian *DoubleRoll*).
- **Durasi**: Seketika (*Instant* / 1 Turn).
- **Cara berakhir**: Efek selesai setelah dadu kedua dilempar dan rute pergerakan tambahannya selesai dieksekusi.

### 2.3. StealPoint
- **Deskripsi**: Sabotase poin dari musuh dengan skor tertinggi.
- **Efek**: Pemain yang mendapatkan buff ini menerima +3 poin, dan secara bersamaan mencuri (mengurangi) 3 poin dari pemain lawan yang memiliki skor tertinggi.
- **Cara diperoleh**: Mendarat di petak Bonus (hasil undian *StealPoint*).
- **Durasi**: Seketika (*Instant*).
- **Cara berakhir**: Langsung dihapus setelah penambahan/pengurangan skor dieksekusi.

---

## 3. Debuff List

Kumpulan efek negatif (perangkap) yang diperoleh dari mendarat di petak **Penalty**.

### 3.1. AbsoluteRoll
- **Deskripsi**: Membatasi laju lari pemain.
- **Efek**: Hasil lemparan dadu pemain tidak akan bisa lebih dari angka 4. Jika pelemparan menghasilkan angka 5 atau 6, angka tersebut ditekan menjadi 4.
- **Cara diperoleh**: Mendarat di petak Penalty (hasil undian *AbsoluteRoll*).
- **Durasi**: 2 giliran (*Turns*).
- **Cara berakhir**: Durasi berkurang setiap akhir giliran pemain tersebut. Hilang saat sisa giliran mencapai 0.

### 3.2. FactBanned
- **Deskripsi**: Pemblokiran akses informasi sejarah.
- **Efek**: Pemain kehilangan hak untuk melihat petunjuk (Hint) dari petak Fakta Sejarah.
- **Cara diperoleh**: Mendarat di petak Penalty (hasil undian *FactBanned*).
- **Durasi**: 1 kali pendaratan di petak Fakta (atau 1 putaran penuh, merujuk pada Open Decision).
- **Cara berakhir**: Efek dihilangkan setelah aktif menolak/melewati petak Fakta satu kali.

### 3.3. DecreasedRoll
- **Deskripsi**: Pengurangan hasil dadu akibat kelelahan.
- **Efek**: Angka dadu murni yang dilempar akan dikurangi angka **2**. Pemain hanya akan maju sebanyak hasil perhitungan akhir (minimal mendapat 1 langkah meskipun hasil kalkulasi bernilai 0 atau negatif).
- **Cara diperoleh**: Mendarat di petak Penalty (hasil undian *DecreasedRoll*).
- **Durasi**: 1 giliran (berlaku untuk lemparan dadu di ronde berikutnya).
- **Cara berakhir**: Dihapus sesaat setelah dadu di putaran berikutnya selesai dikalkulasi.

---

## 4. Fact System

### 4.1. Fungsi Fact sebagai Hint
Petak Fakta (Fact Tile) bukan lagi hanya teks hiasan, melainkan berfungsi sebagai *Hint* (Petunjuk) krusial bagi pemain untuk menjawab pertanyaan kuis. Saat mendarat di petak ini, Modal akan muncul menyajikan sepotong teks sejarah singkat.

### 4.2. Hubungan Fact dengan Quiz
*(Open Decision: Apakah `contentId` Fact dipasangkan persis dengan ID pertanyaan kuis yang spesifik, atau teks fakta dipilih secara acak dari wadah sejarah yang tersedia?)*

### 4.3. Kapan Fact Modal Muncul
Fact Modal dipanggil (tampil) sesaat setelah *Game Engine* mendaftarkan `gameStatus` menjadi `'showing_fact'` pasca pemain mendarat murni di petak Fact dan seluruh animasi bidak selesai bergerak.

### 4.4. Kapan Fact Dilewati (FactBanned)
Jika sistem mendeteksi `FactBanned` di dalam `activeEffects` pemain saat mereka mendarat di petak Fact, proses pengubahan status ke `'showing_fact'` akan **dibatalkan**. *Game Engine* akan mengirimkan notifikasi *Debuff* singkat, lalu giliran langsung diserahkan ke lawan tanpa membuka *Fact Modal*.

---

## 5. Effect Lifecycle

Seluruh *Buff* maupun *Debuff* mengikuti siklus hidup (*lifecycle*) seragam di bawah ini:

1. **Didapat**: Pemain menginjak petak Bonus atau Penalty, `Game Engine` mengundi satu jenis efek secara acak.
2. **Disimpan**: Efek tersebut (lengkap dengan tipe dan durasinya) dimasukkan ke dalam susunan (Array) `Player.activeEffects`. Status UI berubah menjadi `'showing_effect'`.
3. **Digunakan**: 
   - Efek pasif dieksekusi secara reaktif (contoh: *AntiSnake* saat memicu ular).
   - Efek intervensi dadu dieksekusi saat proses `Pre-Roll` dadu berjalan.
4. **Durasi Berkurang**: Pada saat fase `Update Score / Turn Change`, fungsi `TurnManager` memotong durasi dari setiap efek di `activeEffects`.
5. **Efek Dihapus**: Jika durasi (turn limit / use limit) mencapai `0`, entri objek efek tersebut dipotong (*slice/filter*) dari `Player.activeEffects` secara permanen.

---

## 6. Effect Priority

Aturan saat mengeksekusi beberapa efek dalam antrean waktu yang bersamaan.

### A. Pre-Roll Priority (Dadu)
Jika pemain memiliki `AbsoluteRoll` (batas max 4) dan `DecreasedRoll` (minus X):
1. Terapkan pemotongan nilai maksimum dari `AbsoluteRoll` terlebih dahulu (potong ke 4 jika lebih dari 4).
2. Setelah itu, kurangi hasil akhirnya menggunakan nilai pemotong dari `DecreasedRoll`.
*(Alasan: Memotong batasan atas terlebih dahulu lebih logis, sehingga pengurangan acak tidak dirugikan).*

### B. Snake Resolution Priority
**AntiSnake + Snake**: `AntiSnake` memiliki prioritas tertinggi di petak tujuan. Jika `TileResolver` meresolusi adanya Ular, *Game Engine* terlebih dahulu mengintersep dan memeriksa keberadaan `AntiSnake`. Pendaratan aman dicapai, turun ular dibatalkan, buff dihancurkan.

### C. Fact Resolution Priority
**FactBanned + Fact**: `FactBanned` dieksekusi mendahului pembukaan UI Kuis/Fakta. Resolusi langsung dibajak menuju penyelesaian giliran.

### D. DoubleRoll + Finish
Jika pemain menggunakan kesempatan `DoubleRoll` dan mencapai Petak 100 (Kemenangan), *state* kemenangan memotong (override) sisa dadu. Giliran tidak diputar, dan `ResultScreen` seketika tampil.

---

## 7. Stacking Rules

Aturan ketika pemain mendarat lebih dari satu kali di petak spesifik sebelum efeknya habis.

- **Double Buff/Debuff yang Sama**: 
  *(Open Decision: Apakah durasi di-refresh, atau stack (durasi bertambah)? Sebagai rekomendasi standar, durasi sebaiknya **di-refresh** ke nilai awal).*
- **Buff + Debuff**: Pemain diizinkan menampung efek positif dan negatif secara bersamaan (keduanya ditaruh di dalam satu wadah `activeEffects`).

---

## 8. Turn Flow

Alur giliran komprehensif di level abstraksi *Business Logic*:

1. **Start Turn**
   *(User input: tekan tombol Lempar Dadu)*
2. **Pre-Roll (Check Active Effects)**
   *Mendeteksi AbsoluteRoll dan DecreasedRoll*.
3. **Roll Dice**
   *Mendapatkan angka murni dadu -> Menerapkan hasil modifikasi Pre-Roll -> Angka final*.
4. **Movement**
   *Kalkulasi langkah pion (1-by-1 animation).*
5. **Tile Resolver**
   *Menganalisis petak akhir: apakah Normal, Kuis, Fakta, Bonus, Ular, Tangga.*
6. **Apply Tile Effect / Event Interception**
   - *Pencegatan ular (AntiSnake).*
   - *Pencegatan fakta (FactBanned).*
   - *Undian Efek Bonus/Penalty.*
7. **UI Suspension (Wait for Acknowledge)**
   *Jika memicu kuis/fakta/efek baru, tunggu input UI Modal. Jika tidak, proses instan.*
8. **Update Score**
   *Menambah/mengurangi skor berdasarkan jawaban (jika kuis) atau instan StealPoint.*
9. **Reduce Effect Duration & Cleanup**
   *TurnManager* memotong 1 sisa umur bagi semua *turn-based active effects*.
10. **Next Turn**
   *Rotasi giliran disahkan (Kecuali DoubleRoll).*

---

## 9. UI Behaviour

### 9.1. Fact Modal
- **Kapan Muncul**: Ketika `gameStatus === 'showing_fact'`.
- **Kapan Ditutup**: Saat pengguna menekan tombol "Saya Mengerti / Tutup" di modal, yang memicu *callback* ke *Game Engine* untuk mengakhiri rotasi giliran.

### 9.2. Effect Modal
- **Kapan Muncul**: Ketika `gameStatus === 'showing_effect'`. Modal mendeskripsikan secara elegan nama efek, *icon* (Buff: Hijau, Debuff: Merah), dan dampak efeknya.
- **Kapan Ditutup**: Saat pengguna menekan "Oke", efek baru mulai aktif dan giliran akan segera diputar. Khusus untuk `DoubleRoll`, giliran dipertahankan di pemain aktif.

### 9.3. HUD Effect Indicator
- **Kapan Muncul**: Sebuah *badge/icon* kecil akan melekat pada bingkai profil (Pemain 1 / Pemain 2) di *Sidebar Bottom* jika susunan `activeEffects` di pemain tersebut memiliki panjang `> 0`.
- **Kapan Dihapus**: Indikator otomatis raib tatkala efek telah digunakan (`AntiSnake` dikonsumsi) atau durasinya lenyap (`AbsoluteRoll` kadaluarsa).

---

## 10. Testing Impact

### 10.1. Pembaruan Test Plan
- Skenario pengujian untuk Petak Bonus (menjadi sistem Undian *Buff*).
- Skenario pengujian untuk Petak Penalty (menjadi sistem Undian *Debuff*).

### 10.2. Test Case Baru
- Verifikasi batas maksimal dadu karena `AbsoluteRoll`.
- Verifikasi perhitungan acak minus langkah di `DecreasedRoll`.
- Verifikasi perlindungan dari kepala ular berkat `AntiSnake`.
- Verifikasi perolehan +3 Poin sambil mengurangi poin lawan oleh `StealPoint`.
- Verifikasi kemunculan modal `Fact` vs pemblokiran di `FactBanned`.
- Verifikasi *DoubleRoll* mengizinkan satu pemain jalan dua kali beruntun.

### 10.3. Regression Risk
- *Business Logic Modifikasi*: Fungsi inti `processTurn` dan `TurnManager` memikul banyak cabang percabangan (*if/else*) baru yang berpotensi merusak logika dasar (skor kacau atau lompatan urutan pemain berantakan). Pengujian Regresi ketat diperlukan untuk pergerakan dasar Ular dan Tangga konvensional tanpa adanya *Buff*.

---

## 11. Open Decisions

Bagian ini menyimpan asumsi krusial yang memerlukan persetujuan dari Desainer Game / Klien sebelum ditulis menjadi kode murni:

1. **Target StealPoint**: ~~"Apakah mencuri dari seluruh musuh atau 1 musuh acak?"~~
   - **Keputusan**: Mencuri (minus 3 poin) khusus dari pemain lawan dengan **skor tertinggi**. Pemain perampas mendapat +3.
2. **Kekuatan DecreasedRoll**: ~~"Berapa rentang acak pengurang dadu?"~~
   - **Keputusan**: Pengurangan bernilai mutlak sebesar **2**. Jika perhitungan minus atau nol, maka langkah minimal tetap dibatasi **1**.
3. **Fact Binding (Hubungan Fakta dan Kuis)**: 
   - **Pertanyaan**: Fakta sebagai "Hint", apakah ID petak Fakta *harus* berisi jawaban eksplisit dari ID petak Kuis di dekatnya, atau UI sekadar menyajikan koleksi teks sejarah acak?
4. **Stacking Rule (Penumpukan Efek)**:
   - **Pertanyaan**: Jika pemain mendarat di *AbsoluteRoll*, lalu di *DoubleRoll* mendarat di *AbsoluteRoll* lagi, haruskah 2 giliran durasinya me-*refresh* ke 2 putaran dari awal, atau *stacking* menjadi 4 putaran?
