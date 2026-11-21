// =====================================================================
// HALAMAN-HALAMAN APLIKASI (HTML dibuat dengan template string)
// Setiap fungsi page mengembalikan string HTML. Event ditangani lewat
// atribut data-action / data-change / data-nav (lihat app.js).
// =====================================================================
import {
  roles, schedules, semesterCourses, taskOptions, groupMembers, availableStudents,
  lecturerStudents, matrixDays, matrixTimes, matrixSlots, lecturerRows, state,
} from "./data.js";

// Konteks bersama: state lokal halaman + fungsi dari app.js
export const ctx = {
  local: {}, // di-reset setiap pindah halaman
  rerender() {},
  navigate() {},
  refreshPartial() {},
};

// ---------- helper ----------
export const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const pad2 = (n) => String(n).padStart(2, "0");
const option = (value, label, selected) =>
  `<option value="${esc(value)}"${selected ? " selected" : ""}>${esc(label)}</option>`;

const isEn = () => state.language === "en";

function languageToggle(src, className = "") {
  const en = isEn();
  return `<button aria-label="${en ? "Ganti ke Bahasa Indonesia" : "Switch to English"}"
    class="language-toggle ${className}" data-action="toggle-lang"
    title="${en ? "Bahasa Indonesia" : "English"}" type="button">
    <img alt="" class="language-icon" src="${src}"><span>${en ? "ID" : "EN"}</span></button>`;
}

function navButton(active, label, path, extra = "") {
  return `<button ${active ? 'aria-current="page"' : ""} class="nav-link${active ? " nav-link--active" : ""}"
    data-nav="${path}" type="button">${label}</button>`;
}

// ---------- LOGIN ----------
export function roleFromPath(pathname) {
  if (pathname === "/login/mahasiswa") return "student";
  if (pathname === "/login/dosen") return "lecturer";
  return "admin";
}

export function loginPage(pathname) {
  const role = roleFromPath(pathname);
  return `
  <main class="login-page">
    <div class="ambient-glow ambient-glow--top" aria-hidden="true"></div>
    <div class="ambient-glow ambient-glow--bottom" aria-hidden="true"></div>
    ${languageToggle("/assets/dashboard/e1c1f.svg", "language-toggle--login")}
    <section class="login-card" aria-labelledby="login-title">
      <header class="login-header">
        <h1 id="login-title">Login ke Akun Anda</h1>
        <p>Aplikasi Pengaturan Jadwal Presentasi Tugas Besar</p>
      </header>
      <form class="login-form" data-form="login" data-role="${role}">
        <fieldset class="role-picker">
          <legend>Pilih peran Anda</legend>
          <div class="role-options">
            ${roles.map((r) => `
              <button aria-pressed="${role === r.id}" class="role-option${role === r.id ? " role-option--active" : ""}"
                data-nav="${r.path}" type="button">
                <img alt="" class="role-icon ${r.iconClass}" src="${r.icon}"><span>${r.label}</span>
              </button>`).join("")}
          </div>
        </fieldset>
        <div class="credentials">
          <label class="field">
            <span>Email</span>
            <span class="input-shell">
              <img alt="" src="/assets/c6d15.svg">
              <input autocomplete="email" name="email" placeholder="Contoh@email.com" required type="email">
            </span>
          </label>
          <label class="field">
            <span>Password</span>
            <span class="input-shell">
              <img alt="" src="/assets/f5daa.svg">
              <input autocomplete="current-password" name="password" placeholder="Password" required type="password">
            </span>
          </label>
        </div>
        <div class="form-footer">
          <p aria-live="polite" class="form-message"></p>
          <button class="submit-button" type="submit">
            <span>Masuk ke Aplikasi</span>
            <img alt="" src="/assets/77060.svg">
          </button>
        </div>
      </form>
    </section>
  </main>`;
}

