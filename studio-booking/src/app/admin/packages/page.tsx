export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import DeletePackageButton from "./DeletePackageButton";

async function getPackages() {
  return prisma.package.findMany({
    include: { category: true, tiers: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPackagesPage() {
  const packages = await getPackages();

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase">Manajemen</p>
          <h1 className="font-cinzel text-3xl text-stone-900 mt-1">Paket Foto</h1>
        </div>
        <Link
          href="/admin/packages/baru"
          className="bg-[#0f0f0f] hover:bg-accent text-white font-cinzel text-xs tracking-widest uppercase px-6 py-3 transition-all duration-300"
        >
          + Tambah Paket
        </Link>
      </div>

      {/* List */}
      <div className="bg-white border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900">
            {packages.length} Paket
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-4">
            <p className="font-cinzel text-xs tracking-widest uppercase text-stone-300">
              Belum ada paket
            </p>
            <Link
              href="/admin/packages/baru"
              className="inline-block font-cinzel text-xs tracking-widest uppercase text-accent hover:underline"
            >
              Tambahkan sekarang →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {packages.map((pkg) => (
              <div key={pkg.id} className="px-6 py-5 flex items-center gap-4 hover:bg-stone-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-cinzel text-sm text-stone-900 tracking-wide">{pkg.name}</p>
                    {!pkg.isActive && (
                      <span className="font-cinzel text-[10px] tracking-widest uppercase bg-stone-100 text-stone-400 px-2 py-0.5">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs mt-1">{pkg.category.name}</p>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                  {pkg.tiers.map((t) => (
                    <span key={t.id} className="font-cinzel text-[10px] tracking-widest uppercase bg-stone-50 border border-stone-100 text-stone-500 px-3 py-1">
                      {t.name}: {formatRupiah(t.price)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="font-cinzel text-[10px] tracking-widest uppercase text-stone-500 hover:text-black border border-stone-200 hover:border-black px-4 py-2 transition-all"
                  >
                    Edit
                  </Link>
                  <DeletePackageButton packageId={pkg.id} packageName={pkg.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}