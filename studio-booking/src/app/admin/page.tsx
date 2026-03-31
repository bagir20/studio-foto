import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

async function getStats() {
  const [totalBookings, pendingBookings, confirmedBookings, totalPackages, recentBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.package.count({ where: { isActive: true } }),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { package: true, tier: true },
      }),
    ]);
  return { totalBookings, pendingBookings, confirmedBookings, totalPackages, recentBookings };
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  DONE: { label: "Done", className: "bg-stone-100 text-stone-500" },
};

export default async function AdminDashboard() {
  const { totalBookings, pendingBookings, confirmedBookings, totalPackages, recentBookings } =
    await getStats();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase">Overview</p>
        <h1 className="font-cinzel text-3xl text-stone-900 mt-1">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Booking", value: totalBookings, sub: "Semua waktu" },
          { label: "Pending", value: pendingBookings, sub: "Butuh konfirmasi", accent: true },
          { label: "Confirmed", value: confirmedBookings, sub: "Terjadwal" },
          { label: "Paket Aktif", value: totalPackages, sub: "Ditampilkan" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-6 border ${stat.accent ? "bg-[#0f0f0f] border-[#0f0f0f]" : "bg-white border-stone-200"}`}
          >
            <p className={`font-cinzel text-4xl font-bold ${stat.accent ? "text-accent" : "text-stone-900"}`}>
              {stat.value}
            </p>
            <p className={`font-cinzel text-xs tracking-widest uppercase mt-2 ${stat.accent ? "text-white/60" : "text-stone-400"}`}>
              {stat.label}
            </p>
            <p className={`text-xs mt-1 ${stat.accent ? "text-white/30" : "text-stone-300"}`}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900">
            Booking Terbaru
          </p>
          <Link
            href="/admin/bookings"
            className="font-cinzel text-[10px] tracking-widest uppercase text-accent hover:underline"
          >
            Lihat semua →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="px-6 py-12 text-center font-cinzel text-xs tracking-widest uppercase text-stone-300">
            Belum ada booking
          </p>
        ) : (
          <div className="divide-y divide-stone-50">
            {recentBookings.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-cinzel text-sm text-stone-900 tracking-wide">{b.clientName}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {b.package.name} · {b.tier.name} ·{" "}
                    {new Date(b.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}{" "}
                    {b.timeSlot}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="font-cinzel text-sm text-stone-700 hidden sm:block">
                    {formatRupiah(b.tier.price)}
                  </p>
                  <span className={`font-cinzel text-[10px] tracking-widest uppercase px-3 py-1 ${statusConfig[b.status]?.className}`}>
                    {statusConfig[b.status]?.label}
                  </span>
                  {/* ✅ PERBAIKAN: Tambahkan tag <a> yang benar */}
                  <a
                    href={`https://wa.me/${b.clientPhone.replace(/\D/g, "").replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-cinzel text-[10px] tracking-widest uppercase text-accent hover:underline"
                  >
                    WA
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/packages/baru", label: "Tambah Paket Baru", desc: "Buat paket foto baru" },
          { href: "/admin/gallery", label: "Upload Foto Gallery", desc: "Tambah foto ke gallery" },
          { href: "/admin/bookings", label: "Kelola Bookings", desc: "Lihat & update status" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="border border-stone-200 bg-white p-6 hover:border-black hover:bg-[#0f0f0f] group transition-all duration-300"
          >
            <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900 group-hover:text-white transition-colors">
              {action.label}
            </p>
            <p className="text-stone-400 group-hover:text-white/40 text-xs mt-2 transition-colors">
              {action.desc}
            </p>
            <span className="font-cinzel text-[10px] tracking-widest uppercase text-accent mt-4 block">
              Buka →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}