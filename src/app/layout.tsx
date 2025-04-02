import type { Metadata } from "next";

import Image from "next/image";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          className="hidden"
          width={100}
          height={100}
        />
        {children}
      </body>
    </html>
  );
}
