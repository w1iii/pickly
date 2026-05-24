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
  title: "Pickly — Find a court. Find a game. Find your match.",
  description:
    "The all-in-one pickleball web app: court finder, matchmaker, and tournament organizer.",
  keywords: [
    "pickleball",
    "courts",
    "matchmaking",
    "tournaments",
    "sports",
  ],
  authors: [{ name: "Pickly" }],
  openGraph: {
    title: "Pickly",
    description:
      "Find a court. Find a game. Find your match.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
