"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingSchema, type BookingSchema } from "@/lib/validations";
import { formatRupiah, formatDuration, cn } from "@/lib/utils";
import TimeSlotPicker from "./TimeSlotPicker";
import type { Package } from "@/types";

type Props = {
  packages: Package[];
};

export default function BookingForm({ packages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil packageId & tierId dari URL kalau ada (dari tombol "Pilih" di halaman paket)
  const defaultPackageId = searchParams.get("packageId") ?? "";
  const defaultTierId = searchParams.get("tierId") ?? "";

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageId: defaultPackageId,
      tierId: defaultTierId,
    },
  });

  const watchPackageId = watch("packageId");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");

  // Paket yang sedang dipilih
  const selectedPackage = packages.find((p) => p.id === watchPackageId);

  // Fetch slot terbooked saat tanggal berubah
  useEffect(() => {
    if (!watchDate) return;
    setLoadingSlots(true);
    setBookedSlots([]);
    setValue("timeSlot", "");

    fetch(`/api/booking?date=${watchDate}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.bookedSlots ?? []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [watchDate, setValue]);

  // Tanggal minimum = besok
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Tanggal maksimum = 3 bulan ke depan
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const onSubmit = async (data: BookingSchema) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan");

      // Redirect ke halaman konfirmasi
      router.push(`/booking/konfirmasi?id=${json.data.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* ── Step 1: Pilih Paket ── */}
      <div className="space-y-4">
        <StepLabel number={1} label="Pilih paket" />
        <div className="grid sm:grid-cols-2 gap-3">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => {
                setValue("packageId", pkg.id, { shouldValidate: true });
                setValue("tierId", "");
              }}
              className={cn(
                "text-left p-4 rounded-xl border-2 transition-all duration-200",
                watchPackageId === pkg.id
                  ? "border-amber-400 bg-amber-50"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              )}
            >
              <p className="font-semibold text-stone-900">{pkg.name}</p>
              <p className="text-xs text-stone-400 mt-0.5">{pkg.category.name}</p>
            </button>
          ))}
        </div>
        {errors.packageId && <FieldError msg={errors.packageId.message} />}
      </div>

      {/* ── Step 2: Pilih Tier ── */}
      {selectedPackage && (
        <div className="space-y-4">
          <StepLabel number={2} label="Pilih tier" />
          <div className="space-y-3">
            {selectedPackage.tiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setValue("tierId", tier.id, { shouldValidate: true })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  watch("tierId") === tier.id
                    ? "border-amber-400 bg-amber-50"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{tier.name}</p>
                    <p className="text-xs text-stone-400">{formatDuration(tier.duration)}</p>
                  </div>
                  <p className="font-bold text-amber-600">{formatRupiah(tier.price)}</p>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-xs text-stone-500 flex gap-1.5">
                      <span className="text-amber-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          {errors.tierId && <FieldError msg={errors.tierId.message} />}
        </div>
      )}

      {/* ── Step 3: Pilih Tanggal ── */}
      <div className="space-y-4">
        <StepLabel number={3} label="Pilih tanggal" />
        <input
          type="date"
          min={minDate}
          max={maxDateStr}
          {...register("date")}
          className="w-full sm:w-auto border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        {errors.date && <FieldError msg={errors.date.message} />}
      </div>

      {/* ── Step 4: Pilih Jam ── */}
      {watchDate && (
        <div className="space-y-4">
          <StepLabel number={4} label="Pilih jam sesi" />
          <TimeSlotPicker
            selectedDate={watchDate}
            selectedSlot={watchTimeSlot ?? ""}
            bookedSlots={bookedSlots}
            onSelect={(slot) => setValue("timeSlot", slot, { shouldValidate: true })}
            loading={loadingSlots}
          />
          {errors.timeSlot && <FieldError msg={errors.timeSlot.message} />}
        </div>
      )}

      {/* ── Step 5: Data diri ── */}
      <div className="space-y-4">
        <StepLabel number={5} label="Data diri" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">Nama lengkap</label>
            <input
              {...register("clientName")}
              placeholder="Nama Kamu"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {errors.clientName && <FieldError msg={errors.clientName.message} />}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-700">Nomor WhatsApp</label>
            <input
              {...register("clientPhone")}
              placeholder="081234567890"
              type="tel"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {errors.clientPhone && <FieldError msg={errors.clientPhone.message} />}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-stone-700">Email</label>
            <input
              {...register("clientEmail")}
              placeholder="kamu@email.com"
              type="email"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {errors.clientEmail && <FieldError msg={errors.clientEmail.message} />}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-stone-700">
              Catatan <span className="text-stone-400 font-normal">(opsional)</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Ada permintaan khusus? Tulis di sini..."
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
            {errors.notes && <FieldError msg={errors.notes.message} />}
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 font-bold py-4 rounded-xl transition-all duration-200 text-lg"
      >
        {submitting ? "Memproses..." : "Konfirmasi Booking"}
      </button>
    </form>
  );
}

// ── Helpers ──────────────────────────────────────────────

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <h3 className="font-semibold text-stone-900">{label}</h3>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}
