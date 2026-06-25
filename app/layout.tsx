import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discovery | Premium Tanisma Katalogu",
  description: "Discovery, Turkiye'nin en premium tanisma katalogu. Gercek profiller, guvenli iletisim.",
  keywords: "tanisma, ask, iliski, partner, discovery, premium",
  authors: [{ name: "BY EXPOWER" }],
  openGraph: {
    title: "Discovery | Premium Tanisma Katalogu",
    description: "Turkiye'nin en premium tanisma katalogu.",
    url: "https://tanisma-sitesi.vercel.app",
    siteName: "Discovery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}