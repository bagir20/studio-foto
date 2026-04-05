"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LimboSection() {
  return (
    <section className="canvas-texture w-full overflow-hidden bg-white">

      {/* ── INTRO ── */}
      <div className="relative w-full px-5 sm:px-8 md:px-12 pt-0 md:pt-0 pb-0">

        {/* Ghost watermark */}
        <p
          className="absolute top-6 md:top-10 right-4 md:right-10 font-cinzel text-[clamp(5rem,18vw,14rem)] leading-none text-black/[0.035] select-none pointer-events-none tracking-tight"
          aria-hidden
        >
          LIMBO
        </p>

        <div className="relative max-w-7xl mx-auto">

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0 mb-12 md:mb-20">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="inline-block text-[9px] uppercase tracking-[0.45em] text-accent font-bold mb-4"
              >
                Studio Concept
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="font-cinzel text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.0] tracking-tight text-black"
              >
                Limbo<br />Studio
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="md:max-w-xs border-t border-black/10 pt-5 md:pt-4 space-y-3"
            >
              <p className="text-black/45 text-sm md:text-[13px] leading-relaxed font-light">
                Latar polos <em>seamless</em> — tanpa batas visual antara lantai dan background.
                Fokus sepenuhnya pada subjek dengan pencahayaan presisi.
              </p>
              <p className="text-black/45 text-sm md:text-[13px] leading-relaxed font-light">
                Tone halus, depth yang pas, nuansa premium di setiap frame.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Clean", "Seamless", "Timeless", "Premium"].map((tag) => (
                  <span key={tag} className="text-[8px] uppercase tracking-[0.3em] border border-black/12 text-black/40 px-2.5 py-1 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── PHOTO GRID ── */}
          <div className="grid grid-cols-12 gap-2 md:gap-3">

            {/* Foto 1 — tall kiri, span 2 baris */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              className="col-span-12 md:col-span-5 md:row-span-2"
            >
              <div className="relative w-full aspect-[3/4] md:h-full md:min-h-[520px] overflow-hidden group">
                <Image
                  src="/images/limbo1.jpeg"
                  alt="Couple Session — Limbo Studio"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-black font-cinzel text-[8px] uppercase tracking-[0.3em] px-3 py-1.5">
                    Couple Session
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Foto 2 — kanan atas */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="col-span-12 md:col-span-7"
            >
              <div className="relative w-full aspect-[16/9] md:aspect-[16/8] overflow-hidden group">
                <Image
                  src="/images/lands.jpeg"
                  alt="Limbo Studio — WanPicture"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>

            {/* Foto 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.18 }}
              className="col-span-6 md:col-span-4"
            >
              <div className="relative w-full aspect-square overflow-hidden group">
                <Image
                  src="/images/limbo5.jpeg"
                  alt="Limbo Studio — WanPicture"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </motion.div>

            {/* Foto 4 + floating tag */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.26 }}
              className="col-span-6 md:col-span-3 relative"
            >
              <div className="relative w-full aspect-square overflow-hidden group">
                <Image
                  src="/images/limbo3.jpeg"
                  alt="Limbo Studio — WanPicture"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute -bottom-3 -right-2 md:-bottom-4 md:-right-4 z-20 bg-black text-white px-3 py-2">
                <p className="font-cinzel text-[8px] md:text-[9px] tracking-[0.25em] uppercase leading-tight">
                  Limbo<br /><span className="text-accent">Studio</span>
                </p>
              </div>
            </motion.div>

          </div>

          {/* Caption bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between mt-8 md:mt-10 pt-5 border-t border-black/8"
          >
            <p className="text-[9px] uppercase tracking-[0.35em] text-black/30 font-medium">WanPicture — Pulang-Pisau</p>
            <p className="text-[9px] uppercase tracking-[0.35em] text-black/30 font-medium">Seamless Limbo Backdrop</p>
          </motion.div>

        </div>
      </div>

    </section>
  );
}