"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"] as const;
type Status = (typeof statuses)[number];

const statusLabel: Record<Status, string> = {
  PENDING: "Pending",
  CONFIRMED: "Konfirmasi",
  DONE: "Selesai",
  CANCELLED: "Batal",
};

const statusStyle: Record<Status, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  DONE: "bg-stone-100 text-stone-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function BookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus as Status);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: Status) => {
    if (newStatus === status) return;
    setLoading(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setLoading(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={loading}
      className={cn(
        "text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400",
        statusStyle[status]
      )}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {statusLabel[s]}
        </option>
      ))}
    </select>
  );
}
