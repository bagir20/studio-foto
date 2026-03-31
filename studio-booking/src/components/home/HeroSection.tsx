"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden canvas-texture pt-20">
      <div className="grid grid-cols-12 min-h-screen gap-0 px-8 md:px-12 pt-8 pb-0">

        {/* Main image col */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="col-span-12 md:col-span-8 relative h-[70vh] md:h-[85vh]"
        >
          <div className="w-full h-full bg-stone-900 overflow-hidden relative">
            <Image
              src="/images/kiri.jpg"
              alt="Wanpicture Studio"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
        </motion.div>

        {/* Overlay teks besar */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-12 md:px-24 z-10 pointer-events-none pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-cinzel text-black text-6xl md:text-8xl lg:text-[9rem] leading-none tracking-[0.03em] mix-blend-difference pointer-events-auto"
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

        {/* Featured card — kanan */}
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
