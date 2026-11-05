// Routine program overview from Kemenkes, 2025. Not an eligibility or catch-up algorithm.
export type VaccineStatus = "recorded" | "not-recorded" | "unsure";
export type VaccineRecord = { birthDate: string; statuses: Record<string, VaccineStatus> };
export const vaccineSource = "https://kemkes.go.id/id/pekan-imunisasi-dunia-2025-ayo-lengkapi-imunisasi-untuk-generasi-sehat-menuju-indonesia-emas";
export const vaccineSchedule = [
  { age: "Kurang dari 24 jam", items: [{ id: "hb0", name: "Hepatitis B (HB0)" }] },
  { age: "Kurang dari 1 bulan", items: [{ id: "bcg", name: "BCG" }, { id: "opv1", name: "Polio tetes (OPV) 1" }] },
  { age: "2 bulan", items: [{ id: "dpt1", name: "DPT-HB-Hib 1" }, { id: "opv2", name: "Polio tetes (OPV) 2" }, { id: "pcv1", name: "PCV 1" }, { id: "rv1", name: "Rotavirus (RV) 1" }] },
  { age: "3 bulan", items: [{ id: "dpt2", name: "DPT-HB-Hib 2" }, { id: "opv3", name: "Polio tetes (OPV) 3" }, { id: "pcv2", name: "PCV 2" }, { id: "rv2", name: "Rotavirus (RV) 2" }] },
  { age: "4 bulan", items: [{ id: "dpt3", name: "DPT-HB-Hib 3" }, { id: "opv4", name: "Polio tetes (OPV) 4" }, { id: "ipv1", name: "Polio suntik (IPV) 1" }, { id: "rv3", name: "Rotavirus (RV) 3" }] },
  { age: "9 bulan", items: [{ id: "mr1", name: "Campak-Rubela 1" }, { id: "ipv2", name: "Polio suntik (IPV) 2" }] },
  { age: "10 bulan", items: [{ id: "je", name: "Japanese Encephalitis (JE) — daerah endemis" }] },
  { age: "12 bulan", items: [{ id: "pcv3", name: "PCV 3" }] },
  { age: "18 bulan", items: [{ id: "mr2", name: "Campak-Rubela 2" }, { id: "dpt4", name: "DPT-HB-Hib 4" }] },
] as const;
export function vaccineStatusLabel(value: VaccineStatus | undefined): string {
  return value === "recorded" ? "Tercatat diberikan" : value === "not-recorded" ? "Tidak ditemukan di catatan" : value === "unsure" ? "Belum yakin" : "Belum diisi";
}
export function validBirthDate(value: string, today: string): boolean {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
