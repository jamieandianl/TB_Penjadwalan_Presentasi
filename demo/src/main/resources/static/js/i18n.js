// Terjemahan Indonesia -> Inggris. Teks pada halaman diterjemahkan setelah render
// (sama seperti perilaku aplikasi React sebelumnya).

const englishTranslations = {
  "Login ke Akun Anda": "Login to Your Account",
  "Aplikasi Pengaturan Jadwal Presentasi Tugas Besar": "Final Project Presentation Scheduling Application",
  "Pilih peran Anda": "Choose your role",
  Mahasiswa: "Student",
  Dosen: "Lecturer",
  Admin: "Administrator",
  "Masuk ke Aplikasi": "Enter Application",
  "Dashboard Mahasiswa": "Student Dashboard",
  "Isi Jadwal Mahasiswa": "Set Student Schedule",
  "Isi Tugas Besar": "Final Project",
  "Jadwal Presentasi Hari Ini & Mendatang": "Today's & Upcoming Presentations",
  "Waktu & Durasi": "Time & Duration",
  Ruangan: "Room",
  "Anggota Tim Pengembang:": "Development Team Members:",
  "Pilih mata kuliah": "Choose courses",
  Semester: "Semester",
  "Simpan Jadwal": "Save Schedule",
  "Mata kuliah yang dibuka pada semester ini": "Courses available this semester",
  "Kode & Mata Kuliah": "Code & Course",
  "Dosen Pengampu": "Lecturer",
  Kelas: "Class",
  "Pilih Tugas besar": "Choose Final Project",
  "Nama Tugas Besar": "Final Project Name",
  "Kelompok yang tersedia": "Available groups",
  "Edit kelompok": "Edit group",
  "Tambah anggota": "Add members",
  Nama: "Name",
  "+ Cari & tambah Mahasiswa": "+ Search & add Student",
  "Simpan perubahan": "Save changes",
  "Dashboard Dosen": "Lecturer Dashboard",
  "Kelola Kelompok": "Manage Groups",
  "Matriks Ketersediaan Waktu": "Availability Matrix",
  "Penjadwalan Presentasi": "Presentation Scheduling",
  "Program Studi Sarjana Informatika (2024": "Bachelor of Informatics Program (2024",
  "Jadwal Presentasi": "Presentation Schedule",
  "Mata kuliah": "Course",
  Kelompok: "Group",
  "Nama Mata kuliah": "Course Name",
  "Daftar Mahasiswa (Terdaftar)": "Registered Students",
  "Kuota Anggota": "Member Quota",
  "+ Cari & Tambah Mahasiswa": "+ Search & Add Student",
  Simpan: "Save",
  Tersimpan: "Saved",
  "Buat Slot Kelompok": "Create Group Slot",
  "Matriks Pemetaan Ketersediaan Waktu (Heatmap Slot Availability)": "Availability Mapping Matrix (Slot Availability Heatmap)",
  "Analisis Kelompok:": "Group Analysis:",
  "Legenda Matriks:": "Matrix Legend:",
  "Kuliah Mahasiswa Bentrok": "Student Class Conflict",
  "Jadwal Ujian / Dosen Mengawas": "Exam / Invigilation Schedule",
  "Jadwal Mengajar Dosen": "Lecturer Teaching Schedule",
  "Waktu (WIB)": "Time (WIB)",
  "Kuliah Mhs Bentrok": "Student Class Conflict",
  "Jadwal Ujian Bentrok": "Exam Schedule Conflict",
  "Mengajar Dosen": "Lecturer Teaching",
  "Dosen Mengawas": "Lecturer Invigilating",
  "Buat Jadwal": "Create Schedule",
  Tanggal: "Date",
  "Waktu Mulai": "Start Time",
  "Waktu Selesai": "End Time",
  "Mata Kuliah Tugas Besar": "Final Project Course",
  "Ringkasan jadwal": "Schedule summary",
  Anggota: "Members",
  "Durasi presentasi": "Presentation duration",
  "Dipilih dari matriks ketersediaan waktu.": "Selected from the availability matrix.",
  "Pengelolaan Data": "Data Management",
  "Pengelolaan Jadwal": "Schedule Management",
  "Data Mahasiswa": "Student Data",
  "Data Dosen": "Lecturer Data",
  "Data Jadwal Mata Kuliah": "Course Schedule Data",
  "Masukan file": "Upload file",
  Menampilkan: "Showing",
  dari: "of",
  Data: "records",
  Senin: "Monday",
  Selasa: "Tuesday",
  Rabu: "Wednesday",
  "Kamis (Fokus)": "Thursday (Focus)",
  Jumat: "Friday",
  "Kamis, 19 Des 2026": "Thursday, 19 Dec 2026",
  "Selasa, 24 Des 2026": "Tuesday, 24 Dec 2026",
  "Kamis, 19 Des": "Thursday, 19 Dec",
  DES: "DEC",
  "Presentasi Tugas Besar Manajemen Proyek Kelas A": "Project Management Final Project Presentation Class A",
  "Presentasi Tugas Besar Rekayasa Perangkat Lunak Kelas B": "Software Engineering Final Project Presentation Class B",
  "Manajemen Proyek": "Project Management",
  "Rekayasa Perangkat Lunak": "Software Engineering",
  "Dasar Pemrograman": "Programming Fundamentals",
  "Struktur Data": "Data Structures",
  "Basis Data": "Database",
  "Pemrograman Web": "Web Programming",
  "Jaringan Komputer": "Computer Networks",
  "Kecerdasan Buatan": "Artificial Intelligence",
  "Interaksi Manusia Komputer": "Human-Computer Interaction",
};

function translate(value) {
  if (englishTranslations[value]) return englishTranslations[value];
  if (/^Semester \d+$/.test(value)) return value;
  if (/^Kelompok \d+$/.test(value)) return value.replace("Kelompok", "Group");
  if (/^Kelas [A-Z]$/.test(value)) return value.replace("Kelas", "Class");
  if (/^\d+ Orang$/.test(value)) return value.replace("Orang", "People");
  if (/^\d+ Menit$/.test(value)) return value.replace("Menit", "Minutes");
  if (/^\d+ \/ \d+ Anggota Terisi$/.test(value)) return value.replace("Anggota Terisi", "Members Filled");
  if (/^dari \d+ Data$/.test(value)) return value.replace("dari", "of").replace("Data", "records");
  if (/^Menampilkan /.test(value)) return value.replace("Menampilkan", "Showing").replace("dari", "of");
  return value;
}

export function translateVisibleDocument(language, root = document.body) {
  document.documentElement.lang = language === "en" ? "en" : "id";
  if (language === "id") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node.nodeValue ?? "";
    const trimmed = text.trim();
    const translated = translate(trimmed);
    if (trimmed && translated !== trimmed) node.nodeValue = text.replace(trimmed, translated);
    node = walker.nextNode();
  }

  root.querySelectorAll("input[placeholder]").forEach((input) => {
    input.placeholder = translate(input.placeholder);
  });
}
