"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/session/session-provider";
import { vaccineSchedule, vaccineSource, validBirthDate, type VaccineStatus } from "./schedule";

function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }

export function VaccinePanel() {
  const { state, dispatch } = useSession();
  const saved = state.vaccines;
  const [birthDate, setBirthDate] = useState(saved?.birthDate ?? state.profile?.birthDate ?? "");
  const [statuses, setStatuses] = useState<Record<string, VaccineStatus>>(saved?.statuses ?? {});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validBirthDate(birthDate, today())) { setError("Tanggal lahir tidak valid atau berada di masa depan."); return; }
    if (!Object.keys(statuses).length) { setError("Isi setidaknya satu catatan vaksin sebelum menyimpan."); return; }
    dispatch({ type: "vaccines", vaccines: { birthDate, statuses } });
    setError(""); setNotice("Catatan tersimpan dalam memori sesi dan dapat dicetak di ringkasan.");
  }
  return <div><p className="modal-intro">Lihat acuan imunisasi rutin bayi dan baduta dari Kemenkes (2025), lalu cocokkan dengan buku KIA atau catatan tenaga kesehatan.</p>
    <div className="privacy-notice">Ini bukan penentuan vaksin yang harus diberikan hari ini atau jadwal imunisasi kejar. Jadwal individual, riwayat, jenis vaksin, interval, kondisi kesehatan dan ketersediaan daerah perlu diperiksa tenaga kesehatan. Catatan hanya tersimpan selama sesi.</div>
    {saved && <p className="field-help">Ada catatan tersimpan dari sesi ini. Simpan lagi untuk menggantinya; perubahan yang belum disimpan akan hilang saat formulir ditutup.</p>}
    <form onSubmit={submit} noValidate><div className="field"><label htmlFor="vaccine-birth">Tanggal lahir <span>(opsional, untuk ringkasan)</span></label><input id="vaccine-birth" type="date" max={today()} value={birthDate} onChange={e => {setBirthDate(e.target.value); setNotice("");}} /></div>
      <p className="field-help">Pilih hanya yang ingin dicatat. “Tidak ditemukan di catatan” belum berarti anak belum menerima vaksin.</p>
      {vaccineSchedule.map(group => <section className="vaccine-group" key={group.age}><h3>{group.age}</h3>{group.items.map(item => <div className="vaccine-row" key={item.id}><label htmlFor={`vacc-${item.id}`}>{item.name}</label><select id={`vacc-${item.id}`} value={statuses[item.id] ?? ""} onChange={e => { const value = e.target.value; setStatuses(current => {const next = { ...current }; if (value) next[item.id] = value as VaccineStatus; else delete next[item.id]; return next;}); setNotice(""); }}><option value="">Belum diisi</option><option value="recorded">Tercatat diberikan</option><option value="not-recorded">Tidak ditemukan di catatan</option><option value="unsure">Belum yakin</option></select></div>)}</section>)}
      <p className="field-help">JE tercantum untuk daerah endemis. Ada vaksin dan jadwal lanjutan usia sekolah atau di luar program yang tidak dicakup di sini. Jangan menyimpulkan bahwa imunisasi sudah lengkap. Jadwal dapat berubah.</p><a className="development-source" href={vaccineSource} target="_blank" rel="noopener noreferrer">Lihat jadwal lengkap Kemenkes 2025 ↗</a>
      {error && <p role="alert" className="assistant-error">{error}</p>}<Button type="submit" className="button-wide">Simpan catatan sesi ↗</Button>{notice && <p role="status" className="development-notice">{notice}</p>}
    </form><p className="development-advice">Jika catatan tidak lengkap atau tidak yakin, bawa buku KIA ke puskesmas atau dokter. Tenaga kesehatan akan menilai vaksin yang diperlukan dan jadwal kejar yang aman. Tidak ada pengingat setelah situs ditutup.</p>
  </div>;
}
