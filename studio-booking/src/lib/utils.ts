import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fungsi helper untuk merge Tailwind class dengan aman
// Contoh: cn("px-4 py-2", isActive && "bg-blue-500", className)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format harga ke Rupiah
// Contoh: formatRupiah(150000) → "Rp 150.000"
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format durasi dari menit ke string
// Contoh: formatDuration(90) → "1 jam 30 menit"
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} menit`;
  if (mins === 0) return `${hours} jam`;
  return `${hours} jam ${mins} menit`;
}
