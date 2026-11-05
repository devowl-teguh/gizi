# Rangkuman Fitur Website Parenting & Gizi Anak

Tanggal: 4 November 2026
Status: homepage Playful Growth disetujui dan diimplementasikan bersama profil sementara serta alur hapus sesi. Pencarian AI bersumber sudah terhubung secara lokal. Cek berat dan panjang/tinggi menurut umur WHO tersedia untuk usia 0–1.856 hari; checklist perkembangan berisi contoh terpilih CDC yang bukan skrining; acuan imunisasi program bayi dan baduta 2025 serta catatan sesi tersedia tanpa jadwal kejar; fitur pertumbuhan lainnya dan penilaian vaksin individual masih tertunda. Ringkasan sesi dapat dicetak atau disimpan sebagai PDF melalui dialog browser.

## Tujuan

Membuat web app parenting berbahasa Indonesia yang terinspirasi fungsi aplikasi Tentang Anak. Fokus pada alat yang memberi hasil dalam satu kali penggunaan, dengan identitas visual sendiri dan tampilan responsif untuk HP serta desktop.

## Aturan utama

- Pengguna tidak perlu login.
- Data anak dan hasil sesi hanya disimpan dalam memori halaman browser.
- Jangan menyimpan data anak di localStorage, sessionStorage, IndexedDB, cookie, cache browser, atau database.
- Saat halaman dimuat ulang atau sesi halaman berakhir, data sesi hilang. Tab yang hanya masuk background masih dapat mempertahankan data.
- Penutupan tab tidak dapat dijadikan jaminan penghapusan mutlak karena perilaku pemulihan sesi browser. Sediakan tombol “Hapus data & selesai” untuk mengosongkan state dan hasil yang tampil secara eksplisit.
- Tampilkan penjelasan sebelum input: “Data hanya digunakan selama sesi ini. Memuat ulang atau menutup halaman akan mengakhiri sesi. Gunakan Hapus data & selesai untuk menghapus data sekarang.”
- Backend perantara AI tidak menyimpan isi pertanyaan, data anak, atau jawaban ke database maupun log aplikasi. Hindari pencatatan payload pada observability dan error reporting.
- Aset publik website boleh di-cache, tetapi data pribadi dan respons AI tidak boleh di-cache.

Daftar status terkini dan pekerjaan tertunda: [docs/ROADMAP.md](docs/ROADMAP.md).

## Fitur prioritas versi pertama

| Fitur | Perilaku |
| --- | --- |
| Profil anak sementara | Nama panggilan opsional, tanggal lahir atau usia, serta jenis kelamin sesuai kebutuhan alat. Tidak memerlukan foto atau identitas lengkap. |
| Cek pertumbuhan | Input usia, jenis kelamin, berat, tinggi, dan bila relevan lingkar kepala; tampilkan hasil dan kurva berdasarkan standar terverifikasi. |
| Checklist perkembangan | Pertanyaan sesuai usia, rangkuman pencapaian, dan arahan stimulasi. Instrumen dan aturan penilaian harus memiliki rujukan yang tepat. |
| Ide stimulasi | Pencarian aktivitas sesuai usia dan kemampuan yang ingin dilatih, dengan langkah, bahan, serta sumber. |
| Panduan vaksin | Input tanggal lahir dan vaksin yang sudah diberikan; tampilkan panduan jadwal berikutnya untuk sesi berjalan berdasarkan rujukan terverifikasi. |
| Pencari resep | Cari menu berdasarkan usia, bahan yang tersedia, dan alergi; tampilkan bahan, langkah, serta sumber. Klaim nutrisi harus didukung data. |
| Unduh ringkasan | Pengguna dapat menyimpan PDF hasil sesi secara sengaja ke perangkatnya. File unduhan tetap ada setelah sesi website berakhir. |
| Hapus data & selesai | Kosongkan profil, formulir, hasil, serta percakapan; batalkan permintaan aktif dan abaikan respons terlambat. |

## Fitur pendukung / tahap berikutnya

- Artikel parenting sesuai usia dengan referensi sumber.
- Tanya panduan berbasis sumber tepercaya.
- Kalkulator usia anak.
- Kalkulator usia kehamilan dan perkiraan persalinan.

Fitur di atas merupakan kandidat lanjutan, belum merupakan komitmen lingkup versi pertama.

## Fitur yang tidak sesuai dengan model sesi sementara

- Riwayat pertumbuhan otomatis antar kunjungan.
- Tracker tidur, makan, atau menyusui lintas hari.
- Pemantauan progres mingguan yang tersimpan.
- Pengingat vaksin ketika website sudah ditutup.
- Sinkronisasi akun atau perangkat.

