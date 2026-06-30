# UX Design

## 1. Purpose

Tujuan dokumen ini adalah mendefinisikan pengalaman pengguna (User Experience) untuk Game Ular Tangga Edukatif pada platform Desktop dan Mobile.

Dokumen ini menjadi acuan implementasi seluruh React Components agar gameplay nyaman, konsisten, dan mudah dipahami.

---

# 2. Design Principles

## 2.1 Mobile First Gameplay

Gameplay utama harus tetap nyaman dimainkan menggunakan satu tangan.

Aksi utama tidak boleh mengharuskan pemain melakukan scroll berulang kali.

---

## 2.2 Board First

Board merupakan fokus utama antarmuka.

Pemain harus selalu dapat melihat posisi pion selama bermain.

---

## 2.3 Action First

Tombol aksi utama (Roll Dice) harus selalu mudah dijangkau.

---

## 2.4 Minimal Distraction

Informasi yang tidak penting disembunyikan agar pemain fokus pada permainan.

---

# 3. Platform Strategy

## Desktop

Target:
Mouse + Keyboard

Karakteristik:

- Seluruh komponen dapat tampil bersamaan.
- Memanfaatkan ruang horizontal.
- Informasi permainan tampil lengkap.

---

## Mobile

Target:
Touch Screen

Karakteristik:

- Gameplay tanpa scroll.
- Roll Dice selalu terlihat.
- Board menjadi fokus utama.
- Informasi penting tetap terlihat.
- Menu sekunder disimpan dalam drawer atau menu.

---

# 4. Gameplay Flow

Start Game

↓

Board

↓

Roll Dice

↓

Player Movement

↓

Tile Event

↓

Quiz / Snake / Ladder / Fact

↓

Score Update

↓

Next Turn

↓

Repeat

---

# 5. Layout Rules

Desktop

- Header
- Board
- HUD
- Dice
- Control Panel

Semua tampil bersamaan.

---

Mobile

- Header
- Board
- Sticky Bottom Panel

Bottom Panel berisi:

- Current Player
- Score
- Roll Dice

---

# 6. Component Priority

Critical

- Board
- Roll Dice
- Player Token

High

- HUD
- Quiz

Medium

- Score Detail

Low

- Settings
- Help
- Credits

---

# 7. Responsive Rules

Desktop menggunakan layout horizontal.

Mobile menggunakan layout vertikal.

Board harus selalu terlihat.

Roll Dice tidak boleh memerlukan scroll.

Quiz muncul sebagai modal.

---

# 8. Accessibility

- Tombol mudah ditekan.
- Ukuran font tetap terbaca.
- Kontras warna cukup.
- Feedback visual saat tombol ditekan.

---

# 9. Future Improvements

- Dark Mode
- Landscape Mode
- Animasi Board
- Gesture Support
- Zoom Board