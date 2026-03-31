import { prisma } from "@/lib/prisma";
import GalleryAdminGrid from "./GalleryAdminGrid";

async function getData() {
  const [photos, categories] = await Promise.all([
    prisma.galleryPhoto.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { photos, categories };
}

export default async function AdminGalleryPage() {
  const { photos, categories } = await getData();

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase">Manajemen</p>
        <h1 className="font-cinzel text-3xl text-stone-900 mt-1">Gallery</h1>
      </div>
      <GalleryAdminGrid photos={photos} categories={categories} />
    </div>
  );
}