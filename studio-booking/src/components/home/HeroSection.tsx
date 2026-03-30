"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "Sesi selesai" },
  { value: "5★", label: "Rating klien" },
  { value: "3+", label: "Tahun pengalaman" },
  { value: "10+", label: "Jenis paket" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-stone-950">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d97706 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #78716c 0%, transparent 40%)`,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.0 }}
            className="inline-flex items-center gap-2 bg-stone-800 text-amber-400 text-xs font-semibold px-4 py-2 rounded-full tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Studio Foto Palangkaraya
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
          >
            Abadikan{" "}
            <span className="text-amber-400">momen</span>{" "}
            terbaikmu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-stone-400 text-lg leading-relaxed max-w-md"
          >
            Studio foto profesional dengan berbagai paket sesuai kebutuhan.
            Wedding, portrait, produk, dan masih banyak lagi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/booking"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-8 py-4 rounded-full transition-colors duration-200"
              >
                Book Sekarang
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/packages"
                className="inline-block border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-medium px-8 py-4 rounded-full transition-colors duration-200"
              >
                Lihat Paket
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-1 cursor-default"
            >
              <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-stone-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}