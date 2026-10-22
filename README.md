# Habib Hasibuan — Personal Portfolio

Portfolio personal Next.js dengan gaya Apple-inspired glassmorphism, Swiss editorial, dark/light theme, neon-blue ambient background, halaman Home/Biodata/Hobby/Kontak, dan AI information assistant via Groq.

## Menjalankan lokal

1. Install Node.js versi LTS.
2. Ekstrak ZIP project, buka folder project di terminal.
3. Jalankan `npm install`.
4. Salin `.env.example` menjadi `.env.local`.
5. Isi `GROQ_API_KEY` dengan API key Groq. Jangan pernah menaruh key di file frontend atau mengunggah `.env.local` ke GitHub.
6. Jalankan `npm run dev`, lalu buka `http://localhost:3000`.

## Deploy ke Vercel

1. Upload project ke repository GitHub.
2. Import repository di Vercel.
3. Di Project Settings → Environment Variables, tambahkan:
   - `GROQ_API_KEY` = API key Groq
   - model AI yang sudah ditetapkan langsung di `src/app/api/assistant/route.ts` = `openai/gpt-oss-120b` (atau model OpenAI gpt-oss yang tersedia di akun Groq)
4. Redeploy setelah menambah atau mengubah environment variables.

Groq API dipanggil dari `src/app/api/assistant/route.ts`, bukan dari browser, supaya API key tidak diekspos.

## Foto

Foto yang diberikan di `jpg.zip` sudah disalin ke `public/images/`:
- `habib1.jpg` dan `habib2.jpg` untuk foto profil
- `olahraga.jpg` dan `game.jpg` untuk halaman hobby
- `profileinstagram.jpg` dan `profilewhatsapp.jpg` tersedia sebagai aset tambahan
- `school.jpg` tersedia sebagai aset tambahan

Kalau ingin mengganti foto, pertahankan nama file atau ubah path di `src/components/Portfolio.tsx`.

## Catatan sebelum publikasi

- Nomor WhatsApp yang ditampilkan adalah data yang diberikan. Pastikan pemilik nomor setuju nomor itu dipublikasikan, karena website publik dapat diakses siapa pun.
- AI hanya menjawab berdasarkan data profil yang diberikan. Tambahkan detail lain ke `profileContext` di route API bila ingin asisten dapat menjelaskan hal lain secara akurat.
- AI tidak mengidentifikasi dirinya sebagai Habib dan tidak boleh mengarang detail pribadi.
- Tema pengguna disimpan di localStorage.
- Music player tidak disertakan sesuai brief.
