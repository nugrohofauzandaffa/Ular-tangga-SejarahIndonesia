import { Question } from '../types/question';

export const questions: Question[] = [
  {
    id: 'q1',
    category: 'Kemerdekaan',
    difficulty: 'Easy',
    question: 'Siapakah yang membacakan teks Proklamasi Kemerdekaan Indonesia?',
    options: ['Mohammad Hatta', 'Soekarno', 'Sutan Sjahrir', 'Ahmad Soebardjo'],
    correctAnswer: 'Soekarno',
    explanation: 'Soekarno, didampingi oleh Mohammad Hatta, membacakan teks proklamasi pada 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56, Jakarta.'
  },
  {
    id: 'q2',
    category: 'Kerajaan Nusantara',
    difficulty: 'Medium',
    question: 'Kerajaan Islam pertama di nusantara adalah...',
    options: ['Demak', 'Samudera Pasai', 'Mataram Islam', 'Ternate'],
    correctAnswer: 'Samudera Pasai',
    explanation: 'Samudera Pasai adalah kerajaan Islam pertama di Nusantara yang terletak di pesisir utara Sumatera, didirikan pada abad ke-13.'
  },
  {
    id: 'q3',
    category: 'Masa Penjajahan',
    difficulty: 'Easy',
    question: 'Pahlawan nasional yang memimpin Perang Diponegoro adalah...',
    options: ['Pangeran Antasari', 'Tuanku Imam Bonjol', 'Pangeran Diponegoro', 'Pattimura'],
    correctAnswer: 'Pangeran Diponegoro',
    explanation: 'Pangeran Diponegoro memimpin Perang Jawa atau Perang Diponegoro melawan pemerintah Hindia Belanda pada tahun 1825–1830.'
  },
  {
    id: 'q4',
    category: 'Sumpah Pemuda',
    difficulty: 'Medium',
    question: 'Kapan Sumpah Pemuda diikrarkan?',
    options: ['28 Oktober 1928', '20 Mei 1908', '17 Agustus 1945', '10 November 1945'],
    correctAnswer: '28 Oktober 1928',
    explanation: 'Sumpah Pemuda diikrarkan pada Kongres Pemuda II tanggal 28 Oktober 1928 di Batavia (Jakarta).'
  },
  {
    id: 'q5',
    category: 'Orde Baru',
    difficulty: 'Hard',
    question: 'Surat Perintah 11 Maret (Supersemar) diberikan kepada...',
    options: ['Soekarno', 'Soeharto', 'B.J. Habibie', 'A.H. Nasution'],
    correctAnswer: 'Soeharto',
    explanation: 'Supersemar adalah surat perintah yang ditandatangani Presiden Soekarno pada 11 Maret 1966 yang memberikan wewenang kepada Letjen Soeharto untuk mengambil tindakan memulihkan keamanan.'
  },
  {
    id: 'q6',
    category: 'Kerajaan Hindu-Buddha',
    difficulty: 'Medium',
    question: 'Candi Borobudur dibangun pada masa wangsa...',
    options: ['Sanjaya', 'Syailendra', 'Isyana', 'Rajasa'],
    correctAnswer: 'Syailendra',
    explanation: 'Candi Borobudur dibangun pada abad ke-8 dan ke-9 Masehi pada masa pemerintahan Wangsa Syailendra dari Kerajaan Mataram Kuno.'
  }
];
