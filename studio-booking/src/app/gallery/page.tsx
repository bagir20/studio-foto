import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Lihat hasil karya foto studio dan outdoor wanpicture Palangkaraya.",
};

// Fetch langsung di server — tidak perlu useEffect atau fetch ke API
async function getGalleryData() {
  const [photos, categories] = await Promise.all([
    prisma.galleryPhoto.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.galleryCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);
  return { photos, categories };
}

export default async function GalleryPage() {
  const { photos, categories } = await getGalleryData();

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="bg-stone-950 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Portfolio
          </p>
          <h1 className="text-5xl font-bold text-white">Gallery</h1>
          <p className="text-stone-400 text-lg max-w-md mx-auto">
            Koleksi karya foto terbaik kami — dari studio hingga outdoor.
          </p>
        </div>
      </section>

      {/* Gallery content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <GalleryGrid photos={photos} categories={categories} />
      </section>

    </div>
  );
}
