"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    num: "01",
    title: "Fotografi Berbasis Konsep",
    desc: "Setiap sesi dirancang sesuai karakter dan cerita klien — bukan template.",
  },
  {
    num: "02",
    title: "Hasil Bersih & Elegan",
    desc: "Spesialisasi limbo studio premium dengan hasil yang bersih dan berkelas.",
  },
  {
    num: "03",
    title: "Pencahayaan Profesional",
    desc: "Pencahayaan presisi untuk hasil tajam, soft, dan penuh detail.",
  },
  {
    num: "04",
    title: "Suasana Studio yang Nyaman",
    desc: "Suasana santai yang membebaskan ekspresi terbaik dari setiap klien.",
  },
];

export default function WhySection() {
  return (
    <section className="canvas-texture w-full overflow-hidden bg-white px-5 sm:px-8 md:px-12 py-10 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="grid grid-cols-12 gap-0 mb-16 md:mb-24 items-end">
          <div className="col-span-12 md:col-span-6">
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-xs uppercase tracking-[0.45em] text-accent font-bold mb-4"
            >
              Kenapa WanPicture?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="font-cinzel text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-tight text-black"
            >
              Lebih dari<br />Sekadar Foto.
            </motion.h2>
          </div>

          {/* Thin vertical rule + quote kanan */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:flex col-span-6 items-end gap-6 pb-1"
          >
            <div className="w-px h-16 bg-black/10 shrink-0" />
            <p className="text-black/35 text-sm leading-relaxed font-light italic max-w-xs">
              "Bukan hanya tentang foto, tapi tentang bagaimana sebuah momen bisa terasa hidup kembali saat dilihat."
            </p>
          </motion.div>
        </div>

        {/* ── Reason Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black/10">
          {reasons.map((r, i) => (
            <motion.div
              key={r.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className={`group relative flex gap-6 md:gap-8 p-7 md:p-10 border-b border-black/10 hover:bg-black transition-colors duration-500 cursor-default
                ${i % 2 === 0 ? "md:border-r" : ""}`}
            >
              {/* Number */}
              <span className="font-cinzel text-[11px] text-black group-hover:text-accent/60 transition-colors duration-500 pt-0.5 shrink-0 w-6">
                {r.num}
              </span>

              <div className="flex-1">
                {/* Thin accent line — reveals on hover */}
                <div className="w-0 group-hover:w-8 h-px bg-accent mb-3 transition-all duration-500" />

                <h4 className="font-cinzel text-base md:text-lg text-black group-hover:text-white transition-colors duration-500 mb-2 leading-snug">
                  {r.title}
                </h4>
                <p className="text-black/45 group-hover:text-white/55 text-sm leading-relaxed font-light transition-colors duration-500">
                  {r.desc}
                </p>
              </div>

              {/* Corner symbol */}
              <span className="absolute top-6 right-6 font-cinzel text-[10px] text-black/10 group-hover:text-white/20 transition-colors duration-500 tracking-widest">
                ✦
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Penutup / Closing Statement ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 md:mt-24 grid grid-cols-12 gap-0 items-center"
        >
          {/* Left: decorative lines */}
          <div className="hidden md:flex col-span-3 flex-col gap-2 pr-8">
            <div className="w-full h-px bg-black/8" />
            <div className="w-3/4 h-px bg-black/5" />
            <div className="w-1/2 h-px bg-black/3" />
          </div>

          {/* Center: statement */}
          <div className="col-span-12 md:col-span-6 text-center space-y-4 py-10 md:py-14 border-t border-b border-black/8 md:border-l md:border-r md:border-black/8">
            <p className="text-[12px] uppercase tracking-[0.em] text-accent font-bold">
              WanPicture Studio
            </p>
            <p className="font-cinzel text-xl md:text-3xl text-black leading-snug tracking-tight">
              Simple. Elegant.<br />Timeless.
            </p>
            <div className="w-8 h-px bg-accent mx-auto" />
            <p className="text-black/40 text-xs md:text-sm font-light leading-relaxed max-w-xs mx-auto">
              Hanya di WanPicture Studio — tempat setiap momen menjadi karya yang tak lekang oleh waktu.
            </p>
          </div>

          {/* Right: decorative lines */}
          <div className="hidden md:flex col-span-3 flex-col items-end gap-2 pl-8">
            <div className="w-full h-px bg-black/8" />
            <div className="w-3/4 h-px bg-black/5" />
            <div className="w-1/2 h-px bg-black/3" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}