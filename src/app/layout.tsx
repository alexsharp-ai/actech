import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupportChat from "@/components/SupportChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdamCoTech",
  description: "AdamCoTech – Innovative magnetic accessories and tech mounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <link rel="preload" as="video" href="/v2.mp4" />
    <link rel="preload" as="image" href="/head.png" />
        {children}
        <SupportChat />
      </body>
    </html>
  );
}
