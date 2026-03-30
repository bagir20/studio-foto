import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDuration } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPackage(slug: string) {
  return prisma.package.findUnique({
    where: { slug },
    include: {
      category: true,
      tiers: { orderBy: { price: "asc" } },
      samples: { orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return { title: "Paket tidak ditemukan" };
  return {
    title: pkg.name,
    description: pkg.description ?? `Lihat detail dan harga paket ${pkg.name}.`,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) notFound();

  return (
    <div className="bg-white min-h-screen">

      {/* Hero cover */}
      <div className="relative h-72 md:h-96 bg-stone-200 overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-6xl mx-auto">
          <span className="inline-block bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            {pkg.category.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{pkg.name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        {/* Left: info + samples */}
        <div className="md:col-span-2 space-y-12">

          {/* Description */}
          {pkg.description && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3">Tentang paket ini</h2>
              <p className="text-stone-600 leading-relaxed">{pkg.description}</p>
            </div>
          )}

          {/* Sample photos */}
          {pkg.samples.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Contoh hasil foto</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pkg.samples.map((sample) => (
                  <div key={sample.id} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src={sample.imageUrl}
                      alt={sample.caption ?? "Sample foto"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: tiers + CTA */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-stone-900">Pilih tier</h2>

          {pkg.tiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`border rounded-2xl p-6 space-y-4 ${
                i === 1
                  ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                  : "border-stone-200"
              }`}
            >
              {i === 1 && (
                <span className="inline-block bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                  Paling populer
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">{tier.name}</h3>
                  <p className="text-stone-500 text-sm">{formatDuration(tier.duration)}</p>
                </div>
                <p className="text-xl font-bold text-amber-600">{formatRupiah(tier.price)}</p>
              </div>

              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-amber-500 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/booking?packageId=${pkg.id}&tierId=${tier.id}`}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  i === 1
                    ? "bg-amber-400 hover:bg-amber-300 text-stone-900"
                    : "bg-stone-900 hover:bg-stone-700 text-white"
                }`}
              >
                Pilih {tier.name}
              </Link>
            </div>
          ))}

          <Link
            href="/packages"
            className="block text-center text-stone-400 text-sm hover:text-stone-600 transition-colors mt-4"
          >
            ← Kembali ke semua paket
          </Link>
        </div>
      </div>
    </div>
  );
}
