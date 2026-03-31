"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden canvas-texture pt-20">
      <div className="grid grid-cols-12 gap-0 px-5 sm:px-8 md:px-12">

        {/* ── Main image ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="col-span-12 md:col-span-8 relative h-[60vh] sm:h-[65vh] md:min-h-screen md:h-auto"
        >
          <div className="w-full h-full bg-stone-900 overflow-hidden relative">
            <Image
              src="/images/kiri.jpg"
              alt="Wanpicture Studio"
              fill
              className="object-cover grayscale"
              priority
            />
            {/* Gradient untuk baca teks di mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent md:hidden" />
          </div>

          {/* ── Mobile: teks di dalam image container ── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end items-start px-5 sm:px-8 pb-6 sm:pb-10 md:hidden pointer-events-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-cinzel text-white text-[clamp(2rem,10vw,3.5rem)] leading-[0.9] tracking-[0.02em] pointer-events-auto"
            >
              BREWING<br />MEMORIES
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-4 pointer-events-auto"
            >
              <Link
                href="/gallery"
                className="inline-block border-b-2 border-accent text-white font-cinzel tracking-[0.2em] uppercase py-2 hover:text-accent transition-colors text-[10px] sm:text-xs"
              >
                Explore Our Work
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Desktop: teks di section level ── */}
        <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start px-24 z-10 pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-cinzel text-black text-8xl lg:text-[9rem] leading-none tracking-[0.03em] mix-blend-difference pointer-events-auto"
            style={{ filter: "invert(1)" }}
          >
            BREWING<br />MEMORIES
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 pointer-events-auto"
          >
            <Link
              href="/gallery"
              className="inline-block border-b-2 border-accent text-white font-cinzel tracking-[0.3em] uppercase py-2 hover:text-accent transition-colors text-xs"
            >
              Explore Our Work
            </Link>
          </motion.div>
        </div>

        {/* ── Featured card — Mobile ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="md:hidden col-span-12 flex justify-center py-4 sm:py-6 relative z-20"
        >
          <div className="bg-white w-[92%] max-w-sm p-4 sm:p-6 shadow-xl border border-black/5 canvas-texture">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent mb-1.5 sm:mb-3 font-bold">
              Featured
            </p>
            <h2 className="font-cinzel text-sm sm:text-xl mb-1.5 sm:mb-4 text-black">
              Studio Profesional
            </h2>
            <p className="text-black/50 leading-relaxed text-[11px] sm:text-sm mb-3 sm:mb-6 font-light line-clamp-2 sm:line-clamp-none">
              Setiap sesi dirancang dengan detail — pencahayaan, komposisi, dan emosi
              yang terabadikan dalam satu frame sempurna.
            </p>
            <div className="w-full h-24 sm:h-36 overflow-hidden bg-stone-100 border border-black/5 relative">
              <Image
                src="/images/landscape.jpg"
                alt="Featured sample"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Featured card — Desktop (kanan) ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden md:flex col-span-4 flex-col justify-end pb-16 pl-0"
        >
          <div className="bg-white p-8 relative -left-16 z-20 shadow-xl border border-black/5 canvas-texture">
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3 font-bold">
              Featured
            </p>
            <h2 className="font-cinzel text-xl mb-4 text-black">
              Studio Profesional
            </h2>
            <p className="text-black/50 leading-relaxed text-sm mb-6 font-light">
              Setiap sesi dirancang dengan detail — pencahayaan, komposisi, dan emosi
              yang terabadikan dalam satu frame sempurna.
            </p>
            <div className="w-full h-36 overflow-hidden bg-stone-100 border border-black/5 relative">
              <Image
                src="/images/landscape.jpg"
                alt="Featured sample"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}