"use strict";

const FIRST_M = ["Budi", "Agus", "Slamet", "Joko", "Bambang", "Dedi", "Andi", "Rudi", "Eko", "Hendra", "Fajar", "Rizky", "Dimas", "Bayu", "Ilham", "Arief", "Yusuf", "Galih", "Putra", "Bagus", "Wahyu", "Dedi", "Teguh", "Rian", "Fikri", "Hadi", "Ivan", "Yoga", "Rama", "Surya"];
const FIRST_F = ["Siti", "Sri", "Dewi", "Rina", "Fitri", "Ayu", "Putri", "Nur", "Ratna", "Wulan", "Intan", "Maya", "Lestari", "Indah", "Dian", "Ratih", "Sari", "Tiara", "Anisa", "Mega", "Riska", "Yuni", "Laras", "Citra", "Nadia", "Farah", "Dina", "Reni", "Eka", "Suci"];
const LAST = ["Santoso", "Wijaya", "Saputra", "Pratama", "Nugroho", "Hidayat", "Firmansyah", "Kusuma", "Rahmawati", "Nugraha", "Setiawan", "Handoko", "Purnama", "Ramadhan", "Saputri", "Anggraini", "Hartono", "Salim", "Halim", "Gunawan", "Susanto", "Wibowo", "Prabowo", "Mahardika", "Nugraheni", "Laksmana", "Perdana", "Utama", "Saputra", "Fauzi"];
const STREETS = ["Jl. Merdeka", "Jl. Sudirman", "Jl. Diponegoro", "Jl. Gajah Mada", "Jl. Ahmad Yani", "Jl. Pahlawan", "Jl. Kenanga", "Jl. Melati", "Jl. Anggrek", "Jl. Cendana", "Jl. Kartini", "Jl. Imam Bonjol", "Jl. Veteran", "Jl. Asia Afrika", "Jl. Pemuda"];
const CITIES = ["Jakarta", "Bandung", "Surabaya", "Medan", "Semarang", "Makassar", "Yogyakarta", "Palembang", "Denpasar", "Balikpapan", "Pontianak", "Manado", "Batam", "Bogor", "Depok", "Tangerang", "Bekasi", "Malang", "Solo", "Padang"];
const JOBS = ["Guru", "Dokter", "Perawat", "Programmer", "Desainer Grafis", "Akuntan", "Wiraswasta", "Petani", "Nelayan", "Sopir", "Pedagang", "Pegawai Negeri", "Marketing", "Barista", "Montir", "Penjahit", "Arsitek", "Jurnalis", "Koki", "Peternak"];
const COMP_A = ["Nusantara", "Cipta", "Karya", "Maju", "Sejahtera", "Abadi", "Sentosa", "Prima", "Arunika", "Bumi"];
const COMP_B = ["Digital", "Teknologi", "Logistik", "Foods", "Retail", "Media", "Konstruksi", "Farmasi", "Energi", "Properti"];
const PREFIX = ["0812", "0813", "0821", "0852", "0811", "0817", "0859", "0878", "0815", "0856", "0857", "0896", "0895", "0881", "0838"];
const DOMAINS = ["gmail.com", "gmail.com", "yahoo.co.id", "outlook.com", "hotmail.com"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const num = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

let records = [];

function makeRecord(cols) {
  const female = Math.random() < 0.5;
  const first = pick(female ? FIRST_F : FIRST_M);
  const last = pick(LAST);
  const r = { nama: `${first} ${last}` };
  if (cols.includes("email")) r.email = `${first.toLowerCase()}.${last.toLowerCase().replace(/\s/g, "")}${Math.random() < 0.6 ? num(1, 99) : ""}@${pick(DOMAINS)}`;
  if (cols.includes("telepon")) r.telepon = pick(PREFIX) + String(num(10000000, 99999999));
  if (cols.includes("alamat")) r.alamat = `${pick(STREETS)} No. ${num(1, 250)}, RT ${String(num(1, 12)).padStart(2, "0")}/RW ${String(num(1, 12)).padStart(2, "0")}`;
  if (cols.includes("kota")) r.kota = pick(CITIES);
  if (cols.includes("pekerjaan")) r.pekerjaan = pick(JOBS);
  if (cols.includes("perusahaan")) r.perusahaan = `PT ${pick(COMP_A)} ${pick(COMP_B)}`;
  if (cols.includes("umur")) r.umur = num(18, 65);
  return r;
}

function selectedCols() {
  return [...document.querySelectorAll(".col-toggle:checked")].map((c) => c.value);
}

function generate() {
  const n = Number(document.getElementById("count").value);
  const cols = selectedCols();
  records = Array.from({ length: n }, () => makeRecord(cols));
  render(cols);
  document.getElementById("status").textContent = `${n} data fiktif dibuat. Unduh atau salin buat dipakai testing.`;
}

function render(cols) {
  const head = ["nama", ...cols.filter((c) => c !== "nama")];
  const show = records.slice(0, 50);
  document.getElementById("data-table").innerHTML =
    `<tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>` +
    show.map((r) => `<tr>${head.map((h) => `<td>${r[h] ?? ""}</td>`).join("")}</tr>`).join("");
  document.getElementById("preview-note").textContent =
    records.length > 50 ? `(pratinjau 50 dari ${records.length})` : "";
}

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

document.getElementById("count").addEventListener("input", (e) => {
  document.getElementById("count-label").textContent = e.target.value;
});
document.getElementById("gen-btn").addEventListener("click", generate);
for (const c of document.querySelectorAll(".col-toggle")) c.addEventListener("change", generate);

document.getElementById("json-btn").addEventListener("click", () =>
  download("data-dummy.json", JSON.stringify(records, null, 2), "application/json"));
document.getElementById("csv-btn").addEventListener("click", () => {
  const cols = Object.keys(records[0] || { nama: "" });
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...records.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  download("data-dummy.csv", csv, "text/csv");
});
document.getElementById("copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(records, null, 2));
    document.getElementById("status").textContent = "JSON tersalin ke clipboard.";
  } catch {
    document.getElementById("status").textContent = "Gagal menyalin otomatis — pakai tombol Unduh JSON ya.";
  }
});

generate();
