"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import type { PackageCategory } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tier = { name: string; price: string; duration: string; includes: string };
type SamplePhoto = { id?: string; imageUrl: string; caption: string };

type Props = {
  categories: PackageCategory[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    isActive: boolean;
    categoryId: string;
    tiers: Tier[];
    samples: SamplePhoto[];
  };
};

const emptyTier: Tier = { name: "", price: "", duration: "", includes: "" };

// Untuk cover
async function uploadCover(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    initialQuality: 0.8,
  });
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("gallery").upload(fileName, compressed, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("gallery").getPublicUrl(fileName).data.publicUrl;
}

// Untuk sample foto
async function uploadSample(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
    initialQuality: 0.8,
  });
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("gallery").upload(fileName, compressed, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("gallery").getPublicUrl(fileName).data.publicUrl;
}

export default function PackageForm({ categories, initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const coverInputRef = useRef<HTMLInputElement>(null);
  const sampleInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    coverImage: initialData?.coverImage ?? "",
    isActive: initialData?.isActive ?? true,
    categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
  });

  const [tiers, setTiers] = useState<Tier[]>(
    initialData?.tiers ?? [{ ...emptyTier }]
  );

  const [samples, setSamples] = useState<SamplePhoto[]>(
    initialData?.samples ?? []
  );

  const [coverPreview, setCoverPreview] = useState<string>(
    initialData?.coverImage ?? ""
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSample, setUploadingSample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateTier = (i: number, field: keyof Tier, value: string) => {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  };

  // Upload cover image
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError("");
    try {
      const url = await uploadCover(file);
      setForm((f) => ({ ...f, coverImage: url }));
      setCoverPreview(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload cover");
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload sample foto (bisa multiple)
  const handleSampleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingSample(true);
    setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadSample(f)));
      setSamples((prev) => [
        ...prev,
        ...urls.map((url) => ({ imageUrl: url, caption: "" })),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload sample");
    } finally {
      setUploadingSample(false);
      if (sampleInputRef.current) sampleInputRef.current.value = "";
    }
  };

  const removeSample = (i: number) => {
    setSamples((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.coverImage) { setError("Upload cover image terlebih dahulu"); return; }
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      tiers: tiers.map((t) => ({
        name: t.name,
        price: parseInt(t.price),
        duration: parseInt(t.duration),
        includes: t.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      })),
      samples: samples.map((s, i) => ({ imageUrl: s.imageUrl, caption: s.caption, order: i })),
    };

    const url = isEdit ? `/api/admin/packages/${initialData.id}` : "/api/admin/packages";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/packages");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

      {/* ── Info Paket ── */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">Info Paket</h2>

        <Field label="Nama paket">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({
              ...f,
              name: e.target.value,
              slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            }))}
            required className={inputCls} placeholder="Foto Studio Personal"
          />
        </Field>

        <Field label="Slug (URL)">
          <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required className={inputCls} placeholder="foto-studio-personal" />
        </Field>

        <Field label="Kategori">
          <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className={inputCls}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Deskripsi">
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} placeholder="Deskripsi singkat paket..." />
        </Field>

        {/* Cover image upload */}
        <Field label="Cover Image">
          <div
            onClick={() => coverInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            {coverPreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image src={coverPreview} alt="Cover" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">Ganti foto</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1 py-4">
                <p className="text-stone-500 text-sm font-medium">
                  {uploadingCover ? "Mengupload & mengompres..." : "Klik untuk upload cover"}
                </p>
                <p className="text-stone-400 text-xs">Auto dikompres — maks 1280px, 500KB</p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </div>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-amber-400" />
          <span className="text-sm text-stone-700">Paket aktif (tampil di website)</span>
        </label>
      </section>

      {/* ── Tiers ── */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Tier Harga</h2>
          <button type="button" onClick={() => setTiers((t) => [...t, { ...emptyTier }])} className="text-xs font-medium text-amber-600 hover:text-amber-700">
            + Tambah tier
          </button>
        </div>
        {tiers.map((tier, i) => (
          <div key={i} className="border border-stone-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-700">Tier {i + 1}</p>
              {tiers.length > 1 && (
                <button type="button" onClick={() => setTiers((t) => t.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Hapus</button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Nama">
                <input value={tier.name} onChange={(e) => updateTier(i, "name", e.target.value)} required className={inputCls} placeholder="Basic" />
              </Field>
              <Field label="Harga (Rp)">
                <input value={tier.price} onChange={(e) => updateTier(i, "price", e.target.value)} required type="number" className={inputCls} placeholder="150000" />
              </Field>
              <Field label="Durasi (menit)">
                <input value={tier.duration} onChange={(e) => updateTier(i, "duration", e.target.value)} required type="number" className={inputCls} placeholder="60" />
              </Field>
            </div>
            <Field label="Termasuk (satu per baris)">
              <textarea value={tier.includes} onChange={(e) => updateTier(i, "includes", e.target.value)} rows={3} className={inputCls} placeholder={"2 outfit\nSoft file 50 foto\n1 cetak 4R"} />
            </Field>
          </div>
        ))}
      </section>

      {/* ── Sample Foto ── */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Sample Foto</h2>
          <button
            type="button"
            onClick={() => sampleInputRef.current?.click()}
            disabled={uploadingSample}
            className="text-xs font-medium text-amber-600 hover:text-amber-700 disabled:text-stone-400"
          >
            {uploadingSample ? "Mengupload..." : "+ Upload foto"}
          </button>
          <input ref={sampleInputRef} type="file" accept="image/*" multiple onChange={handleSampleChange} className="hidden" />
        </div>

        {samples.length === 0 ? (
          <div
            onClick={() => sampleInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            <p className="text-stone-500 text-sm font-medium">Klik untuk upload sample foto</p>
            <p className="text-stone-400 text-xs mt-1">Bisa pilih beberapa foto sekaligus — auto dikompres</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {samples.map((sample, i) => (
              <div key={i} className="space-y-1.5">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
                  <Image src={sample.imageUrl} alt="Sample" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => removeSample(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
                <input
                  value={sample.caption}
                  onChange={(e) => setSamples((prev) => prev.map((s, idx) => idx === i ? { ...s, caption: e.target.value } : s))}
                  placeholder="Caption (opsional)"
                  className="w-full text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            ))}
            {/* Tombol tambah lagi */}
            <div
              onClick={() => sampleInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-amber-400 flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="text-stone-400 text-2xl">+</span>
            </div>
          </div>
        )}
      </section>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploadingCover || uploadingSample} className="bg-amber-400 hover:bg-amber-300 disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 font-semibold px-6 py-3 rounded-xl transition-colors">
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Paket"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 hover:border-stone-300 transition-colors">
          Batal
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}