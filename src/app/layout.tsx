import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/contexts/AudioContext";
import { ParticleManagerProvider } from "@/components/effects/ParticleManager";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ular Tangga Sejarah",
  description: "Game edukasi sejarah",
};

export const viewport: import("next").Viewport = {
  width: 390,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AudioProvider>
            <ParticleManagerProvider>
              {children}
            </ParticleManagerProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

