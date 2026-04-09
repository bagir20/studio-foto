import Link from "next/link";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="border-t border-black/5 bg-white"
      style={{
        backgroundImage: `url("/textures/paper.jpg")`,
        backgroundRepeat: "repeat",
        backgroundSize: "2500px",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start px-8 md:px-24 py-16 md:py-24 gap-12">

        {/* Brand */}
        <div>
          <span className="font-cinzel text-xl tracking-widest text-black font-bold">
            WANPICTURE
          </span>
          <p className="font-sans text-[10px] uppercase tracking-widest text-black/40 mt-2">
            Mengabadikan momen terbaik sejak 2021
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-wrap gap-8 md:gap-12">
            {[
              { href: "/gallery", label: "Galeri" },
              { href: "/packages", label: "Paket" },
              { href: "/booking", label: "Booking" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-black/40 hover:text-accent transition-colors font-sans text-[10px] uppercase tracking-[0.2em] font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-black/30">
            © {new Date().getFullYear()} Wanpicture Studio. Hak cipta dilindungi.
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <span className="text-black font-cinzel text-xs tracking-widest font-bold">Kontak</span>

          {/* Teks "Hubungi Admin Kurniawan" */}
          <span className="text-black/60 font-sans text-[10px] uppercase tracking-widest font-semibold mt-1">
            Hubungi Admin Kurniawan
          </span>

          {/* Nomor WA dengan Icon */}
          <a
            href="https://wa.me/6282152128370"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 hover:text-accent transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <FaWhatsapp className="w-3 h-3 flex-shrink-0" />
            082152128370
          </a>

          {/* IG dengan Icon */}
          <a
            href="https://www.instagram.com/wanpicture.studio_/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 hover:text-accent transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <FaInstagram className="w-3 h-3 flex-shrink-0" />
            @wanpicture.studio_
          </a>

          <a
            href="https://maps.google.com/?q=67F9+6CR,+Jl.+Rey+II,+Mantaren+I,+Kec.+Kahayan+Hilir,+Kabupaten+Pulang+Pisau,+Kalimantan+Tengah+73564"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 hover:text-accent transition-colors text-[10px] tracking-widest leading-relaxed max-w-[200px]"
          >
            Jl. Rey II, Mantaren I,<br />
            Kab. Pulang Pisau,<br />
            Kalimantan Tengah 73564
          </a>

        </div>

      </div>
    </footer>
  );
}