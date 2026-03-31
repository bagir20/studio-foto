"use client";

import { cn } from "@/lib/utils";

const ALL_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

type Props = {
  selectedDate: string;
  selectedSlot: string;
  bookedSlots: string[];
  onSelect: (slot: string) => void;
  loading: boolean;
};

export default function TimeSlotPicker({ selectedSlot, bookedSlots, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {ALL_SLOTS.map((s) => (
          <div key={s} className="h-10 bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {ALL_SLOTS.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={cn(
              "py-2.5 font-cinzel text-xs tracking-widest border transition-all duration-200",
              isBooked
                ? "border-black/5 text-black/20 cursor-not-allowed line-through"
                : isSelected
                ? "border-black bg-black text-white"
                : "border-black/10 text-black hover:border-black"
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}