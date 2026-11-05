"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { assistantInputSchema, type AssistantResult } from "@/lib/ai/contracts";
import { useSession } from "@/features/session/session-provider";

export function AssistantPanel({ kind, initialQuery, ageMonths, onReset }: { kind: "recipes" | "stimulation" | "guide"; initialQuery: string; ageMonths?: number; onReset: () => void }) {
  const { dispatch } = useSession();
  const [query, setQuery] = useState(initialQuery);
  const [age, setAge] = useState(ageMonths === undefined ? "" : String(ageMonths));
  const [ingredients, setIngredients] = useState("");
  const [allergies, setAllergies] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AssistantResult | null>(null);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => { if (result) output.current?.scrollIntoView({ block: "start", behavior: "auto" }); }, [result]);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  useEffect(() => () => { requestId.current++; controller.current?.abort(); }, []);
  function cancel() { requestId.current++; controller.current?.abort(); setLoading(false); setError("Pencarian dibatalkan. Anda dapat mencoba lagi."); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = assistantInputSchema.safeParse({ kind, query, ageMonths: age === "" ? undefined : Number(age), ingredients, allergies, consent });
    if (!parsed.success) { setError("Isi pertanyaan (2–500 karakter), usia 0–216 bulan bila diperlukan, dan centang persetujuan AI."); return; }
    controller.current?.abort(); controller.current = new AbortController();
    const id = ++requestId.current;
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), cache: "no-store", signal: controller.current.signal });
      const payload = await response.json();
      if (id !== requestId.current) return;
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Pencarian belum berhasil.");
      const received = payload as AssistantResult;
      setResult(received);
      if (received.status === "ok") dispatch({ type: "search-result", search: { kind, query: parsed.data.query, result: received } });
    } catch (cause) {
      if (id !== requestId.current) return;
      setError(cause instanceof Error && cause.name !== "AbortError" ? cause.message : "Pencarian dibatalkan.");
    } finally { if (id === requestId.current) setLoading(false); }
  }
  return <div className="assistant-panel">
    <p className="modal-intro">{kind === "recipes" ? "Cari ide menu sesuai usia, bahan, dan alergi." : kind === "stimulation" ? "Temukan aktivitas bermain sesuai usia dan bahan yang tersedia." : "Cari panduan parenting dengan rujukan bacaan."} Jangan masukkan nama, tanggal lahir lengkap, atau informasi pribadi.</p>
    <form onSubmit={submit} noValidate>
      <fieldset disabled={loading} className="assistant-fields">
        <div className="field"><label htmlFor="ai-query">Apa yang ingin dicari?</label><textarea id="ai-query" value={query} onChange={e => setQuery(e.target.value)} maxLength={500} rows={3} placeholder={kind === "recipes" ? "Ide menu makan siang yang mudah" : "Ide bermain di dalam rumah"} /></div>
        <div className="field"><label htmlFor="ai-age">Usia dalam bulan <span>(opsional)</span></label><input id="ai-age" type="number" min="0" max="216" step="1" value={age} onChange={e => setAge(e.target.value)} /><p className="field-help">Hanya angka usia yang dikirim, tanpa nama atau tanggal lahir. Isi usia untuk saran yang sesuai tahap anak.</p></div>
        <div className="field"><label htmlFor="ai-materials">{kind === "recipes" ? "Bahan yang tersedia" : "Bahan atau perlengkapan"} <span>(opsional)</span></label><input id="ai-materials" value={ingredients} onChange={e => setIngredients(e.target.value)} maxLength={200} placeholder={kind === "recipes" ? "Misalnya: nasi, wortel, ayam" : "Misalnya: kertas, krayon"} /></div>
        {kind === "recipes" && <div className="field"><label htmlFor="ai-allergies">Bahan yang harus dihindari / alergi <span>(opsional)</span></label><input id="ai-allergies" value={allergies} onChange={e => setAllergies(e.target.value)} maxLength={200} placeholder="Misalnya: telur, kacang" /></div>}
        <div className="privacy-notice">Pertanyaan, usia (jika diisi), bahan, dan alergi yang Anda tulis dikirim ke NaraRouter serta layanan model/pencarian. NaraRouter menyatakan tidak menyimpan isi prompt dan jawaban; penyedia lain memiliki kebijakan masing-masing. Menghapus sesi ini tidak menjamin penghapusan di pihak ketiga. <a href="https://router.bynara.id/privacy" target="_blank" rel="noopener noreferrer">Kebijakan privasi NaraRouter ↗</a></div>
        <label className="consent-check"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><span>Saya memahami pengiriman konteks di atas dan ingin menggunakan AI.</span></label>
        <Button type="submit" className="button-wide">{result ? "Cari lagi ↗" : "Cari dengan AI ↗"}</Button>
      </fieldset>
    </form>
    {loading && <div className="search-progress" role="status"><span className="loading-dot" aria-hidden="true" />Mencari sumber dan menyiapkan jawaban…<button className="text-button" onClick={cancel}>Batalkan</button></div>}
    {error && <p className="assistant-error" role="alert">{error}</p>}
    <div ref={output} className="search-output">
    {result?.status === "empty" && <div className="empty-result" role="status"><h3>Belum ada hasil yang cukup</h3><p>{result.message}</p></div>}
    {result?.status === "ok" && <section className="assistant-result" aria-label="Hasil pencarian AI" aria-live="polite"><span className="panel-badge">Ringkasan AI · periksa sumber</span><p>{result.answer.summary}</p>{result.answer.ideas.map((idea, index) => <article key={index} className="idea-result"><h3>{idea.title}</h3>{idea.materials && <p><strong>Bahan / perlengkapan:</strong> {idea.materials}</p>}<ol>{idea.steps.map((step, i) => <li key={i}>{step}</li>)}</ol><div className="source-links">{idea.sourceIds.map(id => { const source = result.sources.find(s => s.id === id); return source && <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">[{id}] {source.title} ↗</a>; })}</div></article>)}{result.answer.cautions.length > 0 && <div className="privacy-notice"><strong>Perhatikan juga</strong><ul>{result.answer.cautions.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}<p className="field-help">Ringkasan AI dapat keliru. Sumber belum ditinjau tenaga kesehatan untuk setiap jawaban. Ini bukan diagnosis atau rekomendasi klinis.</p></section>}
    </div>
    <div className="assistant-end"><button className="text-button" onClick={onReset}>Hapus data & selesai</button></div>
  </div>;
}
