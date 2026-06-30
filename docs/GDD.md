# Game Design Document

## Nama Project
Ular Tangga Edukatif: Sejarah Indonesia

---

## Genre

- Board Game
- Educational Game
- Quiz Game

---

## Target Platform

- Web Browser
- Desktop
- Mobile Browser

---

## Target Pengguna

- Siswa SMP
- Siswa SMA
- Mahasiswa
- Masyarakat umum yang ingin belajar sejarah Indonesia

---

## Tujuan Game

Menggabungkan permainan Ular Tangga dengan pembelajaran sejarah Indonesia sehingga pemain dapat belajar sambil bermain.

---

## Gameplay Loop

1. Lempar dadu
2. Pindahkan pion
3. Cek jenis petak
4. Jika Quiz → Jawab soal
5. Jika benar → Tambah skor
6. Jika salah → Tampilkan penjelasan
7. Lanjut ke pemain berikutnya
8. Pemain pertama mencapai Finish memenangkan permainan

---

## Core Features

- Board 100 petak
- Dice
- Snake
- Ladder
- Quiz
- Score
- History Facts
- Result Screen

---

## Movement Rules

1. Pemain melempar dadu untuk menentukan jumlah langkah.
2. Pion bergerak maju sesuai nilai dadu.
3. Untuk memenangkan permainan, pemain harus berhenti tepat di petak terakhir (100).
4. Jika hasil dadu melebihi petak terakhir, pion tetap berada di posisi semula.
5. Setelah pergerakan selesai, giliran berpindah ke pemain berikutnya.
6. Pemeriksaan ular, tangga, kuis, fakta, bonus, dan penalti dilakukan oleh Tile Resolver, bukan Movement Module.

## Teknologi

Frontend:
- Next.js
- React
- TypeScript

Backend:
- Node.js Runtime

Database:
- Tidak digunakan (MVP)

Version:
v1.0