// ---------- MAHASISWA ----------
function studentHeader(active, assetSet = "dashboard") {
  const prefix = assetSet === "dashboard" ? "/assets/dashboard" : `/assets/features/${assetSet}`;
  return `
  <header class="dashboard-header">
    <button class="brand brand-button" data-nav="/dashboard/mahasiswa" type="button">
      <img alt="" src="${prefix}/7f1dc.svg"><span>APJTPB</span>
    </button>
    <nav aria-label="Navigasi mahasiswa">
      ${languageToggle(`${prefix}/e1c1f.svg`)}
      ${navButton(active === "dashboard", "Dashboard<br>Mahasiswa", "/dashboard/mahasiswa")}
      ${navButton(active === "schedule", "Isi Jadwal<br>Mahasiswa", "/jadwal/mahasiswa")}
      ${navButton(active === "tasks", "Isi<br>Tugas Besar", "/tugas-besar/mahasiswa")}
    </nav>
  </header>`;
}

function metric(icon, label, primary, secondary) {
  return `
  <div class="schedule-metric">
    <img alt="" src="${icon}">
    <div>
      <span>${label}</span>
      <strong>${esc(primary)}</strong>
      ${secondary ? `<small>${esc(secondary)}</small>` : ""}
    </div>
  </div>`;
}

function scheduleCard(s) {
  return `
  <article class="schedule-card">
    <div class="schedule-heading">
      <div class="schedule-meta"><span>${esc(s.group)}</span><small>${esc(s.course)}</small></div>
      <h3>${esc(s.title)}</h3>
    </div>
    <div class="schedule-metrics">
      ${metric("/assets/dashboard/798be.svg", "Waktu &amp; Durasi", s.date, s.time)}
      ${metric("/assets/dashboard/dfad7.svg", "Ruangan", s.room)}
      ${metric("/assets/dashboard/1a291.svg", "Dosen", s.lecturer)}
    </div>
    <div class="members">
      <span>Anggota Tim Pengembang:</span>
      <div>${s.members.map((m) => `<small>${esc(m)}</small>`).join("")}</div>
    </div>
  </article>`;
}

export function studentDashboard() {
  return `
  <main class="dashboard-page">
    ${studentHeader("dashboard")}
    <div class="dashboard-content">
      <section class="profile-banner" aria-label="Profil mahasiswa">
        <div class="profile-glow" aria-hidden="true"></div>
        <div class="avatar">BA</div>
        <div class="profile-copy">
          <h1>Bibii Andiani</h1>
          <p>NPM: <strong>6182101088</strong></p>
          <p>Universitas Katolik Parahyangan</p>
        </div>
      </section>
      <section class="schedule-section" aria-labelledby="schedule-title">
        <h2 id="schedule-title"><img alt="" src="/assets/dashboard/f88ab.svg">Jadwal Presentasi Hari Ini &amp; Mendatang</h2>
        <div class="schedule-list">${schedules.map(scheduleCard).join("")}</div>
      </section>
    </div>
  </main>`;
}

export function courseSchedulePage() {
  const L = ctx.local;
  L.semester ??= "5";
  L.draft ??= new Set(state.selectedCourses);
  return `
  <main class="dashboard-page feature-page">
    ${studentHeader("schedule", "schedule")}
    <section class="feature-content">
      <h1 class="feature-title">Pilih mata kuliah</h1>
      <div class="feature-controls feature-controls--schedule">
        <label class="filter-card">
          <span>Semester</span>
          <select aria-label="Semester" data-change="semester" data-key="semester">
            ${[1, 2, 3, 4, 5].map((v) => option(v, `Semester ${v}`, String(v) === L.semester)).join("")}
          </select>
        </label>
        <button class="feature-primary-button" data-action="save-courses" type="button">Simpan Jadwal</button>
      </div>
      <p class="section-label">Mata kuliah yang dibuka pada semester ini</p>
      <div class="course-table" role="table">
        <div class="course-table-head" role="row">
          <span>Kode &amp; Mata Kuliah</span><span>Dosen Pengampu</span><span>Kelas</span>
          <span class="sr-only">Pilih</span>
        </div>
        ${semesterCourses[L.semester].map(([code, course, lecturer, className]) => {
          const key = `${L.semester}-${code}-${className}`;
          return `
          <label class="course-row" role="row">
            <span><strong>${code}</strong>${esc(course)}</span>
            <span>${esc(lecturer)}</span>
            <span>${className}</span>
            <input ${L.draft.has(key) ? "checked" : ""} data-change="course-check" data-course="${key}" type="checkbox">
          </label>`;
        }).join("")}
      </div>
    </section>
  </main>`;
}

