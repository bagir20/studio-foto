import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Gallery Categories ──────────────────────────────────
  const galCats = await Promise.all([
    prisma.galleryCategory.upsert({
      where: { slug: "wedding" },
      update: {},
      create: { name: "Wedding", slug: "wedding" },
    }),
    prisma.galleryCategory.upsert({
      where: { slug: "portrait" },
      update: {},
      create: { name: "Portrait", slug: "portrait" },
    }),
    prisma.galleryCategory.upsert({
      where: { slug: "product" },
      update: {},
      create: { name: "Product", slug: "product" },
    }),
  ]);
  console.log("✅ Gallery categories:", galCats.map((c) => c.name));

  // ─── Gallery Photos ──────────────────────────────────────
  // Ganti URL ini dengan foto asli dari Supabase Storage kamu
  await prisma.galleryPhoto.createMany({
    skipDuplicates: true,
    data: [
      { imageUrl: "https://placehold.co/800x600?text=Wedding+1", categoryId: galCats[0].id, order: 1 },
      { imageUrl: "https://placehold.co/800x600?text=Wedding+2", categoryId: galCats[0].id, order: 2 },
      { imageUrl: "https://placehold.co/800x600?text=Portrait+1", categoryId: galCats[1].id, order: 1 },
      { imageUrl: "https://placehold.co/800x600?text=Product+1", categoryId: galCats[2].id, order: 1 },
    ],
  });
  console.log("✅ Gallery photos seeded");

  // ─── Package Categories ──────────────────────────────────
  const pkgCats = await Promise.all([
    prisma.packageCategory.upsert({
      where: { slug: "foto-studio" },
      update: {},
      create: { name: "Foto Studio", slug: "foto-studio" },
    }),
    prisma.packageCategory.upsert({
      where: { slug: "foto-outdoor" },
      update: {},
      create: { name: "Foto Outdoor", slug: "foto-outdoor" },
    }),
    prisma.packageCategory.upsert({
      where: { slug: "foto-produk" },
      update: {},
      create: { name: "Foto Produk", slug: "foto-produk" },
    }),
  ]);
  console.log("✅ Package categories:", pkgCats.map((c) => c.name));

  // ─── Packages + Tiers + Samples ─────────────────────────
  const packageStudio = await prisma.package.upsert({
    where: { slug: "foto-studio-personal" },
    update: {},
    create: {
      name: "Foto Studio Personal",
      slug: "foto-studio-personal",
      description: "Sesi foto di studio dengan berbagai backdrop dan pencahayaan profesional.",
      coverImage: "https://placehold.co/800x600?text=Studio+Personal",
      categoryId: pkgCats[0].id,
      tiers: {
        create: [
          {
            name: "Basic",
            price: 150_000,
            duration: 60,
            includes: ["1 outfit", "Soft file 20 foto", "1 backdrop pilihan"],
          },
          {
            name: "Premium",
            price: 300_000,
            duration: 120,
            includes: ["2 outfit", "Soft file 50 foto", "3 backdrop pilihan", "1 cetak 4R"],
          },
          {
            name: "Exclusive",
            price: 500_000,
            duration: 180,
            includes: ["3 outfit", "Soft file 100 foto", "Semua backdrop", "3 cetak 4R", "1 album digital"],
          },
        ],
      },
      samples: {
        create: [
          { imageUrl: "https://placehold.co/800x600?text=Sample+Studio+1", order: 1 },
          { imageUrl: "https://placehold.co/800x600?text=Sample+Studio+2", order: 2 },
          { imageUrl: "https://placehold.co/800x600?text=Sample+Studio+3", order: 3 },
        ],
      },
    },
  });

  const packageOutdoor = await prisma.package.upsert({
    where: { slug: "foto-outdoor-couple" },
    update: {},
    create: {
      name: "Foto Outdoor Couple",
      slug: "foto-outdoor-couple",
      description: "Sesi foto di luar ruangan dengan nuansa natural dan romantis.",
      coverImage: "https://placehold.co/800x600?text=Outdoor+Couple",
      categoryId: pkgCats[1].id,
      tiers: {
        create: [
          {
            name: "Basic",
            price: 200_000,
            duration: 90,
            includes: ["1 lokasi", "Soft file 30 foto"],
          },
          {
            name: "Premium",
            price: 400_000,
            duration: 150,
            includes: ["2 lokasi", "Soft file 60 foto", "1 cetak 4R"],
          },
        ],
      },
      samples: {
        create: [
          { imageUrl: "https://placehold.co/800x600?text=Sample+Outdoor+1", order: 1 },
          { imageUrl: "https://placehold.co/800x600?text=Sample+Outdoor+2", order: 2 },
        ],
      },
    },
  });

  console.log("✅ Packages seeded:", [packageStudio.name, packageOutdoor.name]);
  console.log("\n🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
