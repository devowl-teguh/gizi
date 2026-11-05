# Status dan fitur tertunda

Terakhir diperbarui: 5 November 2026. Fitur berikutnya ditunda sampai diminta untuk dilanjutkan; urutan di bawah adalah usulan, bukan jadwal.

## Sudah tersedia

- Homepage responsif dengan desain Playful Growth yang sudah disetujui.
- Profil anak sementara, validasi tanggal lahir, dan tampilan usia.
- Tombol untuk menghapus data dan mengakhiri sesi; memuat ulang halaman juga memulai sesi baru.
- Pencarian resep, ide stimulasi, dan panduan umum melalui NaraRouter **secara lokal**, dengan persetujuan, sumber, serta batas dan penanganan kesalahan dasar. Jawaban AI dapat keliru dan perlu diperiksa terhadap sumbernya.
- Cetak ringkasan profil, pengukuran berat menurut umur, dan hasil pencarian AI terakhir; pengguna dapat memilih simpan sebagai PDF pada dialog cetak browser. File yang disimpan tetap ada setelah sesi berakhir.
- Checklist observasi perkembangan: empat contoh terpilih per tahap CDC untuk usia 2–71 bulan, jawaban dan ringkasan sesi; bukan skrining atau diagnosis. Usia 60–71 bulan memakai contoh tahap 5 tahun.
- Panduan imunisasi rutin Kemenkes (2025) untuk bayi dan baduta hingga 18 bulan, dengan catatan status sementara dan ringkasan cetak; bukan penentuan kelayakan atau jadwal kejar.
- Cek berat serta panjang atau tinggi badan menurut umur berdasarkan tabel harian WHO untuk usia 0–1.856 hari, dengan grafik dan z-score. Ini belum mencakup penilaian berat menurut tinggi atau diagnosis.

## Prioritas fitur berikutnya — tertunda

1. **Perluas cek pertumbuhan.** Berat dan panjang/tinggi menurut umur sudah tersedia. Berat menurut tinggi, lingkar kepala, serta verifikasi klinis lebih lanjut masih tertunda.
2. **Perluas checklist perkembangan.** Saat ini hanya empat contoh per tahap CDC, bukan daftar lengkap atau instrumen skrining. Tinjau terjemahan bersama ahli serta pertimbangkan instrumen skrining yang tervalidasi dan sesuai konteks Indonesia.
3. **Perluas panduan vaksin.** Ringkasan program bayi dan baduta sudah tersedia. Jadwal usia sekolah, vaksin pilihan, riwayat tanggal/dosis terperinci dan rekomendasi individual masih tertunda; perlu validasi klinis dan sumber terkini. Tidak ada pengingat saat situs ditutup.
4. **Perluas ringkasan** saat ada hasil atau cakupan fitur tambahan.

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