export function taskGroupsPage() {
  const L = ctx.local;
  L.task ??= taskOptions[0];
  const joined = state.joinedGroups[L.task] ?? null;
  return `
  <main class="dashboard-page feature-page">
    ${studentHeader("tasks", "tasks")}
    <section class="feature-content">
      <h1 class="feature-title">Pilih Tugas besar</h1>
      <label class="filter-card task-filter">
        <span>Nama Tugas Besar</span>
        <select aria-label="Nama Tugas Besar" data-change="task" data-key="task">
          ${taskOptions.map((t) => option(t, t, t === L.task)).join("")}
        </select>
      </label>
      <div class="groups-divider"><img alt="" src="/assets/features/tasks/48d39.svg"></div>
      <p class="section-label">Kelompok yang tersedia</p>
      <div class="group-grid">
        ${groupMembers.map((members, index) => {
          const n = index + 1;
          const isJoined = joined === n;
          const isDisabled = joined !== null && !isJoined;
          return `
          <article class="group-card${isDisabled ? " group-card--disabled" : ""}">
            <h2>Kelompok ${pad2(n)}</h2>
            ${members.map((m) => `<span>${esc(m)}</span>`).join("")}
            <button class="group-button${isJoined ? " group-button--edit" : ""}" ${isDisabled ? "disabled" : ""}
              data-action="join-group" data-n="${n}" type="button">${isJoined ? "EDIT" : "JOIN"}</button>
          </article>`;
        }).join("")}
      </div>
    </section>
  </main>`;
}

export function editGroupPage() {
  const L = ctx.local;
  const params = new URLSearchParams(window.location.search);
  const task = taskOptions[Number(params.get("task") ?? 0)] ?? taskOptions[0];
  L.draftMembers ??= [...state.members];
  return `
  <main class="dashboard-page feature-page">
    ${studentHeader("tasks", "edit")}
    <section class="edit-content">
      <article class="edit-summary">
        <small>AIF6767 • Manajemen Proyek</small>
        <h1>${esc(task)}</h1>
      </article>
      <h2 class="edit-title">Edit kelompok</h2>
      <section class="member-editor">
        <h3>Tambah anggota</h3>
        <label>
          <span>Nama</span>
          <select aria-label="Cari dan tambah mahasiswa" data-change="edit-add" data-key="edit-add">
            <option value="" selected>+ Cari &amp; tambah Mahasiswa</option>
            ${availableStudents.filter((s) => !L.draftMembers.includes(s)).map((s) => option(s, s)).join("")}
          </select>
        </label>
        <div class="member-list">
          ${L.draftMembers.map((m, i) => `
            <div class="member-row">
              <img alt="" src="/assets/features/edit/fd43c.svg">
              <span>${esc(m)}</span>
              <button aria-label="Hapus ${esc(m)}" data-action="remove-edit-member" data-index="${i}" type="button">
                <img alt="" src="/assets/features/edit/49b2d.svg">
              </button>
            </div>`).join("")}
        </div>
      </section>
      <button class="save-changes" data-action="save-edit" type="button">Simpan perubahan</button>
    </section>
  </main>`;
}

