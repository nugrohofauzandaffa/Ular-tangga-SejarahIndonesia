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
  },
  // Easy (5 New)
  {
    id: 'q21',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Easy',
    question: 'Siapakah presiden pertama Republik Indonesia?',
    options: ['Ir. Soekarno', 'Mohammad Hatta', 'Soeharto', 'B.J. Habibie'],
    correctAnswer: 'Ir. Soekarno',
    explanation: 'Ir. Soekarno adalah presiden pertama Indonesia yang menjabat sejak tahun 1945.'
  },
  {
    id: 'q22',
    category: 'Pahlawan Nasional',
    difficulty: 'Easy',
    question: 'Siapakah pahlawan yang dijuluki Bapak Pendidikan Nasional?',
    options: ['Ki Hajar Dewantara', 'Budi Utomo', 'Wahid Hasyim', 'Sutan Sjahrir'],
    correctAnswer: 'Ki Hajar Dewantara',
    explanation: 'Ki Hajar Dewantara mendirikan Taman Siswa dan dijuluki Bapak Pendidikan Nasional.'
  },
  {
    id: 'q23',
    category: 'Kerajaan Nusantara',
    difficulty: 'Easy',
    question: 'Kerajaan Islam pertama di Indonesia adalah...',
    options: ['Samudera Pasai', 'Demak', 'Aceh', 'Ternate'],
    correctAnswer: 'Samudera Pasai',
    explanation: 'Samudera Pasai yang terletak di Aceh merupakan kerajaan Islam pertama di Indonesia.'
  },
  {
    id: 'q24',
    category: 'Pahlawan Nasional',
    difficulty: 'Easy',
    question: 'Pahlawan nasional yang memimpin Perang Diponegoro adalah...',
    options: ['Pangeran Diponegoro', 'Sultan Hasanuddin', 'Tuanku Imam Bonjol', 'Teuku Umar'],
    correctAnswer: 'Pangeran Diponegoro',
    explanation: 'Perang Jawa (1825-1830) dipimpin oleh Pangeran Diponegoro melawan Belanda.'
  },
  {
    id: 'q25',
    category: 'Simbol Negara',
    difficulty: 'Easy',
    question: 'Burung yang menjadi lambang negara Indonesia adalah...',
    options: ['Garuda', 'Rajawali', 'Elang', 'Merpati'],
    correctAnswer: 'Garuda',
    explanation: 'Burung Garuda digunakan sebagai lambang negara Republik Indonesia.'
  },
  // Medium (5 New)
  {
    id: 'q26',
    category: 'Organisasi Keagamaan',
    difficulty: 'Medium',
    question: 'Siapakah ulama besar pendiri organisasi keagamaan Nahdlatul Ulama (NU) pada tahun 1926?',
    options: ["K.H. Hasyim Asy'ari", 'K.H.Ahmad Dahlan', 'H.A.Salim', 'H.O.S.Tjokroaminoto'],
    correctAnswer: "K.H. Hasyim Asy'ari",
    explanation: "K.H. Hasyim Asy'ari adalah pahlawan nasional sekaligus pendiri Nahdlatul Ulama(NU) di Surabaya pada 31 Januari 1926."
  },
  {
    id: 'q27',
    category: 'Organisasi Pergerakan',
    difficulty: 'Medium',
    question: 'Siapakah pendiri Sarekat Dagang Islam yang kemudian menjadi Sarekat Islam?',
    options: ['Haji Samanhudi', 'H.O.S. Tjokroaminoto', 'K.H. Ahmad Dahlan', 'Hasyim Asy\'ari'],
    correctAnswer: 'Haji Samanhudi',
    explanation: 'Haji Samanhudi mendirikan Sarekat Dagang Islam di Solo pada tahun 1905 untuk membela pedagang batik lokal.'
  },
  {
    id: 'q28',
    category: 'Zaman Penjajahan',
    difficulty: 'Medium',
    question: 'Sistem kerja paksa pada masa penjajahan Jepang disebut...',
    options: ['Romusha', 'Kerja Rodi', 'Tanam Paksa', 'Kerja Bakti'],
    correctAnswer: 'Romusha',
    explanation: 'Romusha adalah sebutan untuk orang-orang Indonesia yang dipekerjakan secara paksa oleh tentara Jepang.'
  },
  {
    id: 'q29',
    category: 'Kerajaan Nusantara',
    difficulty: 'Medium',
    question: 'Sultan Hasanuddin, pahlawan dari Makassar, sering dijuluki...',
    options: ['Ayam Jantan dari Timur', 'Mutiara dari Timur', 'Pahlawan Tak Terkalahkan', 'Singa Barong'],
    correctAnswer: 'Ayam Jantan dari Timur',
    explanation: 'Belanda menjuluki Sultan Hasanuddin "De Haantjes van Het Oosten" atau Ayam Jantan dari Timur karena kegigihannya.'
  },
  {
    id: 'q30',
    category: 'Revolusi Kemerdekaan',
    difficulty: 'Medium',
    question: 'Pertempuran heroik 10 November 1945 terjadi di kota...',
    options: ['Surabaya', 'Bandung', 'Semarang', 'Medan'],
    correctAnswer: 'Surabaya',
    explanation: 'Pertempuran Surabaya mencapai puncaknya pada 10 November 1945, yang kini diperingati sebagai Hari Pahlawan.'
  },
  // Hard (5 New)
  {
    id: 'q31',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Hard',
    question: 'Siapakah pengetik naskah Proklamasi Kemerdekaan Indonesia?',
    options: ['Sayuti Melik', 'Sukarni', 'B.M. Diah', 'Latief Hendraningrat'],
    correctAnswer: 'Sayuti Melik',
    explanation: 'Naskah Proklamasi yang ditulis tangan oleh Soekarno diketik oleh Sayuti Melik dengan beberapa perubahan.'
  },
  {
    id: 'q32',
    category: 'Perjanjian',
    difficulty: 'Hard',
    question: 'Perjanjian Bongaya (1667) adalah perjanjian damai antara VOC dengan kerajaan...',
    options: ['Gowa-Tallo', 'Ternate', 'Mataram', 'Banten'],
    correctAnswer: 'Gowa-Tallo',
    explanation: 'Perjanjian Bongaya mengakhiri konflik antara Kesultanan Gowa yang dipimpin Sultan Hasanuddin dengan VOC.'
  },
  {
    id: 'q33',
    category: 'Zaman Kolonial',
    difficulty: 'Hard',
    question: 'Gubernur Jenderal Belanda yang menerapkan kebijakan Tanam Paksa (Cultuurstelsel) adalah...',
    options: ['Johannes van den Bosch', 'Herman Willem Daendels', 'Jan Pieterszoon Coen', 'Thomas Stamford Raffles'],
    correctAnswer: 'Johannes van den Bosch',
    explanation: 'Van den Bosch memperkenalkan Cultuurstelsel pada tahun 1830 untuk mengisi kas Belanda yang kosong.'
  },
  {
    id: 'q34',
    category: 'Organisasi Pergerakan',
    difficulty: 'Hard',
    question: 'Surat kabar pertama di Indonesia yang menjadi corong pergerakan nasional adalah...',
    options: ['Medan Prijaji', 'De Locomotief', 'Bataviaasch Nieuwsblad', 'Sin Po'],
    correctAnswer: 'Medan Prijaji',
    explanation: 'Medan Prijaji yang diterbitkan oleh Tirto Adhi Soerjo adalah surat kabar pertama yang dikelola penuh oleh kaum bumiputra.'
  },
  {
    id: 'q35',
    category: 'Konferensi Asia Afrika',
    difficulty: 'Hard',
    question: 'Siapakah Perdana Menteri Indonesia yang memprakarsai Konferensi Asia-Afrika 1955?',
    options: ['Ali Sastroamidjojo', 'Burhanuddin Harahap', 'Djuanda Kartawidjaja', 'Wilopo'],
    correctAnswer: 'Ali Sastroamidjojo',
    explanation: 'Ali Sastroamidjojo, Perdana Menteri Indonesia saat itu, memainkan peran kunci dalam penyelenggaraan KAA 1955.'
  },
  // Extreme (5 New)
  {
    id: 'q36',
    category: 'Sistem Ketatanegaraan',
    difficulty: 'Extreme',
    question: 'Konstitusi Republik Indonesia Serikat (RIS) berlaku sejak tanggal...',
    options: ['27 Desember 1949', '17 Agustus 1950', '18 Agustus 1945', '5 Juli 1959'],
    correctAnswer: '27 Desember 1949',
    explanation: 'Konstitusi RIS berlaku setelah penyerahan kedaulatan hasil KMB pada 27 Desember 1949 hingga 17 Agustus 1950.'
  },
  {
    id: 'q37',
    category: 'Revolusi',
    difficulty: 'Extreme',
    question: 'Perwira militer Inggris yang tewas dalam insiden di Surabaya, yang memicu Pertempuran 10 November, adalah...',
    options: ['A.W.S. Mallaby', 'Philip Christison', 'Lord Mountbatten', 'Richard Kirby'],
    correctAnswer: 'A.W.S. Mallaby',
    explanation: 'Brigadir Jenderal A.W.S. Mallaby tewas pada 30 Oktober 1945 dalam baku tembak di Jembatan Merah, Surabaya.'
  },
  {
    id: 'q38',
    category: 'Kerajaan Nusantara',
    difficulty: 'Extreme',
    question: 'Kitab Nagarakretagama yang mendeskripsikan masa kejayaan Majapahit ditulis oleh...',
    options: ['Mpu Prapanca', 'Mpu Tantular', 'Mpu Sedah', 'Mpu Panuluh'],
    correctAnswer: 'Mpu Prapanca',
    explanation: 'Mpu Prapanca menulis kakawin Nagarakretagama pada tahun 1365 M (masa pemerintahan Hayam Wuruk).'
  },
  {
    id: 'q39',
    category: 'Zaman Kolonial',
    difficulty: 'Extreme',
    question: 'Undang-Undang Agraria (Agrarische Wet) yang membuka Indonesia bagi penanaman modal swasta asing disahkan pada tahun...',
    options: ['1870', '1830', '1901', '1910'],
    correctAnswer: '1870',
    explanation: 'Agrarische Wet 1870 menjadi awal berlakunya politik pintu terbuka dan sistem ekonomi liberal di Hindia Belanda.'
  },
  {
    id: 'q40',
    category: 'Perjanjian Internasional',
    difficulty: 'Extreme',
    question: 'Utusan PBB yang membantu menyelesaikan konflik Indonesia-Belanda melalui Komisi Tiga Negara (KTN) adalah dari negara...',
    options: ['Australia, Belgia, Amerika Serikat', 'Inggris, India, Australia', 'Amerika Serikat, Inggris, Belanda', 'Prancis, Belgia, Amerika Serikat'],
    correctAnswer: 'Australia, Belgia, Amerika Serikat',
    explanation: 'KTN dibentuk oleh PBB; Australia dipilih oleh Indonesia, Belgia oleh Belanda, dan AS disepakati sebagai pihak netral.'
  },
  // Tambahan 10 soal baru (4 Easy, 3 Medium, 3 Hard)
  {
    id: 'q41',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Easy',
    question: 'Siapakah Wakil Presiden pertama Republik Indonesia?',
    options: ['Mohammad Hatta', 'Sultan Hamengkubuwono IX', 'Adam Malik', 'Jusuf Kalla'],
    correctAnswer: 'Mohammad Hatta',
    explanation: 'Mohammad Hatta mendampingi Ir. Soekarno sebagai Wakil Presiden pertama sejak 17 Agustus 1945.'
  },
  {
    id: 'q42',
    category: 'Sejarah Kemerdekaan',
    difficulty: 'Easy',
    question: 'Siapa nama pahlawan nasional yang menciptakan lagu kebangsaan Indonesia Raya?',
    options: ['W.R. Supratman', 'Ismail Marzuki', 'Ibu Sud', 'C. Simanjuntak'],
    correctAnswer: 'W.R. Supratman',
    explanation: 'Wage Rudolf Supratman menciptakan lagu Indonesia Raya yang pertama kali dikumandangkan pada momen Sumpah Pemuda 1928.'
  },
  {
    id: 'q43',
    category: 'Kerajaan Nusantara',
    difficulty: 'Easy',
    question: 'Candi Borobudur dibangun pada masa pemerintahan wangsa atau dinasti apa?',
    options: ['Syailendra', 'Sanjaya', 'Isyana', 'Warmadewa'],
    correctAnswer: 'Syailendra',
    explanation: 'Candi Borobudur dibangun pada abad ke-8 dan ke-9 Masehi oleh Dinasti Syailendra di Jawa Tengah.'
  },
  {
    id: 'q44',
    category: 'Pahlawan Nasional',
    difficulty: 'Easy',
    question: 'Pahlawan nasional Kapitan Pattimura berasal dari daerah mana?',
    options: ['Maluku', 'Aceh', 'Jawa Tengah', 'Sumatera Barat'],
    correctAnswer: 'Maluku',
    explanation: 'Kapitan Pattimura (Thomas Matulessy) adalah pahlawan yang memimpin perlawanan rakyat Maluku melawan Belanda pada tahun 1817.'
  },
  {
    id: 'q45',
    category: 'Zaman Penjajahan',
    difficulty: 'Medium',
    question: 'Perang Diponegoro (Perang Jawa) berlangsung pada kurun waktu...',
    options: ['1825 - 1830', '1800 - 1805', '1901 - 1908', '1873 - 1904'],
    correctAnswer: '1825 - 1830',
    explanation: 'Perang Diponegoro dipimpin oleh Pangeran Diponegoro melawan pemerintah Hindia Belanda dan berlangsung selama 5 tahun.'
  },
  {
    id: 'q46',
    category: 'Pahlawan Nasional',
    difficulty: 'Medium',
    question: 'Siapakah tokoh yang memimpin perlawanan rakyat Aceh melawan Belanda dengan taktik gerilya?',
    options: ['Teuku Umar', 'Tuanku Imam Bonjol', 'Sultan Hasanuddin', 'Pangeran Antasari'],
    correctAnswer: 'Teuku Umar',
    explanation: 'Teuku Umar memimpin perlawanan di Aceh dengan taktik bergerilya, bahkan sempat pura-pura menyerah kepada Belanda untuk merebut persenjataan.'
  },
  {
    id: 'q47',
    category: 'Zaman Penjajahan',
    difficulty: 'Medium',
    question: 'Siapakah pelaut Belanda yang memimpin armada pertama dan mendarat di Banten pada tahun 1596?',
    options: ['Cornelis de Houtman', 'J.P. Coen', 'Abel Tasman', 'Pieter Both'],
    correctAnswer: 'Cornelis de Houtman',
    explanation: 'Cornelis de Houtman adalah kapten armada Belanda pertama yang sukses mencapai Nusantara (di pelabuhan Banten) untuk mencari rempah-rempah.'
  },
  {
    id: 'q48',
    category: 'Pahlawan Nasional',
    difficulty: 'Hard',
    question: 'Pahlawan dari Bali yang gugur bersama pasukannya dalam pertempuran sengit "Puputan Margarana" melawan Belanda adalah...',
    options: ['I Gusti Ngurah Rai', 'Untung Surapati', 'Pangeran Antasari', 'Kyai Mojo'],
    correctAnswer: 'I Gusti Ngurah Rai',
    explanation: 'Letkol I Gusti Ngurah Rai memimpin perlawanan heroik habis-habisan (puputan) di Margarana, Bali pada 20 November 1946.'
  },
  {
    id: 'q49',
    category: 'Pendudukan Jepang',
    difficulty: 'Hard',
    question: 'Organisasi semi-militer bentukan Jepang yang beranggotakan pemuda Indonesia berusia 14-22 tahun dinamakan...',
    options: ['Seinendan', 'Keibodan', 'PETA', 'Fujinkai'],
    correctAnswer: 'Seinendan',
    explanation: 'Seinendan dibentuk Jepang untuk mendidik dan melatih pemuda agar dapat mempertahankan tanah air, meski tujuan aslinya demi kepentingan perang Jepang.'
  },
  {
    id: 'q50',
    category: 'Zaman Kolonial',
    difficulty: 'Hard',
    question: 'Jalan Raya Pos sepanjang 1.000 km dari Anyer (Banten) hingga Panarukan (Jawa Timur) dibangun pada masa pemerintahan Gubernur Jenderal...',
    options: ['Herman Willem Daendels', 'Jan Pieterszoon Coen', 'Thomas Stamford Raffles', 'Johannes van den Bosch'],
    correctAnswer: 'Herman Willem Daendels',
    explanation: 'Daendels memerintahkan pembangunan De Grote Postweg (Jalan Raya Pos) untuk mempermudah pertahanan militer dan komunikasi di Pulau Jawa.'
  }
];
