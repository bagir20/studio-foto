import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";

export default function HomePage() {
  return (
    <div className="bg-white">

      <HeroSection />

      {/* Services */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Layanan Kami</p>
            <h2 className="text-4xl font-bold text-stone-900">Apa yang kami tawarkan</h2>
            <p className="text-stone-500 max-w-md mx-auto">Berbagai paket foto untuk setiap kebutuhan dan anggaran</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "◈", title: "Foto Studio", desc: "Sesi foto indoor dengan backdrop dan pencahayaan profesional. Cocok untuk portrait, keluarga, dan foto formal.", href: "/packages?category=foto-studio" },
              { icon: "◉", title: "Foto Outdoor", desc: "Sesi foto di luar ruangan dengan nuansa natural. Ideal untuk couple, prewedding, dan foto lifestyle.", href: "/packages?category=foto-outdoor" },
              { icon: "◇", title: "Foto Produk", desc: "Foto produk berkualitas tinggi untuk kebutuhan bisnis, e-commerce, dan media sosial.", href: "/packages?category=foto-produk" },
            ].map((service) => (
              <Link key={service.title} href={service.href} className="group bg-white border border-stone-200 rounded-2xl p-8 hover:border-amber-300 hover:shadow-lg transition-all duration-300 space-y-4">
                <span className="text-3xl text-amber-500">{service.icon}</span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{service.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{service.desc}</p>
                <span className="text-amber-600 text-sm font-semibold group-hover:underline">Lihat paket →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-stone-900">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">Siap untuk sesi foto?</h2>
          <p className="text-stone-400 text-lg">Pilih paket yang sesuai dan booking jadwalmu sekarang. Mudah, cepat, dan terpercaya.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-8 py-4 rounded-full transition-colors duration-200 hover:scale-105">
              Booking Sekarang
            </Link>
            <Link href="/gallery" className="border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 font-medium px-8 py-4 rounded-full transition-colors duration-200">
              Lihat Gallery
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}