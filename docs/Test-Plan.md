# Test Plan: Ular Tangga Sejarah

Dokumen ini mendefinisikan *Test Plan* untuk tahap Quality Assurance (QA) aplikasi Ular Tangga Sejarah. Pengujian dibagi ke dalam enam (6) area guna memverifikasi kinerja fungsi, logika permainan, perilaku saat kondisi *edge case*, adaptasi UI/responsif, serta memitigasi isu regresi pasca-integrasi.

---

## 1. Functional Testing

Menguji fungsionalitas komponen individu agar berjalan sesuai dengan spesifikasi awalnya.

| Test ID | Deskripsi | Langkah Pengujian | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **FN-01** | *Roll Dice Validation* | Menekan tombol "Lempar Dadu". | Dadu menunjukkan angka acak (1-6). Tombol terkunci selama animasi. | [ ] |
| **FN-02** | *HUD Update* | Selesaikan sebuah giliran pemain pertama. | HUD memperbarui nama pemain, memutar giliran, skor, dan posisi pemain selanjutnya. | [ ] |
| **FN-03** | *Quiz Modal Render* | Pindahkan pemain ke *Tile* bertipe Quiz. | *Modal* Quiz terbuka, menampilkan soal yang valid beserta pilihan gandanya. | [ ] |
| **FN-04** | *Quiz Validation* | Tekan salah satu jawaban pada kuis. | Sistem memberikan status valid (Benar/Salah) serta memunculkan *Explanation* tanpa mengubah soal. | [ ] |
| **FN-05** | *Result Screen Render* | Berikan pemain kondisi *Game Over* (mencapai petak 100). | Layar *Result Screen* menutupi seluruh *game* dan menampilkan hasil yang selaras. | [ ] |
| **FN-06** | *Restart Game* | Tekan tombol "Main Lagi" di Result Screen. | Papan, pion, skor, giliran dan dadu ter-*reset* kembali ke nilai awalnya (Tile 1, P1). | [ ] |

---

## 2. Gameplay Testing

Menguji integrasi keseluruhan alur (*flow*) dari hulu hingga hilir, terutama sinkronisasi *Game Engine*.

| Test ID | Deskripsi | Langkah Pengujian | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **GP-01** | *Perpindahan Pemain* | Lakukan *roll dice* dengan angka X. | Bidak pemain bergeser maju sebanyak X kotak secara berurutan. | [ ] |
| **GP-02** | *Pengujian Tangga* | Mendarat tepat pada kepala/bawah tangga (contoh: Tile 10). | Pemain langsung dipindahkan secara otomatis ke titik puncak tangga terkait. | [ ] |
| **GP-03** | *Pengujian Ular* | Mendarat tepat pada kepala ular (contoh: Tile 16). | Pemain langsung diturunkan secara otomatis ke ekor ular terkait. | [ ] |
| **GP-04** | *Siklus Giliran* | Menyelesaikan langkah tanpa *event* (atau selesaikan kuis). | Giliran berpindah ke pemain berikutnya secara sirkular (P1 -> P2 -> P1). | [ ] |
| **GP-05** | *Skor: Jawaban Benar* | Memilih jawaban benar di *Quiz Modal*. | Skor pemain saat ini bertambah (mis. +100 atau +1), status jumlah benar +1. | [ ] |
| **GP-06** | *Skor: Jawaban Salah* | Memilih jawaban salah di *Quiz Modal*. | Skor tetap (atau berkurang sesuai GDD), status salah +1. | [ ] |
| **GP-07** | *Kondisi Kemenangan* | Pemain berada di petak akhir (misal: 98) dan lemparan pas (2). | Pemain mendarat di 100, tercatat sebagai Pemenang, permainan beralih ke *Finished*. | [ ] |

---

## 3. Edge Case Testing

Menguji ketahanan aplikasi pada skenario langka, batasan, atau *input* berlebih.

