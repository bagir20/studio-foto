import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PackageForm from "@/components/admin/PackageForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params;
  const [pkg, categories] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: { tiers: { orderBy: { price: "asc" } } },
    }),
    prisma.packageCategory.findMany(),
  ]);

  if (!pkg) notFound();

  const initialData = {
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    description: pkg.description ?? "",
    coverImage: pkg.coverImage,
    isActive: pkg.isActive,
    categoryId: pkg.categoryId,
    tiers: pkg.tiers.map((t) => ({
      name: t.name,
      price: String(t.price),
      duration: String(t.duration),
      includes: t.includes.join("\n"),
    })),
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Edit: {pkg.name}</h1>
      <PackageForm categories={categories} initialData={initialData} />
    </div>
  );
}
