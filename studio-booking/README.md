# Studio Booking — Next.js + TypeScript

Project booking studio foto dan FG, diconvert dari CI4 ke Next.js 15 dengan TypeScript.

## Tech Stack

| Layer | Tool | Keterangan |
|-------|------|------------|
| Framework | Next.js 15 (App Router) | Pengganti CI4 |
| Language | TypeScript | Type safety |
| Database | PostgreSQL via Supabase | Pengganti MySQL |
| ORM | Prisma | Pengganti Query Builder CI4 |
| Storage | Supabase Storage | Untuk foto gallery & sample |
| Styling | Tailwind CSS | Pengganti Bootstrap/CSS manual |
| Validation | Zod + React Hook Form | Pengganti CI4 Form Validation |

---

## Struktur Folder

```
src/
├── app/                        # App Router (pengganti routes CI4)
│   ├── page.tsx                # Home → views/home/index.php
│   ├── layout.tsx              # Root layout → templates/header+footer.php
│   ├── gallery/
│   │   └── page.tsx            # → views/gallery/index.php
│   ├── packages/
│   │   ├── page.tsx            # → views/packages/list.php
│   │   └── [slug]/
│   │       └── page.tsx        # → views/packages/detail.php
│   ├── booking/
│   │   └── page.tsx            # → views/booking/form.php
│   └── api/                    # Route Handlers (pengganti Controllers)
│       ├── booking/route.ts    # → controllers/Booking.php
│       ├── packages/route.ts   # → controllers/Packages.php
│       └── gallery/route.ts    # → controllers/Gallery.php
├── components/                 # Reusable UI components
│   ├── layout/                 # Navbar, Footer, dll
│   ├── booking/                # BookingForm, TimeSlotPicker, dll
│   ├── gallery/                # GalleryGrid, PhotoCard, dll
│   └── packages/               # PackageCard, TierCard, dll
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── supabase.ts             # Supabase client
│   ├── utils.ts                # Helper functions (cn, formatRupiah, dll)
│   └── validations.ts          # Zod schemas
└── types/
    └── index.ts                # TypeScript types
prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Data awal
```

---

## Setup Awal

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd studio-booking
npm install
```

### 2. Setup Supabase

1. Buat akun di [supabase.com](https://supabase.com) (gratis)
2. Buat project baru
3. Masuk ke **Settings → API**, copy:
   - `Project URL`
   - `anon public` key
4. Masuk ke **Settings → Database**, copy `Connection string` (URI)
5. Buat bucket di **Storage → New Bucket**:
   - Nama: `gallery`
   - Public: ✅ aktifkan

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke Supabase
npm run db:push

# Isi data awal
npm run db:seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Upload Foto ke Supabase Storage

Karena tidak ada admin panel, foto diupload langsung via Supabase dashboard:

1. Buka Supabase → **Storage → gallery**
2. Upload foto
3. Klik foto → copy URL publik
4. Update URL di `prisma/seed.ts` atau langsung via **Table Editor**

---

## Cara Kerja Booking

```
Visitor pilih paket
    ↓
Pilih tier (Basic/Premium/Exclusive)
    ↓
Pilih tanggal & jam (slot yang sudah dipesan otomatis disabled)
    ↓
Isi nama, email, nomor HP
    ↓
Submit → POST /api/booking
    ↓
Tersimpan di database dengan status PENDING
```

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Jalankan production build
npm run db:generate  # Generate Prisma client (jalankan setelah edit schema)
npm run db:push      # Push schema ke database
npm run db:seed      # Isi data awal
npm run db:studio    # Buka Prisma Studio (GUI database)
```

---

## Perbedaan CI4 vs Next.js

| CI4 | Next.js |
|-----|---------|
| `controllers/Booking.php` | `app/api/booking/route.ts` |
| `views/booking/form.php` | `app/booking/page.tsx` |
| `models/BookingModel.php` | Prisma schema + query |
| `config/Routes.php` | File-based routing (folder = route) |
| CI4 Form Validation | Zod + React Hook Form |
| MySQL | PostgreSQL (Supabase) |
| `$this->db->get()` | `prisma.booking.findMany()` |
