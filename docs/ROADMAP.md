# Status dan fitur tertunda

Terakhir diperbarui: 4 November 2026. Fitur berikutnya ditunda sampai diminta untuk dilanjutkan; urutan di bawah adalah usulan, bukan jadwal.

## Sudah tersedia

- Homepage responsif dengan desain Playful Growth yang sudah disetujui.
- Profil anak sementara, validasi tanggal lahir, dan tampilan usia.
- Tombol untuk menghapus data dan mengakhiri sesi; memuat ulang halaman juga memulai sesi baru.
- Pencarian resep, ide stimulasi, dan panduan umum melalui NaraRouter **secara lokal**, dengan persetujuan, sumber, serta batas dan penanganan kesalahan dasar. Jawaban AI dapat keliru dan perlu diperiksa terhadap sumbernya.

## Prioritas fitur berikutnya — tertunda

1. **Cek pertumbuhan.** Pilih dan dokumentasikan rujukan yang terverifikasi, cakupan usia dan satuan; buat formulir pengukuran, perhitungan deterministik, grafik, dan penjelasan hasil. Uji dengan nilai rujukan dan kondisi batas. Hasil bukan diagnosis.
2. **Checklist perkembangan.** Pilih instrumen dan rujukan sesuai rentang usia; susun pertanyaan, cara penilaian, rangkuman, dan aktivitas yang relevan. Uji bersama rujukannya.
3. **Panduan vaksin.** Verifikasi sumber dan versi jadwal yang berlaku; buat input riwayat serta panduan untuk sesi berjalan. Tidak ada pengingat saat situs ditutup.
4. **Unduh ringkasan.** Buat PDF yang hanya diunduh atas tindakan pengguna, berisi hasil yang tersedia dalam sesi. Jelaskan bahwa file unduhan tetap ada setelah sesi berakhir.

Urutan dapat diubah sesuai kebutuhan. Tiap fitur harus tetap berfungsi tanpa login dan tidak menyimpan data anak antar kunjungan.

## Sebelum AI digunakan di situs produksi — tertunda

- Terapkan pembatasan permintaan bersama di hosting dan batas anggaran akun; batas per proses saat ini belum cukup untuk situs publik.
- Pastikan konfigurasi proxy/Host dan logging hosting tidak merekam data pribadi atau isi permintaan.
- Periksa ketentuan retensi dan penggunaan data dari penyedia model yang sebenarnya melayani alias NaraRouter.
- Uji ulang privasi, pembatalan, dan batas biaya pada lingkungan produksi. AI produksi tetap dinonaktifkan secara default sampai pengamanan tersebut tersedia.
- Lihat [AI integration and privacy](AI_INTEGRATION.md) untuk rincian implementasi dan keterbatasan.

## Ide lanjutan — belum diprioritaskan

- Artikel parenting sesuai usia dengan sumber.
- Kalkulator usia anak sebagai alat mandiri.
- Kalkulator usia kehamilan dan perkiraan persalinan.
- Pengembangan lebih lanjut pengalaman tanya panduan berbasis sumber.

## Keputusan yang tetap berlaku

Data profil, isian, dan hasil hanya berada dalam memori sesi browser; tidak ada login atau database data anak. Menutup tab tidak menjamin penghapusan mutlak karena browser dapat memulihkan sesi, sehingga pengguna dapat memilih **Hapus data & selesai**. Bila AI digunakan, konteks yang disetujui pengguna dikirim ke NaraRouter dan penyedia terkait; menghapus sesi lokal tidak menjamin penghapusan di pihak ketiga.
