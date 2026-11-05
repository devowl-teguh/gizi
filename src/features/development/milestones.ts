// Selected, paraphrased examples, not the complete CDC checklist or a screening instrument.
export type Answer = "yes" | "not-yet" | "unsure";
export type DevelopmentResult = { ageMonths: number; milestoneAge: number; answers: Record<string, Answer> };
export type MilestoneSet = { age: number; slug: string; questions: readonly string[] };
export const milestones: readonly MilestoneSet[] = [
  { age: 2, slug: "2-months", questions: ["Tenang ketika diajak bicara atau diangkat.", "Mengeluarkan suara selain menangis.", "Mengamati Anda saat Anda bergerak.", "Mengangkat kepala saat tengkurap."] },
  { age: 4, slug: "4-months", questions: ["Tersenyum sendiri untuk menarik perhatian Anda.", "Menoleh ke arah suara Anda.", "Melihat tangannya dengan tertarik.", "Menahan kepala tetap tegak tanpa bantuan saat digendong."] },
  { age: 6, slug: "6-months", questions: ["Mengenali orang yang dikenalnya.", "Bergantian mengeluarkan suara dengan Anda.", "Meraih mainan yang diinginkan.", "Berguling dari tengkurap ke telentang."] },
  { age: 9, slug: "9-months", questions: ["Menoleh ketika namanya dipanggil.", "Mengangkat tangan untuk minta digendong.", "Membenturkan dua benda bersama-sama.", "Duduk tanpa bantuan."] },
  { age: 12, slug: "1-year", questions: ["Bermain bersama Anda, misalnya tepuk tangan.", "Melambaikan tangan untuk mengucapkan selamat tinggal.", "Memasukkan benda ke dalam wadah.", "Berdiri dengan menarik tubuh ke atas."] },
  { age: 15, slug: "15-months", questions: ["Menunjukkan benda yang disukainya kepada Anda.", "Menunjuk untuk meminta sesuatu atau bantuan.", "Menyusun setidaknya dua benda kecil, seperti balok.", "Mengambil beberapa langkah sendiri."] },
  { age: 18, slug: "18-months", questions: ["Menunjuk untuk menunjukkan sesuatu yang menarik kepada Anda.", "Mengikuti perintah satu langkah tanpa gerakan bantuan, seperti memberikan mainan saat diminta.", "Bermain dengan mainan secara sederhana, seperti mendorong mobil-mobilan.", "Berjalan tanpa berpegangan pada orang atau benda."] },
  { age: 24, slug: "2-years", questions: ["Memperhatikan saat orang lain terluka atau sedih, misalnya berhenti atau tampak sedih saat orang lain menangis.", "Mengucapkan setidaknya dua kata bersama, misalnya 'mau susu'.", "Memegang benda dengan satu tangan sambil menggunakan tangan lainnya, misalnya memegang wadah dan membuka tutupnya.", "Menendang bola."] },
  { age: 30, slug: "30-months", questions: ["Bermain di sebelah anak lain dan kadang bermain bersama mereka.", "Mengucapkan sekitar 50 kata.", "Mengikuti perintah dua langkah, seperti 'letakkan mainan dan tutup pintu'.", "Melompat dengan kedua kaki terangkat dari lantai."] },
  { age: 36, slug: "3-years", questions: ["Memperhatikan anak lain dan ikut bermain bersama mereka.", "Bercakap-cakap dengan setidaknya dua kali percakapan bolak-balik.", "Menggambar lingkaran setelah Anda mencontohkannya.", "Menggunakan garpu."] },
  { age: 48, slug: "4-years", questions: ["Berpura-pura menjadi sesuatu yang lain saat bermain, seperti guru atau pahlawan.", "Mengucapkan kalimat dengan empat kata atau lebih.", "Menyebutkan beberapa warna benda.", "Sering berhasil menangkap bola besar."] },
  { age: 60, slug: "5-years", questions: ["Mengikuti aturan atau bergiliran saat bermain dengan anak lain.", "Menjawab pertanyaan sederhana tentang buku atau cerita setelah dibacakan atau diceritakan.", "Menghitung sampai sepuluh.", "Melompat dengan satu kaki."] },
];
export function setForAge(months: number): MilestoneSet | null {
  if (!Number.isInteger(months) || months < 2 || months > 71) return null;
  return [...milestones].reverse().find(set => set.age <= months) ?? null;
}
export function responseLabel(answer: Answer | undefined) { return answer === "yes" ? "Sudah terlihat" : answer === "not-yet" ? "Belum terlihat" : answer === "unsure" ? "Belum yakin" : "Belum dijawab"; }
