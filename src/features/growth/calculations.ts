import references from "../../lib/reference-data/who-wfa-daily.json" with { type: "json" };
import heightReferences from "../../lib/reference-data/who-lhfa-daily.json" with { type: "json" };

export type GrowthSex = "female" | "male";
export type HeightResult = { measuredCm: number; position: "lying" | "standing"; adjustedCm: number; zScore: number };
export type GrowthResult = { birthDate: string; measuredOn: string; sex: GrowthSex; weightKg: number; ageDays: number; zScore: number; height?: HeightResult };
const DAY_MS = 86_400_000;

export function ageInDays(birthDate: string, measuredOn: string): number | null {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
  };
  const days = (parse(measuredOn) - parse(birthDate)) / DAY_MS;
  return Number.isInteger(days) && days >= 0 && days <= 1856 ? days : null;
}

export function valueAtZ(ageDays: number, sex: GrowthSex, z: number): number {
  const [l, m, s] = references[sex][ageDays];
  return Math.abs(l) < 1e-10 ? m * Math.exp(s * z) : m * Math.pow(1 + l * s * z, 1 / l);
}

export function weightZScore(ageDays: number, sex: GrowthSex, weightKg: number): number {
  if (!Number.isInteger(ageDays) || ageDays < 0 || ageDays > 1856 || !references[sex] || !Number.isFinite(weightKg) || weightKg <= 0) throw new Error("Invalid growth measurement");
  const [l, m, s] = references[sex][ageDays];
  const raw = Math.abs(l) < 1e-10 ? Math.log(weightKg / m) / s : (Math.pow(weightKg / m, l) - 1) / (l * s);
  if (raw > 3) return 3 + (weightKg - valueAtZ(ageDays, sex, 3)) / (valueAtZ(ageDays, sex, 3) - valueAtZ(ageDays, sex, 2));
  if (raw < -3) return -3 + (weightKg - valueAtZ(ageDays, sex, -3)) / (valueAtZ(ageDays, sex, -2) - valueAtZ(ageDays, sex, -3));
  return raw;
}

export function adjustedHeight(ageDays: number, measuredCm: number, position: "lying" | "standing"): number {
  if (!Number.isInteger(ageDays) || ageDays < 0 || ageDays > 1856 || !Number.isFinite(measuredCm) || measuredCm <= 0 || (position !== "lying" && position !== "standing")) throw new Error("Invalid height measurement");
  if (ageDays <= 730 && position === "standing") return measuredCm + 0.7;
  if (ageDays > 730 && position === "lying") return measuredCm - 0.7;
  return measuredCm;
}

export function heightValueAtZ(ageDays: number, sex: GrowthSex, z: number): number {
  const [l, m, s] = heightReferences[sex][ageDays];
  return Math.abs(l) < 1e-10 ? m * Math.exp(s * z) : m * Math.pow(1 + l * s * z, 1 / l);
}

export function heightZScore(ageDays: number, sex: GrowthSex, heightCm: number): number {
  if (!Number.isInteger(ageDays) || ageDays < 0 || ageDays > 1856 || !heightReferences[sex] || !Number.isFinite(heightCm) || heightCm <= 0) throw new Error("Invalid height measurement");
  const [l, m, s] = heightReferences[sex][ageDays];
  return Math.abs(l) < 1e-10 ? Math.log(heightCm / m) / s : (Math.pow(heightCm / m, l) - 1) / (l * s);
}

export function zDescription(z: number): string {
  if (z < -3) return "Di bawah garis -3 SD";
  if (z < -2) return "Di antara garis -3 dan -2 SD";
  if (z <= 2) return "Di antara garis -2 dan +2 SD";
  return "Di atas garis +2 SD";
}