| Test ID | Deskripsi | Langkah Pengujian | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EC-01** | *Overshoot Finish* | Pemain berada di Tile 98, dadu menunjukkan angka 5. | Bidak bergerak ke-100, memantul mundur ke-97. Tidak menang. | [ ] |
| **EC-02** | *Collision* (Tumpuk) | P2 bergerak ke tile yang sama persis tempat P1 berada. | Bidak tidak saling tumpang tindih; diberi pergeseran visual (*offset*). | [ ] |
| **EC-03** | *Tile Tanpa Event* | Berhenti pada kotak *Normal* biasa. | Pergerakan selesai dengan damai dan giliran otomatis memutar ke lawan. | [ ] |
| **EC-04** | *Celah Dadu (Spam)* | Klik "Lempar Dadu" sangat cepat berulang-ulang. | Hanya klik pertama yang diakui; tidak terjadi lemparan ganda dalam 1 giliran. | [ ] |
| **EC-05** | *Post-Finish Action* | Berusaha melempar dadu setelah Result Screen terbuka. | Tidak mungkin dilakukan karena layar permainan ditutupi oleh *modal* hasil akhir. | [ ] |
| **EC-06** | *Double Event* | Berhenti di ujung tangga yang merupakan petak *Quiz*. | Diselesaikan satu per satu: naik tangga dulu, kemudian memunculkan *Quiz Modal*. | [ ] |

---

## 4. Responsive Testing

Menguji konsistensi UI/UX tata letak di perangkat dan rasio aspek yang berbeda.

| Test ID | Lingkungan / Resolusi | Komponen Diuji | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **RT-01** | **Desktop** (≥1024px) | Seluruh Layout | Board di kiri/tengah. *Sidebar* (HUD & Dadu) di sebelah kanan tersusun rapi (*Vertical*). | [ ] |
| **RT-02** | **Tablet** (768px - 1023px)| Seluruh Layout | Tata letak menyesuaikan (mungkin *Stacking* atau tetap *Sidebar* jika ruang cukup). | [ ] |
| **RT-03** | **Mobile Portrait** (<768px)| Sticky Bottom Panel | Board tetap persegi. Dadu (horizontal) dan HUD menempel dengan mulus di panel bawah layar. | [ ] |
| **RT-04** | **Mobile Landscape** | Semua | *Board aspect ratio* tetap seimbang. *Sticky panel* tidak menutupi *Board* secara ekstrem. | [ ] |
| **RT-05** | Semua Perangkat | Quiz & Result Modal | Modal tidak terpotong, pas *viewport*, *scroll* diizinkan jika konten soal terlalu panjang. | [ ] |

---

## 5. UI Testing

Menguji estetika, visibilitas, aksesibilitas, serta *micro-interactions*.

| Test ID | Deskripsi | Langkah Pengujian | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **UI-01** | *Konsistensi Komponen* | Amati *Font* (Typography) dan *Spacing* (Padding/Margin). | Seluruh komponen konsisten menggunakan utilitas Tailwind (`slate`, seragam). | [ ] |
| **UI-02** | *Button States* | Verifikasi efek `hover`, `active`, dan `disabled` di tombol UI. | Tombol memberikan *feedback* visual (warna meredup atau kursor *not-allowed*). | [ ] |
| **UI-03** | *Visual Kuis* | Lakukan kuis benar/salah secara bergantian. | Pilihan ganda benar diberi efek **Hijau**, jika salah berefek **Merah**. | [ ] |
| **UI-04** | *Animasi* | Verifikasi gerakan buka-tutup (Modal) atau transisi Dadu. | Animasi *fade/zoom* tidak kaku, efek *blur* di belakang *modal* terlihat elegan. | [ ] |
| **UI-05** | *Aksesibilitas Dasar* | Kontras teks keterangan dan penjelasan. | Tulisan harus terbaca di atas latar terang, ukuran terbaca tanpa *zoom* manual. | [ ] |

