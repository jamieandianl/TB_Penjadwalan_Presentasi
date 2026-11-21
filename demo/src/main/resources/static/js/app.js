// =====================================================================
// ENTRY POINT: router sederhana (History API) + penanganan event
// =====================================================================
import { state, taskOptions } from "./data.js";
import { translateVisibleDocument } from "./i18n.js";
import { ctx, loginPage, routes, scheduleSummaryHtml } from "./pages.js";

const app = document.getElementById("app");

// ---------- render ----------
function render() {
  const focusKey = document.activeElement?.dataset?.key;
  const pageFn = routes[window.location.pathname];
  const html = pageFn ? pageFn() : loginPage(window.location.pathname);
  app.innerHTML = `<div class="language-root">${html}</div>`;
  translateVisibleDocument(state.language, app);
  if (focusKey) app.querySelector(`[data-key="${CSS.escape(focusKey)}"]`)?.focus();
}

function navigate(url) {
  window.history.pushState({}, "", url);
  ctx.local = {};
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

ctx.rerender = render;
ctx.navigate = navigate;
window.addEventListener("popstate", () => {
  ctx.local = {};
  render();
});

// ---------- Excel (SheetJS dimuat saat dibutuhkan) ----------
let xlsxPromise;
function loadXLSX() {
  xlsxPromise ??= new Promise((resolve, reject) => {
    if (window.XLSX) return resolve(window.XLSX);
    const script = document.createElement("script");
    script.src = "/js/vendor/xlsx.full.min.js";
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error("Gagal memuat pustaka Excel"));
    document.head.appendChild(script);
  });
  return xlsxPromise;
}

async function readExcel(file) {
  const XLSX = await loadXLSX();
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return { fileName: file.name, rows: rows.length, columns: rows[0] ? Object.keys(rows[0]) : [] };
}

// ---------- aksi klik ----------
const actions = {
  "toggle-lang"() {
    state.language = state.language === "id" ? "en" : "id";
    localStorage.setItem("app-language", state.language);
    render();
  },
  "save-courses"() {
    state.selectedCourses = new Set(ctx.local.draft);
    navigate("/dashboard/mahasiswa");
  },
  "join-group"(el) {
    const L = ctx.local;
    const n = Number(el.dataset.n);
    const joined = state.joinedGroups[L.task] ?? null;
    if (joined === n) {
      navigate(`/tugas-besar/edit?task=${taskOptions.indexOf(L.task)}&group=${n}`);
    } else if (joined === null) {
      state.joinedGroups = { ...state.joinedGroups, [L.task]: n };
      render();
    }
  },
  "remove-edit-member"(el) {
    ctx.local.draftMembers.splice(Number(el.dataset.index), 1);
    render();
  },
  "save-edit"() {
    state.members = [...ctx.local.draftMembers];
    navigate("/dashboard/mahasiswa");
  },
  "remove-group-member"(el) {
    const g = ctx.local.groups.find((x) => x.id === Number(el.dataset.id));
    g.members.splice(Number(el.dataset.index), 1);
    g.saved = false;
    render();
  },
  "save-group"(el) {
    ctx.local.groups.find((x) => x.id === Number(el.dataset.id)).saved = true;
    render();
  },
  "add-group-slot"() {
    const groups = ctx.local.groups;
    groups.push({ id: groups.length + 1, members: [], quota: 4, saved: false });
    render();
  },
  "create-schedule"() {
    // TODO: kirim ke backend (POST /api/jadwal) setelah PostgreSQL terpasang
    navigate("/dashboard/dosen");
  },
  "show-picker"(el) {
    el.showPicker?.();
  },
  "page-prev"() {
    ctx.local.page = Math.max(1, ctx.local.page - 1);
    render();
  },
  "page-next"() {
    ctx.local.page = ctx.local.page + 1;
    render();
  },
  "page-go"(el) {
    ctx.local.page = Number(el.dataset.page);
    render();
  },
  "upload-save"(el) {
    const u = ctx.local.uploads?.[el.dataset.panel];
    if (u?.result) {
      u.saved = true; // TODO: kirim ke backend (POST /api/import/...) setelah PostgreSQL terpasang
      render();
    }
  },
};

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    navigate(nav.dataset.nav);
    return;
  }
  const el = event.target.closest("[data-action]");
  if (el && el.tagName !== "INPUT" && actions[el.dataset.action]) actions[el.dataset.action](el, event);
});

// klik pada input tanggal membuka date picker (seperti versi React)
document.addEventListener("click", (event) => {
  const el = event.target;
  if (el.matches?.('input[data-action="show-picker"]')) actions["show-picker"](el);
});

// ---------- aksi change / input ----------
function updateScheduleField(el) {
  ctx.local[el.dataset.field] = el.value;
  const summary = app.querySelector("[data-summary]");
  summary.innerHTML = scheduleSummaryHtml();
  translateVisibleDocument(state.language, summary);
}

const changeHandlers = {
  semester(el) {
    ctx.local.semester = el.value;
    render();
  },
  "course-check"(el) {
    const { draft } = ctx.local;
    const key = el.dataset.course;
    draft.has(key) ? draft.delete(key) : draft.add(key);
  },
  task(el) {
    ctx.local.task = el.value;
    render();
  },
  "edit-add"(el) {
    const L = ctx.local;
    if (el.value && !L.draftMembers.includes(el.value)) L.draftMembers.push(el.value);
    render();
  },
  "nav-select"(el) {
    navigate(el.value);
  },
  "manage-course"(el) {
    ctx.local.course = el.value;
    render();
  },
  "group-add"(el) {
    const g = ctx.local.groups.find((x) => x.id === Number(el.dataset.id));
    if (el.value && g.members.length < g.quota) {
      g.members.push(el.value);
      g.saved = false;
    }
    render();
  },
  "group-quota"(el) {
    const g = ctx.local.groups.find((x) => x.id === Number(el.dataset.id));
    g.quota = Number(el.value);
    g.saved = false;
    render();
  },
  "matrix-group"(el) {
    ctx.local.group = el.value;
    render();
  },
  async "upload-file"(el) {
    const file = el.files?.[0];
    if (!file) return;
    const L = ctx.local;
    L.uploads ??= {};
    try {
      L.uploads[el.dataset.panel] = { result: await readExcel(file), saved: false };
    } catch (err) {
      L.uploads[el.dataset.panel] = { error: "Gagal membaca file. Pastikan formatnya .xlsx, .xls, atau .csv." };
    }
    render();
  },
};

document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.dataset?.field) return updateScheduleField(el);
  const handler = changeHandlers[el.dataset?.change];
  if (handler) handler(el);
});

document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.dataset?.field && el.tagName === "INPUT") updateScheduleField(el);
});

// ---------- submit login ----------
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.dataset.form !== "login") return;
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // TODO: autentikasi ke backend (POST /api/login) setelah PostgreSQL terpasang
  const role = form.dataset.role;
  navigate(role === "student" ? "/dashboard/mahasiswa" : role === "lecturer" ? "/dashboard/dosen" : "/admin/data");
});

render();
