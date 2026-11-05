"use client";

import { useState, type FormEvent } from "react";
import { AssistantPanel } from "@/features/assistant/assistant-panel";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProfileForm } from "./profile-form";
import { SessionProvider, useSession } from "./session-provider";
import { ageLabel } from "@/lib/validation/profile";
import { GrowthPanel } from "@/features/growth/growth-panel";
import { zDescription } from "@/features/growth/calculations";
import { DevelopmentPanel } from "@/features/development/development-panel";
import { milestones, responseLabel } from "@/features/development/milestones";
import { VaccinePanel } from "@/features/vaccines/vaccine-panel";
import { vaccineSchedule, vaccineSource, vaccineStatusLabel } from "@/features/vaccines/schedule";

const tools = {
  recipes: { title: "Masak apa hari ini?", description: "Jelajahi resep dari bahan yang sudah ada di dapur.", note: "Pencarian resep berdasarkan bahan, usia, dan alergi akan tersedia setelah asisten AI terhubung." },
  stimulation: { title: "Main sambil belajar", description: "Aktivitas sederhana untuk rasa ingin tahu yang besar.", note: "Ide aktivitas sesuai usia akan tersedia setelah asisten AI terhubung." },
  growth: { title: "Cek pertumbuhan", note: "Kurva dan perhitungan pertumbuhan sedang disiapkan dengan rujukan yang terverifikasi. Belum ada penilaian pertumbuhan di versi ini." },
  development: { title: "Checklist perkembangan", note: "Checklist sesuai usia sedang disiapkan menggunakan instrumen dan rujukan yang terverifikasi. Belum ada skrining di versi ini." },
  vaccines: { title: "Panduan vaksin", note: "Panduan jadwal vaksin sedang disiapkan dengan rujukan yang terverifikasi. Belum ada rekomendasi jadwal di versi ini." },
};
type Tool = keyof typeof tools;
type Panel = Tool | "profile" | "search" | "reset" | "privacy" | null;

