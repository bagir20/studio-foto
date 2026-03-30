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

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Bookings</h1>
        <p className="text-stone-500 text-sm mt-1">{bookings.length} total booking</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {bookings.length === 0 ? (
          <p className="px-6 py-12 text-center text-stone-400">Belum ada booking</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {["Nama", "Paket", "Tanggal & Jam", "Harga", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-stone-900">{b.clientName}</p>
                      <p className="text-stone-400 text-xs">{b.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-stone-700">{b.package.name}</p>
                      <p className="text-stone-400 text-xs">{b.tier.name}</p>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {new Date(b.date).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                      <span className="text-stone-400"> · {b.timeSlot}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-700">
                      {formatRupiah(b.tier.price)}
                    </td>
                    <td className="px-5 py-4">
                      <BookingActions bookingId={b.id} currentStatus={b.status} />
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`https://wa.me/${b.clientPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-green-600 hover:underline"
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
