export interface StandardItem {
  id: string;
  code: string;
  title: string;
  sector: string;
  ics: string;
  year: number;
  status: 'Aktif' | 'Revisi' | 'Draf Konsensus';
  pages: number;
  fileSize: string;
  organization: string;
  summary: string;
  scope: string[];
  parameters: {
    name: string;
    targetValue: string;
    tolerance: string;
    unit: string;
  }[];
}

export interface InnovationIdea {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  impactMetrics: string;
}

export const INNOVATION_IDEAS: InnovationIdea[] = [
  {
    id: 1,
    title: "Fresh Idea",
    category: "Inovasi Standar AI & Data Siber",
    subtitle: "Standarisasi Keamanan Kecerdasan Artifisial & Tata Kelola Data Nasional",
    description: "Penyusunan kerangka kerja terpadu untuk pengujian akurasi, mitigasi bias algoritma, dan perlindungan privasi data latih model kecerdasan buatan di sektor publik dan finansial.",
    impactMetrics: "Kepatuhan Akreditasi 99.4%"
  },
  {
    id: 2,
    title: "Eco Battery Standard",
    category: "Energi Bersih & Transportasi",
    subtitle: "Standardisasi Protokol Penukaran Baterai EV & Daur Ulang Litium",
    description: "Spesifikasi mekanikal dan konektivitas swap station motor listrik nasional untuk memastikan interoperabilitas lintas merek serta keamanan termal sel baterai.",
    impactMetrics: "Target Reduksi Emisi 42%"
  },
  {
    id: 3,
    title: "Smart Industry 4.0",
    category: "Otomasi & Manufaktur",
    subtitle: "Protokol Komunikasi Mesin-ke-Mesin (M2M) & Sensor Industri",
    description: "Standardisasi latensi dan enkripsi jaringan sensor nirkabel pada lini produksi pabrik pintar guna menjamin keselamatan kerja otomatis dan toleransi nol henti.",
    impactMetrics: "Efisiensi Lini 35%+"
  },
  {
    id: 4,
    title: "Bio Packaging SNI",
    category: "Material Ramah Lingkungan",
    subtitle: "Standarisasi Kemasan Makanan Biodegradable Berbasis Pati Singkong",
    description: "Metode uji biodegradabilitas tanah dan ketahanan migrasi zat kimia pada kemasan pangan alternatif pengganti plastik sekali pakai di industri kuliner.",
    impactMetrics: "Degradasi Alami <90 Hari"
  }
];

