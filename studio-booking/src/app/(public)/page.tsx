import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";

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

      {/* ── About ── */}
      <section className="canvas-texture w-full px-8 md:px-12 py-32 md:py-48">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">

         {/* Image */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-accent/5 z-0" />

            <div className="relative z-10 w-full aspect-[4/5] border-[10px] border-white shadow-lg overflow-hidden">
              <Image
                src="/images/about.jpg"
                alt="Wanpicture Studio"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

          {/* Text */}
          <div className="w-full md:w-1/2 space-y-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">
                The Studio
              </span>
              <h2 className="font-cinzel text-4xl md:text-5xl mt-4 tracking-tight text-black leading-tight">
                CRAFTING<br />TIMELESSNESS
              </h2>
            </div>
            <div className="space-y-5 text-black/50 leading-loose font-light text-lg max-w-lg">
              <p>
                Wanpicture adalah lebih dari sekadar studio foto. Kami adalah
                kurator momen terberharga dalam hidupmu.
              </p>
              <p>
                Setiap gambar dihasilkan dengan kesabaran, intensi, dan
                perhatian penuh terhadap detail — karena setiap momen layak
                diabadikan dengan sempurna.
              </p>
            </div>
            <div className="flex gap-12 pt-4">
              <div>
                <span className="block font-cinzel text-3xl text-black">200+</span>
                <span className="text-[10px] uppercase tracking-widest text-black/40">Sesi selesai</span>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div>
                <span className="block font-cinzel text-3xl text-black">3+</span>
                <span className="text-[10px] uppercase tracking-widest text-black/40">Tahun pengalaman</span>
              </div>
              <div className="w-px h-12 bg-black/10" />
              <div>
                <span className="block font-cinzel text-3xl text-black">5★</span>
                <span className="text-[10px] uppercase tracking-widest text-black/40">Rating klien</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="w-full px-8 md:px-12 pb-32 md:pb-48 canvas-texture">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h3 className="font-cinzel text-3xl md:text-4xl tracking-widest text-black">
              OUR SERVICES
            </h3>
            <Link
              href="/packages"
              className="text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-accent transition-colors hidden md:block"
            >
              View all packages →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-black/10">
            {services.map((service, i) => (
              <Link
                key={service.title}
                href={service.href}
                className={`group p-10 md:p-12 flex flex-col gap-6 hover:bg-black transition-all duration-500 ${
                  i < services.length - 1 ? "border-b md:border-b-0 md:border-r border-black/10" : ""
                }`}
              >
                <span className="font-cinzel text-[10px] tracking-[0.4em] text-accent uppercase">
                  0{i + 1}
                </span>
                <h4 className="font-cinzel text-xl text-black group-hover:text-white transition-colors duration-500">
                  {service.title.toUpperCase()}
                </h4>
                <p className="text-black/50 group-hover:text-white/60 text-sm leading-relaxed font-light transition-colors duration-500 flex-1">
                  {service.desc}
                </p>
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-accent transition-colors duration-500">
                  Lihat paket →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full px-8 md:px-12 py-32 bg-black canvas-texture">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">
            Ready?
          </span>
          <h2 className="font-cinzel text-4xl md:text-6xl text-white tracking-wide">
            READY TO FRAME<br />YOUR STORY?
          </h2>
          <p className="text-white/40 text-lg font-light max-w-md mx-auto leading-relaxed">
            Pilih paket yang sesuai dan booking jadwalmu sekarang.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/booking"
              className="bg-white text-black px-12 py-4 text-xs tracking-[0.2em] uppercase font-cinzel hover:bg-accent hover:text-white transition-all duration-300"
            >
              Book Session
            </Link>
            <Link
              href="/packages"
              className="border border-white/20 text-white/60 hover:border-white hover:text-white px-12 py-4 text-xs tracking-[0.2em] uppercase font-cinzel transition-all duration-300"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
