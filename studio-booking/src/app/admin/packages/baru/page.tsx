import { prisma } from "@/lib/prisma";
import PackageForm from "@/components/admin/PackageForm";

export default async function NewPackagePage() {
  const categories = await prisma.packageCategory.findMany();
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Tambah Paket Baru</h1>
      <PackageForm categories={categories} />
    </div>
  );
}
