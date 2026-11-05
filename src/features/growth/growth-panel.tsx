"use client";

import { useState, type FormEvent } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/session/session-provider";
import { adjustedHeight, ageInDays, heightValueAtZ, heightZScore, valueAtZ, weightZScore, zDescription, type GrowthSex } from "./calculations";

function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }

export function GrowthPanel() {
  const { state, dispatch } = useSession();
  const previous = state.growth;
  const [birthDate, setBirthDate] = useState(previous?.birthDate ?? state.profile?.birthDate ?? "");
  const [sex, setSex] = useState(previous?.sex ?? state.profile?.sex ?? "");
  const [measuredOn, setMeasuredOn] = useState(previous?.measuredOn ?? today());
  const [weight, setWeight] = useState(previous ? String(previous.weightKg) : "");
  const [height, setHeight] = useState(previous?.height ? String(previous.height.measuredCm) : "");
  const [position, setPosition] = useState<"" | "lying" | "standing">(previous?.height?.position ?? "");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const days = ageInDays(birthDate, measuredOn);
    const kg = Number(weight);
    if (!birthDate || !measuredOn || measuredOn > today() || days === null) { setError("Periksa tanggal. Pengukuran harus sejak lahir, tidak di masa depan, dan berusia maksimal 1.856 hari."); return; }
    if (sex !== "female" && sex !== "male") { setError("Pilih jenis kelamin untuk rujukan WHO."); return; }
    if (!weight.trim() || !Number.isFinite(kg) || kg < 0.1 || kg > 100) { setError("Isi berat badan dari 0,1 sampai 100 kg."); return; }
    let heightResult;
    if (height.trim()) {
      const cm = Number(height);
      if (!Number.isFinite(cm) || cm < 30 || cm > 160) { setError("Isi panjang atau tinggi badan dari 30 sampai 160 cm."); return; }
      if (position !== "lying" && position !== "standing") { setError("Pilih cara pengukuran panjang atau tinggi badan."); return; }
      const adjustedCm = adjustedHeight(days, cm, position);
      heightResult = { measuredCm: cm, position, adjustedCm, zScore: heightZScore(days, sex, adjustedCm) };
    }
    dispatch({ type: "growth", growth: { birthDate, measuredOn, sex, weightKg: kg, ageDays: days, zScore: weightZScore(days, sex, kg), height: heightResult } });
    setError("");
  }
  const chart = previous ? Array.from({ length: 62 }, (_, i) => { const day = Math.min(Math.round(i * 1856 / 61), 1856); return { day, low: valueAtZ(day, previous.sex, -2), median: valueAtZ(day, previous.sex, 0), high: valueAtZ(day, previous.sex, 2) }; }) : [];
  if (previous && !chart.some(row => row.day === previous.ageDays)) {
    const day = previous.ageDays;
    chart.push({ day, low: valueAtZ(day, previous.sex, -2), median: valueAtZ(day, previous.sex, 0), high: valueAtZ(day, previous.sex, 2) });
    chart.sort((a, b) => a.day - b.day);
  }
  return <div><p className="modal-intro">Bandingkan satu pengukuran berat badan dengan standar WHO berdasarkan umur dalam hari dan jenis kelamin. Cakupan: lahir hingga 1.856 hari (sekitar 5 tahun).</p><div className="privacy-notice">Data hanya digunakan dalam sesi ini. Untuk bayi lahir prematur, usia koreksi memerlukan penilaian tenaga kesehatan; alat ini memakai usia sejak tanggal lahir.</div>
    <form onSubmit={submit} noValidate>
      <div className="field"><label htmlFor="growth-birth">Tanggal lahir</label><input id="growth-birth" type="date" value={birthDate} max={today()} onChange={e => setBirthDate(e.target.value)} required /></div>
      <div className="field"><label htmlFor="growth-sex">Jenis kelamin pada rujukan WHO</label><select id="growth-sex" value={sex} onChange={e => setSex(e.target.value as GrowthSex | "")} required><option value="">Pilih</option><option value="female">Perempuan</option><option value="male">Laki-laki</option></select></div>
      <div className="field"><label htmlFor="growth-date">Tanggal pengukuran</label><input id="growth-date" type="date" value={measuredOn} max={today()} onChange={e => setMeasuredOn(e.target.value)} required /></div>
      <div className="field"><label htmlFor="growth-weight">Berat badan (kg)</label><input id="growth-weight" type="number" min="0.1" max="100" step="0.01" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Contoh: 9.5" required /></div>
      <div className="field"><label htmlFor="growth-height">Panjang atau tinggi badan (cm) <span>(opsional)</span></label><input id="growth-height" type="number" min="30" max="160" step="0.1" inputMode="decimal" value={height} onChange={e => setHeight(e.target.value)} placeholder="Contoh: 75.5" /></div>
      {height.trim() && <div className="field"><label htmlFor="growth-position">Cara pengukuran</label><select id="growth-position" value={position} onChange={e => setPosition(e.target.value as "" | "lying" | "standing")}><option value="">Pilih cara ukur</option><option value="lying">Telentang (panjang badan)</option><option value="standing">Berdiri (tinggi badan)</option></select><p className="field-help">WHO menggunakan panjang telentang sampai usia 730 hari dan tinggi berdiri mulai hari ke-731. Jika cara ukur berbeda, hasil disesuaikan 0,7 cm.</p></div>}
      {error && <p className="assistant-error" role="alert">{error}</p>}<Button type="submit" className="button-wide">Lihat hasil ↗</Button>
    </form>
    {previous && <section className="growth-result" aria-live="polite"><h3>Berat badan menurut umur</h3><p><strong>{previous.weightKg} kg · {previous.ageDays} hari</strong></p><p>Pengukuran {previous.measuredOn} · {previous.sex === "female" ? "Perempuan" : "Laki-laki"} · lahir {previous.birthDate}</p><p>{zDescription(previous.zScore)} (z-score {previous.zScore.toFixed(2)} SD).</p><p>Hasil memakai nilai sebelum pembulatan. Grafik: garis ungu = median, garis putus-putus = -2 dan +2 SD, titik = pengukuran Anda.</p><div className="growth-chart" role="img" aria-label={`Grafik rujukan WHO dan titik pengukuran ${previous.weightKg} kilogram pada usia ${previous.ageDays} hari`}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={chart} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" type="number" domain={[0, 1856]} tickFormatter={v => `${Math.round(v / 365.25)} th`} /><YAxis width={40} domain={[0, (max: number) => Math.ceil(Math.max(max, previous.weightKg) * 1.1)]} tickFormatter={v => `${v}`} /><Tooltip labelFormatter={v => `Usia ${v} hari`} formatter={(value) => `${Number(value).toFixed(2)} kg`} /><Line type="monotone" dataKey="low" name="-2 SD" stroke="#a27ca8" strokeDasharray="5 5" dot={false} isAnimationActive={false} /><Line type="monotone" dataKey="median" name="Median" stroke="#763f86" dot={false} isAnimationActive={false} /><Line type="monotone" dataKey="high" name="+2 SD" stroke="#a27ca8" strokeDasharray="5 5" dot={false} isAnimationActive={false} /><ReferenceDot x={previous.ageDays} y={previous.weightKg} r={5} fill="#df7043" stroke="#fff" /></ComposedChart></ResponsiveContainer></div><p className="field-help">Sumbu vertikal: berat (kg); sumbu horizontal: perkiraan usia (tahun). Hasil bukan diagnosis. Berat menurut umur tidak dapat menilai tinggi badan atau menentukan kelebihan berat badan; konsultasikan hasil dan pola pertumbuhan dengan tenaga kesehatan. Bila pengukuran jauh dari kurva, periksa ulang data.</p><p className="source-links"><a href="https://www.who.int/tools/child-growth-standards/standards/weight-for-age" target="_blank" rel="noopener noreferrer">Sumber: WHO Child Growth Standards — weight-for-age ↗</a></p></section>}
    {previous?.height && <HeightChart result={previous} />}
  </div>;
}