Pengguna harus memasukkan ulang data pada kunjungan berikutnya. Panduan vaksin dalam sesi bukan layanan notifikasi terjadwal.

## AI agent melalui NaraRouter

Pengguna sudah memiliki API key NaraRouter. Key sudah dikonfigurasi di file environment lokal yang diabaikan Git.

### Pembagian tugas

| Area | Tugas AI |
| --- | --- |
| Resep | Mencari dan merangkum pilihan sesuai usia, bahan, dan alergi. |
| Stimulasi | Mencari aktivitas sesuai usia dan tujuan latihan. |
| Artikel | Mencari referensi dan merangkum dengan tautan sumber. |
| Tanya panduan | Menjawab berdasarkan sumber yang ditemukan, menyatakan keterbatasan bila bukti tidak cukup. |
| Pertumbuhan dan vaksin | Menjelaskan hasil dari mesin aturan terverifikasi. AI bukan sumber angka, kurva, skor, atau jadwal. |

### Arsitektur

Browser → backend perantara → NaraRouter → penyedia model / pencarian.

- Simpan key sebagai secret pada server, bukan dalam kode frontend atau repository.
- Gunakan kemampuan pencarian web dan pembacaan halaman NaraRouter dengan model yang mendukung tool calling.
- Pastikan pencarian benar-benar dilakukan sebelum menandai jawaban sebagai hasil pencarian.
- Sertakan tautan sumber yang benar-benar ditemukan dan mendukung jawaban; utamakan sumber primer seperti WHO, Kemenkes, dan IDAI sesuai topik.
- Kirim konteks minimum, misalnya “anak usia 5 tahun, alergi telur”. Jangan otomatis mengirim nama, foto, atau tanggal lahir lengkap.
- Riwayat percakapan hanya berada dalam memori sesi.
- Terapkan batas permintaan dan biaya yang wajar untuk endpoint publik tanpa login.
- Tentukan model, batas pencarian, timeout, serta penanganan kegagalan saat implementasi.

### Batas privasi yang harus dijelaskan

Data lokal bersifat sementara, tetapi konteks AI tetap dikirim ke NaraRouter dan layanan model/pencarian terkait. Tidak menyimpan data pada website sendiri tidak berarti layanan pihak ketiga tidak menyimpannya. Kebijakan gateway telah diperiksa; ketentuan penyedia model yang mendasari alias belum diverifikasi secara independen. Keterbatasan ini dijelaskan sebelum persetujuan AI. Lihat docs/AI_INTEGRATION.md. Jangan menjanjikan penghapusan data pihak ketiga saat tab ditutup.

## Alur pengguna

1. Buka website dan lihat penjelasan sesi serta pengiriman konteks bila memakai AI.
2. Pilih alat; artikel, resep umum, dan panduan umum dapat diakses tanpa profil anak.
3. Masukkan data minimum yang diperlukan.
4. Lihat hasil, penjelasan, dan sumber.
5. Unduh ringkasan bila diinginkan.
6. Tekan “Hapus data & selesai”.

## Arah tampilan

- Nuansa hangat: oranye, krem, kartu membulat, dengan identitas sendiri.
- HP: navigasi ringkas di bawah dan formulir mudah diisi.
- Desktop: navigasi samping dan area hasil lebih lapang.
- Dashboard berisi pilihan alat, profil sementara, dan ringkasan sesi; hindari tampilan yang menyiratkan riwayat tersimpan.

## Validasi sebelum peluncuran

- Verifikasi standar kurva pertumbuhan, rentang usia, satuan, dan perhitungan.
- Verifikasi instrumen perkembangan serta rujukan jadwal vaksin yang digunakan.
- Bedakan informasi dan skrining awal dari diagnosis.
- Periksa alergi dan kesesuaian usia pada konten resep.
- Uji penghapusan state, refresh halaman, respons AI terlambat, dan tidak adanya penyimpanan payload di browser/server.
- Verifikasi kebijakan retensi NaraRouter serta penyedia model yang dipilih.

## Referensi riset awal

- Tentang Anak: https://tentanganak.com/
- Tentang Kami: https://tentanganak.com/tentang-kami/
- Deskripsi aplikasi: https://play.google.com/store/apps/details?hl=id&id=com.criyos.tentanganak
- Dokumentasi NaraRouter: https://router.bynara.id/id/docs

Screenshot dari pengguna digunakan sebagai referensi antarmuka. Homepage dan sesi sementara sudah berjalan; pencarian AI lokal sudah terhubung, sementara fitur klinis belum selesai.
