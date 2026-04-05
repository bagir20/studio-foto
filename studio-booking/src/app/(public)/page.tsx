import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import LimboSection from "@/components/home/LimboSection";
import WhySection from "@/components/home/WhySection";

const services = [
  {
    title: "Foto Studio",
    slug: "foto-studio",
    desc: "Sesi foto indoor dengan backdrop dan pencahayaan profesional.",
    href: "/packages?category=foto-studio",
  },
  {
    title: "Foto Outdoor",
    slug: "foto-outdoor",
    desc: "Nuansa natural untuk couple, prewedding, dan foto lifestyle.",
    href: "/packages?category=foto-outdoor",
  },
  {
    title: "Foto Produk",
    slug: "foto-produk",
    desc: "Foto produk berkualitas tinggi untuk e-commerce dan media sosial.",
    href: "/packages?category=foto-produk",
  },
  {
    title: "Event & Wedding",
    slug: "event-wedding",
    desc: "Akad, pernikahan, ulang tahun, wisuda, dan momen spesial lainnya.",
    href: "/packages?category=event-wedding",
  },
];



export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <HeroSection />

      <LimboSection />

      <WhySection />

      {/* ── CTA ── */}
      <section className="w-full px-5 sm:px-8 md:px-12 py-16 sm:py-20 md:py-32 bg-black canvas-texture">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-8 md:space-y-10">
          <span className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.5em] text-accent font-bold">
            Mulai Sekarang
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white tracking-wide leading-tight">
            ABADIKAN MOMEN<br />TERBAIKMU
          </h2>
          <p className="text-white/40 text-sm sm:text-base md:text-lg font-light max-w-md mx-auto leading-relaxed px-2">
            Setiap momen layak diabadikan dengan indah. Pilih paket yang sesuai dan jadwalkan sesimu hari ini.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link
              href="/booking"
              className="bg-white text-black px-10 sm:px-12 py-3.5 sm:py-4 text-xs tracking-[0.2em] uppercase font-cinzel hover:bg-accent hover:text-white transition-all duration-300"
            >
              Booking Sesi
            </Link>
            <Link
              href="/packages"
              className="border border-white/20 text-white/60 hover:border-white hover:text-white px-10 sm:px-12 py-3.5 sm:py-4 text-xs tracking-[0.2em] uppercase font-cinzel transition-all duration-300"
            >
              Lihat Paket
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}