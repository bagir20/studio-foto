import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import type { PackageCard } from "@/types";

type Props = {
  pkg: PackageCard;
};

export default function PackageCard({ pkg }: Props) {
  // Harga mulai dari tier termurah
  const startingPrice = pkg.tiers.length > 0
    ? Math.min(...pkg.tiers.map((t) => t.price))
    : null;

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-semibold px-3 py-1 rounded-full">
          {pkg.category.name}
        </span>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors leading-snug">
          {pkg.name}
        </h3>

        {pkg.description && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
            {pkg.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          {startingPrice !== null ? (
            <div>
              <p className="text-xs text-stone-400">Mulai dari</p>
              <p className="text-lg font-bold text-amber-600">
                {formatRupiah(startingPrice)}
              </p>
            </div>
          ) : (
            <p className="text-stone-400 text-sm">Hubungi kami</p>
          )}
          <span className="text-xs font-semibold text-stone-400 group-hover:text-amber-500 transition-colors">
            Lihat detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
