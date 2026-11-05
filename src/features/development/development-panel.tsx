"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/session/session-provider";
import { milestones, responseLabel, setForAge, type Answer } from "./milestones";

export function DevelopmentPanel({ profileAge }: { profileAge?: number }) {
  const { state, dispatch } = useSession();
  const saved = state.development;
  const [age, setAge] = useState(saved ? String(saved.ageMonths) : profileAge !== undefined && profileAge >= 2 && profileAge <= 71 ? String(profileAge) : "");
  const [answers, setAnswers] = useState<Record<string, Answer>>(saved?.answers ?? {});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const months = age.trim() === "" ? NaN : Number(age);
  const selected = setForAge(months);
  const savedSet = milestones.find(set => set.age === saved?.milestoneAge);
  function changeAge(value: string) { setAge(value); setAnswers({}); setNotice(""); setError(""); }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) { setError("Masukkan usia lengkap antara 2 dan 71 bulan."); return; }
    if (selected.questions.some((_, i) => !answers[`${selected.age}-${i}`])) { setError("Jawab semua pertanyaan; pilih 'Belum yakin' jika belum tahu."); return; }
    dispatch({ type: "development", development: { ageMonths: months, milestoneAge: selected.age, answers } });
    setError(""); setNotice("Jawaban disimpan dalam memori sesi dan dapat dicetak di ringkasan.");
  }
  return <div><p className="modal-intro">Catat beberapa contoh kemampuan sesuai usia berdasarkan panduan CDC. Daftar ini hanya sebagian contoh, bukan checklist lengkap atau alat skrining dan diagnosis.</p>
    <div className="privacy-notice">Jawaban hanya berada di memori sesi. Jika anak lahir lebih dari 3 minggu lebih awal, CDC menyarankan usia koreksi; tanyakan kepada tenaga kesehatan untuk menentukan usia yang digunakan.</div>
    {saved && <p className="field-help">Ringkasan terakhir yang tersimpan: usia {saved.ageMonths} bulan, tahap {saved.milestoneAge} bulan. Simpan lagi untuk menggantinya; menutup formulir membuang perubahan yang belum disimpan.</p>}<form onSubmit={submit} noValidate><div className="field"><label htmlFor="development-age">Usia dalam bulan lengkap</label><input id="development-age" type="number" min="2" max="71" step="1" inputMode="numeric" value={age} onChange={e => changeAge(e.target.value)} /><p className="field-help">Usia 2–71 bulan. Untuk usia di antara dua tahap CDC, digunakan tahap yang lebih muda. Usia 60–71 bulan memakai contoh tahap 5 tahun; konsultasikan untuk penilaian sesuai usia.</p></div>
      {selected && <><p className="development-stage">Contoh tonggak tahap <strong>{selected.age} bulan</strong></p><p className="field-help">Pilih satu jawaban untuk setiap contoh. Jawaban baru tersimpan saat Anda menekan tombol di bawah; mengubah usia mengosongkan pilihan formulir.</p>{selected.questions.map((question, i) => { const id = `${selected.age}-${i}`; return <fieldset className="development-question" key={id}><legend>{question}</legend><div className="development-options">{(["yes", "not-yet", "unsure"] as const).map(value => <label key={value}><input type="radio" name={id} checked={answers[id] === value} onChange={() => { setAnswers({ ...answers, [id]: value }); setNotice(""); }} /> {responseLabel(value)}</label>)}</div></fieldset>; })}<a className="development-source" href={`https://www.cdc.gov/act-early/milestones/${selected.slug}.html`} target="_blank" rel="noopener noreferrer">Lihat daftar lengkap dan aktivitas dari CDC ↗</a></>}
      {error && <p role="alert" className="assistant-error">{error}</p>}<Button type="submit" className="button-wide">Simpan ringkasan sesi ↗</Button>{notice && <p role="status" className="development-notice">{notice}</p>}
    </form>
    {saved && savedSet && <section className="development-saved" aria-label="Ringkasan jawaban tersimpan"><h3>Ringkasan yang tersimpan</h3><p>Usia {saved.ageMonths} bulan · contoh tahap {saved.milestoneAge} bulan</p><ul>{savedSet.questions.map((question, i) => <li key={i}>{question} <strong>{responseLabel(saved.answers[`${savedSet.age}-${i}`])}</strong></li>)}</ul></section>}
    <p className="development-advice">Jika ada kemampuan yang belum terlihat, ada kekhawatiran, atau anak kehilangan kemampuan yang pernah dimiliki, jangan menunggu: bicarakan dengan tenaga kesehatan dan tanyakan tentang skrining perkembangan. Jawaban “sudah” tidak menyingkirkan kemungkinan masalah.</p>
  </div>;
}
