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

function getActiveStep(
  watchPackageId: string,
  watchTierId: string,
  watchDate: string,
  watchTimeSlot: string
) {
  if (!watchPackageId) return 1;
  if (!watchTierId) return 2;
  if (!watchDate || !watchTimeSlot) return 3;
  return 4;
}

// Format "081234567890" → "0812-3456-7890"
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}

function unformatPhone(formatted: string) {
  return formatted.replace(/\D/g, "");
}

export default function BookingForm({ packages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultPackageId = searchParams.get("packageId") ?? "";
  const defaultTierId = searchParams.get("tierId") ?? "";

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  // Track which step user manually opened via "Ubah"
  const [manualStep, setManualStep] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { packageId: defaultPackageId, tierId: defaultTierId },
  });

  const watchPackageId = watch("packageId");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");
  const watchTierId = watch("tierId");
  const watchClientName = watch("clientName");
  const watchClientPhone = watch("clientPhone");

  const selectedPackage = packages.find((p) => p.id === watchPackageId);
  const selectedTier = selectedPackage?.tiers.find((t) => t.id === watchTierId);
  const autoStep = getActiveStep(watchPackageId, watchTierId, watchDate, watchTimeSlot);
  const activeStep = manualStep ?? autoStep;

  // Clear manual override once progress naturally passes it
  useEffect(() => {
    if (manualStep !== null && autoStep > manualStep) {
      setManualStep(null);
    }
  }, [autoStep, manualStep]);

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