// ---------- DOSEN ----------
function lecturerHeader(active, assetSet = "lecturer_dashboard") {
  const items = [
    ["dashboard", "Dashboard Dosen", "/dashboard/dosen"],
    ["groups", "Kelola Kelompok", "/dosen/kelola-kelompok"],
    ["matrix", "Matriks Ketersediaan Waktu", "/dosen/matriks"],
    ["schedule", "Penjadwalan Presentasi", "/dosen/penjadwalan"],
  ];
  const prefix = `/assets/features/${assetSet}`;
  const current = items.find(([id]) => id === active)?.[2];
  return `
  <header class="dashboard-header lecturer-header">
    <button class="brand brand-button" data-nav="/dashboard/dosen" type="button">
      <img alt="" src="${prefix}/7f1dc.svg"><span>APJTPB</span>
    </button>
    <nav aria-label="Navigasi dosen">
      ${languageToggle(`${prefix}/e1c1f.svg`)}
      <select aria-label="Navigasi dosen mobile" class="mobile-lecturer-nav" data-change="nav-select">
        ${items.map(([, label, path]) => option(path, label, path === current)).join("")}
      </select>
      ${items.map(([id, label, path]) => navButton(active === id, label, path)).join("")}
    </nav>
  </header>`;
}

export function lecturerDashboard() {
  const L = ctx.local;
  L.page ??= 1;
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(lecturerRows.length / pageSize));
  const rows = lecturerRows.slice((L.page - 1) * pageSize, L.page * pageSize);
  const first = lecturerRows.length === 0 ? 0 : (L.page - 1) * pageSize + 1;
  const last = Math.min(L.page * pageSize, lecturerRows.length);
  return `
  <main class="dashboard-page lecturer-page">
    ${lecturerHeader("dashboard")}
    <div class="lecturer-content">
      <section class="profile-banner">
        <div class="profile-glow" aria-hidden="true"></div>
        <div class="avatar lecturer-avatar">BA</div>
        <div class="profile-copy lecturer-profile">
          <h1>Veronica Sri Moertini</h1>
          <p>Program Studi Sarjana Informatika (2024</p>
          <p>Universitas Katolik Parahyangan</p>
        </div>
      </section>
      <h2 class="lecturer-section-title">Jadwal Presentasi</h2>
      <div class="lecturer-table">
        <div class="lecturer-table-head">
          <span>Mata kuliah</span><span>Ruangan</span><span>Kelompok</span><span>Waktu &amp; Durasi</span>
        </div>
        ${rows.map((r) => `
          <div class="lecturer-row">
            <span>${esc(r.course)}</span><span>${esc(r.room)}</span><span>${esc(r.group)}</span>
            <span><strong>${esc(r.date)}</strong><small>${esc(r.time)}</small></span>
          </div>`).join("")}
        <div class="lecturer-table-fill"></div>
      </div>
      <div class="pagination-footer">
        <p class="pagination-summary">Menampilkan <strong>${first} - ${last}</strong> dari ${lecturerRows.length} Data</p>
        <div class="pagination" aria-label="Pagination">
          ${totalPages > 1 ? `<button aria-label="Halaman sebelumnya" ${L.page === 1 ? "disabled" : ""} data-action="page-prev" type="button"><img alt="" src="/assets/features/lecturer_dashboard/4ef17.svg"></button>` : ""}
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => `
            <button ${p === L.page ? 'aria-current="page"' : ""} class="${p === L.page ? "pagination-active" : ""}"
              data-action="page-go" data-page="${p}" type="button">${p}</button>`).join("")}
          ${totalPages > 1 ? `<button aria-label="Halaman berikutnya" ${L.page === totalPages ? "disabled" : ""} data-action="page-next" type="button"><img alt="" src="/assets/features/lecturer_dashboard/1c753.svg"></button>` : ""}
        </div>
      </div>
    </div>
  </main>`;
}

