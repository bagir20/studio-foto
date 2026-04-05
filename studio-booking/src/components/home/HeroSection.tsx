"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex w-full min-h-screen">

        {/* KIRI: area teks — putih solid */}
        <div className="relative w-[42%] flex-shrink-0 flex flex-col justify-between px-12 lg:px-16 py-10 bg-white z-10">

          {/* Vertical label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ writingMode: "vertical-rl" }}
          >
            <span className="text-[7px] uppercase tracking-[0.5em] text-black/20 font-medium">
              Studio Fotografi — Palangkaraya
            </span>
          </motion.div>

          {/* Top: logo area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pl-8"
          >
            <span className="text-[8px] uppercase tracking-[0.5em] text-black/20">Est. 2021</span>
          </motion.div>

          {/* Center: heading */}
          <div className="pl-8 flex-1 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[9px] uppercase tracking-[0.5em] text-accent font-bold mb-7"
            >
              Wanpicture Studio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-cinzel text-[clamp(2rem,3.8vw,3.8rem)] leading-[0.95] tracking-[-0.01em] text-black"
            >
              WHERE MOMENTS<br />BECOME<br />TIMELESS FRAMES
            </motion.h1>

            {/* Garis accent solid */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="origin-left h-[3px] w-24 bg-accent mt-6 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-black/40 text-sm font-light leading-relaxed max-w-[260px] mb-10"
            >
              Di WanPicture, kami percaya setiap momen memiliki cerita — mengabadikan rasa, ekspresi, dan keindahan dalam bentuk visual yang tak lekang oleh waktu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex items-center gap-5"
            >
              <Link
                href="/booking"
                className="bg-black text-white font-cinzel text-[10px] uppercase tracking-[0.3em] px-8 py-3.5 hover:bg-accent transition-colors duration-300"
              >
                Booking Sesi
              </Link>
              <Link
                href="/gallery"
                className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-accent transition-colors border-b border-black/15 hover:border-accent pb-0.5"
              >
                Lihat Galeri
              </Link>
            </motion.div>
          </div>

       
        </div>

        {/* GARIS PEMBATAS TEGAS */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="origin-top w-[2px] bg-black flex-shrink-0 self-stretch"
        />

        {/* KANAN: foto murni tanpa overlay apapun */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex-1 relative"
        >
          <Image
            src="/images/heroo.jpeg"
            alt="Wanpicture Studio"
            fill
            className="object-cover"
            priority
          />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
          >
            <div className="w-px h-10 bg-white/50" />
            <span
              className="font-cinzel text-[8px] text-white/50 tracking-widest uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll
            </span>
          </motion.div>

          {/* Nomor dekoratif pojok kiri bawah foto */}
          <div
            className="absolute bottom-6 left-6 font-cinzel text-[8rem] leading-none text-white/[0.07] select-none pointer-events-none tracking-tighter"
            aria-hidden
          >
            WANPICTURE
          </div>
        </motion.div>
      </div>

      {/* ── MOBILE: Hard Split vertikal (atas foto, bawah teks) ── */}
      <div className="md:hidden flex flex-col w-full">

        {/* ATAS: foto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="relative w-full h-[55vw] min-h-[240px] flex-shrink-0"
        >
          <Image
            src="/images/heroo.jpeg"
            alt="Wanpicture Studio"
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>

        {/* GARIS PEMBATAS HORIZONTAL */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="origin-left h-[2px] w-full bg-black flex-shrink-0"
        />

        {/* BAWAH: teks — putih solid */}
        <div className="flex-1 bg-white px-5 pt-7 pb-4 flex flex-col justify-between">

          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[8px] uppercase tracking-[0.5em] text-accent font-bold mb-4"
            >
              Wanpicture Studio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-cinzel text-[clamp(2.4rem,11vw,3.5rem)] leading-[0.9] tracking-tight text-black"
              >
                WHERE<br />MOMENTS<br />TIMELESS
            </motion.h1>

            {/* Accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="origin-left h-[2px] w-16 bg-accent mt-4 mb-5"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-black/40 text-xs font-light leading-relaxed max-w-[280px] mb-7"
            >
               Di WanPicture, kami percaya setiap momen memiliki cerita. Kami hadir bukan sekadar untuk memotret, tapi untuk mengabadikan rasa, ekspresi, dan keindahan dalam bentuk visual yang tak lekang oleh waktu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex gap-3"
            >
              <Link
                href="/booking"
                className="bg-black text-white font-cinzel text-[9px] uppercase tracking-[0.25em] px-6 py-3 hover:bg-accent transition-colors duration-300"
              >
                Booking
              </Link>
              <Link
                href="/gallery"
                className="border border-black/15 text-black/50 font-cinzel text-[9px] uppercase tracking-[0.25em] px-6 py-3 hover:border-accent hover:text-accent transition-colors"
              >
                Galeri
              </Link>
            </motion.div>
          </div>

       

        </div>
      </div>

    </section>
  );
}