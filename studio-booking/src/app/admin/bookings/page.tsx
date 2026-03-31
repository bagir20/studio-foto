import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import BookingActions from "./BookingActions";

async function getBookings() {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: true, tier: true },
  });
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    done: bookings.filter((b) => b.status === "DONE").length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase">Manajemen</p>
        <h1 className="font-cinzel text-3xl text-stone-900 mt-1">Bookings</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Semua", value: counts.all },
          { label: "Pending", value: counts.pending, accent: true },
          { label: "Confirmed", value: counts.confirmed },
          { label: "Done", value: counts.done },
        ].map((s) => (
          <div key={s.label} className={`p-5 border ${s.accent ? "bg-[#0f0f0f] border-[#0f0f0f]" : "bg-white border-stone-200"}`}>
            <p className={`font-cinzel text-3xl ${s.accent ? "text-accent" : "text-stone-900"}`}>{s.value}</p>
            <p className={`font-cinzel text-[10px] tracking-widest uppercase mt-1 ${s.accent ? "text-white/50" : "text-stone-400"}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="font-cinzel text-xs tracking-widest uppercase text-stone-900">Semua Booking</p>
        </div>
        {bookings.length === 0 ? (
          <p className="px-6 py-12 text-center font-cinzel text-xs tracking-widest uppercase text-stone-300">
            Belum ada booking
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100">
                <tr>
                  {["Klien", "Paket", "Jadwal", "Harga", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 font-cinzel text-[10px] tracking-widest uppercase text-stone-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-cinzel text-xs tracking-wide text-stone-900">{b.clientName}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{b.clientPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-stone-700 text-xs">{b.package.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{b.tier.name}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-600">
                      {new Date(b.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      <span className="text-stone-400"> · {b.timeSlot}</span>
                    </td>
                    <td className="px-6 py-4 font-cinzel text-xs text-stone-700">
                      {formatRupiah(b.tier.price)}
                    </td>
                    <td className="px-6 py-4">
                      <BookingActions bookingId={b.id} currentStatus={b.status} />
                    </td>
                    <td className="px-6 py-4">
                      {/* ✅ PERBAIKAN: Tambahkan <a di baris ini */}
                      <a
                        href={`https://wa.me/${b.clientPhone.replace(/\D/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-cinzel text-[10px] tracking-widest uppercase text-accent hover:underline"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}