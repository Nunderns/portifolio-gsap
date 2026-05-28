import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Gochi_Hand } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Henri Okayama - Fullstack Developer",
  description: "Portfolio of Henri Okayama, a fullstack developer specializing in backend and frontend development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${gochiHand.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
