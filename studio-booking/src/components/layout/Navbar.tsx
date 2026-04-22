"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/packages", label: "Paket" },
  { href: "/gallery", label: "Galleri" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
          <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5"
        style={{
          backgroundImage: `url("/textures/paper.jpg")`,
          backgroundRepeat: "repeat",
          backgroundSize: "2500px",
        }}
      >
      <nav className="flex justify-between items-center w-full px-8 md:px-12 py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-[0.3em] text-black font-cinzel">
            WANPICTURE
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-cinzel text-xs tracking-widest uppercase transition-colors relative pb-1",
                pathname === link.href
                  ? "text-black font-semibold border-b-2 border-black"
                  : "text-black/50 hover:text-black"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/booking"
          className="hidden md:inline-block bg-accent text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-cinzel hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          Booking 
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 space-y-1.5">
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-full h-px bg-black origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-full h-px bg-black"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-full h-px bg-black origin-center"
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-black/5 overflow-hidden"
          >
            <div className="px-8 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "font-cinzel text-xs tracking-widest uppercase py-2",
                    pathname === link.href ? "text-black font-semibold" : "text-black/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
             <Link
  href="/booking"
  onClick={() => setMenuOpen(false)}
  className="mt-2 bg-accent text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-cinzel font-semibold text-center"
>
  Booking
</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
