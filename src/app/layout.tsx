import type { Metadata } from "next";
import localFont from "next/font/local";
import { WebAnalytics } from "@/features/analytics/web-analytics";
import "./globals.css";

const dmSans = localFont({ src: "../assets/fonts/dm-sans-latin.woff2", variable: "--font-dm-sans", weight: "100 1000", display: "swap" });
const inter = localFont({ src: "../assets/fonts/inter-latin.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: "Gizi — Pendamping Orang Tua",
  description: "Panduan gizi dan tumbuh kembang anak dengan sesi sementara.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${inter.variable}`}>
      <body>
        {children}
        <WebAnalytics />
      </body>
    </html>
  );
}
