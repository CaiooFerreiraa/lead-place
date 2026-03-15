import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leads Collector | Premium Data Extraction",
  description: "Advanced lead collection and contact extraction system.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster position="top-right" expand={false} richColors />
      </body>
    </html>
  );
}
