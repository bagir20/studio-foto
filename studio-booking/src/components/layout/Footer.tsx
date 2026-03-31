import Link from "next/link";

export default function Footer() {
  return (
    <footer className="canvas-texture border-t border-black/5 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 md:px-24 py-16 md:py-24 gap-12">

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
        <div className="flex flex-col items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-8 md:gap-12">
            {[
              { href: "/gallery", label: "Gallery" },
              { href: "/packages", label: "Packages" },
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
            © {new Date().getFullYear()} Wanpicture Studio. All rights reserved.
          </p>
        </div>

        {/* Contact */}
        <div className="hidden md:flex flex-col items-end gap-3">
          <span className="text-black font-cinzel text-xs tracking-widest font-bold">Kontak</span>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 hover:text-accent transition-colors text-[10px] uppercase tracking-widest"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com/wanpicture"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 hover:text-accent transition-colors text-[10px] uppercase tracking-widest"
          >
            Instagram
          </a>
          <p className="text-black/30 text-[10px] uppercase tracking-widest">
            Palangkaraya, Kalteng
          </p>
        </div>

      </div>
    </footer>
  );
}
