# Coding Standards

## Project

Nama:
Ular Tangga Edukatif: Sejarah Indonesia

Framework:
- Next.js 15
- React
- TypeScript

---

# General Rules

- Gunakan TypeScript di seluruh project.
- Hindari penggunaan `any`.
- Semua function harus memiliki tipe data yang jelas.
- Gunakan ES Module.
- Pisahkan UI dan Business Logic.
- Jangan menyimpan logika game di dalam komponen React.

---

# Folder Structure

src/

- app/
- components/
- hooks/
- lib/
- data/
- types/
- assets/
- constants/
- styles/

Jangan membuat folder baru tanpa alasan yang jelas.

---

# File Naming

Gunakan PascalCase untuk React Component.

Contoh:

Board.tsx

Dice.tsx

QuestionModal.tsx

Gunakan camelCase untuk file helper.

Contoh:

gameEngine.ts

movement.ts

random.ts

Gunakan huruf kecil untuk folder.

Contoh:

components/

hooks/

lib/

---

# Component Rules

Satu file hanya untuk satu komponen.

Contoh:

Board.tsx

berisi

Board

Jangan membuat dua komponen utama dalam satu file.

---

# Custom Hooks

Semua custom hook diawali dengan use.

Contoh:

useGame()

useDice()

useQuestion()

---

# Interface

Semua interface berada di folder

src/types

Contoh:

player.ts

board.ts

question.ts

Jangan membuat interface di dalam komponen React.

---

# Dummy Data

Semua data statis berada di

src/data

Contoh:

questions.ts

board.ts

snakes.ts

ladders.ts

---

# Business Logic

Semua aturan permainan berada di

src/lib

Contoh:

gameEngine.ts

movement.ts

scoring.ts

QuestionEngine.ts

Komponen React hanya memanggil fungsi.

---

# React Rules

Gunakan Functional Component.

Gunakan React Hooks.

Hindari Class Component.

---

# Styling

Gunakan CSS Module atau Tailwind.

Jangan menggunakan inline style kecuali sangat diperlukan.

---

# Import Order

1. React
2. Next.js
3. Third Party Library
4. Internal Components
5. Hooks
6. Types
7. Styles

---

# Comments

Gunakan komentar hanya untuk menjelaskan logika yang kompleks.

Hindari komentar yang menjelaskan hal yang sudah jelas.

---

# Git Commit Convention

feat:
Menambah fitur baru.

fix:
Memperbaiki bug.

refactor:
Mengubah struktur kode tanpa mengubah fungsi.

style:
Perubahan tampilan.

docs:
Perubahan dokumentasi.

chore:
Konfigurasi project.

Contoh:

feat: add dice animation

fix: player movement bug

docs: update GDD

---

# AI Agent Rules

AI Agent harus:

- Mengikuti struktur folder yang sudah ditentukan.
- Tidak membuat folder baru tanpa persetujuan.
- Tidak membuat file yang tidak digunakan.
- Tidak menggunakan library baru tanpa alasan.
- Tidak mengubah struktur project tanpa persetujuan.
- Selalu menggunakan TypeScript.
- Menjaga kode tetap modular.
- Memisahkan UI dari Business Logic.

# Architecture Rules

Game Engine tidak boleh bergantung pada React.

Komponen React hanya bertugas menampilkan data.

Seluruh state permainan berasal dari Game Engine.

Game Engine harus dapat dijalankan tanpa UI.

UI tidak boleh berisi perhitungan aturan permainan.

Semua data soal harus diambil dari folder data/.

Business Logic tidak boleh ditulis di page.tsx.

# Documentation Rules

Setelah setiap implementasi selesai, AI Agent wajib:

1. Memperbarui docs/Management/Development-Log.md.
2. Menjelaskan:
   - Phase
   - File yang dibuat atau diubah
   - Alasan perubahan
   - Dampak perubahan
   - Status (Completed / Waiting Review / Revised)
3. Memperbarui docs/Management/task.md bila ada task yang selesai.
4. Tidak melanjutkan ke phase berikutnya sebelum mendapat persetujuan reviewer.

# Documentation Policy

AI Agent boleh langsung memperbarui:

- Development-Log.md
- task.md
- Roadmap.md (status saja)

AI Agent harus meminta persetujuan sebelum:

- Mengubah GDD.md
- Mengubah Domain-Model.md
- Mengubah Architecture.md
- Mengubah Coding-Standards.md
- Membuat dokumen baru di folder docs/

Setiap perubahan dokumentasi desain harus disertai alasan dan dampaknya.