export function manageGroupsPage() {
  const L = ctx.local;
  L.course ??= "Manajemen Proyek";
  L.groups ??= [
    { id: 1, members: lecturerStudents.slice(0, 2), quota: 4 },
    { id: 2, members: lecturerStudents.slice(2, 4), quota: 4 },
    { id: 3, members: lecturerStudents.slice(4, 6), quota: 4 },
  ];
  const en = isEn();
  return `
  <main class="dashboard-page lecturer-feature-page">
    ${lecturerHeader("groups", "manage_groups")}
    <section class="manage-content">
      <div class="manage-topline">
        <h1>Kelola Kelompok</h1>
        <label class="filter-card manage-course-filter">
          <span>Nama Mata kuliah</span>
          <select data-change="manage-course" data-key="manage-course">
            ${["Manajemen Proyek", "Rekayasa Perangkat Lunak"].map((c) => option(c, c, c === L.course)).join("")}
          </select>
        </label>
      </div>
      <div class="manage-table-head">
        <span>Kelompok</span><span>Daftar Mahasiswa (Terdaftar)</span><span>Kuota Anggota</span><span></span>
      </div>
      <div class="managed-groups">
        ${L.groups.map((g) => `
        <article class="managed-group">
          <div class="managed-group-name">
            <strong><i></i>Kelompok ${pad2(g.id)}</strong>
            <span>${g.members.length} / ${g.quota} ${en ? "Members Filled" : "Anggota Terisi"}</span>
          </div>
          <div class="managed-members">
            ${g.members.map((m, i) => `
              <div>
                <img alt="" src="/assets/features/manage_groups/c7d85.svg">
                <span>${esc(m)}</span>
                <button aria-label="Hapus ${esc(m)}" data-action="remove-group-member" data-id="${g.id}" data-index="${i}" type="button">
                  <img alt="" src="/assets/features/manage_groups/49b2d.svg">
                </button>
              </div>`).join("")}
            <select aria-label="Tambah anggota Kelompok ${g.id}" data-change="group-add" data-id="${g.id}" data-key="group-add-${g.id}">
              <option value="" selected>+ Cari &amp; Tambah Mahasiswa</option>
              ${lecturerStudents
                .filter((s) => !L.groups.some((cg) => cg.members.includes(s)))
                .map((s) => option(s, s)).join("")}
            </select>
          </div>
          <label class="quota-control">
            <select aria-label="Kuota Kelompok ${g.id}" data-change="group-quota" data-id="${g.id}" data-key="group-quota-${g.id}">
              ${[2, 3, 4, 5, 6].map((q) => option(q, `${q} ${en ? "People" : "Orang"}`, q === g.quota)).join("")}
            </select>
          </label>
          <button class="managed-save" data-action="save-group" data-id="${g.id}" type="button">${g.saved ? "Tersimpan" : "Simpan"}</button>
        </article>`).join("")}
      </div>
      <button class="add-group-slot" data-action="add-group-slot" type="button">
        <img alt="" src="/assets/features/manage_groups/eee2d.svg">Buat Slot Kelompok
      </button>
    </section>
  </main>`;
}

export function availabilityMatrixPage() {
  const L = ctx.local;
  L.group ??= "Kelompok 01 (Jonathan, Kevin, Siti)";
  const labels = { free: "", student: "Kuliah Mhs Bentrok", exam: "Jadwal Ujian Bentrok", teach: "Mengajar Dosen", guard: "Dosen Mengawas" };
  const groups = ["Kelompok 01 (Jonathan, Kevin, Siti)", "Kelompok 02 (Roy, Thomas)", "Kelompok 03 (Bobi, Bibii)"];
  return `
  <main class="dashboard-page lecturer-feature-page">
    ${lecturerHeader("matrix", "matrix")}
    <section class="matrix-content">
      <div class="matrix-intro">
        <div>
          <h1><img alt="" src="/assets/features/matrix/bfdbb.svg">Matriks Pemetaan Ketersediaan Waktu (Heatmap Slot Availability)</h1>
          <p>Analisis instan komputasi irisan slot waktu luang<br>antara anggota kelompok terpilih dan dosen pengampu.</p>
        </div>
        <label>
          <span>Analisis Kelompok:</span>
          <select data-change="matrix-group" data-key="matrix-group">
            ${groups.map((g) => option(g, g, g === L.group)).join("")}
          </select>
        </label>
      </div>
      <div class="matrix-legend">
        <strong>Legenda Matriks:</strong>
        <span class="legend-student">Kuliah Mahasiswa Bentrok</span>
        <span class="legend-exam">Jadwal Ujian / Dosen Mengawas</span>
        <span class="legend-teach">Jadwal Mengajar Dosen</span>
      </div>
      <div class="matrix-scroll">
        <div class="availability-matrix">
          <div class="matrix-corner">Waktu (WIB)</div>
          ${matrixDays.map((day, i) => `
            <div class="${i === 3 ? "matrix-day matrix-day--focus" : "matrix-day"}">
              <strong>${day}</strong><small>${16 + i} Des</small>
            </div>`).join("")}
          ${matrixTimes.map((time, row) => `
            <div class="matrix-row">
              <div class="matrix-time">${time}</div>
              ${matrixSlots[row].map((type) => `<div class="matrix-cell matrix-cell--${type}">${labels[type]}</div>`).join("")}
            </div>`).join("")}
        </div>
      </div>
    </section>
  </main>`;
}

