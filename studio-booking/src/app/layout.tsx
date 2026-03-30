import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "wanpicture — Studio Foto Palangkaraya",
    template: "%s | wanpicture",
  },
  description:
    "Studio foto dan fotografi profesional di Palangkaraya. Booking sesi foto studio, outdoor, wedding, dan produk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${geist.variable} font-sans bg-white antialiased`}>
        <Navbar />
        <main className="pt-16 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}