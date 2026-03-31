"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingSchema, type BookingSchema } from "@/lib/validations";
import { formatRupiah, formatDuration, cn } from "@/lib/utils";
import TimeSlotPicker from "./TimeSlotPicker";
import type { Package } from "@/types";

type Props = { packages: Package[] };

export default function BookingForm({ packages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultPackageId = searchParams.get("packageId") ?? "";
  const defaultTierId = searchParams.get("tierId") ?? "";

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { packageId: defaultPackageId, tierId: defaultTierId },
  });

  const watchPackageId = watch("packageId");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");
  const selectedPackage = packages.find((p) => p.id === watchPackageId);

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
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
      router.push(`/booking/konfirmasi?id=${json.data.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-14">

      {/* Step 1 */}
      <div className="space-y-4">
        <StepLabel number="01" label="Pilih Paket" />
        <div className="space-y-2">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => { setValue("packageId", pkg.id, { shouldValidate: true }); setValue("tierId", ""); }}
              className={cn(
                "w-full text-left px-5 py-4 border transition-all duration-200 flex items-center justify-between",
                watchPackageId === pkg.id
                  ? "border-black bg-black text-white"
                  : "border-black/10 hover:border-black"
              )}
            >
              <div>
                <p className={`font-cinzel text-sm tracking-wide ${watchPackageId === pkg.id ? "text-white" : "text-black"}`}>
                  {pkg.name.toUpperCase()}
                </p>
                <p className={`text-xs mt-0.5 ${watchPackageId === pkg.id ? "text-white/50" : "text-black/40"}`}>
                  {pkg.category.name}
                </p>
              </div>
              {watchPackageId === pkg.id && (
                <span className="font-cinzel text-[10px] tracking-widest text-accent">Selected</span>
              )}
            </button>
          ))}
        </div>
        {errors.packageId && <FieldError msg={errors.packageId.message} />}
      </div>

      {/* Step 2 */}
      {selectedPackage && (
        <div className="space-y-4">
          <StepLabel number="02" label="Pilih Tier" />
          <div className="space-y-2">
            {selectedPackage.tiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setValue("tierId", tier.id, { shouldValidate: true })}
                className={cn(
                  "w-full text-left px-5 py-4 border transition-all duration-200",
                  watch("tierId") === tier.id
                    ? "border-black bg-black text-white"
                    : "border-black/10 hover:border-black"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-cinzel text-sm tracking-wide ${watch("tierId") === tier.id ? "text-white" : "text-black"}`}>
                      {tier.name.toUpperCase()}
                    </p>
                    <p className={`text-xs mt-0.5 ${watch("tierId") === tier.id ? "text-white/50" : "text-black/40"}`}>
                      {formatDuration(tier.duration)}
                    </p>
                  </div>
                  <p className="font-cinzel text-accent text-sm">{formatRupiah(tier.price)}</p>
                </div>
                <ul className={`mt-3 space-y-1 ${watch("tierId") === tier.id ? "block" : "hidden"}`}>
                  {tier.includes.map((item) => (
                    <li key={item} className="text-xs text-white/60 flex gap-2">
                      <span className="text-accent">—</span>{item}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          {errors.tierId && <FieldError msg={errors.tierId.message} />}
        </div>
      )}

      {/* Step 3 */}
      <div className="space-y-4">
        <StepLabel number="03" label="Pilih Tanggal" />
        <input
          type="date"
          min={minDate}
          max={maxDateStr}
          {...register("date")}
          className="border border-black/10 focus:border-black px-4 py-3 text-sm font-cinzel tracking-wide text-black focus:outline-none transition-colors w-full sm:w-auto"
        />
        {errors.date && <FieldError msg={errors.date.message} />}
      </div>

      {/* Step 4 */}
      {watchDate && (
        <div className="space-y-4">
          <StepLabel number="04" label="Pilih Jam" />
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

      {/* Step 5 */}
      <div className="space-y-4">
        <StepLabel number="05" label="Data Diri" />
        <div className="space-y-3">
          {[
            { name: "clientName" as const, label: "Nama Lengkap", placeholder: "Nama Kamu", type: "text" },
            { name: "clientPhone" as const, label: "Nomor WhatsApp", placeholder: "081234567890", type: "tel" },
            { name: "clientEmail" as const, label: "Email", placeholder: "kamu@email.com", type: "email" },
          ].map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/40">
                {field.label}
              </label>
              <input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors"
              />
              {errors[field.name] && <FieldError msg={errors[field.name]?.message} />}
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/40">
              Catatan <span className="text-black/20">(opsional)</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Ada permintaan khusus?"
              rows={3}
              className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {submitError && (
        <p className="text-red-500 text-xs font-cinzel tracking-widest uppercase border border-red-200 px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-black hover:bg-accent disabled:bg-black/20 text-white font-cinzel text-xs tracking-[0.3em] uppercase py-4 transition-all duration-300"
      >
        {submitting ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
}

function StepLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 pb-2 border-b border-black/5">
      <span className="font-cinzel text-[10px] text-accent tracking-widest">{number}</span>
      <h3 className="font-cinzel text-sm tracking-[0.2em] uppercase text-black">{label}</h3>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-[10px] font-cinzel tracking-widest uppercase mt-1">{msg}</p>;
}