import type { Metadata } from "next";
import { Comic_Neue, Permanent_Marker } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const comicNeue = Comic_Neue({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "WhatIsDev? - Glossaire de Développement Web",
  description: "Glossaire participatif de termes et définitions de développement web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.variable} ${permanentMarker.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
