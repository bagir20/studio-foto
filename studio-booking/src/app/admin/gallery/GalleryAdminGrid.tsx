"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import type { GalleryPhoto, GalleryCategory } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
};

export default function GalleryAdminGrid({ photos, categories }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Pilih foto terlebih dahulu"); return; }
    setUploading(true);
    setError("");

    try {
      // 1. Kompres foto
      const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        initialQuality: 0.85,
      });

      // 2. Upload ke Supabase Storage
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, compressed, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      // 3. Ambil URL publik
      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      // 4. Simpan ke database via API
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption, categoryId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menyimpan ke database");
      }

      setFile(null);
      setPreview(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Hapus foto ini?")) return;
    setDeleting(id);

    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      await supabase.storage.from("gallery").remove([fileName]);
    }

    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(null);
  };

  return (
    <div className="space-y-8">

      {/* Form upload */}
      <div className="bg-white border border-stone-200 p-6">
        <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900 mb-6">Upload Foto</p>
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            {preview ? (
              <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-stone-400 text-4xl">[ foto ]</p>
                <p className="text-stone-600 text-sm font-medium">Klik untuk pilih foto</p>
                <p className="text-stone-400 text-xs">JPG, PNG, WEBP — auto dikompres 2MB, 2400px</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                Caption <span className="text-stone-300 font-normal">(opsional)</span>
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Deskripsi singkat..."
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="bg-amber-400 hover:bg-amber-300 disabled:bg-stone-100 disabled:text-stone-400 text-stone-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            {uploading ? "Mengompres & mengupload..." : "Upload Foto"}
          </button>
        </form>
      </div>

      {/* Grid foto */}
       <div className="bg-white border border-stone-200 p-6">
        <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900 mb-6">
          Foto Tersimpan <span className="text-stone-400 font-normal">({photos.length})</span>
        </p>
        {photos.length === 0 ? (
          <p className="text-center py-8 text-stone-400 text-sm">Belum ada foto. Upload di atas!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden bg-stone-100 aspect-square">
                <Image src={photo.imageUrl} alt={photo.caption ?? "Gallery"} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full self-start">
                    {photo.category.name}
                  </span>
                  <button
                    onClick={() => handleDelete(photo.id, photo.imageUrl)}
                    disabled={deleting === photo.id}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === photo.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}