// Ringkasan jadwal dipisah supaya bisa diperbarui tanpa merender ulang form
// (agar kursor/fokus pada input waktu tidak hilang saat mengetik).
export function scheduleSummaryHtml() {
  const L = ctx.local;
  const locale = isEn() ? "en-US" : "id-ID";
  const d = new Date(`${L.date}T00:00:00`);
  const minutes =
    Number(L.end.slice(0, 2)) * 60 + Number(L.end.slice(3, 5)) -
    (Number(L.start.slice(0, 2)) * 60 + Number(L.start.slice(3, 5)));
  const valid = !Number.isNaN(d.getTime());
  const month = valid ? d.toLocaleDateString(locale, { month: "short" }).replace(".", "").toUpperCase() : "";
  const longDate = valid ? d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" }) : "";
  const [groupNo, groupMembersText] = L.group.split(" - ");
  return `
    <h2>Ringkasan jadwal</h2>
    <div class="summary-time">
      <div><small>${month}</small><strong>${valid ? d.getDate() : ""}</strong></div>
      <span>${longDate}<strong>${L.start.replace(":", ".")}–${L.end.replace(":", ".")} WIB</strong></span>
    </div>
    <dl>
      <dt>Kelompok</dt><dd>Kelompok ${groupNo.padStart(2, "0")}</dd>
      <dt>Anggota</dt><dd>${esc(groupMembersText)}</dd>
      <dt>Mata Kuliah</dt><dd>${esc(L.course)}</dd>
      <dt>Durasi presentasi</dt><dd>${Math.max(minutes || 0, 0)} Menit</dd>
      <dt>Ruangan</dt><dd>${esc(L.room)}</dd>
    </dl>
    <p><img alt="" src="/assets/features/create_schedule/d4b94.svg">Dipilih dari matriks ketersediaan waktu.</p>`;
}

export function createSchedulePage() {
  const L = ctx.local;
  L.date ??= "2026-12-19";
  L.start ??= "13:30";
  L.end ??= "14:00";
  L.course ??= "Rekayasa Perangkat Lunak";
  L.group ??= "1 - Jonathan, Kevin, Siti";
  L.room ??= "AG2U.06.05-06";
  return `
  <main class="dashboard-page lecturer-feature-page">
    ${lecturerHeader("schedule", "create_schedule")}
    <section class="create-schedule-content">
      <h1>Buat Jadwal</h1>
      <div class="schedule-builder">
        <div class="schedule-form">
          <label class="schedule-field">
            <span>Tanggal</span>
            <div>
              <input aria-label="Tanggal presentasi" data-action="show-picker" data-field="date" type="date" value="${L.date}">
              <img alt="" src="/assets/features/create_schedule/af45a.svg">
            </div>
          </label>
          <div class="time-fields">
            <label>
              <span>Waktu Mulai</span>
              <div><img alt="" src="/assets/features/create_schedule/0e851.svg"><input data-field="start" type="time" value="${L.start}"></div>
            </label>
            <label>
              <span>Waktu Selesai</span>
              <div><img alt="" src="/assets/features/create_schedule/0e851.svg"><input data-field="end" type="time" value="${L.end}"></div>
            </label>
          </div>
          <label class="schedule-field">
            <span>Mata Kuliah Tugas Besar</span>
            <select data-field="course">
              ${["Rekayasa Perangkat Lunak", "Manajemen Proyek"].map((c) => option(c, c, c === L.course)).join("")}
            </select>
          </label>
          <label class="schedule-field">
            <span>Kelompok</span>
            <select data-field="group">
              ${["1 - Jonathan, Kevin, Siti", "2 - Roy, Thomas", "3 - Bobi, Bibii"].map((g) => option(g, g, g === L.group)).join("")}
            </select>
          </label>
          <label class="schedule-field">
            <span>Ruangan</span>
            <select data-field="room">
              ${["AG2U.06.05-06", "R. Kuliah 09.00.0035 SB Gd.9", "Laboratorium Informatika"].map((r) => option(r, r, r === L.room)).join("")}
            </select>
          </label>
        </div>
        <aside class="schedule-summary" data-summary>${scheduleSummaryHtml()}</aside>
      </div>
      <button class="create-schedule-button" data-action="create-schedule" type="button">
        Buat Jadwal<img alt="" src="/assets/features/create_schedule/3f7ee.svg">
      </button>
    </section>
  </main>`;
}