export const STANDARDIZATION_DATABASE: StandardItem[] = [
  {
    id: "std-01",
    code: "SNI ISO/IEC 27001:2022",
    title: "Sistem Manajemen Keamanan Informasi (SMKI) - Persyaratan",
    sector: "Teknologi Informasi & Siber",
    ics: "35.030",
    year: 2022,
    status: "Aktif",
    pages: 38,
    fileSize: "3.4 MB",
    organization: "Badan Standardisasi Nasional (BSN)",
    summary: "Menetapkan spesifikasi untuk membangun, memelihara, dan terus menyempurnakan Sistem Manajemen Keamanan Informasi terpadu di lingkungan korporasi maupun instansi pemerintah.",
    scope: ["Tata Kelola Risiko Siber", "Kontrol Kriptografi", "Keamanan Fisik & Lingkungan", "Audit Kontinuitas Bisnis"],
    parameters: [
      { name: "Enkripsi Data At-Rest", targetValue: "AES-256", tolerance: "Wajib Minimum", unit: "Cipher" },
      { name: "Audit Trail Retention", targetValue: "365", tolerance: "±0", unit: "Hari" },
      { name: "Incident Response Time", targetValue: "15", tolerance: "<20", unit: "Menit" }
    ]
  },
  {
    id: "std-02",
    code: "SNI ISO 9001:2015",
    title: "Sistem Manajemen Mutu - Persyaratan & Standarisasi Proses",
    sector: "Manajemen & Organisasi",
    ics: "03.120.10",
    year: 2015,
    status: "Aktif",
    pages: 46,
    fileSize: "4.1 MB",
    organization: "Komite Akreditasi Nasional (KAN)",
    summary: "Acuan tolok ukur penjaminan mutu operasional, kepuasan konsumen, efisiensi rantai pasok, dan manajemen perbaikan berkelanjutan berbasis siklus PDCA.",
    scope: ["Konteks Organisasi", "Kepemimpinan Mutu", "Evaluasi Kinerja", "Tindakan Korektif"],
    parameters: [
      { name: "Indeks Kepuasan Klien", targetValue: "85.0", tolerance: "≥80.0", unit: "%" },
      { name: "Tingkat Cacat Produk (Defect)", targetValue: "0.05", tolerance: "≤0.10", unit: "%" },
      { name: "Penyelesaian Keluhan", targetValue: "48", tolerance: "≤72", unit: "Jam" }
    ]
  },
  {
    id: "std-03",
    code: "SNI 8914:2020",
    title: "Tekstil - Masker dari Kain untuk Penggunaan Medis & Perlindungan Umum",
    sector: "Kesehatan & Farmasi",
    ics: "11.140",
    year: 2020,
    status: "Aktif",
    pages: 18,
    fileSize: "1.8 MB",
    organization: "BSN / Balai Besar Tekstil",
    summary: "Spesifikasi teknis efisiensi filtrasi bakteri (BFE), resistensi penetrasi cairan sintetis, diferensial tekanan, dan kenyamanan sirkulasi pernapasan.",
    scope: ["Bacterial Filtration Efficiency", "Tahanan Aliran Udara", "Kekuatan Tarik Sambungan", "Uji Iritasi Kulit"],
    parameters: [
      { name: "Efisiensi Filtrasi Partikel", targetValue: "95.0", tolerance: "≥90.0", unit: "%" },
      { name: "Diferensial Tekanan Udara", targetValue: "40.0", tolerance: "<50.0", unit: "Pa/cm²" },
      { name: "Daya Tahan Cuci", targetValue: "20", tolerance: "≥15", unit: "Siklus" }
    ]
  },
  {
    id: "std-04",
    code: "SNI 04-0225-2020",
    title: "Persyaratan Umum Instalasi Listrik (PUIL 2020) & Keselamatan Energi",
    sector: "Kelistrikan & Energi",
    ics: "29.020",
    year: 2020,
    status: "Revisi",
    pages: 684,
    fileSize: "18.5 MB",
    organization: "Dirjen Ketenagalistrikan & BSN",
    summary: "Ketentuan teknis perancangan, pemasangan, inspeksi, dan pengujian instalasi listrik tegangan rendah dan menengah untuk keselamatan manusia dan proteksi kebakaran.",
    scope: ["Proteksi Bahaya Kejut Listrik", "Kapasitas Hantar Arus (KHA)", "Pentanahan Sistem (Grounding)", "Proteksi Arus Lebih"],
    parameters: [
      { name: "Tahanan Isolasi Konduktor", targetValue: "1000", tolerance: "≥500", unit: "kΩ" },
      { name: "Tahanan Pembumian (Grounding)", targetValue: "5.0", tolerance: "≤5.0", unit: "Ω" },
      { name: "Waktu Putus Pemutus Bocor", targetValue: "30", tolerance: "≤40", unit: "ms" }
    ]
  },
  {
    id: "std-05",
    code: "SNI ISO 14001:2015",
    title: "Sistem Manajemen Lingkungan - Panduan Penggunaan & Emisi Bersih",
    sector: "Lingkungan & Keberlanjutan",
    ics: "13.020.10",
    year: 2015,
    status: "Aktif",
    pages: 52,
    fileSize: "3.9 MB",
    organization: "Kementerian Lingkungan Hidup / BSN",
    summary: "Standar kerangka kerja untuk mengidentifikasi aspek lingkungan yang signifikan, mengendalikan pencemaran udara/air, dan menerapkan praktik keberlanjutan industri.",
    scope: ["Pencegahan Pencemaran", "Kepatuhan Hukum Lingkungan", "Daur Hidup Produk", "Optimasi Konsumsi Energi"],
    parameters: [
      { name: "Kepatuhan Baku Mutu Limbah", targetValue: "100.0", tolerance: "100.0", unit: "%" },
      { name: "Pengurangan Emisi Karbon Tahunan", targetValue: "8.5", tolerance: "≥5.0", unit: "%" },
      { name: "Daur Ulang Air Proses", targetValue: "45.0", tolerance: "≥30.0", unit: "%" }
    ]
  },
  {
    id: "std-06",
    code: "SNI ISO 22000:2018",
    title: "Sistem Manajemen Keamanan Pangan - Persyaratan Rantai Pasok",
    sector: "Pangan & Pertanian",
    ics: "67.020",
    year: 2018,
    status: "Aktif",
    pages: 44,
    fileSize: "3.1 MB",
    organization: "Badan Pengawas Obat dan Makanan (BPOM) / BSN",
    summary: "Pengendalian bahaya mikrobiologis, kimiawi, dan fisik dalam seluruh siklus rantai makanan mulai dari produsen bahan baku hingga ke meja konsumen.",
    scope: ["Prerequisite Programmes (PRPs)", "HACCP Plan", "Traceability Rantai Pasok", "Sistem Karantina Kontaminasi"],
    parameters: [
      { name: "Suhu Cold Chain Penyimpanan", targetValue: "4.0", tolerance: "±1.5", unit: "°C" },
      { name: "Waktu Lacak Asal Bahan Baku", targetValue: "2.0", tolerance: "≤4.0", unit: "Jam" },
      { name: "Inspeksi Mikroorganisme Coliform", targetValue: "0", tolerance: "0", unit: "CFU/g" }
    ]
  },
  {
    id: "std-07",
    code: "SNI 7973:2013",
    title: "Spesifikasi Desain untuk Konstruksi Kayu & Ketahanan Gempa",
    sector: "Konstruksi & Sipil",
    ics: "91.080.20",
    year: 2013,
    status: "Aktif",
    pages: 72,
    fileSize: "5.6 MB",
    organization: "Kementerian PUPR",
    summary: "Perhitungan nilai desain acuan kuat lentur, modulus elastisitas lentur, dan ketahanan sambungan mekanis pada bangunan kayu di zona rawan gempa Indonesia.",
    scope: ["Kuat Tekan Sejajar Serat", "Modulus Elastisitas Efektif", "Faktor Penyesuaian Lingkungan Basah", "Sambungan Baut Prategang"],
    parameters: [
      { name: "Kadar Air Kayu Terpasang", targetValue: "15.0", tolerance: "≤19.0", unit: "%" },
      { name: "Kuat Lentur Desain Minimum", targetValue: "18.5", tolerance: "≥16.0", unit: "MPa" },
      { name: "Koefisien Geser Sambungan", targetValue: "1.25", tolerance: "≥1.15", unit: "Fs" }
    ]
  },
  {
    id: "std-08",
    code: "SNI ISO/IEC 25010:2023",
    title: "Rekayasa Sistem & Perangkat Lunak: Model Kualitas Data & Software",
    sector: "Teknologi Informasi & Siber",
    ics: "35.080",
    year: 2023,
    status: "Draf Konsensus",
    pages: 40,
    fileSize: "2.7 MB",
    organization: "Masyarakat Standardisasi Indonesia (MASTAN) / BSN",
    summary: "Pedoman evaluasi karakteristik produk software meliputi kecukupan fungsional, efisiensi kinerja, kesesuaian waktu respons, reliabilitas, dan portabilitas database.",
    scope: ["Functional Suitability", "Performance Efficiency", "Fault Tolerance", "Usability Heuristics"],
    parameters: [
      { name: "Uptime Sistem Operasional", targetValue: "99.95", tolerance: "≥99.90", unit: "%" },
      { name: "Query Execution Time (P95)", targetValue: "180", tolerance: "<300", unit: "ms" },
      { name: "Code Coverage Unit Testing", targetValue: "85.0", tolerance: "≥80.0", unit: "%" }
    ]
  }
];

export const STEPPER_STAGES = [
  {
    step: 1,
    title: "Home page",
    subtitle: "lorem ipsum dolore",
    idnTitle: "Pencarian & Seleksi Standar",
    idnSubtitle: "Katalog SNI & Regulasi Mutu",
    desc: "Telusuri pangkalan data standarisasi, temukan acuan teknis regulasi, dan ajukan permohonan standardisasi spesifikasi produk."
  },
  {
    step: 2,
    title: "About us",
    subtitle: "lorem ipsum dolore",
    idnTitle: "Validasi & Pengujian Parameter",
    idnSubtitle: "Verifikasi Nilai Ambang Batas",
    desc: "Lakukan uji kesesuaian toleransi data aktual terhadap standar baku SNI dengan kalkulator kepatuhan otomatis."
  },
  {
    step: 3,
    title: "What we do for you",
    subtitle: "lorem ipsum dolore",
    idnTitle: "Sertifikasi & Unduh Berkas",
    idnSubtitle: "Penerbitan Dokumen Resmi",
    desc: "Unduh dokumen standar legal terverifikasi dan unduh paket dataset JSON/PDF dengan pemantauan progress terintegrasi."
  }
];
