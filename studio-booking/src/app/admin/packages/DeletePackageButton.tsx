"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePackageButton({
  packageId,
  packageName,
}: {
  packageId: string;
  packageName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus paket "${packageName}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    await fetch(`/api/admin/packages/${packageId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-200 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Hapus"}
    </button>
  );
}