// ---------- ADMIN ----------
function adminHeader(active) {
  const prefix = `/assets/features/admin_${active}`;
  return `
  <header class="dashboard-header admin-header">
    <div class="brand"><img alt="" src="${prefix}/7f1dc.svg"><span>APJTPB</span></div>
    <nav aria-label="Navigasi admin">
      ${languageToggle(`${prefix}/e1c1f.svg`)}
      ${navButton(active === "data", "Pengelolaan<br>Data", "/admin/data")}
      ${navButton(active === "schedule", "Pengelolaan<br>Jadwal", "/admin/jadwal")}
    </nav>
  </header>`;
}

function uploadPanel(key, label, assetSet) {
  const L = ctx.local;
  L.uploads ??= {};
  const u = L.uploads[key] ?? {};
  const en = isEn();
  return `
  <section class="upload-section">
    <h2>${label}</h2>
    <label class="upload-dropzone">
      <input accept=".xlsx,.xls,.csv" data-change="upload-file" data-key="upload-${key}" data-panel="${key}" type="file">
      <img alt="" src="/assets/features/${assetSet}/91823.svg">
      <strong>${u.result ? esc(u.result.fileName) : "Masukan file"}</strong>
      ${u.result ? `<span>${u.result.rows} ${en ? "rows" : "baris"} • ${u.result.columns.length} ${en ? "columns detected" : "kolom terdeteksi"}</span>` : ""}
      ${u.error ? `<span>${esc(u.error)}</span>` : ""}
    </label>
    <button ${u.result ? "" : "disabled"} data-action="upload-save" data-panel="${key}" type="button">${u.saved ? "Tersimpan" : "Simpan"}</button>
  </section>`;
}

export function adminDataPage() {
  return `
  <main class="dashboard-page admin-page">
    ${adminHeader("data")}
    <section class="admin-content">
      <h1>Pengelolaan Data</h1>
      ${uploadPanel("mahasiswa", "Data Mahasiswa", "admin_data")}
      ${uploadPanel("dosen", "Data Dosen", "admin_data")}
    </section>
  </main>`;
}

export function adminSchedulePage() {
  return `
  <main class="dashboard-page admin-page">
    ${adminHeader("schedule")}
    <section class="admin-content">
      <h1>Pengelolaan Jadwal</h1>
      ${uploadPanel("jadwal", "Data Jadwal Mata Kuliah", "admin_schedule")}
    </section>
  </main>`;
}

// ---------- ROUTING TABLE ----------
export const routes = {
  "/dashboard/mahasiswa": studentDashboard,
  "/jadwal/mahasiswa": courseSchedulePage,
  "/tugas-besar/mahasiswa": taskGroupsPage,
  "/tugas-besar/edit": editGroupPage,
  "/dashboard/dosen": lecturerDashboard,
  "/dosen/kelola-kelompok": manageGroupsPage,
  "/dosen/matriks": availabilityMatrixPage,
  "/dosen/penjadwalan": createSchedulePage,
  "/admin/data": adminDataPage,
  "/admin/jadwal": adminSchedulePage,
};
