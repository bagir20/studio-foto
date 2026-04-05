import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Koleksi karya foto terbaik wanpicture Palangkaraya.",
};

async function getGalleryData() {
  const [photos, categories] = await Promise.all([
    prisma.galleryPhoto.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { photos, categories };
}

export default async function GalleryPage() {
  const { photos, categories } = await getGalleryData();

  return (
    <div className="bg-white min-h-screen canvas-texture">
      <section className="px-8 md:px-12 pt-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Portfolio</span>
          </div>
          <h1 className="font-cinzel text-5xl md:text-7xl text-black tracking-tight mb-5">
            GALLERY
          </h1>
          <GalleryGrid photos={photos} categories={categories} />
        </div>
      </section>
    </div>
  );
}