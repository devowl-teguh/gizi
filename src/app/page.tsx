const features = ["Cek pertumbuhan", "Checklist perkembangan", "Ide stimulasi", "Panduan vaksin", "Pencari resep", "Unduh ringkasan"];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-semibold text-orange-700">GIZI · FONDASI APLIKASI</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Temani langkah kecil si Kecil.</h1>
      <p className="mt-5 max-w-2xl text-lg text-stone-600">Panduan gizi dan tumbuh kembang anak, tanpa akun. Fitur masih dalam pengembangan.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <section key={feature} className="rounded-2xl border border-orange-100 bg-white p-6">
            <h2 className="font-semibold">{feature}</h2>
            <p className="mt-2 text-sm text-stone-500">Direncanakan untuk versi pertama</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-stone-600">Belum ada formulir atau pengumpulan data anak. Asisten AI belum diaktifkan.</p>
    </main>
  );
}
