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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null);
  const [deletingCat, setDeletingCat] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setError("");
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch("/api/admin/gallery/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      if (!res.ok) throw new Error("Gagal menambah kategori");
      setNewCategory("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah kategori");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingCat) return;
  try {
    const res = await fetch(`/api/admin/gallery/categories/${editingCat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingCat.name }),
    });
    if (!res.ok) throw new Error("Gagal edit kategori");
    setEditingCat(null);
    router.refresh();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Gagal edit kategori");
  }
};

const handleDeleteCategory = async (id: string) => {
  if (!confirm("Hapus kategori ini? Foto dalam kategori ini tidak ikut terhapus.")) return;
  setDeletingCat(id);
  try {
    const res = await fetch(`/api/admin/gallery/categories/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal hapus kategori");
    router.refresh();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Gagal hapus kategori");
  } finally {
    setDeletingCat(null);
  }
};

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) { setError("Pilih foto terlebih dahulu"); return; }
    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const compressed = await imageCompression(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.8,
        });

        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, compressed, { cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: urlData.publicUrl, caption, categoryId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Gagal menyimpan ke database");
        }

        setUploadProgress(i + 1);
      }

      setFiles([]);
      setPreviews([]);
      setCaption("");
      setUploadProgress(0);
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

      {/* Kelola Kategori */}
      <div className="bg-white border border-stone-200 p-6">
        <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900 mb-4">Kelola Kategori</p>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nama kategori baru..."
            className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={addingCategory || !newCategory.trim()}
            className="bg-amber-400 hover:bg-amber-300 disabled:bg-stone-100 disabled:text-stone-400 text-stone-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            {addingCategory ? "Menyimpan..." : "+ Tambah"}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
  {categories.map((cat) => (
    <div key={cat.id} className="flex items-center gap-1 bg-stone-100 rounded-full px-3 py-1.5">
      {editingCat?.id === cat.id ? (
        <form onSubmit={handleEditCategory} className="flex items-center gap-1">
          <input
            value={editingCat.name}
            onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
            className="text-xs border border-amber-400 rounded px-2 py-0.5 w-24 focus:outline-none"
            autoFocus
          />
          <button type="submit" className="text-xs text-amber-600 font-semibold hover:text-amber-700">✓</button>
          <button type="button" onClick={() => setEditingCat(null)} className="text-xs text-stone-400 hover:text-stone-600">✕</button>
        </form>
      ) : (
        <>
          <span className="text-xs text-stone-600 font-medium">{cat.name}</span>
          <button
            onClick={() => setEditingCat({ id: cat.id, name: cat.name })}
            className="text-stone-400 hover:text-amber-500 transition-colors ml-1 text-xs"
          >
            ✎
          </button>
          <button
            onClick={() => handleDeleteCategory(cat.id)}
            disabled={deletingCat === cat.id}
            className="text-stone-400 hover:text-red-500 transition-colors text-xs disabled:opacity-50"
          >
            ×
          </button>
        </>
      )}
    </div>
  ))}
</div>
      </div>

      {/* Form Upload */}
      <div className="bg-white border border-stone-200 p-6">
        <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900 mb-6">Upload Foto</p>
        <form onSubmit={handleUpload} className="space-y-4">

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            {previews.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {previews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={src} alt={`Preview ${i}`} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
                <p className="text-stone-500 text-sm font-medium">{files.length} foto dipilih — klik untuk ganti</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-stone-400 text-4xl">[ foto ]</p>
                <p className="text-stone-600 text-sm font-medium">Klik untuk pilih foto</p>
                <p className="text-stone-400 text-xs">Bisa pilih banyak sekaligus — auto dikompres</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Progress bar */}
          {uploading && files.length > 1 && (
            <div className="space-y-1.5">
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadProgress / files.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-stone-400 text-center">
                Mengupload {uploadProgress} dari {files.length} foto...
              </p>
            </div>
          )}

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
            disabled={uploading || !files.length}
            className="bg-amber-400 hover:bg-amber-300 disabled:bg-stone-100 disabled:text-stone-400 text-stone-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            {uploading
              ? `Mengupload ${files.length > 1 ? `(${uploadProgress}/${files.length})` : ""}...`
              : `Upload ${files.length > 1 ? `${files.length} Foto` : "Foto"}`}
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