function SessionScreen({ announcement, onReset }: { announcement: string; onReset: () => void }) {
  const { state, dispatch } = useSession();
  const [panel, setPanel] = useState<Panel>(null);
  function search(event: FormEvent) { event.preventDefault(); if (state.query.trim()) setPanel("search"); }
  function selectTool(tool: Tool) { setPanel(tool); }
  const vaccines = state.vaccines;
  const development = state.development;
  const developmentSet = milestones.find(set => set.age === development?.milestoneAge);
  let ageMonths: number | undefined;
  if (state.profile) {
    const [y, m, d] = state.profile.birthDate.split("-").map(Number);
    const now = new Date();
    const months = Math.max(0, (now.getFullYear() - y) * 12 + now.getMonth() - m + 1 - (now.getDate() < d ? 1 : 0));
    if (months <= 216) ageMonths = months;
  }
  return <div className="site-shell">
    <a className="skip-link" href="#main">Langsung ke konten</a>
    <header className="site-header">
      <a href="#main" className="brand" aria-label="Gizi, beranda">✿ gizi.</a>
      <nav aria-label="Navigasi utama"><a href="#main">Jelajah</a><a href="#growth-tools">Tumbuh</a><button onClick={() => selectTool("stimulation")}>Main</button><button onClick={() => selectTool("recipes")}>Makan</button></nav>
      <span className="header-note">Tanpa akun<span className="desktop-note">, langsung jelajah</span></span>
    </header>
    <main id="main" className="main-content">
      <section className="hero" aria-labelledby="hero-title"><span className="welcome-badge">☀ &nbsp;Hari baru, penemuan baru</span><h1 id="hero-title">Hari ini, mau tumbuh<br />lewat apa?</h1><p>Dari sepiring menu sampai permainan seru.<br />Temukan ide kecil untuk momen besar bersama.</p></section>
      <form className="search-bar" role="search" onSubmit={search}><label className="sr-only" htmlFor="idea-search">Cari ide untuk si Kecil</label><input id="idea-search" type="search" autoComplete="off" maxLength={500} required value={state.query} onChange={e => dispatch({ type: "query", query: e.target.value })} placeholder="Misalnya: ide bermain untuk anak 2 tahun" /><Button type="submit"><span className="desktop-note">Cari ide</span><span className="mobile-only">Cari</span> ↗</Button></form>
      <section className="featured-grid" aria-label="Resep dan aktivitas"><button className="feature-card peach" onClick={() => selectTool("recipes")}><h2>{tools.recipes.title}</h2><p>{tools.recipes.description}</p></button><button className="feature-card sage" onClick={() => selectTool("stimulation")}><h2>{tools.stimulation.title}</h2><p>{tools.stimulation.description}</p></button></section>
      <section id="growth-tools" className="growth-section" aria-labelledby="growth-title"><h2 id="growth-title">Kenali tumbuh kembangnya</h2><div className="shortcut-grid"><button onClick={() => selectTool("growth")}>↗ Cek pertumbuhan</button><button onClick={() => selectTool("development")}>✓ Checklist perkembangan</button><button onClick={() => selectTool("vaccines")}>＋ Panduan vaksin</button></div></section>
      <section className="session-bar" aria-label="Profil sesi sementara"><div><span className="session-label">PROFIL SEMENTARA</span><p>{state.profile ? <><strong>{state.profile.nickname || "Si Kecil"}</strong><span> · {ageLabel(state.profile.birthDate)}</span></> : "Mulai dengan usia si Kecil, saat Anda siap."}</p></div><button className="text-button" onClick={() => setPanel("profile")}>{state.profile ? "Ubah profil" : "Isi profil anak"} ↗</button></section>
      <footer className="site-footer"><p>Sesi sementara · Tanpa akun · Data minimum</p><p>AI mencari sumber setelah persetujuan Anda. Nama dan tanggal lahir tidak dikirim otomatis.</p><div className="footer-actions"><button onClick={() => setPanel("privacy")}>Tentang data sesi</button><button onClick={() => window.print()}>Cetak / simpan ringkasan PDF</button><button onClick={() => setPanel("reset")}>Hapus data & selesai</button></div><p>Untuk PDF, pilih “Simpan sebagai PDF” di dialog cetak. File yang disimpan tetap ada di perangkat setelah sesi berakhir.</p><p className="session-announcement" role="status">{announcement}</p></footer>
    </main>
    {panel === "profile" && <Modal title="Kenali si Kecil" onClose={() => setPanel(null)}><ProfileForm onSaved={() => setPanel(null)} /></Modal>}
    {(panel === "recipes" || panel === "stimulation" || panel === "search") && <Modal title={panel === "search" ? "Cari panduan untuk si Kecil" : tools[panel].title} onClose={() => setPanel(null)}><AssistantPanel kind={panel === "search" ? "guide" : panel} initialQuery={panel === "search" ? state.query : ""} ageMonths={ageMonths} onReset={onReset} /></Modal>}
    {panel === "growth" && <Modal title="Cek pertumbuhan" onClose={() => setPanel(null)}><GrowthPanel /></Modal>}
    {panel === "development" && <Modal title="Checklist perkembangan" onClose={() => setPanel(null)}><DevelopmentPanel profileAge={ageMonths} /></Modal>}
    {panel === "vaccines" && <Modal title="Panduan vaksin" onClose={() => setPanel(null)}><VaccinePanel /></Modal>}
    {panel === "reset" && <Modal title="Akhiri sesi ini?" onClose={() => setPanel(null)}><p className="modal-intro">Profil anak, pertanyaan, dan semua isian sesi ini akan dikosongkan. Setelah selesai, Anda bisa mulai lagi dengan sesi baru.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setPanel(null)}>Lanjutkan sesi</button><Button onClick={onReset}>Hapus data & selesai</Button></div></Modal>}
    {panel === "privacy" && <Modal title="Anda memegang kendali" onClose={() => setPanel(null)}><div className="privacy-copy"><p>Profil dan pertanyaan hanya ada di memori halaman. Tidak ada akun atau penyimpanan data anak di browser maupun database.</p><p>Memuat ulang halaman menghapus sesi. Tab di background dapat mempertahankan data; pemulihan halaman setelah tab ditutup bergantung pada browser. Gunakan “Hapus data & selesai” untuk mengosongkannya sekarang.</p><p>AI hanya berjalan setelah persetujuan Anda. Pertanyaan dan konteks minimum dikirim ke NaraRouter serta layanan model/pencarian. Kebijakan pihak ketiga berlaku; hapus sesi tidak menjamin penghapusan data di sana. Nama dan tanggal lahir tidak dikirim otomatis.</p><p>Statistik kunjungan halaman utama dikirim ke Vercel Web Analytics, termasuk informasi seperti perangkat, browser, perkiraan lokasi, dan situs perujuk. Nama, tanggal lahir, serta isian formulir anak tidak dikirim sebagai event analytics.</p></div><Button onClick={() => setPanel(null)}>Mengerti</Button></Modal>}
    <section className="print-summary" aria-label="Ringkasan sesi untuk dicetak"><h1>Ringkasan sesi Gizi</h1><p>Ringkasan sementara · bukan diagnosis atau pengganti konsultasi tenaga kesehatan.</p><h2>Profil anak</h2>{state.profile ? <div><p>Nama panggilan: {state.profile.nickname || "Tidak diisi"}</p><p>Tanggal lahir: {state.profile.birthDate}</p><p>Jenis kelamin: {state.profile.sex === "female" ? "Perempuan" : state.profile.sex === "male" ? "Laki-laki" : "Tidak diisi"}</p></div> : <p>Belum ada profil dalam sesi ini.</p>}{state.growth && <div><h2>Berat badan menurut umur</h2><p>Tanggal lahir: {state.growth.birthDate} · Jenis kelamin: {state.growth.sex === "female" ? "Perempuan" : "Laki-laki"}</p><p>Pengukuran {state.growth.measuredOn}: {state.growth.weightKg} kg, usia {state.growth.ageDays} hari.</p><p>{zDescription(state.growth.zScore)} (z-score {state.growth.zScore.toFixed(2)} SD).</p><p>Rujukan WHO: https://www.who.int/tools/child-growth-standards/standards/weight-for-age</p><p>Berat menurut umur saja tidak menilai seluruh status gizi dan bukan diagnosis. Konsultasikan dengan tenaga kesehatan.</p></div>}{state.growth?.height && <div><h2>Panjang atau tinggi menurut umur</h2><p>Pengukuran {state.growth.measuredOn}: {state.growth.height.measuredCm} cm, usia {state.growth.ageDays} hari; diukur {state.growth.height.position === "lying" ? "telentang" : "berdiri"}.</p><p>Nilai untuk rujukan WHO: {state.growth.height.adjustedCm.toFixed(1)} cm{state.growth.height.measuredCm !== state.growth.height.adjustedCm ? " (penyesuaian 0,7 cm sesuai posisi pengukuran)" : " (tanpa penyesuaian posisi)"}. {zDescription(state.growth.height.zScore)} (z-score {state.growth.height.zScore.toFixed(2)} SD).</p><p>Rujukan WHO: https://www.who.int/tools/child-growth-standards/standards/length-height-for-age</p><p>Bukan diagnosis. Pengukuran ini menggunakan usia sejak lahir; konsultasikan hasil dan usia koreksi untuk anak prematur dengan tenaga kesehatan.</p></div>}{development && developmentSet && <div><h2>Catatan perkembangan</h2><p>Usia yang dimasukkan: {development.ageMonths} bulan; contoh tahap CDC: {development.milestoneAge} bulan.</p><p>Ini hanya beberapa contoh, bukan daftar lengkap, skrining, atau diagnosis.</p><ul>{developmentSet.questions.map((question, i) => <li key={i}>{question} — {responseLabel(development.answers[`${developmentSet.age}-${i}`])}</li>)}</ul><p>Rujukan: https://www.cdc.gov/act-early/milestones/{developmentSet.slug}.html</p><p>Jika ada kekhawatiran, kemampuan yang belum terlihat, atau anak kehilangan kemampuan, bicarakan dengan tenaga kesehatan dan tanyakan tentang skrining.</p></div>}{vaccines && <div><h2>Catatan imunisasi sesi</h2>{vaccines.birthDate && <p>Tanggal lahir: {vaccines.birthDate}</p>}<p>Hanya catatan yang diisi pengguna; bukan bukti imunisasi lengkap atau jadwal kejar.</p>{vaccineSchedule.map(group => { const filled = group.items.filter(item => vaccines.statuses[item.id]); return filled.length > 0 && <div key={group.age}><h3>{group.age} — acuan Kemenkes</h3><ul>{filled.map(item => <li key={item.id}>{item.name}: {vaccineStatusLabel(vaccines.statuses[item.id])}</li>)}</ul></div>; })}<p>JE dicantumkan untuk daerah endemis. Penilaian vaksin lanjutan atau kejar perlu dilakukan oleh tenaga kesehatan.</p><p>Rujukan Kemenkes 2025: {vaccineSource}</p></div>}{state.latestSearch && <div><h2>Hasil pencarian AI terakhir</h2><p>Pertanyaan: {state.latestSearch.query}</p><p>{state.latestSearch.result.answer.summary}</p>{state.latestSearch.result.answer.ideas.map((idea, i) => <article key={i}><h3>{idea.title}</h3>{idea.materials && <p>Bahan atau perlengkapan: {idea.materials}</p>}<ol>{idea.steps.map((step, j) => <li key={j}>{step}</li>)}</ol><p>Sumber: {idea.sourceIds.map(id => `[${id}]`).join(" ")}</p></article>)}{state.latestSearch.result.answer.cautions.length > 0 && <><h3>Perhatikan</h3><ul>{state.latestSearch.result.answer.cautions.map((item, i) => <li key={i}>{item}</li>)}</ul></>}<h3>Rujukan</h3>{state.latestSearch.result.sources.map(source => <p key={source.id}>[{source.id}] {source.title}: {source.url}</p>)}<p>Ringkasan AI dapat keliru. Periksa sumber dan konsultasikan bila diperlukan.</p></div>}<p>File hasil cetak atau PDF tetap tersimpan di perangkat sampai Anda menghapusnya.</p></section>
  </div>;
}
function SessionRoot() {
  const { state, dispatch } = useSession();
  const [announcement, setAnnouncement] = useState("");
  return <SessionScreen key={state.generation} announcement={announcement} onReset={() => { dispatch({ type: "reset" }); setAnnouncement("Sesi selesai. Semua data sesi telah dikosongkan."); }} />;
}
export function GiziHome() { return <SessionProvider><SessionRoot /></SessionProvider>; }
