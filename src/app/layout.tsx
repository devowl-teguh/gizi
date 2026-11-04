import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gizi — Pendamping Orang Tua",
  description: "Panduan gizi dan tumbuh kembang anak dengan sesi sementara.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
