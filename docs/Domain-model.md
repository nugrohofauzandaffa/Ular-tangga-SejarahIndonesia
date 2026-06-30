# Domain Model

## Game

Mengelola keseluruhan permainan.

Memiliki:

- Board
- Players
- Dice
- Game State

---

## Player

Mewakili pemain. Skor digunakan sebagai statistik pembelajaran di akhir, bukan penentu pemenang.

Atribut:

- id
- name
- position (Posisi petak saat ini)
- score (Total skor yang didapat dari Quiz/Bonus)
- correctAnswers (Jumlah kuis dijawab benar)
- wrongAnswers (Jumlah kuis dijawab salah)

---

## Board

Papan permainan.

Memiliki:

- Tiles (Array of Tile 1-100)
- Snakes
- Ladders

---

## Tile

Satu petak pada papan permainan.

Atribut:

- position (1-100)
- type (Normal, Quiz, Snake, Ladder, Bonus, Penalty, Fact)
- contentId (Opsional: ID untuk referensi Soal Quiz atau Fakta)
- effectValue (Opsional: Nilai efek untuk Bonus/Penalty. Contoh: +50 skor, -2 langkah)

---

## Snake

Mekanik rintangan.

Atribut:

- head (Posisi kepala ular, posisi yang membuat turun)
- tail (Posisi ekor ular, posisi akhir setelah turun)

---

## Ladder

Mekanik shortcut/keuntungan.

Atribut:

- start (Posisi bawah tangga, posisi yang membuat naik)
- end (Posisi atas tangga, posisi akhir setelah naik)

---

## Dice

Atribut:

- currentValue (Nilai dadu 1-6)
- isRolling (Status animasi/mengacak)

---

## Question (Quiz)

Atribut soal untuk petak Quiz. Setelah dijawab, akan selalu menampilkan explanation.

Atribut:

- id
- category
- difficulty
- question
- options
- correctAnswer
- explanation (Penjelasan fakta historis untuk jawaban)

---

## Fact

Atribut informasi untuk petak Fact. Ditampilkan tanpa pertanyaan.

Atribut:

- id
- title
- description (Isi fakta sejarah singkat)

---

## Score

Statistik di akhir permainan.

Atribut:

- totalScore
- combo
- accuracy

---

## Game State

Mengatur kondisi alur permainan (Client-side, tanpa database). Pemenang adalah yang pertama kali mencapai petak akhir (100).

Atribut:

- players (Daftar semua pemain)
- currentTurn (ID pemain yang sedang mendapat giliran)
- winner (ID pemain yang menang, null jika belum ada)
- gameStatus (Misal: 'idle', 'rolling_dice', 'moving', 'answering_quiz', 'showing_fact', 'showing_effect', 'finished')