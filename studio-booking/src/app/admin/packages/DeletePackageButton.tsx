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
    if (!confirm(`Hapus paket "${packageName}"?`)) return;
    setLoading(true);
    await fetch(`/api/admin/packages/${packageId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-cinzel text-[10px] tracking-widest uppercase text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-4 py-2 transition-all disabled:opacity-50"
    >
      {loading ? "..." : "Hapus"}
    </button>
  );
}