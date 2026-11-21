// =====================================================================
// DATA DUMMY
// Semua data di file ini masih statis (belum memakai PostgreSQL).
// Nanti, bagian ini cukup diganti dengan pemanggilan fetch("/api/...")
// ke controller Spring Boot yang membaca database.
// =====================================================================

export const roles = [
  { id: "student", label: "Mahasiswa", icon: "/assets/bfc3b.svg", iconClass: "role-icon--student", path: "/login/mahasiswa" },
  { id: "lecturer", label: "Dosen", icon: "/assets/a6017.svg", iconClass: "role-icon--lecturer", path: "/login/dosen" },
  { id: "admin", label: "Admin", icon: "/assets/5219e.svg", iconClass: "role-icon--admin", path: "/" },
];

export const schedules = [
  {
    group: "Kelompok 01",
    course: "AIF6767 • Manajemen Proyek",
    title: "Presentasi Tugas Besar Manajemen Proyek Kelas A",
    date: "Kamis, 19 Des 2026",
    time: "13.30 - 14.30 WIB (60 Menit)",
    room: "R. Kuliah 09.00.0035 SB Gd.9",
    lecturer: "Veronica Sri Moertini",
    members: [
      "Bibii Andiani (6182401088)",
      "Roy Dilon (6182401083)",
      "Thomas Wilbert Alfontra(6182401055)",
    ],
  },
  {
    group: "Kelompok 03",
    course: "AIF7777 • Rekayasa Perangkat Lunak",
    title: "Presentasi Tugas Besar Rekayasa Perangkat Lunak Kelas B",
    date: "Selasa, 24 Des 2026",
    time: "10.00 - 11.00 WIB (60 Menit)",
    room: "R. Kuliah 09.00.0034 SB Gd.9",
    lecturer: "Pascal Alfadian Nugroho",
    members: [
      "Bibii Andiani (6182401088)",
      "Roy Dilon (6182401083)",
      "Thomas Wilbert (6182401055)",
    ],
  },
];

export const semesterCourses = {
  1: [
    ["AIF1101", "Dasar Pemrograman", "Rizky Pradana", "Kelas A"],
    ["AIF1101", "Dasar Pemrograman", "Rizky Pradana", "Kelas B"],
  ],
  2: [
    ["AIF2202", "Struktur Data", "Maria Christina", "Kelas A"],
    ["AIF2203", "Basis Data", "Daniel Saputra", "Kelas A"],
  ],
  3: [
    ["AIF3301", "Pemrograman Web", "Yulius Harjono", "Kelas A"],
    ["AIF3302", "Jaringan Komputer", "Bambang Riyanto", "Kelas B"],
  ],
  4: [
    ["AIF4401", "Kecerdasan Buatan", "Nathanael Wirawan", "Kelas A"],
    ["AIF4402", "Interaksi Manusia Komputer", "Clara Wijaya", "Kelas A"],
  ],
  5: [
    ["AIF6767", "Manajemen Proyek", "Veronica Sri Moertini", "Kelas A"],
    ["AIF6767", "Manajemen Proyek", "Veronica Sri Moertini", "Kelas B"],
    ["AIF7777", "Rekayasa Perangkat Lunak", "Pascal Alfadian Nugroho", "Kelas A"],
    ["AIF7777", "Rekayasa Perangkat Lunak", "Pascal Alfadian Nugroho", "Kelas B"],
  ],
};

export const taskOptions = [
  "Presentasi Tugas Besar Manajemen Proyek Kelas A",
  "Presentasi Tugas Besar Rekayasa Perangkat Lunak Kelas B",
];

export const groupMembers = [
  ["Roy Dilon (6182401083)", "Thomas Wilbert Alfontra (6182401055)"],
  ["Clark (6182401077)", "Bryan (6182401044)"],
  ["Ignatius Vilbert (6182401024)", "Mikael Graffias (6182401001)"],
];

export const availableStudents = [
  "Bibii Andiani (6182401088)",
  "Angela Putri (6182401017)",
  "Kevin Jonathan (6182401029)",
  "Nadia Maharani (6182401066)",
];

export const lecturerStudents = [
  "Roy Dilon (NPM 6182101083)",
  "Thomas Wilbert Alfontra (NPM 6182101055)",
  "Bobi G (NPM 6182101087)",
  "Bibii M (NPM 6182101056)",
  "Rudi D (NPM 6182101089)",
  "Riri S (NPM 6182101023)",
  "Jonathan (NPM 6182101071)",
  "Kevin (NPM 6182101072)",
];

export const matrixDays = ["Senin", "Selasa", "Rabu", "Kamis (Fokus)", "Jumat"];

export const matrixTimes = [
  "08.00 - 09.00",
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  "12.00 - 13.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "17.00 - 18.00",
];

export const matrixSlots = [
  ["free", "student", "student", "free", "free"],
  ["free", "free", "student", "exam", "free"],
  ["free", "free", "student", "exam", "free"],
  ["student", "student", "free", "free", "student"],
  ["free", "free", "student", "free", "exam"],
  ["teach", "free", "free", "teach", "free"],
  ["teach", "guard", "free", "exam", "free"],
  ["teach", "guard", "free", "exam", "free"],
  ["free", "free", "free", "free", "exam"],
];

export const lecturerRows = [1, 2, 3].map((group, index) => ({
  course: "Presentasi Tugas Besar Manajemen Proyek Kelas A",
  room: "R. Kuliah 09.00.0035 SB Gd.9",
  group: `Kelompok 0${group}`,
  date: "Kamis, 19 Des 2026",
  time: `${13 + index}.30 - ${14 + index}.30 WIB (60 Menit)`,
}));

// State aplikasi (disimpan di memori selama halaman terbuka)
export const state = {
  language: localStorage.getItem("app-language") === "en" ? "en" : "id",
  selectedCourses: new Set(),
  joinedGroups: { [taskOptions[0]]: 1 },
  members: [...groupMembers[0]],
};
