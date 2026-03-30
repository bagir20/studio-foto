import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </span>
              <span className="font-semibold text-white text-lg tracking-tight">
                wanpicture
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Studio foto dan fotografi profesional di Palangkaraya.
              Mengabadikan momen terbaik hidupmu.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/gallery", label: "Gallery" },
                { href: "/packages", label: "Paket Foto" },
                { href: "/booking", label: "Booking" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase">
              Kontak
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  WhatsApp: 0812-3456-7890
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/wanpicture"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  Instagram: @wanpicture
                </a>
              </li>
              <li className="text-stone-500">
                Palangkaraya, Kalimantan Tengah
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} wanpicture. All rights reserved.
          </p>
          <p className="text-xs text-stone-600">
            Dibuat dengan Next.js + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
