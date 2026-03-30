"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto, GalleryCategory } from "@/types";

type Props = {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
};

export default function GalleryGrid({ photos, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const filtered =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category.slug === activeCategory);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeCategory === "all"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          )}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeCategory === cat.slug
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          Belum ada foto di kategori ini.
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl bg-stone-100"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption ?? "Gallery photo"}
                width={400}
                height={500}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl leading-none hover:text-stone-300"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.caption ?? "Gallery photo"}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              unoptimized
            />
            {lightbox.caption && (
              <p className="text-center text-stone-300 text-sm mt-4">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