function HeightChart({ result }: { result: import("./calculations").GrowthResult }) {
  const h = result.height!;
  const days = Array.from(new Set([...Array.from({ length: 62 }, (_, i) => Math.round(i * 1856 / 61)), 730, 731, result.ageDays])).sort((a, b) => a - b);
  const data = days.map(day => ({ day, low: heightValueAtZ(day, result.sex, -2), median: heightValueAtZ(day, result.sex, 0), high: heightValueAtZ(day, result.sex, 2) }));
  const adjustment = h.adjustedCm - h.measuredCm;
  return <section className="growth-result" aria-live="polite"><h3>Panjang atau tinggi badan menurut umur</h3><p><strong>{h.measuredCm} cm · {result.ageDays} hari</strong> · diukur {h.position === "lying" ? "telentang" : "berdiri"}</p><p>{adjustment === 0 ? "Cara ukur sesuai rujukan usia; tidak ada penyesuaian." : `Nilai disesuaikan ${adjustment > 0 ? "+0,7" : "−0,7"} cm untuk rujukan WHO: ${h.adjustedCm.toFixed(1)} cm.`}</p><p>{zDescription(h.zScore)} (z-score {h.zScore.toFixed(2)} SD; label memakai nilai sebelum pembulatan).</p><p>Garis ungu adalah median; garis putus-putus adalah −2 dan +2 SD. Titik menunjukkan nilai setelah penyesuaian bila diperlukan.</p><div className="growth-chart" role="img" aria-label={`Grafik WHO panjang atau tinggi menurut umur; nilai untuk rujukan ${h.adjustedCm.toFixed(1)} sentimeter pada usia ${result.ageDays} hari`}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" type="number" domain={[0,1856]} tickFormatter={v => `${Math.round(v / 365.25)} th`} /><YAxis width={40} domain={[0, (max: number) => Math.ceil(Math.max(max, h.adjustedCm) * 1.1)]} /><Tooltip labelFormatter={v => `Usia ${v} hari`} formatter={value => `${Number(value).toFixed(1)} cm`} /><Line type="linear" dataKey="low" name="−2 SD" stroke="#a27ca8" strokeDasharray="5 5" dot={false} isAnimationActive={false} /><Line type="linear" dataKey="median" name="Median" stroke="#763f86" dot={false} isAnimationActive={false} /><Line type="linear" dataKey="high" name="+2 SD" stroke="#a27ca8" strokeDasharray="5 5" dot={false} isAnimationActive={false} /><ReferenceDot x={result.ageDays} y={h.adjustedCm} r={5} fill="#df7043" stroke="#fff" /></ComposedChart></ResponsiveContainer></div><p className="field-help">Sumbu vertikal: cm; sumbu horizontal: perkiraan tahun. Perubahan kecil kurva pada hari ke-731 menunjukkan perubahan dari rujukan panjang ke tinggi. Hasil ini bukan diagnosis. Periksa teknik ukur dan diskusikan hasil dengan tenaga kesehatan.</p><p className="source-links"><a href="https://www.who.int/tools/child-growth-standards/standards/length-height-for-age" target="_blank" rel="noopener noreferrer">Sumber: WHO Child Growth Standards — length/height-for-age ↗</a></p></section>;
}
