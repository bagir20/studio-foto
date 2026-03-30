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
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Paket Foto</h1>
          <p className="text-stone-500 text-sm mt-1">{packages.length} paket</p>
        </div>
        <Link
          href="/admin/packages/baru"
          className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          + Tambah Paket
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {packages.length === 0 ? (
          <p className="px-6 py-12 text-center text-stone-400">Belum ada paket. Tambahkan yang pertama!</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {packages.map((pkg) => (
              <div key={pkg.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900">{pkg.name}</p>
                    {!pkg.isActive && (
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs mt-0.5">{pkg.category.name}</p>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  {pkg.tiers.map((t) => (
                    <span key={t.id} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                      {t.name}: {formatRupiah(t.price)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
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
