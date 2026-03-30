import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PackageCard from "@/components/packages/PackageCard";

export const metadata: Metadata = {
  title: "Paket Foto",
  description: "Pilih paket foto studio, outdoor, atau produk sesuai kebutuhanmu.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

async function getPackages(categorySlug?: string) {
  const [packages, categories] = await Promise.all([
    prisma.package.findMany({
      where: {
        isActive: true,
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      include: {
        category: true,
        tiers: { select: { price: true }, orderBy: { price: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.packageCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { packages, categories };
}

export default async function PackagesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const { packages, categories } = await getPackages(category);

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="bg-stone-950 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Pilihan Paket
          </p>
          <h1 className="text-5xl font-bold text-white">Paket Foto</h1>
          <p className="text-stone-400 text-lg max-w-md mx-auto">
            Temukan paket yang sesuai dengan kebutuhan dan anggaranmu.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/packages"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !category
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/packages?category=${cat.slug}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat.slug
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Package grid */}
        {packages.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-lg">Belum ada paket di kategori ini.</p>
            <Link href="/packages" className="mt-4 inline-block text-amber-600 font-medium hover:underline">
              Lihat semua paket
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
