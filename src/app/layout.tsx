import type { Metadata } from "next";

import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MyFlix",
  description: "MyFlix - Stream your favorite movies and TV shows online.",
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
      <body className={`${inter.variable} font-inter antialiased font-sans`}>
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
