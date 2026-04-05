import { z } from "zod";

// Schema validasi form booking
// Zod = pengganti Joi/express-validator di Node.js, tapi lebih TypeScript-friendly
export const bookingSchema = z.object({
  clientName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang"),

  clientEmail: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),

  clientPhone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP terlalu panjang")
    .regex(/^[0-9+\-\s()]+$/, "Nomor HP tidak valid"),

  packageId: z
    .string()
    .min(1, "Pilih paket terlebih dahulu"),

  tierId: z
    .string()
    .min(1, "Pilih tier paket terlebih dahulu"),

  date: z
    .string()
    .min(1, "Pilih tanggal"),

  timeSlot: z
    .string()
    .min(1, "Pilih jam sesi"),

  notes: z
    .string()
    .max(500, "Catatan maksimal 500 karakter")
    .optional(),
});

// TypeScript type otomatis dari schema — tidak perlu define ulang!
export type BookingSchema = z.infer<typeof bookingSchema>;
