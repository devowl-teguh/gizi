"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "./session-provider";
import { profileSchema } from "@/lib/validation/profile";

export function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const { state, dispatch } = useSession();
  const profile = state.profile;
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(event: FormEvent) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget as HTMLFormElement);
    const result = profileSchema.safeParse(Object.fromEntries(fields));
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      return;
    }
    dispatch({ type: "profile", profile: result.data });
    onSaved();
  }
  return <form onSubmit={submit} noValidate autoComplete="off">
    <p className="modal-intro">Cukup data yang diperlukan. Nama lengkap dan foto tidak dibutuhkan.</p>
    <div className="privacy-notice">Data hanya ada selama sesi ini. Memuat ulang halaman menghapus sesi. Gunakan <strong>Hapus data & selesai</strong> untuk menghapusnya sekarang. Pemulihan tab bergantung pada browser.</div>
    <div className="field"><label htmlFor="nickname">Nama panggilan <span>(opsional)</span></label><input id="nickname" maxLength={40} name="nickname" defaultValue={profile?.nickname ?? ""} placeholder="Misalnya: Ara" aria-invalid={!!errors.nickname} aria-describedby={errors.nickname ? "nickname-error" : undefined} />{errors.nickname && <p id="nickname-error" className="field-error">{errors.nickname}</p>}</div>
    <div className="field"><label htmlFor="birthDate">Tanggal lahir</label><input id="birthDate" type="date" required name="birthDate" defaultValue={profile?.birthDate ?? ""} aria-invalid={!!errors.birthDate} aria-describedby={errors.birthDate ? "birthDate-error" : undefined} />{errors.birthDate && <p id="birthDate-error" role="alert" className="field-error">{errors.birthDate}</p>}</div>
    <div className="field"><label htmlFor="sex">Jenis kelamin <span>(opsional)</span></label><select id="sex" name="sex" defaultValue={profile?.sex ?? ""}><option value="">Belum diisi</option><option value="female">Perempuan</option><option value="male">Laki-laki</option></select><p className="field-help">Akan diperlukan untuk kurva pertumbuhan.</p></div>
    <Button type="submit" className="button-wide">Gunakan profil selama sesi ini ↗</Button>
  </form>;
}
