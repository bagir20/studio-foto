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
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Gallery</h1>
        <p className="text-stone-500 text-sm mt-1">{photos.length} foto</p>
      </div>
      <GalleryAdminGrid photos={photos} categories={categories} />
    </div>
  );
}
