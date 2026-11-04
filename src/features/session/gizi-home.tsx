"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProfileForm } from "./profile-form";
import { SessionProvider, useSession } from "./session-provider";
import { ageLabel } from "@/lib/validation/profile";

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
  const tool = panel && panel in tools ? tools[panel as Tool] : null;
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
      <footer className="site-footer"><p>Sesi sementara · Tanpa akun · Data minimum</p><p>Pencarian AI belum aktif. Belum ada konteks yang dikirim ke layanan AI.</p><div className="footer-actions"><button onClick={() => setPanel("privacy")}>Tentang data sesi</button><button onClick={() => setPanel("reset")}>Hapus data & selesai</button></div><p className="session-announcement" role="status">{announcement}</p></footer>
    </main>
    {panel === "profile" && <Modal title="Kenali si Kecil" onClose={() => setPanel(null)}><ProfileForm onSaved={() => setPanel(null)} /></Modal>}
    {tool && <Modal title={tool.title} onClose={() => setPanel(null)}><span className="panel-badge">Sedang disiapkan</span><p className="modal-intro">{tool.note}</p><div className="privacy-notice">{state.profile ? <>Profil sesi: <strong>{state.profile.nickname || "Si Kecil"}</strong> · {ageLabel(state.profile.birthDate)}.</> : "Anda dapat menyiapkan profil anak sementara terlebih dahulu."}</div><Button onClick={() => setPanel("profile")}>{state.profile ? "Ubah profil anak" : "Isi profil anak"} ↗</Button></Modal>}
    {panel === "search" && <Modal title="Cari panduan untuk si Kecil" onClose={() => setPanel(null)}><span className="panel-badge">Asisten belum terhubung</span><p className="search-query">“{state.query.trim()}”</p><p className="modal-intro">Pencarian berbasis sumber akan tersedia setelah integrasi NaraRouter selesai. Pertanyaan ini hanya ada di memori halaman dan belum dikirim ke layanan AI.</p><Button onClick={() => setPanel(null)}>Kembali ke beranda</Button></Modal>}
    {panel === "reset" && <Modal title="Akhiri sesi ini?" onClose={() => setPanel(null)}><p className="modal-intro">Profil anak, pertanyaan, dan semua isian sesi ini akan dikosongkan. Setelah selesai, Anda bisa mulai lagi dengan sesi baru.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setPanel(null)}>Lanjutkan sesi</button><Button onClick={onReset}>Hapus data & selesai</Button></div></Modal>}
    {panel === "privacy" && <Modal title="Anda memegang kendali" onClose={() => setPanel(null)}><div className="privacy-copy"><p>Profil dan pertanyaan hanya ada di memori halaman. Tidak ada akun atau penyimpanan data anak di browser maupun database.</p><p>Memuat ulang halaman menghapus sesi. Tab di background dapat mempertahankan data; pemulihan halaman setelah tab ditutup bergantung pada browser. Gunakan “Hapus data & selesai” untuk mengosongkannya sekarang.</p><p>Asisten AI belum aktif. Saat diaktifkan nanti, konteks minimum akan dikirim ke NaraRouter dan penyedia model, dengan penjelasan sebelum digunakan.</p></div><Button onClick={() => setPanel(null)}>Mengerti</Button></Modal>}
  </div>;
}
function SessionRoot() {
  const { state, dispatch } = useSession();
  const [announcement, setAnnouncement] = useState("");
  return <SessionScreen key={state.generation} announcement={announcement} onReset={() => { dispatch({ type: "reset" }); setAnnouncement("Sesi selesai. Semua data sesi telah dikosongkan."); }} />;
}
export function GiziHome() { return <SessionProvider><SessionRoot /></SessionProvider>; }
