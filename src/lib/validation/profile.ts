import { z } from "zod";

export const profileSchema = z.object({
  nickname: z.string().trim().max(40, "Nama panggilan maksimal 40 karakter."),
  birthDate: z.iso.date("Isi tanggal lahir yang valid.").refine((value) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return value <= today;
  }, "Tanggal lahir tidak boleh di masa depan."),
  sex: z.enum(["", "female", "male"]),
});

export function ageLabel(birthDate: string) {
  const [y, m, d] = birthDate.split("-").map(Number);
  const today = new Date();
  let months = (today.getFullYear() - y) * 12 + today.getMonth() - (m - 1);
  if (today.getDate() < d) months--;
  if (months < 1) return "Kurang dari 1 bulan";
  const years = Math.floor(months / 12);
  return [years ? `${years} tahun` : "", months % 12 ? `${months % 12} bulan` : ""].filter(Boolean).join(" ");
}
