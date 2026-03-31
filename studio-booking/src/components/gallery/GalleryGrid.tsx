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

  const filtered = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category.slug === activeCategory);

  return (
    <>
      {/* Filter */}
      <div className="flex flex-wrap gap-8 mb-12 border-b border-black/10 pb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "font-cinzel text-xs tracking-[0.3em] uppercase pb-1 transition-all",
            activeCategory === "all"
              ? "text-black border-b-2 border-black"
              : "text-black/30 hover:text-black"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
              "font-cinzel text-xs tracking-[0.3em] uppercase pb-1 transition-all",
              activeCategory === cat.slug
                ? "text-black border-b-2 border-black"
                : "text-black/30 hover:text-black"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="font-cinzel text-black/20 text-xs uppercase tracking-widest text-center py-24">
          Belum ada foto
        </p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden bg-stone-100 rounded-lg"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption ?? "Gallery"}
                width={400}
                height={500}
                className="w-full object-cover group-hover:grayscale transition-all duration-700"
                unoptimized
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-cinzel tracking-widest uppercase">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-8 text-white/50 hover:text-white font-cinzel text-xs tracking-widest uppercase">
            Close ×
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.caption ?? "Gallery"}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[85vh] object-contain"
              unoptimized
            />
            {lightbox.caption && (
              <p className="text-center text-white/40 font-cinzel text-xs tracking-widest uppercase mt-4">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}