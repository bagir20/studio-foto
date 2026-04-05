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
  const watchTierId = watch("tierId");
  const selectedPackage = packages.find((p) => p.id === watchPackageId);
  const selectedTier = selectedPackage?.tiers.find((t) => t.id === watchTierId);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">

      {/* ── STEP 1: Pilih Paket ── */}
      <FormSection number="01" label="Pilih Paket">
        <select
          value={watchPackageId}
          onChange={(e) => {
            setValue("packageId", e.target.value, { shouldValidate: true });
            setValue("tierId", "");
          }}
          className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm font-cinzel tracking-wide text-black focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
        >
          <option value="" disabled>— Pilih paket —</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} · {pkg.category.name}
            </option>
          ))}
        </select>
        {errors.packageId && <FieldError msg={errors.packageId.message} />}
      </FormSection>

      {/* ── STEP 2: Pilih Tier ── */}
      {selectedPackage && (
        <FormSection number="02" label="Pilih Paket Harga">
          <select
            value={watchTierId}
            onChange={(e) => setValue("tierId", e.target.value, { shouldValidate: true })}
            className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm font-cinzel tracking-wide text-black focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
          >
            <option value="" disabled>— Pilih harga —</option>
            {selectedPackage.tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name} · {formatDuration(tier.duration)} · {formatRupiah(tier.price)}
              </option>
            ))}
          </select>

          {/* Detail tier yang dipilih */}
          {selectedTier && selectedTier.includes.length > 0 && (
            <div className="mt-3 border border-black/6 px-4 py-3 bg-stone-50">
              <p className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-black/30 mb-2">Sudah termasuk</p>
              <ul className="space-y-1">
                {selectedTier.includes.map((item) => (
                  <li key={item} className="text-[11px] text-black/50 flex gap-2 items-start">
                    <span className="text-accent mt-0.5 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors.tierId && <FieldError msg={errors.tierId.message} />}
        </FormSection>
      )}

      {/* ── STEP 3: Tanggal & Jam ── */}
      <FormSection number="03" label="Pilih Jadwal">
        <div className="space-y-4">
          <div>
            <label className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/35 mb-2 block">Tanggal</label>
            <input
              type="date"
              min={minDate}
              max={maxDateStr}
              {...register("date")}
              className="border border-black/10 focus:border-black px-4 py-3 text-sm font-cinzel tracking-wide text-black focus:outline-none transition-colors w-full"
            />
            {errors.date && <FieldError msg={errors.date.message} />}
          </div>

          {watchDate && (
            <div>
              <label className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/35 mb-2 block">Jam Sesi</label>
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
        </div>
      </FormSection>

      {/* ── STEP 4: Data Diri ── */}
      <FormSection number="04" label="Data Diri">
        <div className="space-y-3">
          <FormField
            label="Nama Lengkap"
            placeholder="Nama kamu"
            type="text"
            registration={register("clientName")}
            error={errors.clientName?.message}
          />
          <FormField
            label="Nomor WhatsApp"
            placeholder="081234567890"
            type="tel"
            registration={register("clientPhone")}
            error={errors.clientPhone?.message}
          />
          <FormField
            label="Email (opsional)"
            placeholder="kamu@email.com"
            type="email"
            registration={register("clientEmail")}
            error={errors.clientEmail?.message}
          />
          <div>
            <label className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/35 mb-2 block">
              Catatan{" "}
              <span className="text-black/20 normal-case tracking-normal font-sans text-[10px]">(opsional)</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Ada permintaan khusus?"
              rows={2}
              className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </FormSection>

      {/* ── RINGKASAN ── */}
      {(selectedPackage || selectedTier || watchDate) && (
        <div className="mx-6 mb-6 border border-black/8 p-4 bg-stone-50 space-y-2">
          <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/30 mb-3">Ringkasan Pesanan</p>
          {selectedPackage && <SummaryRow label="Paket" value={selectedPackage.name} />}
          {selectedTier && (
            <>
              <SummaryRow label="Tier" value={selectedTier.name} />
              <SummaryRow label="Durasi" value={formatDuration(selectedTier.duration)} />
              <SummaryRow label="Harga" value={formatRupiah(selectedTier.price)} accent />
            </>
          )}
          {watchDate && (
            <SummaryRow
              label="Tanggal"
              value={new Date(watchDate).toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            />
          )}
          {watchTimeSlot && <SummaryRow label="Jam" value={watchTimeSlot} />}
        </div>
      )}

      {submitError && (
        <div className="mx-6 mb-4 border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-400 text-[10px] font-cinzel tracking-widest uppercase">{submitError}</p>
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="px-6 pb-10">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black hover:bg-accent disabled:bg-black/20 text-white font-cinzel text-[10px] tracking-[0.4em] uppercase py-4 transition-all duration-300"
        >
          {submitting ? "Memproses..." : "Konfirmasi Booking"}
        </button>
        <p className="text-center text-[10px] text-black/25 mt-3 font-light">
          Kami akan konfirmasi via WhatsApp dalam 1×24 jam
        </p>
      </div>

    </form>
  );
}

// ── Sub components ──

function FormSection({ number, label, children }: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/5 px-6 py-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-cinzel text-[9px] text-accent tracking-widest">{number}</span>
        <h3 className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-black">{label}</h3>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, placeholder, type, registration, error }: {
  label: string;
  placeholder: string;
  type: string;
  registration: object;
  error?: string;
}) {
  return (
    <div>
      <label className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/35 mb-2 block">{label}</label>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors"
      />
      {error && <FieldError msg={error} />}
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-black/35 font-cinzel tracking-wider uppercase">{label}</span>
      <span className={cn("text-[11px] font-cinzel tracking-wide", accent ? "text-accent" : "text-black/70")}>
        {value}
      </span>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-[10px] font-cinzel tracking-widest uppercase mt-1.5">{msg}</p>;
}