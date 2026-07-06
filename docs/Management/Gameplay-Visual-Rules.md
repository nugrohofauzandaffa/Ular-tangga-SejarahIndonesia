# Gameplay Visual Rules (Project Workflow 2.0)

Dokumen ini mendefinisikan 15 aturan visual untuk tahap **Redesign Gameplay (Milestone 3)** dengan tema **"Meja Ekspedisi"**.

## 1. Layout Grid
- **Desktop (lg & up)**: Layout dua kolom. Kolom utama (kiri/tengah) untuk Board dengan porsi dominan (min. 60-70% lebar), kolom samping (kanan) untuk HUD dan Game Log.
- **Mobile (< lg)**: Layout vertikal (stacked). Board berada di tengah, HUD diringkas menjadi bar atas/bawah yang *collapsible*.
- **Wadah Utama**: Menggunakan `h-screen` dan `w-full` dengan `overflow-hidden` untuk mencegah *scrolling* yang tidak disengaja.

## 2. Spacing Rules
- Menggunakan skala Tailwind (kelipatan 4px).
- **Macro Spacing**: Jarak antar komponen besar (misal: Board dengan HUD) menggunakan `gap-6` (24px) atau `gap-8` (32px).
- **Micro Spacing**: Jarak elemen dalam panel (teks ke ikon) menggunakan `gap-2` (8px) atau `gap-3` (12px).
- **Padding Board**: Memberikan jarak bernapas (white space) minimal `p-4` dari tepi layar di mobile, dan `p-8` di desktop.

## 3. Elevation Rules (Z-Index)
- **z-0**: Latar belakang Meja Ekspedisi (Kayu, Vignette).
- **z-10**: Papan Permainan (Board base).
- **z-20**: Jalur Ular & Tangga, Petak Khusus.
- **z-30**: Token Pemain, Dadu.
- **z-40**: Panel HUD, Notifikasi Toast.
- **z-50**: Ambient Particles (Debu, Cahaya) agar melewati semua elemen.
- **z-100**: Modal (Kuis, Efek, Krisis) dengan *backdrop blur*.

## 4. Shadow Rules
- **Physical Shadows**: Board dan Dadu menggunakan *hard shadow* gelap (`shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)]`) untuk kesan objek fisik tebal di atas meja.
- **UI Panels**: HUD dan Modal menggunakan *soft drop shadow* (`shadow-xl` dengan warna ambient navy/coklat tua).
- **Tokens**: Shadow dinamis di bawah pion. Semakin tinggi token melompat, shadow semakin lebar dan pudar.

## 5. Border Rules
- **Tebal**: Papan dan Panel utama menggunakan border tegas `border-4` atau `border-[6px]`.
- **Warna**: Menggunakan warna tematik (`var(--color-wood)`, `var(--color-gold-dark)`).
- **Radius**: Sudut membulat `rounded-xl` atau `rounded-2xl` untuk UI modern, atau gaya *Gigi Balang* untuk tema khusus.
- Hindari border garis tipis 1px abu-abu standar web.

## 6. Lighting Rules
- **Vignette**: Menggunakan *radial-gradient* gelap di pinggiran layar (opacity 40-70%) agar fokus mata tertuju ke papan permainan di tengah.
- **Highlights**: Menggunakan inset shadow terang putih/emas tipis pada sudut atas panel untuk efek terkena cahaya lilin/lampu minyak.
- Efek *Glow* untuk petak tujuan saat token berpindah.

## 7. Motion Rules
- Seluruh animasi UI menggunakan *Spring Physics* (Framer Motion).
- **Tokens**: *Squash & Stretch* ringan saat mendarat (game juice).
- **Modals**: Muncul dari bawah dengan `scale: 0.9` ke `1.0`, `stiffness: 300, damping: 25`.
- **Dadu**: Memiliki simulasi fisika rotasi 3D dan *shake effect*.

## 8. Animation Timing
- **Micro-interactions (Hover/Click)**: 150ms - 200ms (Cepat dan responsif).
- **Token Hop**: 300ms per petak.
- **Snake/Ladder Slide**: 800ms - 1200ms (Berdasarkan panjang rute) menggunakan kurva easing dinamis.
- **Modal Pop**: 400ms.

## 9. Typography Rules
- **Headers/Display**: Font sinematik (*Display Font* misal: serif atau ukiran Nusantara) bergaya kapital tebal.
- **Numbers/Dice**: Font tebal dan kontras tinggi (sans-serif kokoh).
- **Body/Log**: Font sans-serif yang sangat terbaca (`var(--font-body)`) dengan ukuran minimal 14px (desktop) / 12px (mobile).
- Efek ukiran (text-shadow) untuk judul penting.

## 10. Color Rules
- **Background**: Coklat tua/kayu (`#3e2723` atau gradasi tema).
- **Surface**: Perkamen/Krem (`#f4ebd0`) untuk panel UI.
- **Primary**: Navy gelap (`#0a192f`) untuk teks atau aksen tebal.
- **Accent**: Emas (`#d4af37`) untuk interaksi, border, dan pemenang.
- **Alert**: Merah bata/Maroon untuk penalti/ular. Hijau lumut/Emerald untuk bonus/tangga.

## 11. Interaction Rules
- **Interaction Frequency > Information Importance**: Prioritaskan elemen berdasarkan frekuensi penggunaan, bukan sekadar kepentingan informasi.
- **Selalu Terlihat (No Scroll)**: Elemen yang digunakan setiap giliran (Board, Turn Indicator, Dice Tray) WAJIB selalu terlihat utuh di layar tanpa perlu *scroll*.
- **Collapsible Secondary Info**: Informasi sekunder (Ranking, Game Log) harus bersifat *collapsible* (misal: tombol FAB/drawer) agar tidak mengganggu fokus pemain, terutama pada *mobile*.
- **Hover/Click**: Elemen interaktif memberikan efek *glow* atau *scale down* (0.95) layaknya benda fisik, tanpa menimbulkan *layout shift*.

## 12. Responsive Rules
- Board wajib menjaga *aspect-ratio* `1:1` (persegi) di semua ukuran.
- Pada mobile tinggi, Board berada di tengah secara vertikal. Pada layar landscape sempit, Board mengecil secara otomatis.
- HUD merespons dengan mengubah bentuk (dari list memanjang menjadi bar horizontal atau pop-up *collapsible*).

## 13. Accessibility Rules
- Kontras warna teks dengan *background* minimal 4.5:1. (Navy di atas Perkamen sangat aman).
- Tidak mengandalkan warna saja untuk menyampaikan info (gunakan icon + teks, misalnya: 🐍 Ular).
- Tombol/area sentuh memiliki ukuran minimal `44x44px` di mobile.

## 14. Visual Consistency Rules
- Mengadopsi aset visual dari Main Menu (siluet Nusantara, Gunungan Wayang opacity rendah, partikel debu).
- Konsisten dengan palet warna `ThemeContext` (Jakarta Heritage dsb).
- Kualitas *depth* dan pencahayaan disetarakan dengan *Hero Section*.

## 15. Component Naming Rules
- Semua varian komponen untuk redesign baru wajib menggunakan nama jelas jika diletakkan sementara di folder prototype, contoh: `GameLayoutPrototype`, `BoardPrototype`, `HUDPrototype`.
- Setelah disetujui, komponen akan mereplace komponen asli di folder `src/components`.
- Pisahkan presentasional dengan *logic*. File berakhiran `*.tsx` diutamakan untuk UI murni pada tahap ini.
