import { Question } from '../types/question';

export const questions: Question[] = [
  // Easy (5)
  {
    id: 'q1',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Easy',
    question: 'Siapakah proklamator kemerdekaan Indonesia?',
    options: ['Soekarno dan Hatta', 'Soekarno dan Soedirman', 'Hatta dan Sjahrir', 'Soedirman dan Sjahrir'],
    correctAnswer: 'Soekarno dan Hatta',
    explanation: 'Soekarno dan Mohammad Hatta adalah tokoh yang membacakan teks proklamasi pada 17 Agustus 1945.'
  },
  {
    id: 'q2',
    category: 'Kerajaan Nusantara',
    difficulty: 'Easy',
    question: 'Kerajaan Hindu tertua di Indonesia adalah...',
    options: ['Kutai', 'Tarumanegara', 'Majapahit', 'Singasari'],
    correctAnswer: 'Kutai',
    explanation: 'Kerajaan Kutai di Kalimantan Timur adalah kerajaan Hindu tertua di Nusantara yang berdiri abad ke-4.'
  },
  {
    id: 'q3',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Easy',
    question: 'Dimanakah teks Proklamasi Kemerdekaan Indonesia dibacakan?',
    options: ['Jalan Pegangsaan Timur No. 56', 'Jalan Merdeka Barat No. 1', 'Istana Merdeka', 'Lapangan IKADA'],
    correctAnswer: 'Jalan Pegangsaan Timur No. 56',
    explanation: 'Teks proklamasi dibacakan di kediaman Soekarno di Jl. Pegangsaan Timur No. 56, Jakarta.'
  },
  {
    id: 'q4',
    category: 'Pahlawan Nasional',
    difficulty: 'Easy',
    question: 'Pahlawan wanita dari Aceh yang terkenal gigih melawan Belanda adalah...',
    options: ['Cut Nyak Dien', 'R.A. Kartini', 'Dewi Sartika', 'Martha Christina Tiahahu'],
    correctAnswer: 'Cut Nyak Dien',
    explanation: 'Cut Nyak Dien memimpin pasukan Aceh melawan penjajahan Belanda pada masa Perang Aceh.'
  },
  {
    id: 'q5',
    category: 'Sumpah Pemuda',
    difficulty: 'Easy',
    question: 'Kapan Hari Sumpah Pemuda diperingati?',
    options: ['28 Oktober', '17 Agustus', '10 November', '20 Mei'],
    correctAnswer: '28 Oktober',
    explanation: 'Sumpah Pemuda dibacakan pada 28 Oktober 1928, menjadi tonggak penting pergerakan kemerdekaan.'
  },
  // Medium (5)
  {
    id: 'q6',
    category: 'Zaman Penjajahan',
    difficulty: 'Medium',
    question: 'Siapakah Gubernur Jenderal VOC yang memindahkan pusat VOC ke Batavia?',
    options: ['Jan Pieterszoon Coen', 'Herman Willem Daendels', 'Thomas Stamford Raffles', 'Cornelis de Houtman'],
    correctAnswer: 'Jan Pieterszoon Coen',
    explanation: 'J.P. Coen memindahkan pusat VOC ke Jayakarta pada 1619 dan mengubah namanya menjadi Batavia.'
  },
  {
    id: 'q7',
    category: 'Organisasi Pergerakan',
    difficulty: 'Medium',
    question: 'Organisasi pergerakan nasional pertama di Indonesia adalah...',
    options: ['Budi Utomo', 'Sarekat Islam', 'Indische Partij', 'Perhimpunan Indonesia'],
    correctAnswer: 'Budi Utomo',
    explanation: 'Budi Utomo didirikan pada 20 Mei 1908 oleh Dr. Sutomo dan mahasiswa STOVIA.'
  },
  {
    id: 'q8',
    category: 'Kerajaan Nusantara',
    difficulty: 'Medium',
    question: 'Siapakah Mahapatih Majapahit yang mengucapkan Sumpah Palapa?',
    options: ['Gajah Mada', 'Hayam Wuruk', 'Raden Wijaya', 'Ken Arok'],
    correctAnswer: 'Gajah Mada',
    explanation: 'Gajah Mada mengucapkan Sumpah Palapa yang berisi tekad menyatukan Nusantara.'
  },
  {
    id: 'q9',
    category: 'Revolusi Kemerdekaan',
    difficulty: 'Medium',
    question: 'Peristiwa penculikan Soekarno-Hatta oleh para pemuda dikenal sebagai peristiwa...',
    options: ['Rengasdengklok', 'Bandung Lautan Api', 'Ambarawa', 'Tiga Daerah'],
    correctAnswer: 'Rengasdengklok',
    explanation: 'Peristiwa Rengasdengklok terjadi pada 16 Agustus 1945 untuk mendesak proklamasi segera dilakukan.'
  },
  {
    id: 'q10',
    category: 'Agresi Militer',
    difficulty: 'Medium',
    question: 'Pemerintah Darurat Republik Indonesia (PDRI) dibentuk saat Agresi Militer II dan dipimpin oleh...',
    options: ['Sjafruddin Prawiranegara', 'Soedirman', 'Mohammad Natsir', 'Sutan Sjahrir'],
    correctAnswer: 'Sjafruddin Prawiranegara',
    explanation: 'PDRI dibentuk di Bukittinggi oleh Sjafruddin Prawiranegara atas instruksi Soekarno saat ibukota Yogyakarta jatuh.'
  },
  // Hard (5)
  {
    id: 'q11',
    category: 'Perjanjian',
    difficulty: 'Hard',
    question: 'Perjanjian yang mengakui wilayah RI hanya meliputi Jawa, Sumatera, dan Madura adalah...',
    options: ['Perjanjian Linggarjati', 'Perjanjian Renville', 'Perjanjian Roem-Royen', 'Konferensi Meja Bundar'],
    correctAnswer: 'Perjanjian Linggarjati',
    explanation: 'Perjanjian Linggarjati (1946) menghasilkan pengakuan de facto atas Jawa, Sumatera, dan Madura.'
  },
  {
    id: 'q12',
    category: 'Zaman Prasejarah',
    difficulty: 'Hard',
    question: 'Pithecanthropus Erectus ditemukan di Trinil, Ngawi oleh...',
    options: ['Eugene Dubois', 'Von Koenigswald', 'T. Jacob', 'Oppenoorth'],
    correctAnswer: 'Eugene Dubois',
    explanation: 'Fosil Manusia Jawa (Pithecanthropus Erectus) ditemukan oleh peneliti Belanda Eugene Dubois pada tahun 1891.'
  },
  {
    id: 'q13',
    category: 'Tanam Paksa',
    difficulty: 'Hard',
    question: 'Siapakah penulis buku Max Havelaar yang mengkritik sistem Tanam Paksa?',
    options: ['Eduard Douwes Dekker', 'Van den Bosch', 'Baron van Hoevell', 'Snouck Hurgronje'],
    correctAnswer: 'Eduard Douwes Dekker',
    explanation: 'Eduard Douwes Dekker menulis Max Havelaar dengan nama pena Multatuli untuk memprotes Cultuurstelsel.'
  },
  {
    id: 'q14',
    category: 'Kerajaan Nusantara',
    difficulty: 'Hard',
    question: 'Prasasti Yupa yang menjadi bukti tertulis peninggalan Kerajaan Kutai menggunakan huruf...',
    options: ['Pallawa', 'Pranagari', 'Kawi', 'Jawa Kuno'],
    correctAnswer: 'Pallawa',
    explanation: 'Prasasti Yupa dari Kutai (abad ke-4 M) ditulis dalam bahasa Sanskerta dan huruf Pallawa.'
  },
  {
    id: 'q15',
    category: 'Konferensi Asia Afrika',
    difficulty: 'Hard',
    question: 'Konferensi Asia-Afrika (KAA) pertama diselenggarakan di Bandung pada tahun...',
    options: ['1955', '1945', '1961', '1950'],
    correctAnswer: '1955',
    explanation: 'KAA diselenggarakan pada 18-24 April 1955 untuk memperkuat solidaritas negara-negara berkembang.'
  },
  // Extreme (5)
  {
    id: 'q16',
    category: 'Revolusi',
    difficulty: 'Extreme',
    question: 'Dokumen rahasia yang memerintahkan Panglima Soedirman memimpin perang gerilya dikenal sebagai...',
    options: ['Perintah Siasat No. 1', 'Surat Perintah Sebelas Maret', 'Dekrit Presiden', 'Maklumat 3 November'],
    correctAnswer: 'Perintah Siasat No. 1',
    explanation: 'Perintah Siasat No. 1 dikeluarkan pada 12 Juni 1947 sebagai pedoman taktik perang gerilya.'
  },
  {
    id: 'q17',
    category: 'Sistem Ketatanegaraan',
    difficulty: 'Extreme',
    question: 'Kapan tepatnya UUD 1945 disahkan pertama kali oleh PPKI?',
    options: ['18 Agustus 1945', '17 Agustus 1945', '1 Juni 1945', '22 Juni 1945'],
    correctAnswer: '18 Agustus 1945',
    explanation: 'UUD 1945 disahkan pada sidang PPKI pertama tanggal 18 Agustus 1945.'
  },
  {
    id: 'q18',
    category: 'Perjanjian Internasional',
    difficulty: 'Extreme',
    question: 'Siapakah delegasi Indonesia yang memimpin perundingan Renville?',
    options: ['Amir Sjarifuddin', 'Sutan Sjahrir', 'Mohammad Hatta', 'Agus Salim'],
    correctAnswer: 'Amir Sjarifuddin',
    explanation: 'Amir Sjarifuddin bertindak sebagai ketua delegasi Indonesia dalam Perundingan Renville (1947-1948).'
  },
  {
    id: 'q19',
    category: 'Zaman Kolonial',
    difficulty: 'Extreme',
    question: 'Kongsi dagang VOC secara resmi dibubarkan pada tanggal...',
    options: ['31 Desember 1799', '1 Januari 1800', '20 Maret 1602', '18 September 1811'],
    correctAnswer: '31 Desember 1799',
    explanation: 'Karena korupsi dan kebangkrutan, VOC resmi dibubarkan pada malam pergantian tahun 31 Desember 1799.'
  },
  {
    id: 'q20',
    category: 'Organisasi Pergerakan',
    difficulty: 'Extreme',
    question: 'Partai politik pertama di Hindia Belanda yang secara tegas menuntut kemerdekaan adalah...',
    options: ['Indische Partij', 'Partai Nasional Indonesia', 'Sarekat Islam', 'Perhimpunan Indonesia'],
    correctAnswer: 'Indische Partij',
    explanation: 'Didirikan tahun 1912 oleh Tiga Serangkai, Indische Partij adalah partai pertama dengan visi kemerdekaan penuh.'
  }
];
