"use client";

import Image from "next/image";
import { useState } from "react";

type Sample = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

export default function SampleGrid({ samples }: { samples: Sample[] }) {
  const [selected, setSelected] = useState<Sample | null>(null);

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {samples.map((sample) => (
          <div
            key={sample.id}
            onClick={() => setSelected(sample)}
            className="break-inside-avoid group relative overflow-hidden bg-stone-100 rounded-lg cursor-pointer"
          >
            <Image
              src={sample.imageUrl}
              alt={sample.caption ?? "Sample"}
              width={600}
              height={800}
              className="w-full h-auto object-contain group-hover:grayscale group-hover:scale-105 transition-all duration-700"
              unoptimized
            />
            {sample.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-cinzel tracking-widest uppercase">
                  {sample.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-8 font-cinzel text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors"
            onClick={() => setSelected(null)}
          >
            Close ×
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.imageUrl}
              alt={selected.caption ?? "Sample"}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              unoptimized
            />
            {selected.caption && (
              <p className="text-center text-white/40 font-cinzel text-xs tracking-widest uppercase mt-4">
                {selected.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}