import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

async function getStats() {
  const [totalBookings, pendingBookings, totalPackages, recentBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.package.count({ where: { isActive: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { package: true, tier: true },
      }),
    ]);
  return { totalBookings, pendingBookings, totalPackages, recentBookings };
}

export default async function AdminDashboard() {
  const { totalBookings, pendingBookings, totalPackages, recentBookings } =
    await getStats();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Selamat datang kembali!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Booking" value={totalBookings} />
        <StatCard label="Menunggu Konfirmasi" value={pendingBookings} highlight />
        <StatCard label="Paket Aktif" value={totalPackages} />
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Booking Terbaru</h2>
          <a href="/admin/bookings" className="text-amber-600 text-sm hover:underline">
            Lihat semua →
          </a>
        </div>
        <div className="divide-y divide-stone-50">
          {recentBookings.length === 0 ? (
            <p className="px-6 py-8 text-center text-stone-400 text-sm">Belum ada booking</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 truncate">{b.clientName}</p>
                  <p className="text-stone-500 text-xs">
                    {b.package.name} — {b.tier.name} &middot;{" "}
                    {new Date(b.date).toLocaleDateString("id-ID")} {b.timeSlot}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-semibold text-stone-700">
                    {formatRupiah(b.tier.price)}
                  </p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border ${highlight ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200"}`}>
      <p className="text-3xl font-bold text-stone-900">{value}</p>
      <p className={`text-sm mt-1 ${highlight ? "text-amber-700" : "text-stone-500"}`}>{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    DONE: "bg-stone-100 text-stone-600",
  };
  const label: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Konfirmasi",
    CANCELLED: "Batal",
    DONE: "Selesai",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? "bg-stone-100 text-stone-600"}`}>
      {label[status] ?? status}
    </span>
  );
}