---

## 6. Regression Testing

Daftar modul yang harus tetap stabil usai implementasi dan yang wajib diuji ulang sebelum tiap peluncuran rilis/perubahan.

| Komponen Wajib | Fokus Pengujian Regresi | Status |
| :--- | :--- | :---: |
| **Roll Dice** | Tetap melahirkan angka murni `1-6` tanpa tersangkut di angka tertentu. | [ ] |
| **Movement** | Bidak berpidah *absolut* berdasarkan penjumlahan posisi bukan angka tetap. | [ ] |
| **Tile Resolver** | Efek peta (*Event*) tereksekusi sesuai petak mendarat tanpa intervensi. | [ ] |
| **Quiz** | Logika pengambilan soal, tidak mengulangi soal jika sudah semua dikerjakan. | [ ] |
| **Score** | Tidak ada reduksi poin minus berlebih jika salah atau perolehan di-reset mendadak.| [ ] |
| **Turn Manager** | Rotasi selalu `P1 -> P2 -> Pn -> P1` secara terus menerus, tiada giliran yang melompat.| [ ] |
| **HUD** | Harus mencerminkan Data *State* persis; tidak meleset (nama A tertukar dengan B). | [ ] |
| **Board** | 100 Petak selalu hadir dan urutan *zig-zag* tidak menjadi rancu. | [ ] |
| **Result Screen**| Ranking harus berurut akurat berdasar skor; penobatan pemenang sinkron di modul pemenang. | [ ] |

---

## 7. Traceability Matrix

Tabel ini memetakan relasi antara kebutuhan (Requirement) yang tertulis dalam dokumen spesifikasi (`GDD.md` & `UX-Design.md`) dengan skenario pengujian (Test ID) yang akan dijalankan, demi memastikan seluruh fitur inti telah tercakup secara utuh.

| Requirement ID | Deskripsi Fitur / Requirement | Sumber Dokumen | Test ID Terkait |
| :--- | :--- | :--- | :--- |
| **REQ-01** | Mekanika Dadu & Pergerakan | `GDD.md` | FN-01, GP-01, EC-04 |
| **REQ-02** | Logika Ular dan Tangga | `GDD.md` | GP-02, GP-03, EC-06 |
| **REQ-03** | Sistem Kuis Edukasi (Benar/Salah) | `GDD.md` | FN-03, FN-04, GP-05, GP-06, UI-03 |
| **REQ-04** | Rotasi Giliran Pemain | `GDD.md` | FN-02, GP-04 |
| **REQ-05** | Kondisi Menang (Petak 100) & Pantulan | `GDD.md` | FN-05, GP-07, EC-01 |
| **REQ-06** | Penanganan Tumpukan Pion (Collision) | `GDD.md` | EC-02 |
| **REQ-07** | Tata Letak Responsif (Mobile & Desktop) | `UX-Design.md` | RT-01, RT-02, RT-03, RT-04, RT-05 |
| **REQ-08** | Estetika Komponen & Aksesibilitas | `UX-Design.md` | UI-01, UI-02, UI-04, UI-05 |

---

## Test Summary

| Ringkasan | Keterangan |
| :--- | :--- |
| **Total Test Case** | 27 Skenario Uji |
| **Functional Coverage** | Meliputi Dadu, Pergerakan Ular-Tangga, Kuis, Skor, Pemenang. |
| **Area Berisiko Tinggi** | 1. *Bounce-back* (Mundur dari ujung 100).<br>2. Siklus antrean saat Pop-up terpicu bertumpuk.<br>3. *Sticky Bottom Panel* di iOS Safari. |
| **Catatan Pengujian** | Skenario UI animasi mungkin bervariasi bergantung pada *browser* (Webkit/Blink). Pastikan `Dummy Data` kuis minimal diisi dengan data asli untuk melihat apakah *length* String berdampak. |
