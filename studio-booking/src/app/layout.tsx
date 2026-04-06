import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wanpicture — Studio Foto Pulang-Pisau",
    template: "%s | Wanpicture",
  },
  description: "Studio foto profesional di Pulang-Pisau.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <NextTopLoader
          color="#00bcd4"
          height={2}
          showSpinner={false}
          shadow={false}
        />
        {children}
      </body>
    </html>
  );
}