const today = new Date();
const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const isFormReady =
    !!watchPackageId &&
    !!watchTierId &&
    !!watchDate &&
    !!watchTimeSlot &&
    !!watchClientName?.trim() &&
    !!watchClientPhone?.trim();

  const missingFields = [
    !watchPackageId && "paket",
    !watchTierId && "harga",
    !watchDate && "tanggal",
    !watchTimeSlot && "jam sesi",
    !watchClientName?.trim() && "nama",
    !watchClientPhone?.trim() && "nomor WhatsApp",
  ].filter(Boolean) as string[];

  const onSubmit = async (data: BookingSchema) => {
    setSubmitting(true);
    setSubmitError("");
    const payload = { ...data, clientPhone: unformatPhone(data.clientPhone) };
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      {/* ── Progress Bar ── */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-0">
          {[1, 2, 3, 4].map((step, i) => {
            const isDone = autoStep > step;
            const isActive = activeStep === step;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-cinzel shrink-0 transition-all duration-300",
                    isDone
                      ? "bg-black text-white"
                      : isActive
                      ? "bg-black text-white ring-4 ring-black/10"
                      : "bg-white border border-black/30 text-black/50"
                  )}
                >
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    `0${step}`
                  )}
                </div>
                {i < 3 && (
                  <div className={cn(
                    "h-[1px] flex-1 mx-1 transition-all duration-500",
                    autoStep > step + 1 ? "bg-black" : autoStep > step ? "bg-black/60" : "bg-black/10"
                  )} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {["Paket", "Harga", "Jadwal", "Data"].map((label, i) => (
            <span
              key={label}
              className={cn(
                "text-[8px] font-cinzel tracking-widest uppercase transition-colors",
                activeStep === i + 1 ? "text-black" : autoStep > i + 1 ? "text-black/50" : "text-black/25"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Pilih Paket ── */}
      <FormSection
        number="01"
        label="Pilih Paket"
        isActive={activeStep === 1}
        isDone={autoStep > 1}
        summary={selectedPackage ? `${selectedPackage.name} · ${selectedPackage.category.name}` : undefined}
        onEdit={() => {
          setManualStep(1);
          setValue("packageId", "");
          setValue("tierId", "");
          setValue("date", "");
          setValue("timeSlot", "");
          setBookedSlots([]);
        }}
      >
        <SelectWrapper>
          <select
            value={watchPackageId}
            onChange={(e) => {
              setValue("packageId", e.target.value, { shouldValidate: true });
              setValue("tierId", "");
              setManualStep(null);
            }}
            className={cn(
              "w-full border px-4 py-3 pr-10 text-sm font-cinzel tracking-wide focus:outline-none transition-colors bg-white appearance-none cursor-pointer",
              errors.packageId
                ? "border-red-400 focus:border-red-500"
                : watchPackageId
                ? "border-black text-black"
                : "border-black/30 text-black/60 focus:border-black"
            )}
          >
            <option value="" disabled>— Pilih paket —</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} · {pkg.category.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </SelectWrapper>
        {errors.packageId && <FieldError msg={errors.packageId.message} />}
      </FormSection>

      {/* ── STEP 2: Pilih Tier ── */}
      {selectedPackage && (
        <FormSection
          number="02"
          label="Pilih Paket Harga"
          isActive={activeStep === 2}
          isDone={autoStep > 2}
          summary={
            selectedTier
              ? `${selectedTier.name} · ${formatDuration(selectedTier.duration)} · ${formatRupiah(selectedTier.price)}`
              : undefined
          }
          onEdit={() => {
            setManualStep(2);
            setValue("tierId", "");
            setValue("date", "");
            setValue("timeSlot", "");
            setBookedSlots([]);
          }}
        >
          <SelectWrapper>
            <select
              value={watchTierId}
              onChange={(e) => {
                setValue("tierId", e.target.value, { shouldValidate: true });
                setManualStep(null);
              }}
              className={cn(
                "w-full border px-4 py-3 pr-10 text-sm font-cinzel tracking-wide focus:outline-none transition-colors bg-white appearance-none cursor-pointer",
                errors.tierId
                  ? "border-red-400 focus:border-red-500"
                  : watchTierId
                  ? "border-black text-black"
                  : "border-black/30 text-black/60 focus:border-black"
              )}
            >
              <option value="" disabled>— Pilih harga —</option>
              {selectedPackage.tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name} · {formatDuration(tier.duration)} · {formatRupiah(tier.price)}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </SelectWrapper>

          {selectedTier && selectedTier.includes.length > 0 && (
            <div className="mt-3 border border-black/10 px-4 py-3 bg-stone-50">
              <p className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-black/50 mb-2">Sudah termasuk</p>
              <ul className="space-y-1">
                {selectedTier.includes.map((item) => (
                  <li key={item} className="text-[11px] text-black/60 flex gap-2 items-start">
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
      <FormSection
        number="03"
        label="Pilih Jadwal"
        isActive={activeStep === 3}
        isDone={autoStep > 3}
        summary={
          watchDate && watchTimeSlot
            ? `${new Date(watchDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })} · ${watchTimeSlot}`
            : undefined
        }
        onEdit={() => {
          setManualStep(3);
          setValue("date", "");
          setValue("timeSlot", "");
          setBookedSlots([]);
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/60 mb-2 block font-medium">
              Tanggal
            </label>
            <input
              type="date"
              min={minDate}
              max={maxDateStr}
              {...register("date")}
              className={cn(
                "border px-4 py-3 text-sm font-cinzel tracking-wide focus:outline-none transition-colors w-full",
                errors.date
                  ? "border-red-400 text-black"
                  : watchDate
                  ? "border-black text-black"
                  : "border-black/30 text-black/50 focus:border-black"
              )}
            />
            {errors.date && <FieldError msg={errors.date.message} />}
          </div>

          {watchDate && (
            <div>
              <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/60 mb-2 block font-medium">
                Jam Sesi
              </label>
              <TimeSlotPicker
                selectedDate={watchDate}
                selectedSlot={watchTimeSlot ?? ""}
                bookedSlots={bookedSlots}
                onSelect={(slot) => {
                  setValue("timeSlot", slot, { shouldValidate: true });
                  setManualStep(null);
                }}
                loading={loadingSlots}
              />
              {errors.timeSlot && <FieldError msg={errors.timeSlot.message} />}
            </div>
          )}
        </div>
      </FormSection>

      {/* ── STEP 4: Data Diri ── */}
      <FormSection
        number="04"
        label="Data Diri"
        isActive={activeStep === 4}
        isDone={false}
      >
        <div className="space-y-3">
          <FormField
            label="Nama Lengkap"
            placeholder="Nama kamu"
            type="text"
            registration={register("clientName")}
            error={errors.clientName?.message}
            required
          />

          {/* Phone — handled manually for auto-format */}
          <div>
            <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/60 mb-2 flex items-center gap-1.5 font-medium">
              Nomor WhatsApp
              <span className="text-accent text-xs leading-none">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="0812-3456-7890"
              value={phoneDisplay}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setPhoneDisplay(formatted);
                setValue("clientPhone", unformatPhone(formatted), { shouldValidate: true });
              }}
              className={cn(
                "w-full border px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors",
                errors.clientPhone ? "border-red-400 bg-red-50/50" : "border-black/30 focus:border-black"
              )}
            />
            {!errors.clientPhone && (
              <p className="text-[10px] text-black/60 mt-1.5 font-light">
                Konfirmasi booking akan dikirim ke nomor ini
              </p>
            )}
            {errors.clientPhone && <FieldError msg={errors.clientPhone.message} />}
          </div>

          <FormField
            label="Email"
            placeholder="kamu@email.com"
            type="email"
            registration={register("clientEmail")}
            error={errors.clientEmail?.message}
            optional
          />
          <div>
            <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/60 mb-2 block font-medium">
              Catatan{" "}
              <span className="text-black/35 normal-case tracking-normal font-sans text-[10px] font-normal">(opsional)</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Ada permintaan khusus? Contoh: tema foto, outfit, dll."
              rows={3}
              className="w-full border border-black/30 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/50 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </FormSection>

      {/* ── RINGKASAN ── */}
      {(selectedPackage || selectedTier || watchDate) && (
        <div className="mx-6 mb-6 border border-black/15 p-4 bg-stone-50 space-y-2.5">
          <p className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-black/70 mb-3 font-medium">
            Ringkasan Pesanan
          </p>
          {selectedPackage && <SummaryRow label="Paket" value={selectedPackage.name} />}
          {selectedTier && (
            <>
              <SummaryRow label="Tier" value={selectedTier.name} />
              <SummaryRow label="Durasi" value={formatDuration(selectedTier.duration)} />
              <div className="border-t border-black/8 pt-2 mt-2">
                <SummaryRow label="Total" value={formatRupiah(selectedTier.price)} accent />
              </div>
            </>
          )}
          {watchDate && (
            <SummaryRow
              label="Tanggal"
              value={new Date(watchDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
          {watchTimeSlot && <SummaryRow label="Jam" value={watchTimeSlot} />}
        </div>
      )}

      {submitError && (
        <div className="mx-6 mb-4 border border-red-300 bg-red-50 px-4 py-3 flex gap-2 items-start">
          <span className="text-red-400 text-lg leading-none mt-0.5">!</span>
          <p className="text-red-600 text-[11px] font-cinzel tracking-widest uppercase">{submitError}</p>
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="px-6 pb-10">
        <div className="relative group">
          <button
            type="submit"
            disabled={submitting || !isFormReady}
            className="w-full bg-black hover:bg-accent disabled:bg-black/30 disabled:cursor-not-allowed text-white font-cinzel text-[11px] tracking-[0.4em] uppercase py-4 transition-all duration-300 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              "Konfirmasi Booking"
            )}
          </button>

          {/* Tooltip — muncul saat hover tombol disabled */}
          {!isFormReady && !submitting && missingFields.length > 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] bg-black/80 text-white px-3 py-2 text-[9px] font-cinzel tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center leading-relaxed">
              Lengkapi: {missingFields.join(", ")}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-black/45 mt-3 font-light">
          Kami akan konfirmasi via WhatsApp dalam 1×24 jam
        </p>
      </div>

    </form>
  );
}

// ── Sub components ──

function FormSection({
  number,
  label,
  children,
  isActive,
  isDone,
  summary,
  onEdit,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
  isActive: boolean;
  isDone: boolean;
  summary?: string;
  onEdit?: () => void;
}) {
  return (
    <div
      className={cn(
        "border-b px-6 py-6 transition-all duration-300",
        isDone
          ? "border-black/5 opacity-70"
          : isActive
          ? "border-black/8 bg-white"
          : "border-black/5 opacity-50 pointer-events-none select-none"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "font-cinzel text-[9px] tracking-widest transition-colors",
            isActive ? "text-accent" : isDone ? "text-black/70" : "text-black/30"
          )}
        >
          {number}
        </span>
        <h3
          className={cn(
            "font-cinzel text-[11px] tracking-[0.3em] uppercase transition-colors",
            isActive ? "text-black" : isDone ? "text-black/80" : "text-black/25"
          )}
        >
          {label}
        </h3>
        {isDone && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="ml-auto text-[9px] font-cinzel tracking-wider uppercase text-black/40 hover:text-black transition-colors underline underline-offset-2"
          >
            Ubah
          </button>
        )}
      </div>

      {/* Collapsed → tampilkan summary; Active → tampilkan form */}
      {isDone && summary ? (
        <p className="text-[11px] font-cinzel text-black/60 tracking-wide">{summary}</p>
      ) : (
        children
      )}
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

function ChevronIcon() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/60">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type,
  registration,
  error,
  hint,
  optional,
  required,
}: {
  label: string;
  placeholder: string;
  type: string;
  registration: object;
  error?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/60 mb-2 flex items-center gap-1.5 font-medium">
        {label}
        {optional && (
          <span className="text-black/50 normal-case tracking-normal font-sans text-[10px] font-normal">(opsional)</span>
        )}
        {required && <span className="text-accent text-xs leading-none">*</span>}
      </label>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full border px-4 py-3 text-sm text-black placeholder:text-black/50 focus:outline-none transition-colors",
          error ? "border-red-400 bg-red-50/50" : "border-black/30 focus:border-black"
        )}
      />
      {hint && !error && (
        <p className="text-[10px] text-black/60 mt-1.5 font-light">{hint}</p>
      )}
      {error && <FieldError msg={error} />}
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] text-black/45 font-cinzel tracking-wider uppercase shrink-0">{label}</span>
      <span
        className={cn(
          "text-[11px] font-cinzel tracking-wide text-right",
          accent ? "text-accent font-medium" : "text-black/70"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-[10px] font-cinzel tracking-widest uppercase mt-1.5 flex items-center gap-1">
      <span>!</span> {msg}
    </p>
  );
}