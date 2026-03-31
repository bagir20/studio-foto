"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"] as const;
type Status = (typeof statuses)[number];

const statusConfig: Record<Status, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  DONE: { label: "Done", className: "bg-stone-100 text-stone-500" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
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
        "font-cinzel text-[10px] tracking-widest uppercase px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black",
        statusConfig[status].className
      )}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{statusConfig[s].label}</option>
      ))}
    </select>
  );
}