# Lyrs AI — PROJECT 

## FILE
- `index.html`
- `style.css`
- `app.js`
- `netlify.toml`
- `netlify/functions/chat.js`
- `netlify/functions/models.js`

## DEPLOY
- Branch to deploy: `main`
- Base directory: kosong
- Build command: kosong
- Publish directory: `.`
- Functions directory: `netlify/functions`

## API KEY
 → Environment variables, lalu tambahkan:
- Key: `INTERN_AI_API_KEY`
- Value: API key dari dashboard Intern AI Discovery.

Opsional, jika dokumentasi akun menyebut model spesifik:
- Key: `INTERN_AI_MODEL`
- Value: ID model yang valid dari endpoint `/v1/models`.

Lalu trigger deploy ulang agar environment variable terbaca.

## API yang dipakai
Functions meneruskan request ke:
- `https://discovery-api.intern-ai.org.cn/v1/models`
- `https://discovery-api.intern-ai.org.cn/v1/chat/completions`

Default model `intern-latest` hanya fallback awal; bila API mengembalikan error model tidak tersedia, atur `INTERN_AI_MODEL` ke ID yang benar-benar ada di daftar model akunmu.

## Catatan
API key tidak ditaruh di HTML/JS frontend. Jangan commit key ke GitHub. Daftar model ditampilkan sebagai jumlah model yang tersedia; pemilih dropdown model belum dibuat pada versi ini.
